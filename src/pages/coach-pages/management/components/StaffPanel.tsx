import type { Staff } from "@/types/types";
import { Plus } from "lucide-react";
import StaffCard from "./StaffCard";

export const StaffPanel: React.FC<{
  staff: Staff[];
  onAdd: () => void;
}> = ({ staff, onAdd }) => {
  const userId = localStorage.getItem("userId");
  return (
    <>
      <div className="mb-3 text-sm text-gray-600">
        {staff.length} сотрудников
      </div>
      <div className="space-y-2">
        {staff.map(
          (m) => m.id !== userId && <StaffCard key={m.id} member={m} />
        )}
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
