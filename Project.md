# OpenRouter Visualization

## Purpose

A web app that Visualizes OpenRouter model information in various way.

## Data
The OpenRouter API endpoint to retrieve all model information:

https://openrouter.ai/api/v1/models

```json
{
    "id": "x-ai/grok-4.20",
    "canonical_slug": "x-ai/grok-4.20-20260309",
    "hugging_face_id": "",
    "name": "xAI: Grok 4.20",
    "created": 1774979019,
    "description": "Grok 4.20 is xAI's newest flagship model with industry-leading speed and agentic tool calling capabilities. It combines the lowest hallucination rate on the market with strict prompt adherance, delivering consistently...",
    "context_length": 2000000,
    "architecture": {
        "modality": "text+image+file->text",
        "input_modalities": [
            "text",
            "image",
            "file"
        ],
        "output_modalities": [
            "text"
        ],
        "tokenizer": "Grok",
        "instruct_type": null
    },
    "pricing": {
        "prompt": "0.000002",
        "completion": "0.000006",
        "web_search": "0.005",
        "input_cache_read": "0.0000002"
    },
    "top_provider": {
        "context_length": 2000000,
        "max_completion_tokens": null,
        "is_moderated": false
    },
    "per_request_limits": null,
    "supported_parameters": [
        "include_reasoning",
        "logprobs",
        "max_tokens",
        "reasoning",
        "response_format",
        "seed",
        "structured_outputs",
        "temperature",
        "tool_choice",
        "tools",
        "top_logprobs",
        "top_p"
    ],
    "default_parameters": {
        "temperature": null,
        "top_p": null,
        "top_k": null,
        "frequency_penalty": null,
        "presence_penalty": null,
        "repetition_penalty": null
    },
    "knowledge_cutoff": "2025-09-01",
    "expiration_date": null,
    "links": {
        "details": "/api/v1/models/x-ai/grok-4.20-20260309/endpoints"
    }
}
```

## Visualizations
The web page will be layed out in two columns

### Left column

This will be a sortable, filterable table displaying all of the models.
Each row will show:

* canonical_slug labeled as "Model"
* context_length labeled as "Context"
* pricing.prompt labeled as "input$" - value is divided by 1000000 and rounded to cent
* pricing.completion labeled as "output$" - value is divided by 1000000 and rounded to cent
* knowledge_cutoff labeled as "Training cutoff"


### Right column

a bubble chart.  The points values 

* x: knowledge_cutoff as value between normalized range of 0 and 1 based on min/max knowledge_cuttof date of all models
* y: log scaled context_length
* bubble size: pricing.completion

Hovering over a bubble on the chart will show the model canonical_slug, pricing.completion, and context_length


### Features.  
* Clicking on a "show" button in the table on a model row  will open a modal window showing the raw JSON for that model

## Architecture and components:

This will be implemented as an Angular application.  I already have the latest angular CLI version installed and available - use the CLI to create the application.

The table will use [ag-grid-angular](https://www.npmjs.com/package/ag-grid-angular) for the table implementation. See the web page for npm installation, instructions for using in components.


The chart will use [ngx-charts](https://www.npmjs.com/package/@swimlane/ngx-charts)