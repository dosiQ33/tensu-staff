import React from 'react';
import { X, Plus } from 'lucide-react';
import type { NewSection, Staff } from '@/types/types';

interface AddSectionModalProps {
  show: boolean;
  editing: boolean;
  allCoaches: Staff[];
  allClubs: { id: string; name: string }[];  // clubs fetched from API
  newSection: NewSection;
  onChange: (field: keyof NewSection, value: unknown) => void;
  onToggleCoach: (coach: string) => void;
  onSave: () => void;
  onAdd: () => void;
  onClose: () => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  show,
  editing,
  allCoaches,
  allClubs,
  newSection,
  onChange,
  onToggleCoach,
  onSave,
  onAdd,
  onClose,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end pb-12">
      <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? 'Edit Section' : 'Add New Section'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Club Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
            <select
              value={newSection.clubId || ''}
              onChange={e => onChange('clubId', e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Club</option>
              {allClubs.map(club => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          {[
            { label: 'Section Name', field: 'name', type: 'text' },
            { label: 'Description', field: 'description', type: 'textarea' },
            { label: 'Telegram Group Link', field: 'telegramLink', type: 'url', placeholder: 'https://t.me/...'},
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={newSection[field as keyof NewSection] as string}
                  onChange={e => onChange(field as keyof NewSection, e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <input
                  type={type}
                  placeholder={placeholder}
                  value={newSection[field as keyof NewSection] as string}
                  onChange={e => onChange(field as keyof NewSection, e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}

          {/* Assigned Coaches */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Coaches</label>
            <div className="flex flex-wrap gap-2">
              {allCoaches.filter(c => c.role !== 'admin').map(coach => {
                const fullName = `${coach.name} ${coach.surname}`;
                const selected = newSection.coaches.includes(fullName);
                return (
                  <button
                    key={coach.id}
                    onClick={() => onToggleCoach(fullName)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {fullName}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={editing ? onSave : onAdd}
            disabled={!newSection.clubId || !newSection.name || !newSection.description}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            <Plus size={20} /> {editing ? 'Save Changes' : 'Add Section'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;