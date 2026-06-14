import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Upload, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const TIPS = [
  'Muestra el envase claramente antes de reciclarlo',
  'Graba la acción completa de depositar el envase',
  'Asegúrate de que el contenedor sea visible',
  'Duración recomendada: entre 5 y 15 segundos',
  'Buena iluminación para mejor reconocimiento por IA',
];

export default function UploadVideo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barcode = searchParams.get('barcode') || '';
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('video/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }

  async function handleUpload() {
    if (!file || !user) return;
    setUploading(true);

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const action = await base44.entities.RecyclingAction.create({
      user_email: user.email,
      product_name: 'Envase con vídeo',
      product_type: 'plastico',
      barcode: barcode || 'MANUAL',
      video_url: file_url,
      validation_status: 'pending',
      points_awarded: 0,
    });

    navigate(`/validation?actionId=${action.id}`);
  }

  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Subir vídeo</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">La IA validará tu reciclaje automáticamente.</p>
      </div>

      {barcode && (
        <div className="bg-[hsl(var(--secondary))] rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Código:</span>
          <span className="font-mono text-sm font-semibold">{barcode}</span>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">Consejos para el vídeo</span>
        </div>
        {TIPS.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-blue-700">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
            {tip}
          </div>
        ))}
      </div>

      {/* Drop area */}
      {!file ? (
        <motion.div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="border-2 border-dashed border-[hsl(var(--border))] rounded-3xl p-10 flex flex-col items-center gap-4 cursor-pointer hover:border-[hsl(var(--primary))] transition-colors"
        >
          <div className="w-16 h-16 bg-[hsl(var(--secondary))] rounded-2xl flex items-center justify-center">
            <Video className="w-8 h-8 text-[hsl(var(--primary))]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[hsl(var(--foreground))]">Seleccionar vídeo</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Arrastra aquí o pulsa para abrir la cámara</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-black">
            <video src={preview} controls className="w-full max-h-56 object-contain" />
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">{file.name}</p>
          </div>
          <button onClick={() => { setFile(null); setPreview(''); }} className="text-sm text-[hsl(var(--muted-foreground))] underline">
            Cambiar vídeo
          </button>
        </motion.div>
      )}

      <input ref={fileRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleFile} />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-[hsl(var(--primary))] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg text-base"
      >
        {uploading ? (
          <><span className="animate-spin">◌</span> Subiendo...</>
        ) : (
          <><Upload className="w-5 h-5" /> Subir y validar<ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </div>
  );
}
