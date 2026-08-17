---
name: pdf-document-generation-expert
description: "Expert guide for PDF generation and document processing (React PDF, Puppeteer, jsPDF, pdf-lib) / Panduan ahli generasi PDF dan pemrosesan dokumen (React PDF, Puppeteer, jsPDF, pdf-lib)."
author: "vibes-plug-swarm"
---

# PDF & Document Generation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`email-notification-expert`**: PDF attachments in transactional emails.
- **`saas-billing`**: Invoice and receipt PDF generation.
- **`file-upload-media-expert`**: PDF storage and CDN delivery.

### Description
Expert guide for generating PDFs and processing documents in web applications. Covers React PDF (@react-pdf/renderer), Puppeteer HTML-to-PDF, jsPDF, pdf-lib, invoice generation, report templates, digital signatures, and document parsing.

### Trigger Conditions
- Generating invoices, receipts, or reports as PDFs.
- Converting HTML pages to downloadable PDFs.
- Building document templates with dynamic data.
- Implementing digital signatures on PDF documents.

---

### Library Selection

| Library | Approach | Server/Client | Best For |
|---------|----------|---------------|----------|
| @react-pdf/renderer | React components → PDF | Both | Complex layouts |
| Puppeteer | HTML → PDF (headless Chrome) | Server | Pixel-perfect from HTML |
| jsPDF | Programmatic canvas | Client | Simple client-side PDFs |
| pdf-lib | Low-level PDF manipulation | Both | Modify existing PDFs |

```tsx
// React PDF — Invoice generation
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  header: { fontSize: 24, marginBottom: 20, color: '#8B5CF6' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  total: { fontSize: 16, fontWeight: 'bold', borderTopWidth: 1, paddingTop: 8, marginTop: 16 },
});

function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice #{invoice.number}</Text>
        {invoice.items.map((item, i) => (
          <View key={i} style={styles.row}>
            <Text>{item.description}</Text>
            <Text>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.total}>
          <Text>Total: ${invoice.total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}

// Server-side render to buffer
export async function generateInvoicePDF(invoice) {
  return await renderToBuffer(<InvoicePDF invoice={invoice} />);
}
```

## Orchestration & Integration
- `email-notification-expert`, `saas-billing`, `file-upload-media-expert`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk menghasilkan PDF dan memproses dokumen di aplikasi web. Mencakup React PDF, Puppeteer HTML-to-PDF, jsPDF, dan pdf-lib.

### Kondisi Pemicu
- Menghasilkan invoice, struk, atau laporan sebagai PDF.
- Mengkonversi halaman HTML ke PDF yang bisa diunduh.
- Membangun template dokumen dengan data dinamis.
