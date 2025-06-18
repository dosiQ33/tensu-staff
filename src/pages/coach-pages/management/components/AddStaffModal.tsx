import type { CreateClubResponse } from "@/functions/axios/responses";
import type { NewStaff } from "@/types/types";
import { X, Plus } from "lucide-react";

interface AddStaffModalProps {
  show: boolean;
  allRoles: string[];
  allClubs: CreateClubResponse[];  
  newStaff: NewStaff;
  onChange: (field: keyof NewStaff, value: unknown) => void;
  // onToggleArray: (array: string[], item: string, field: keyof NewStaff) => void;
  onAdd: () => void;
  onClose: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  show, allRoles, allClubs, newStaff, onChange, onAdd, onClose
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end pb-12">
      <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden">
        {/* header */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Добавить персонал</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Role */}
          <div>
            <label className="block text-sm">Роль</label>
            <select
              value={newStaff.role}
              onChange={e => onChange('role', e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">– выбрать роль –</option>
              {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm">Номер телефона</label>
            <input
              type="tel"
              value={newStaff.phone}
              onChange={e => onChange('phone', e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Club */}
          <div>
            <label className="block text-sm">Клуб</label>
            <select
              value={newStaff.clubId}
              onChange={e => onChange('clubId', e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">– выбрать клуб –</option>
              {allClubs.map(c =>
                <option key={c.id} value={c.id}>{c.name}</option>
              )}
            </select>
          </div>

          <button
            onClick={onAdd}
            disabled={!newStaff.role || !newStaff.phone || !newStaff.clubId}
            className="w-full bg-blue-500 text-white py-3 rounded-lg disabled:bg-gray-300 flex justify-center items-center gap-2"
          >
            <Plus size={20} /> Добавить персонал
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;