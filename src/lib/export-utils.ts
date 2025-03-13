
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ExportableData {
  [key: string]: any;
}

// Helper function to format data for export
const formatDataForExport = (data: ExportableData[]) => {
  return data.map(item => {
    const formattedItem: ExportableData = {};
    for (const [key, value] of Object.entries(item)) {
      // Skip internal fields and complex objects
      if (key === 'id' || typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
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

    // Create a new jsPDF instance
    const doc = new jsPDF();
    const formattedData = formatDataForExport(data);

    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    doc.setFontSize(12);

    // Add data
    const headers = Object.keys(formattedData[0] || {});
    const rows = formattedData.map(item => headers.map(header => item[header]));

    // Using autoTable with proper type handling
    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      margin: { top: 25 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

// Export individual document as PDF with more details
export const exportDocumentToPDF = (document: ExportableData, selectedColumns: string[]) => {
  try {
    if (!document) {
      throw new Error('No document to export');
    }

    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Documento Fiscal", 20, 20);
    doc.setFontSize(12);
    doc.text(`Número: ${document.number}`, 20, 30);
    
    let yPosition = 40;
    
    // Add selected document information
    if (selectedColumns.includes('type')) {
      doc.text(`Tipo: ${document.type.toUpperCase()}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (selectedColumns.includes('customer')) {
      doc.text(`Cliente: ${document.customer}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (selectedColumns.includes('date')) {
      const date = new Date(document.date).toLocaleDateString('pt-BR');
      doc.text(`Data: ${date}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (selectedColumns.includes('value')) {
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency', 
        currency: 'BRL'
      }).format(document.value);
      doc.text(`Valor: ${formattedValue}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (selectedColumns.includes('status')) {
      doc.text(`Status: ${document.status}`, 20, yPosition);
      yPosition += 10;
    }
    
    if (selectedColumns.includes('paymentMethod') && document.paymentMethod) {
      doc.text(`Forma de Pagamento: ${document.paymentMethod}`, 20, yPosition);
      yPosition += 10;
    }
    
    // Add items if selected and available
    if (selectedColumns.includes('items') && document.items && document.items.length > 0) {
      yPosition += 5;
      doc.text("Itens:", 20, yPosition);
      yPosition += 10;
      
      const itemHeaders = ["Descrição", "Quantidade", "Valor Unitário", "Valor Total"];
      const itemRows = document.items.map((item: any) => [
        item.description,
        item.quantity.toString(),
        new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.unitValue),
        new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.quantity * item.unitValue)
      ]);
      
      (doc as any).autoTable({
        head: [itemHeaders],
        body: itemRows,
        startY: yPosition,
        margin: { top: 25 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    }
    
    if (selectedColumns.includes('observations') && document.observations) {
      const tableHeight = document.items && document.items.length > 0 ? 
        document.items.length * 10 + 15 : 0;
      yPosition += tableHeight + 10;
      
      doc.text("Observações:", 20, yPosition);
      yPosition += 10;
      doc.text(document.observations, 20, yPosition, { 
        maxWidth: 170 
      });
    }
    
    // Save the PDF
    doc.save(`documento_${document.number}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting document to PDF:', error);
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
    return true;
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
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

// Generate document print content
export const generateDocumentPrintContent = (document: ExportableData, selectedColumns: string[]) => {
  try {
    if (!document) {
      throw new Error('No document to print');
    }
    
    const printStyles = `
      <style>
        @media print {
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .document-header { text-align: center; margin-bottom: 30px; }
          .document-info { margin: 20px; }
          .section-title { margin: 20px 0; }
        }
      </style>
    `;

    const getDocumentInfo = () => {
      const info = [];
      if (selectedColumns.includes('number')) info.push(`<p><strong>Número:</strong> ${document.number}</p>`);
      if (selectedColumns.includes('type')) info.push(`<p><strong>Tipo:</strong> ${document.type.toUpperCase()}</p>`);
      if (selectedColumns.includes('customer')) info.push(`<p><strong>Cliente:</strong> ${document.customer}</p>`);
      if (selectedColumns.includes('date')) info.push(`<p><strong>Data:</strong> ${new Date(document.date).toLocaleDateString('pt-BR')}</p>`);
      if (selectedColumns.includes('value')) info.push(`<p><strong>Valor:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(document.value)}</p>`);
      if (selectedColumns.includes('status')) info.push(`<p><strong>Status:</strong> ${document.status}</p>`);
      if (selectedColumns.includes('paymentMethod') && document.paymentMethod) info.push(`<p><strong>Forma de Pagamento:</strong> ${document.paymentMethod}</p>`);
      if (selectedColumns.includes('observations') && document.observations) info.push(`<p><strong>Observações:</strong> ${document.observations}</p>`);
      return info.join('');
    };

    const getItemsTable = () => {
      if (!selectedColumns.includes('items') || !document.items || document.items.length === 0) {
        return '';
      }
      
      return `
        <h2 class="section-title">Itens</h2>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Valor Unitário</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${document.items.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitValue)}</td>
                <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitValue)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Documento Fiscal</title>
          ${printStyles}
        </head>
        <body>
          <div class="document-header">
            <h1>Documento Fiscal</h1>
          </div>
          <div class="document-info">
            ${getDocumentInfo()}
          </div>
          ${getItemsTable()}
        </body>
      </html>
    `;
    
    return content;
  } catch (error) {
    console.error('Error generating print content:', error);
    throw error;
  }
};

// Generate list print content
export const generateListPrintContent = (documents: ExportableData[], selectedColumns: string[]) => {
  try {
    if (!documents || documents.length === 0) {
      throw new Error('No documents to print');
    }
    
    const printStyles = `
      <style>
        @media print {
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .document-header { text-align: center; margin-bottom: 30px; }
          .section-title { margin: 20px 0; }
        }
      </style>
    `;

    const getTableHeaders = () => {
      const headers = [];
      if (selectedColumns.includes('number')) headers.push('<th>Número</th>');
      if (selectedColumns.includes('type')) headers.push('<th>Tipo</th>');
      if (selectedColumns.includes('customer')) headers.push('<th>Cliente</th>');
      if (selectedColumns.includes('date')) headers.push('<th>Data</th>');
      if (selectedColumns.includes('value')) headers.push('<th>Valor</th>');
      if (selectedColumns.includes('status')) headers.push('<th>Status</th>');
      if (selectedColumns.includes('paymentMethod')) headers.push('<th>Forma de Pagamento</th>');
      return headers.join('');
    };

    const getTableRows = () => {
      return documents.map(doc => {
        const cells = [];
        if (selectedColumns.includes('number')) cells.push(`<td>${doc.number}</td>`);
        if (selectedColumns.includes('type')) cells.push(`<td>${doc.type.toUpperCase()}</td>`);
        if (selectedColumns.includes('customer')) cells.push(`<td>${doc.customer}</td>`);
        if (selectedColumns.includes('date')) cells.push(`<td>${new Date(doc.date).toLocaleDateString('pt-BR')}</td>`);
        if (selectedColumns.includes('value')) cells.push(`<td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(doc.value)}</td>`);
        if (selectedColumns.includes('status')) cells.push(`<td>${doc.status}</td>`);
        if (selectedColumns.includes('paymentMethod')) cells.push(`<td>${doc.paymentMethod || '-'}</td>`);
        return `<tr>${cells.join('')}</tr>`;
      }).join('');
    };

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Lista de Documentos Fiscais</title>
          ${printStyles}
        </head>
        <body>
          <div class="document-header">
            <h1>Lista de Documentos Fiscais</h1>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                ${getTableHeaders()}
              </tr>
            </thead>
            <tbody>
              ${getTableRows()}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    return content;
  } catch (error) {
    console.error('Error generating list print content:', error);
    throw error;
  }
};
