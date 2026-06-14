import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Download, Printer, Trash2, Plus, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

function generateQRCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RCLA-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const MATERIAL_OPTIONS = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'vidrio', label: 'Vidrio' },
  { value: 'carton', label: 'Cartón' },
  { value: 'metal', label: 'Metal' },
];

const STATUS_STYLES = {
  unused: 'bg-green-100 text-green-700',
  used: 'bg-blue-100 text-blue-700',
  invalidated: 'bg-red-100 text-red-700',
};
const STATUS_LABELS = { unused: 'Disponible', used: 'Canjeado', invalidated: 'Inválido' };

export default function QRGenerator() {
  const { user } = useAuth();
  const printRef = useRef();
  const [productName, setProductName] = useState('Botella 1.5L');
  const [productType, setProductType] = useState('plastico');
  const [pointsValue, setPointsValue] = useState(15);
  const [quantity, setQuantity] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [lastBatch, setLastBatch] = useState([]);
  const [allQRs, setAllQRs] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);

  useEffect(() => {
    loadQRs();
  }, []);

  async function loadQRs() {
    const data = await base44.entities.BottleQR.list({ order_by: '-created_at' });
    setAllQRs(data);
    setLoadingAll(false);
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (quantity < 1 || quantity > 500) return;
    setGenerating(true);

    const batchId = `BATCH-${Date.now()}`;
    const codes = Array.from({ length: quantity }, () => ({
      code: generateQRCode(),
      product_name: productName,
      product_type: productType,
      points_value: pointsValue,
      batch_id: batchId,
      status: 'unused',
    }));

    const created = await base44.entities.BottleQR.bulkCreate(codes);
    setLastBatch(created);
    await loadQRs();
    setGenerating(false);
  }

  async function invalidateQR(id) {
    await base44.entities.BottleQR.update(id, { status: 'invalidated' });
    setAllQRs(prev => prev.map(q => q.id === id ? { ...q, status: 'invalidated' } : q));
  }

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPDF() {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    const el = document.getElementById('qr-print-area');
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#fff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgAspect = canvas.height / canvas.width;
    const pdfImgH = pageW * imgAspect;
    let yOffset = 0;
    while (yOffset < pdfImgH) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -yOffset, pageW, pdfImgH);
      yOffset += pageH;
    }
    const batchId = lastBatch[0]?.batch_id || 'qrs';
    pdf.save(`${batchId}.pdf`);
  }

  if (user?.role !== 'admin') {
    return (
      <div className="px-4 py-12 text-center space-y-4">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <p className="font-bold text-[hsl(var(--foreground))]">Acceso restringido</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Solo los administradores pueden acceder a este panel.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Panel Admin · QRs</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Genera y gestiona los códigos QR de botellas.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerate} className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-5 space-y-4">
        <h2 className="font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generar nuevo lote
        </h2>
        <div>
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Nombre del producto</label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Tipo de material</label>
            <select
              value={productType}
              onChange={e => setProductType(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-[hsl(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] bg-white"
            >
              {MATERIAL_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Puntos por QR</label>
            <input
              type="number"
              value={pointsValue}
              onChange={e => setPointsValue(Number(e.target.value))}
              min={1} max={100}
              className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5 block">Cantidad (máx. 500)</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(Math.min(500, Math.max(1, Number(e.target.value))))}
            min={1} max={500}
            className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
        </div>
        <button
          type="submit"
          disabled={generating}
          className="w-full bg-[hsl(var(--primary))] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <QrCode className="w-4 h-4" />
          {generating ? 'Generando...' : `Generar ${quantity} QRs`}
        </button>
      </form>

      {/* Last batch preview */}
      <AnimatePresence>
        {lastBatch.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[hsl(var(--foreground))]">Último lote ({lastBatch.length} QRs)</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs font-semibold border border-[hsl(var(--border))] rounded-xl px-3 py-2 hover:bg-[hsl(var(--secondary))] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-[hsl(var(--primary))] text-white rounded-xl px-3 py-2"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>

            <div id="qr-print-area" className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[hsl(var(--border))]">
              {lastBatch.slice(0, 20).map((qr) => (
                <div key={qr.id} className="flex flex-col items-center gap-1.5 p-3 border border-gray-100 rounded-xl">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qr.code)}`}
                    alt={qr.code}
                    className="w-20 h-20"
                    loading="lazy"
                  />
                  <p className="font-mono text-[10px] text-center text-gray-700">{qr.code}</p>
                  <p className="text-[10px] text-center text-gray-500">{qr.product_name}</p>
                  <span className="text-[10px] font-bold text-[hsl(var(--primary))]">{qr.points_value} pts</span>
                </div>
              ))}
            </div>
            {lastBatch.length > 20 && (
              <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
                Mostrando 20 de {lastBatch.length}. El PDF incluirá todos.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All QRs list */}
      <div>
        <h2 className="font-bold text-[hsl(var(--foreground))] mb-3">Todos los QRs ({allQRs.length})</h2>
        {loadingAll ? <LoadingSpinner /> : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {allQRs.map((qr) => (
              <div key={qr.id} className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-3 flex items-center gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${encodeURIComponent(qr.code)}`}
                  alt={qr.code}
                  className="w-10 h-10 rounded-lg"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-bold text-[hsl(var(--foreground))]">{qr.code}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{qr.product_name} · {qr.points_value} pts</p>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[qr.status] || 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[qr.status] || qr.status}
                </span>
                {qr.status === 'unused' && (
                  <button
                    onClick={() => invalidateQR(qr.id)}
                    className="shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Invalidar QR"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #qr-print-area { display: grid !important; position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
