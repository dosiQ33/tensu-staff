import React from 'react';
import { X, Plus } from 'lucide-react';
import type { NewStaff } from '@/types/types';

interface AddStaffModalProps {
  show: boolean;
  allSports: string[];
  allGroups: string[];
  allRoles: string[];
  newStaff: NewStaff;
  onChange: (field: keyof NewStaff, value: unknown) => void;
  onToggleArray: (array: string[], item: string, field: keyof NewStaff) => void;
  onAdd: () => void;
  onClose: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ show, allSports, allGroups, allRoles, newStaff, onChange, onToggleArray, onAdd, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end pb-12">
      <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Staff Member</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600"> <X size={20} /> </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Personal fields */}
          <div className="grid grid-cols-2 gap-3">
            {['First Name', 'Last Name'].map((label, idx) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  value={ idx === 0 ? newStaff.name : newStaff.surname }
                  onChange={e => onChange(idx === 0 ? 'name' : 'surname', e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
          {/* Telegram, Role, Phone */}
          {[
            { label: 'Telegram Username', field: 'telegramUsername', type: 'text', placeholder: '@username' },
            { label: 'Role', field: 'role', type: 'select' },
            { label: 'Phone', field: 'phone', type: 'tel' }
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {type === 'select' ? (
                <select
                  value={newStaff.role}
                  onChange={e => onChange('role', e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Role</option>
                  {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              ) : (
                <input
                  type={type}
                  placeholder={placeholder}
                  value={newStaff[field as keyof NewStaff] as string}
                  onChange={e => onChange(field as keyof NewStaff, e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}
          {/* Sports & Groups selectors */}
          {[
            { label: 'Sports', items: allSports, field: 'sports' },
            { label: 'Groups', items: allGroups, field: 'groups' }
          ].map(({ label, items, field }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onToggleArray(newStaff[field as keyof NewStaff] as string[], item, field as keyof NewStaff)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      (newStaff[field as keyof NewStaff] as string[]).includes(item)
                        ? 'bg-gray-300 text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >{item}</button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={onAdd}
            disabled={!newStaff.name || !newStaff.surname || !newStaff.role}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            <Plus size={20} /> Add Staff Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;