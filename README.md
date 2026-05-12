# OpenRouter Visualization

A modern web application for visualizing and exploring the vast landscape of AI models available through [OpenRouter](https://openrouter.ai/).

## Overview

OpenRouter Visualization provides an interactive dashboard to compare AI models across key metrics such as pricing, context window, and release dates. It helps developers and researchers make informed decisions about which models best suit their needs and budget.

## Key Features

- **Interactive Model Table**: A powerful, sortable, and filterable table using `ag-grid` to browse all available OpenRouter models.
    - View model IDs, context length, output pricing, and creation dates.
    - Quick access to raw model metadata via a modal view.
- **Dynamic Bubble Chart**: Visualize the model landscape using `ngx-charts`.
    - **X-axis**: Normalized release date (Timeline).
    - **Y-axis**: Log-scaled output cost (Price).
    - **Bubble Size**: Context length (Capacity).
- **Advanced Filtering**: Fine-tune your view by filtering models based on:
    - Context length ranges.
    - Pricing (with a non-linear slider for better control over price skews).
    - Release date ranges.

## Tech Stack

- **Framework**: [Angular](https://angular.dev/) (Standalone components, Zoneless change detection)
- **Table Component**: [ag-grid-angular](https://www.ag-grid.com/angular-data-grid/)
- **Charts**: [@swimlane/ngx-charts](https://swimlane.github.io/ngx-charts/)
- **Styling**: Vanilla CSS with dark mode support.
- **Data Source**: [OpenRouter API](https://openrouter.ai/api/v1/models)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd openrouter-visualization
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building

Build the project for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

### Testing

Run unit tests with [Vitest](https://vitest.dev/):
```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if applicable).

## Acknowledgments

- Data provided by [OpenRouter](https://openrouter.ai/).
- Built with the powerful [Angular CLI](https://github.com/angular/angular-cli).
