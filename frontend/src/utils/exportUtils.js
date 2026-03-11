import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Normalizes varying scan results into a stable, consistent schema.
 * Handles different source field names and potential missing data.
 * @param {Object} item - The raw scan history item or result object
 * @returns {Object} - Unified report data
 */
export const normalizeReportData = (item) => {
  if (!item) return null;

  // Extract raw details - handle cases where we pass the full history item or just the details object
  const raw = item.details || item || {};
  
  // 1. Resolve Risk Level
  const riskLevel = (item.riskLevel || raw.riskLevel || 'unknown').toLowerCase();
  
  // 2. Resolve Risk Score (handle various potential keys)
  const riskScore = raw.riskScore ?? raw.score ?? (raw.analysis?.score) ?? 0;
  
  // 3. Resolve Threat Counts / Malicious Hits
  let threatsCount = 0;
  if (Array.isArray(raw.detectedThreats)) {
    threatsCount = raw.detectedThreats.length;
  } else if (raw.phishingCount !== undefined) {
    threatsCount = raw.phishingCount;
  } else if (raw.maliciousCount !== undefined) {
    threatsCount = raw.maliciousCount;
  } else if (raw.breachCount !== undefined) {
    threatsCount = raw.breachCount;
  }

  // 4. Resolve Target (URL, File, Email)
  const target = item.target || raw.url || raw.fileName || raw.email || 'N/A';
  
  // 5. Build Technical Metadata
  const metadata = {
    scanType: (item.scanType || 'unknown').toUpperCase(),
    targetVector: target,
    riskLevel: riskLevel.toUpperCase(),
    riskScore: `${riskScore}/100`,
    timestamp: item.createdAt || new Date().toISOString(),
    status: item.result || (riskLevel === 'safe' ? 'CLEAN' : 'THREAT_DETECTED')
  };

  // 6. Map type-specific findings
  const findings = [];
  if (raw.detectedThreats && Array.isArray(raw.detectedThreats)) {
    findings.push(...raw.detectedThreats);
  } else if (raw.sources && Array.isArray(raw.sources)) {
    findings.push(...raw.sources.map(s => `${s.name} (${s.date})`));
  }

  return {
    ...metadata,
    metrics: {
      score: riskScore,
      totalHits: threatsCount,
      malicious: raw.maliciousCount ?? 0,
      suspicious: raw.suspiciousCount ?? 0,
      engines: raw.totalEngines ?? 0
    },
    findings: findings.length > 0 ? findings : ['None Identified'],
    advice: raw.advice || 'No automated recommendations available.',
    raw: raw // Keep raw data for JSON export
  };
};

/**
 * Safely flattens a nested object into a single-level object for CSV
 * @param {Object} obj - The object to flatten
 * @param {string} prefix - Key prefix for recursion
 * @returns {Object} - Flattened object
 */
const safeFlatten = (obj, prefix = '') => {
  if (obj === null || obj === undefined) return {};
  
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    const value = obj[k];

    if (value === null || value === undefined) {
      acc[pre + k] = '';
    } else if (Array.isArray(value)) {
      acc[pre + k] = value.join(' | ');
    } else if (typeof value === 'object' && Object.keys(value).length > 0) {
      Object.assign(acc, safeFlatten(value, pre + k));
    } else {
      acc[pre + k] = value;
    }
    return acc;
  }, {});
};

/**
 * Downloads a JSON file of the security report
 */
export const exportToJSON = (item) => {
  const data = normalizeReportData(item);
  const fileName = `security-report-${new Date().toISOString().split('T')[0]}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Downloads a CSV file of the security report
 */
export const exportToCSV = (item) => {
  try {
    const data = normalizeReportData(item);
    const flattenedData = safeFlatten(data);
    const fileName = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
    
    const headers = Object.keys(flattenedData).join(',');
    const values = Object.values(flattenedData).map(v => {
      const str = String(v ?? '').replace(/"/g, '""');
      return str.includes(',') ? `"${str}"` : str;
    }).join(',');
    
    const csvContent = `${headers}\n${values}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('CSV Export Error:', err);
    alert('Export Failed: Data structure anomaly detected. Generating JSON fallback.');
    exportToJSON(item);
  }
};

/**
 * Generates and downloads a professional PDF security report
 */
export const exportToPDF = (item) => {
  try {
    const data = normalizeReportData(item);
    const doc = new jsPDF();
    const dateStr = new Date(data.timestamp).toLocaleString();
    const fileName = `security-report-${new Date().toISOString().split('T')[0]}.pdf`;

    const cyberBlue = [0, 255, 255];
    const cyberBlack = [10, 10, 10];
    
    doc.setFillColor(...cyberBlack);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(...cyberBlue);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CYBERNET-AI SECURITY REPORT', 20, 25);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text(`Generated: ${dateStr} | Vector: ${data.scanType}`, 20, 32);

    doc.setDrawColor(...cyberBlue);
    doc.setLineWidth(1);
    doc.line(20, 45, 190, 45);

    // Section 1: Scan Overview
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. SCAN OVERVIEW', 20, 55);

    const overviewData = [
      ['Property', 'Information'],
      ['Scan Type', data.scanType],
      ['Target Vector', data.targetVector],
      ['Risk Assessment', data.riskLevel],
      ['Operational Status', data.status]
    ];

    let currentY = 60;
    if (typeof autoTable === 'function') {
      autoTable(doc, {
        startY: currentY,
        head: [overviewData[0]],
        body: overviewData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: cyberBlack, textColor: cyberBlue },
        styles: { font: 'helvetica', fontSize: 10 }
      });
      currentY = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      overviewData.forEach((row, i) => {
        doc.text(`${row[0]}:`, 25, currentY + (i * 7));
        doc.text(`${row[1]}`, 75, currentY + (i * 7));
      });
      currentY += (overviewData.length * 7) + 15;
    }

    // Section 2: Technical Analysis
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. TECHNICAL TELEMETRY', 20, currentY);
    
    const technicalData = [
      ['Metric', 'Value'],
      ['Risk Confidence', data.riskScore],
      ['Threat Magnitude', data.metrics.totalHits],
      ['Anomalous Signals', (data.findings || []).join(', ')]
    ];

    if (typeof autoTable === 'function') {
      autoTable(doc, {
        startY: currentY + 5,
        body: technicalData,
        theme: 'striped',
        styles: { font: 'courier', fontSize: 9 }
      });
      currentY = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(9);
      doc.setFont('courier', 'normal');
      technicalData.forEach((row, i) => {
        doc.text(`${row[0]}:`, 25, currentY + 10 + (i * 7));
        doc.text(`${row[1]}`, 75, currentY + 10 + (i * 7));
      });
      currentY += (technicalData.length * 7) + 20;
    }

    // Section 3: Protocol Advice
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. AI PROTOCOL RECOMMENDATIONS', 20, currentY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const splitAdvice = doc.splitTextToSize(data.advice, 170);
    doc.text(splitAdvice, 20, currentY + 8);

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`CyberNet-AI | Classified Security Report | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    }

    doc.save(fileName);
  } catch (err) {
    console.error('PDF Export Error:', err);
    alert('Export Fail: Critical parsing error. Generating JSON legacy report instead.');
    exportToJSON(item);
  }
};
