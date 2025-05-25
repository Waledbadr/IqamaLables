# Employee Label Printer

A modern web application for creating and printing professional employee ID labels on sticker sheets. Built with React and Vite for fast development and excellent performance.

## Features

### Core Functionality
- **Employee ID Input**: Enter employee IDs manually or import from CSV files
- **Live Preview**: Real-time preview of how labels will look before printing
- **Flexible Layout**: Customizable page margins, label dimensions, and spacing
- **Multiple Export Options**: Print directly or export as PDF for later use

### Customizable Layout Options
- Configure page margins (top, bottom, left, right)
- Set the number of labels per row and column
- Adjust spacing/gaps between individual labels
- Support for different paper sizes (A4, Letter, custom dimensions)
- Multiple label dimension presets for common sticker sheet types

### User Interface
- Clean, intuitive interface with real-time configuration updates
- Live preview with zoom controls and page navigation
- Preset templates for common sticker sheet formats (Avery 5160, 5161, 5162, etc.)
- Save and load custom layout configurations

### Additional Features
- **CSV Import**: Import employee lists from CSV files with automatic column detection
- **PDF Export**: Generate high-quality PDFs for professional printing
- **Print Preview**: Browser-based print preview with optimized print styles
- **Font Customization**: Choose from multiple fonts, sizes, and weights
- **Text Formatting**: Add prefixes/suffixes to employee numbers (e.g., "EMP-" prefix)
- **Batch Processing**: Handle large lists of employee IDs efficiently
- **Responsive Design**: Works on desktop and tablet devices

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Custom CSS with utility classes (Tailwind-inspired)
- **PDF Generation**: jsPDF and html2canvas
- **CSV Processing**: Papa Parse
- **Icons**: Lucide React
- **File Handling**: Native browser APIs with drag-and-drop support

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd IqamaLables
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### 1. Adding Employee IDs

**Manual Entry:**
- Type or paste employee IDs in the text area
- Separate IDs with new lines, commas, or semicolons
- The application automatically parses and validates the input

**CSV Import:**
- Click "Choose CSV File" or drag and drop a CSV file
- The application automatically detects employee ID columns
- Supports common column names like `employee_id`, `emp_id`, `id`, etc.

**Sample Data:**
- Click "Load Sample Data" to populate with test employee IDs
- Click "Download Sample CSV" to get a template file

### 2. Configuring Layout

**Layout Tab:**
- Choose from preset templates or create custom layouts
- Set paper size (A4, Letter, or custom dimensions)
- Configure margins and label dimensions
- Adjust spacing between labels

**Style Tab:**
- Select font family, size, and weight
- Choose text alignment (left, center, right)
- Add prefixes or suffixes to employee numbers
- Customize colors for text, background, and borders

### 3. Preview and Print

- Use the live preview to see exactly how labels will look
- Navigate between pages if you have multiple pages
- Zoom in/out for detailed inspection
- Print directly from the browser or export as PDF

## Label Presets

The application includes presets for popular sticker sheet formats:

- **Avery 5160**: Address labels (2⅝" × 1")
- **Avery 5161**: Address labels (4" × 1")
- **Avery 5162**: Address labels (4" × 1⅓")
- **Custom Small**: Small ID labels (40mm × 20mm)
- **Custom Medium**: Medium ID labels (60mm × 30mm)
- **Custom Large**: Large ID labels (80mm × 40mm)

## File Structure

```
src/
├── components/
│   ├── Layout/           # Layout components
│   ├── LabelPreview/     # Preview and display components
│   ├── ConfigPanel/      # Configuration interface
│   ├── EmployeeInput/    # Employee ID input handling
│   └── PrintControls/    # Print and export functionality
├── utils/
│   ├── labelGenerator.js # Label layout generation
│   ├── pdfExport.js     # PDF export functionality
│   └── csvImport.js     # CSV file processing
├── types/
│   └── index.js         # Type definitions and constants
└── templates/           # Label templates and presets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.
