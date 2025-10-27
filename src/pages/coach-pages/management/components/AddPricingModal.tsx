// src/pages/coach-pages/management/components/AddPricingModal.tsx
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { PricingPackage, PaymentType, PackageType } from '@/types/pricing.types';
import type { CreateClubResponse, CreateSectionResponse } from '@/functions/axios/responses';

interface AddPricingModalProps {
  show: boolean;
  package?: PricingPackage | null;
  clubs: CreateClubResponse[];
  sections: CreateSectionResponse[];
  onClose: () => void;
  onSave: (pkg: PricingPackage) => void;
}

interface GroupWithSection {
  groupId: number;
  groupName: string;
  sectionId: number;
  sectionName: string;
  clubId: number;
}

const AddPricingModal: React.FC<AddPricingModalProps> = ({
  show,
  package: pkg,
  clubs,
  sections,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Partial<PricingPackage>>(
    pkg || {
      name: '',
      paymentType: 'monthly',
      price: 0,
      active: true,
    }
  );

  const [selectedClubs, setSelectedClubs] = useState<number[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>(pkg?.sectionIds || []);
  const [selectedGroups, setSelectedGroups] = useState<number[]>(pkg?.groupIds || []);
  const [expandedClubs, setExpandedClubs] = useState<number[]>(
    pkg ? clubs.filter(c => sections.some(s => s.club_id === c.id && (pkg.sectionIds?.includes(s.id) || s.groups?.some(g => pkg.groupIds?.includes(g.id))))).map(c => c.id) : []
  );
  const [expandedSections, setExpandedSections] = useState<number[]>(
    pkg ? sections.filter(s => s.groups?.some(g => pkg.groupIds?.includes(g.id))).map(s => s.id) : []
  );

  if (!show) return null;

  // Get all groups with their section and club info
  const allGroups: GroupWithSection[] = sections.flatMap(section =>
    (section.groups || []).map(group => ({
      groupId: group.id,
      groupName: group.name,
      sectionId: section.id,
      sectionName: section.name,
      clubId: section.club_id,
    }))
  );

  const getSelectionSummary = () => {
    if (selectedClubs.length > 0) return `Клубы: ${selectedClubs.length}`;
    if (selectedSections.length > 0 && selectedGroups.length === 0) 
      return `Секции: ${selectedSections.length}`;
    if (selectedGroups.length > 0) return `Группы: ${selectedGroups.length}`;
    return 'Не выбрано';
  };

  const handleClubToggle = (clubId: number) => {
    const clubSections = sections.filter(s => s.club_id === clubId);
    const isSelected = selectedClubs.includes(clubId);
    
    if (isSelected) {
      setSelectedClubs(prev => prev.filter(id => id !== clubId));
      const sectionIds = clubSections.map(s => s.id);
      setSelectedSections(prev => prev.filter(id => !sectionIds.includes(id)));
      const groupIds = clubSections.flatMap(s => (s.groups || []).map(g => g.id));
      setSelectedGroups(prev => prev.filter(id => !groupIds.includes(id)));
    } else {
      setSelectedClubs(prev => [...prev, clubId]);
      const sectionIds = clubSections.map(s => s.id);
      setSelectedSections(prev => [...new Set([...prev, ...sectionIds])]);
      const groupIds = clubSections.flatMap(s => (s.groups || []).map(g => g.id));
      setSelectedGroups(prev => [...new Set([...prev, ...groupIds])]);
    }
  };

  const handleSectionToggle = (sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const isSelected = selectedSections.includes(sectionId);
    
    if (isSelected) {
      setSelectedSections(prev => prev.filter(id => id !== sectionId));
      const groupIds = (section.groups || []).map(g => g.id);
      setSelectedGroups(prev => prev.filter(id => !groupIds.includes(id)));
    } else {
      setSelectedSections(prev => [...prev, sectionId]);
      const groupIds = (section.groups || []).map(g => g.id);
      setSelectedGroups(prev => [...new Set([...prev, ...groupIds])]);
    }
  };

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || selectedGroups.length === 0) {
      alert('Заполните все обязательные поля и выберите хотя бы одну группу');
      return;
    }
    
    const firstGroup = allGroups.find(g => selectedGroups.includes(g.groupId));
    const clubId = firstGroup?.clubId || clubs[0]?.id || 1;
    
    let type: PackageType = 'multiple_groups';
    if (selectedClubs.length > 0) type = 'full_club';
    else if (selectedGroups.length === 1) type = 'single_group';
    else if (selectedSections.length > 0 && selectedGroups.length === 0) type = 'full_section';
    
    const newPackage: PricingPackage = {
      ...form,
      id: pkg?.id || Date.now().toString(),
      name: form.name!,
      type,
      paymentType: form.paymentType!,
      price: form.price!,
      clubId,
      sectionIds: selectedSections,
      groupIds: selectedGroups,
      active: form.active ?? true,
    } as PricingPackage;
    
    onSave(newPackage);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full h-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {pkg ? 'Редактировать пакет' : 'Новый пакет'}
          </h2>
          <button onClick={onClose} className="py-2 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
              placeholder="BJJ Начинающие - Месяц"
            />
          </div>

          {/* Access Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Доступ <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal text-xs ml-2">
                ({getSelectionSummary()})
              </span>
            </label>
            <div className="border rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
              {clubs.map((club) => {
                const clubSections = sections.filter(s => s.club_id === club.id);
                const isClubExpanded = expandedClubs.includes(club.id);
                const isClubSelected = selectedClubs.includes(club.id);
                
                return (
                  <div key={club.id} className="mb-2">
                    <div className="flex items-center gap-2 p-2 hover:bg-white rounded">
                      <button
                        onClick={() =>
                          setExpandedClubs(prev =>
                            prev.includes(club.id)
                              ? prev.filter(id => id !== club.id)
                              : [...prev, club.id]
                          )
                        }
                        className="p-1"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isClubExpanded ? '' : '-rotate-90'}`}
                        />
                      </button>
                      <input
                        type="checkbox"
                        checked={isClubSelected}
                        onChange={() => handleClubToggle(club.id)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">🏢 {club.name}</span>
                    </div>

                    {isClubExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {clubSections.map((section) => {
                          const isSectionExpanded = expandedSections.includes(section.id);
                          const isSectionSelected = selectedSections.includes(section.id);
                          
                          return (
                            <div key={section.id}>
                              <div className="flex items-center gap-2 p-2 hover:bg-white rounded">
                                <button
                                  onClick={() =>
                                    setExpandedSections(prev =>
                                      prev.includes(section.id)
                                        ? prev.filter(id => id !== section.id)
                                        : [...prev, section.id]
                                    )
                                  }
                                  className="p-1"
                                >
                                  <ChevronDown
                                    size={16}
                                    className={`transition-transform ${
                                      isSectionExpanded ? '' : '-rotate-90'
                                    }`}
                                  />
                                </button>
                                <input
                                  type="checkbox"
                                  checked={isSectionSelected}
                                  onChange={() => handleSectionToggle(section.id)}
                                  className="w-4 h-4"
                                />
                                <span>📚 {section.name}</span>
                              </div>

                              {isSectionExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {(section.groups || []).map((group) => {
                                    const isGroupSelected = selectedGroups.includes(group.id);
                                    return (
                                      <div
                                        key={group.id}
                                        className="flex items-center gap-2 p-2 hover:bg-white rounded"
                                      >
                                        <div className="w-4" />
                                        <input
                                          type="checkbox"
                                          checked={isGroupSelected}
                                          onChange={() => handleGroupToggle(group.id)}
                                          className="w-4 h-4"
                                        />
                                        <span className="text-sm">🎯 {group.name}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Тип оплаты <span className="text-red-500">*</span>
            </label>
            <select
              value={form.paymentType}
              onChange={(e) =>
                setForm({ ...form, paymentType: e.target.value as PaymentType })
              }
              className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
            >
              <option value="monthly">Месячный</option>
              <option value="semi_annual">Полугодовой</option>
              <option value="yearly">Годовой</option>
              <option value="session_pack">За количество занятий</option>
            </select>
          </div>

          {/* Session Pack Details */}
          {form.paymentType === 'session_pack' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Количество занятий <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.sessionCount || ''}
                  onChange={(e) =>
                    setForm({ ...form, sessionCount: parseInt(e.target.value) })
                  }
                  className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
                  placeholder="8"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Срок действия (дней) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.validityDays || ''}
                  onChange={(e) =>
                    setForm({ ...form, validityDays: parseInt(e.target.value) })
                  }
                  className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
                  placeholder="30"
                />
              </div>
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Цена (₸) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
              className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
              placeholder="25000"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Активный пакет
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.price || selectedGroups.length === 0}
              className="w-full inline-flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pkg ? 'Сохранить изменения' : 'Создать пакет'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPricingModal;
