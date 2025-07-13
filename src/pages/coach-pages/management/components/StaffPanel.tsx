import type { Staff } from "@/types/types";
import { Plus } from "lucide-react";
import StaffCard from "./StaffCard";

export const StaffPanel: React.FC<{
  staff: Staff[];
  onAdd: () => void;
}> = ({ staff, onAdd }) => (
  <>
    <div className="mb-3 text-sm text-gray-600">{staff.length} сотрудников</div>
    <div className="space-y-2">
      {staff.map((m) => (
        <StaffCard key={m.id} member={m} />
      ))}
      <button onClick={onAdd} className="…">
        <Plus size={20} /> Добавить Тренера/Администратора
      </button>
    </div>
  </>
);