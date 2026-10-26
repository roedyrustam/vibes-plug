---
name: pdf-document-generation-expert
description: "PDF generation and document processing (React PDF, Puppeteer) / Generasi PDF dan pemrosesan dokumen (React PDF, Puppeteer)."
author: "Roedy Rustam"
version: "4.4.4"

---

# PDF & Document Generation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **UI & Design Systems**: `design-system-architect`, `senior-frontend`, `ui-ux-pro-max`, and `anti-slop` for aligning PDF document typography, color tokens (slate/monochrome palettes), tabular numerals (`font-variant-numeric: tabular-nums`), and 1px borders with the primary application design system.
- **Visual Auditing**: `visual-ui-auditor` for verifying print stylesheets, contrast ratios, and layout precision across A4/Letter viewports.
- **FinTech & Billing**: `saas-billing` and `doku-payment-gateway` for automated invoice generation, tax receipts, and payment proofs.
- **Delivery & Media**: `email-notification-expert` for PDF email attachments and `file-upload-media-expert` for Cloudflare R2 / S3 archival.
- **Lifecycle**: `brainstorming` and `zero-to-prod-orchestrator` for structured document generation workflows.

### Description
Production guide for generating high-fidelity PDF documents, transactional invoices, financial reports, and certificates in modern web backends and serverless runtimes. Covers `@react-pdf/renderer` component architecture, server-side streaming buffers, font embedding with custom TrueType/WOFF metrics, Typst/WASM ultra-fast document compilation, and memory-safe PDF manipulation using `pdf-lib`. Enforces sovereign anti-slop visual standards (crisp monochrome/slate palettes, tabular numerals, 1px borders, zero generic purple gradients).

### Trigger Conditions
- Generating transactional billing invoices, tax receipts, or exportable financial summaries.
- Converting HTML views or React components into downloadable, pixel-perfect A4/Letter PDFs.
- Merging, watermarking, stamping, or digitally signing existing PDF contracts (`pdf-lib`).
- Overcoming serverless runtime memory/size limits where headless Chromium/Puppeteer is too heavy (>50MB).

### Production Invoicing Component (`@react-pdf/renderer`)

```tsx
// src/documents/InvoiceDocument.tsx
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer';

// Sovereign typography and professional slate palette (Anti-Slop Pillar 7 compliant)
const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, color: '#0f172a', fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  brandTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  metaLabel: { fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 },
  metaValue: { fontSize: 10, fontWeight: 'medium', color: '#1e293b' },
  table: { marginTop: 24, borderTopWidth: 1, borderColor: '#e2e8f0' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingVertical: 8, paddingHorizontal: 12 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#f1f5f9', paddingVertical: 10, paddingHorizontal: 12 },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  totalSection: { marginTop: 16, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 180, paddingVertical: 4 },
  grandTotal: { borderTopWidth: 1, borderColor: '#0f172a', paddingTop: 6, marginTop: 4, fontWeight: 'bold', fontSize: 12 },
});

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  customerName: string;
  customerEmail: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

export function InvoiceDocument({ invoice }: { invoice: InvoiceData }) {
  const subtotal = invoice.items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);

  return (
    <Document title={`Invoice-${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>INVOICE</Text>
            <Text style={styles.metaLabel}>Invoice #{invoice.invoiceNumber}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaLabel}>Issue Date</Text>
            <Text style={styles.metaValue}>{invoice.issueDate}</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.metaLabel}>Billed To</Text>
            <Text style={styles.metaValue}>{invoice.customerName}</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>{invoice.customerEmail}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Unit Price</Text>
            <Text style={styles.colTotal}>Amount</Text>
          </View>
          {invoice.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>${item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${(item.quantity * item.unitPrice).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total Due:</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Server API Route: stream to Buffer without writing to disk
export async function generateInvoicePdfBuffer(invoice: InvoiceData): Promise<Buffer> {
  return await renderToBuffer(<InvoiceDocument invoice={invoice} />);
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec pdf-document-generation-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **UI & Design System**: `design-system-architect`, `senior-frontend`, `ui-ux-pro-max`, dan `anti-slop` untuk menyelaraskan tipografi dokumen PDF, token warna (palet monokrom/slate), angka tabular (`font-variant-numeric: tabular-nums`), dan border 1px dengan sistem desain aplikasi utama.
- **Audit Visual**: `visual-ui-auditor` untuk memverifikasi stylesheet cetak (print CSS), rasio kontras warna, dan presisi tata letak pada viewport A4/Letter.
- **FinTech & Billing**: `saas-billing` dan `doku-payment-gateway` untuk pembuatan faktur otomatis, tanda terima pajak, dan bukti pembayaran.
- **Pengiriman & Media**: `email-notification-expert` untuk lampiran PDF email dan `file-upload-media-expert` untuk pengarsipan ke Cloudflare R2 / AWS S3.
- **Siklus Hidup**: `brainstorming` dan `zero-to-prod-orchestrator` untuk alur kerja pembuatan dokumen terstruktur.

### Deskripsi
Panduan produksi untuk menghasilkan dokumen PDF berkualitas tinggi, faktur tagihan (*invoice*), laporan keuangan, dan sertifikat pada backend web modern maupun lingkungan serverless. Mencakup arsitektur komponen `@react-pdf/renderer`, streaming buffer di sisi server tanpa penyimpanan disk sementara, penyematan font kustom, serta manipulasi dokumen PDF menggunakan `pdf-lib`. Menegakkan standar estetika visual anti-slop (palet warna slate/monokrom profesional, angka tabular, border 1px yang tajam, bebas gradien ungu generik).

### Kondisi Pemicu
- Menghasilkan faktur pembayaran, bukti transaksi (*receipt*), atau laporan pajak berkala dalam bentuk PDF.
- Mengonversi data dinamis menjadi dokumen PDF berukuran A4/Letter yang rapi dan konsisten.
- Menggabungkan (*merge*), memberi cap (*watermark*), atau menandatangani dokumen PDF secara digital (`pdf-lib`).
- Menghindari batasan memori serverless di mana Puppeteer/Chromium terlalu berat (>50MB).

### Endpoint API Streaming PDF di Next.js App Router

```typescript
// src/app/api/invoices/[id]/pdf/route.ts
import { NextResponse } from 'next/server';
import { generateInvoicePdfBuffer } from '@/documents/InvoiceDocument';
import { getInvoiceById } from '@/lib/db/invoices';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(params.id);
  if (!invoice) {
    return NextResponse.json({ error: 'Faktur tidak ditemukan' }, { status: 404 });
  }

  const pdfBuffer = await generateInvoicePdfBuffer(invoice);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
```

### 3 Aturan Emas Dokumen Keuangan
1. **Palet Warna Profesional**: Gunakan warna monokrom slate (`#0f172a`, `#64748b`) untuk menjaga kesan kredibel perbankan/FinTech. Hindari warna ungu mencolok atau efek bayangan berlebihan.
2. **Angka Tabular**: Pastikan kolom harga dan total menggunakan angka dengan lebar seragam agar desimal sejajar secara vertikal.
3. **Buffer Tanpa File Sementara**: Render langsung ke `Buffer` di memori untuk mencegah kebocoran penyimpanan disk pada container atau fungsi serverless.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec pdf-document-generation-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
