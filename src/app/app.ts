import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule, themeBalham, colorSchemeDark } from 'ag-grid-community';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridAngular, NgxChartsModule, DecimalPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private http = inject(HttpClient);

  rawModels: any[] = [];
  models = signal<any[]>([]);
  chartData = signal<any[]>([]);

  // Filter ranges (Global)
  globalMinContext = 0;
  globalMaxContext = 0;
  globalMinCost = 0;
  globalMaxCost = 0;
  globalMinEpoch = 0;
  globalMaxEpoch = 0;

  // Filter ranges (Current)
  minContext = 0;
  maxContext = 0;
  minCost = 0;
  maxCost = 0;
  minEpoch = 0;
  maxEpoch = 0;

  sliderMinCost = 0;
  sliderMaxCost = 100;

  epochRange = 1;


  // ag-grid configs
  theme = themeBalham.withPart(colorSchemeDark);
  colDefs: ColDef[] = [
    { field: 'id', headerName: 'Model', sortable: true, filter: true },
    { field: 'context_length', headerName: 'Context', sortable: true, filter: 'agNumberColumnFilter' },
    {
      field: 'outputCost',
      headerName: 'output$',
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => params.value != null ? `$${params.value.toFixed(2)}` : ''
    },
    { field: 'createdDate', headerName: 'created', sortable: true, filter: true },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        const btn = document.createElement('button');
        btn.innerText = 'Show';
        btn.className = 'show-btn';
        btn.onclick = () => this.showModal(params.data);
        return btn;
      }
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };

  // ngx-charts configs
  view: [number, number] = [600, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Cost';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  maxRadius: number = 20;
  minRadius: number = 3;
  colorScheme: any = {
    domain: ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#f472b6']
  };

  //   colorScheme: { domain: string[] } = {
  //   domain: [
  //     '#FF8A80',
  //     '#EA80FC',
  //     '#8C9EFF',
  //     '#80D8FF',
  //     '#A7FFEB',
  //     '#CCFF90',
  //     '#FFFF8D',
  //     '#FF9E80'
  //   ]
  // };
  // Modal state
  @ViewChild('modelDialog') modelDialog!: ElementRef<HTMLDialogElement>;
  selectedModelJson = signal<string>('');

  ngOnInit() {
    this.http.get<any>('https://openrouter.ai/api/v1/models').subscribe(response => {
      const data = response.data || [];
      this.processData(data);
    });
  }

  processData(data: any[]) {
    const validEpochs = data
      .map(d => d.created)
      .filter(d => d);

    this.globalMinEpoch = Math.min(...validEpochs);
    this.globalMaxEpoch = Math.max(...validEpochs);
    this.epochRange = this.globalMaxEpoch - this.globalMinEpoch || 1;

    let minCtx = Infinity, maxCtx = -Infinity;
    let minCost = Infinity, maxCost = -Infinity;

    this.rawModels = data.map(m => {
      const inputCost = parseFloat(m.pricing?.prompt || '0') * 1000000;
      const outputCost = parseFloat(m.pricing?.completion || '0') * 1000000;
      const createdDate = new Date(m.created * 1000).toLocaleString();

      if (m.context_length < minCtx) minCtx = m.context_length;
      if (m.context_length > maxCtx) maxCtx = m.context_length;

      if (outputCost < minCost && outputCost >= 0) minCost = outputCost;
      if (outputCost > maxCost) maxCost = outputCost;

      return {
        ...m,
        outputCost,
        inputCost,
        createdDate
      };
    }).filter(m => m.outputCost >= 0);

    this.globalMinContext = minCtx === Infinity ? 0 : minCtx;
    this.globalMaxContext = maxCtx === -Infinity ? 0 : maxCtx;
    this.globalMinCost = minCost === Infinity ? 0 : minCost;
    this.globalMaxCost = maxCost === -Infinity ? 0 : maxCost;

    this.minContext = this.globalMinContext;
    this.maxContext = this.globalMaxContext;
    this.minCost = this.globalMinCost;
    this.maxCost = this.globalMaxCost;
    this.sliderMinCost = 0;
    this.sliderMaxCost = 100;

    this.minEpoch = this.globalMinEpoch;
    this.maxEpoch = this.globalMaxEpoch;

    this.applyFilters();
  }

  getCostFromSlider(sliderVal: number): number {
    const t = sliderVal / 100;
    const factor = Math.pow(t, 4); // x^4 curve to normalize data skew
    return this.globalMinCost + (this.globalMaxCost - this.globalMinCost) * factor;
  }

  onCostSliderChange() {
    if (this.sliderMinCost > this.sliderMaxCost) {
      this.sliderMinCost = this.sliderMaxCost;
    }
    this.minCost = this.getCostFromSlider(this.sliderMinCost);
    this.maxCost = this.getCostFromSlider(this.sliderMaxCost);
    this.applyFilters();
  }

  applyFilters() {
    // Keep min <= max bounds
    if (this.minContext > this.maxContext) this.minContext = this.maxContext;
    if (this.minCost > this.maxCost) this.minCost = this.maxCost;
    if (this.minEpoch > this.maxEpoch) this.minEpoch = this.maxEpoch;

    const filtered = this.rawModels.filter(m => {
      return (
        m.context_length >= this.minContext && m.context_length <= this.maxContext &&
        m.outputCost >= this.minCost && m.outputCost <= this.maxCost &&
        m.created >= this.minEpoch && m.created <= this.maxEpoch
      );
    });

    this.models.set(filtered);

    const series = filtered.map(m => {
      let epochNormalized = 0;
      if (!isNaN(m.created)) {
        epochNormalized = (m.created - this.globalMinEpoch) / this.epochRange;
      }

      const contextLen = m.context_length > 0 ? m.context_length / 100 : 0;

      return {
        name: m.id,
        x: epochNormalized,
        y: Math.log10(m.outputCost == 0 ? 0.0000001 : m.outputCost),
        r: contextLen > 0 ? contextLen : 0.000001,
        tooltipContext: m.context_length,
        tooltipCost: m.outputCost,
        tooltipDate: m.createdDate
      };
    });

    this.chartData.set([
      {
        name: 'Models',
        series: series
      }
    ]);
  }

  formatDate(epoch: number): string {
    if (!epoch) return '';
    return new Date(epoch * 1000).toLocaleDateString();
  }

  showModal(modelData: any) {
    this.selectedModelJson.set(JSON.stringify(modelData, null, 2));
    this.modelDialog.nativeElement.showModal();
  }

  closeModal() {
    this.modelDialog.nativeElement.close();
  }
}
