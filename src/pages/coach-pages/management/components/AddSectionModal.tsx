import React from "react";
import { X, Plus } from "lucide-react";
import type { NewSection, ScheduleEntry, Staff } from "@/types/types";
import type { CreateClubResponse } from "@/functions/axios/responses";

interface AddSectionModalProps {
  show: boolean;
  editing: boolean;
  allClubs: CreateClubResponse[];
  allStaff: Staff[];
  newSection: NewSection & { schedule?: ScheduleEntry[] };
  onChange: (field: keyof NewSection | "schedule", value: unknown) => void;
  onAdd: () => void;
  onSave: () => void;
  onClose: () => void;
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  show,
  editing,
  allClubs,
  allStaff,
  newSection,
  onChange,
  onAdd,
  onSave,
  onClose,
}) => {
  if (!show) return null;

  const schedule: ScheduleEntry[] = newSection.schedule || [];

  const addEntry = () => {
    const entry: ScheduleEntry = { day: weekdays[0], start: "", end: "" };
    onChange("schedule", [...schedule, entry]);
  };

  const updateEntry = (
    idx: number,
    field: keyof ScheduleEntry,
    value: unknown
  ) => {
    const updated = schedule.map((e, i) =>
      i === idx ? { ...e, [field]: value } : e
    );
    onChange("schedule", updated);
  };

  const removeEntry = (idx: number) => {
    const updated = schedule.filter((_, i) => i !== idx);
    onChange("schedule", updated);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end pb-12">
      <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editing ? "Edit Section" : "Add New Section"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Club */}
          <div>
            <label className="block text-sm font-medium mb-1">Клуб</label>
            <select
              value={newSection.clubId || ""}
              onChange={(e) => onChange("clubId", e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Выберите клуб</option>
              {allClubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Название секции
            </label>
            <input
              type="text"
              value={newSection.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Level, Capacity, Price, Duration, Coach */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Уровень</label>
              <select
                value={newSection.level}
                onChange={(e) => onChange("level", e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="beginner">Начальный</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
                <option value="pro">Профи</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Вместимость
              </label>
              <input
                type="number"
                value={newSection.capacity}
                onChange={(e) => onChange("capacity", Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Цена</label>
              <input
                type="number"
                value={newSection.price}
                onChange={(e) => onChange("price", Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Тренер (ID)
              </label>
              <select
                value={newSection.coachId ?? ""}
                onChange={(e) => onChange("coachId", Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Без тренера</option>
                {allStaff
                  .filter((s) => s.role === "coach")
                  .map((s) => (
                    <option key={s.id} value={Number(s.id)}>
                      {s.name} {s.surname}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Optional Schedule */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">
                Расписание (опционально)
              </label>
              <button
                onClick={addEntry}
                className="flex items-center text-blue-500 hover:underline"
              >
                <Plus size={16} /> Добавить время
              </button>
            </div>
            <div className="space-y-2">
              {schedule.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={entry.day}
                    onChange={(e) => updateEntry(idx, "day", e.target.value)}
                    className="border rounded-lg p-2"
                  >
                    {weekdays.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={entry.start}
                    onChange={(e) => updateEntry(idx, "start", e.target.value)}
                    className="border rounded-lg p-2"
                  />
                  <span className="text-sm">—</span>
                  <input
                    type="time"
                    value={entry.end}
                    onChange={(e) => updateEntry(idx, "end", e.target.value)}
                    className="border rounded-lg p-2"
                  />
                  <button
                    onClick={() => removeEntry(idx)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={editing ? onSave : onAdd}
            disabled={!newSection.clubId || !newSection.name}
            className="w-full bg-blue-500 text-white py-3 rounded-lg disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> {editing ? "Save Changes" : "Add Section"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;
