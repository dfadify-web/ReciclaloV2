import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Zap, Calendar, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { daysUntil } from '@/lib/utils';
import { MATERIAL_LABELS } from '@/lib/gamification';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

function CampaignCard({ campaign, i }) {
  const daysLeft = daysUntil(campaign.end_date);
  const isActive = campaign.is_active && (!campaign.end_date || daysLeft > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-sm"
    >
      {campaign.image_url && (
        <img src={campaign.image_url} alt={campaign.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[hsl(var(--foreground))]">{campaign.title}</h3>
          {isActive ? (
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Activa</span>
          ) : (
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">Finalizada</span>
          )}
        </div>

        {campaign.description && (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{campaign.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">+{campaign.bonus_points} pts extra</span>
          </div>
          {campaign.target_type && campaign.target_type !== 'todos' && (
            <div className="flex items-center gap-1.5 bg-[hsl(var(--secondary))] rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">
                {MATERIAL_LABELS[campaign.target_type] || campaign.target_type}
              </span>
            </div>
          )}
        </div>

        {campaign.sponsor && (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Patrocinado por <span className="font-semibold">{campaign.sponsor}</span>
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
          {campaign.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Desde {new Date(campaign.start_date).toLocaleDateString('es-ES')}</span>
            </div>
          )}
          {isActive && daysLeft !== null && (
            <div className="flex items-center gap-1 text-orange-500 font-semibold">
              <Clock className="w-3 h-3" />
              <span>{daysLeft === 0 ? 'Último día' : `${daysLeft} días restantes`}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Campaign.list({ order_by: '-created_at' });
      setCampaigns(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const active = campaigns.filter(c => c.is_active);
  const past = campaigns.filter(c => !c.is_active);

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Campañas</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Participa y gana puntos extra con las campañas activas.</p>
      </div>

      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Campañas activas
          </h2>
          {active.map((c, i) => <CampaignCard key={c.id} campaign={c} i={i} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[hsl(var(--muted-foreground))]">Campañas pasadas</h2>
          {past.map((c, i) => <CampaignCard key={c.id} campaign={c} i={i} />)}
        </div>
      )}

      {campaigns.length === 0 && (
        <EmptyState icon={Megaphone} title="Sin campañas" description="Pronto habrá campañas disponibles. ¡Vuelve pronto!" />
      )}
    </div>
  );
}
