import type { CreateSectionResponse } from "@/functions/axios/responses";
import { Plus } from "lucide-react";
import SectionCard from "./SectionCard";

export const SectionsPanel: React.FC<{
  sections: CreateSectionResponse[];
  onEdit: (id: number) => void;
  onAdd: () => void;
}> = ({ sections, onEdit, onAdd }) => (
  <>
    <div className="mb-3 text-sm text-gray-600">{sections.length} секций</div>
    <div className="space-y-4">
      {sections.map((sec) => (
        <SectionCard key={sec.id} section={sec} onEdit={onEdit} />
      ))}
      <button onClick={onAdd} className="…">
        <Plus size={20} /> Добавить Секцию
      </button>
    </div>
  </>
);

