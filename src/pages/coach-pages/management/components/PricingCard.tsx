// src/pages/coach-pages/management/components/PricingCard.tsx
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import type { PricingPackage, PaymentType } from '@/types/pricing.types';

interface PricingCardProps {
  package: PricingPackage;
  onEdit: (pkg: PricingPackage) => void;
  onDelete: (id: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ package: pkg, onEdit, onDelete }) => {
  const getAccessDescription = (pkg: PricingPackage) => {
    const groupCount = pkg.groupIds?.length || 0;
    const sectionCount = pkg.sectionIds?.length || 0;
    
    if (pkg.type === 'full_club') return '🏢 Весь клуб';
    if (sectionCount > 0 && groupCount === 0) 
      return `📚 ${sectionCount} ${sectionCount === 1 ? 'секция' : 'секции'}`;
    if (groupCount === 1) return '🎯 1 группа';
    if (groupCount > 1) return `🎯 ${groupCount} ${groupCount < 5 ? 'группы' : 'групп'}`;
    return 'Не указано';
  };

  const getPaymentName = (type: PaymentType, count?: number, days?: number) => {
    switch(type) {
      case 'monthly': return 'Месячный';
      case 'yearly': return 'Годовой';
      case 'semi_annual': return 'Полугодовой';
      case 'session_pack': return `${count} занятий (${days} дней)`;
    }
  };

  const handleDelete = () => {
    if (confirm(`Удалить пакет "${pkg.name}"?`)) {
      onDelete(pkg.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-gray-600">{getAccessDescription(pkg)}</span>
            <div className="flex gap-3 items-center">
              <span className="text-gray-600">
                {getPaymentName(pkg.paymentType, pkg.sessionCount, pkg.validityDays)}
              </span>
              <span className="font-bold text-blue-600">
                {pkg.price.toLocaleString()} ₸
              </span>
            </div>
            {!pkg.active && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 w-fit">
                Неактивен
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(pkg)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
