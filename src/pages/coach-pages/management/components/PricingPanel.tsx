// src/pages/coach-pages/management/components/PricingPanel.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import type { PricingPackage } from '@/types/pricing.types';
import PricingCard from './PricingCard';

interface PricingPanelProps {
  packages: PricingPackage[];
  onAdd: () => void;
  onEdit: (pkg: PricingPackage) => void;
  onDelete: (id: string) => void;
}

export const PricingPanel: React.FC<PricingPanelProps> = ({
  packages,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <div className="mb-3 text-sm text-gray-600">
        {packages.length} {packages.length === 1 ? 'пакет' : 'пакетов'}
      </div>
      <div className="space-y-3">
        {packages.map((pkg) => (
          <PricingCard
            key={pkg.id}
            package={pkg}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        <button
          onClick={onAdd}
          className="fixed bottom-28 right-4 bg-blue-500 p-4 rounded-full shadow-lg text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </>
  );
};
