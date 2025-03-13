
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Adicionando a declaração para o autoTable para o TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportableData {
  [key: string]: any;
}

// Helper function to format data for export
const formatDataForExport = (data: ExportableData[]) => {
  return data.map(item => {
    const formattedItem: ExportableData = {};
    for (const [key, value] of Object.entries(item)) {
      // Skip internal fields and complex objects
      if (key === 'id' || typeof value === 'object') continue;
      formattedItem[key] = value;
    }
    return formattedItem;
  });
};

// Export as PDF
export const exportToPDF = (data: ExportableData[], title: string) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const doc = new jsPDF();
    const formattedData = formatDataForExport(data);

    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    doc.setFontSize(12);

    // Add data
    const headers = Object.keys(formattedData[0] || {});
    const rows = formattedData.map(item => headers.map(header => item[header]));

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      margin: { top: 25 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

// Export as Excel
export const exportToExcel = (data: ExportableData[], title: string) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const formattedData = formatDataForExport(data);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, title);

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

// Export as CSV
export const exportToCSV = (data: ExportableData[], title: string) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const formattedData = formatDataForExport(data);
    const csv = Papa.unparse(formattedData);
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};
