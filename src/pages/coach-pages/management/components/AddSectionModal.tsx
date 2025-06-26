// AddSectionModal.tsx
import React from "react";
import { X, Plus, ChevronDown } from "lucide-react";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full h-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editing ? "Изменить Секцию" : "Добавить Новую Секцию"}
          </h2>
          <button
            onClick={onClose}
            className="py-2 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Club & Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Клуб <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 bg-white w-full rounded-xl shadow-sm ">
                <select
                  value={newSection.clubId || ""}
                  onChange={(e) => onChange("clubId", e.target.value)}
                  className="appearance-none block py-2.5 px-4 w-full pr-10 text-gray-900 outline-none transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-transparent"
                >
                  <option value="" className="w-[40%]">
                    Выберите клуб
                  </option>
                  {allClubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="mr-2" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Название секции <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 bg-white w-full rounded-xl shadow-sm ">
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="block w-full border-none rounded-xl py-2.5 px-4"
                />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Уровень
              </label>
              <div className="rounded-xl shadow-sm flex items-center border border-gray-300 bg-white w-full relative">
                <select
                  value={newSection.level}
                  onChange={(e) => onChange("level", e.target.value)}
                  className="py-2.5 px-4 block w-full border-gray-300 focus:outline-none appearance-none"
                >
                  <option value="beginner">Начальный</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                  <option value="pro">Профи</option>
                </select>
                <ChevronDown className="mr-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Вместимость
              </label>
              <input
                type="number"
                min={1}
                value={newSection.capacity || ""}
                onChange={(e) => onChange("capacity", Number(e.target.value))}
                className="rounded-xl py-2.5 px-4 shadow-sm border border-gray-300 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Цена
              </label>
              <input
                type="number"
                value={newSection.price || ""}
                onChange={(e) => onChange("price", Number(e.target.value))}
                className="rounded-xl py-2.5 px-4 shadow-sm border border-gray-300 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Тренер
              </label>
              <div className="rounded-xl shadow-sm flex items-center border border-gray-300 bg-white w-full relative">
                <select
                  value={newSection.coachId ?? ""}
                  onChange={(e) => onChange("coachId", Number(e.target.value))}
                  className="py-2.5 px-4 block w-full border-gray-300 focus:outline-none appearance-none"
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
                <ChevronDown className="mr-2" />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800">
                Расписание
              </h3>
              <button
                onClick={addEntry}
                className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
              >
                <Plus size={16} />
                <span className="ml-1">Добавить время</span>
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {schedule.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 bg-gray-50 p-3 rounded-md"
                >
                  <select
                    value={entry.day}
                    onChange={(e) => updateEntry(idx, "day", e.target.value)}
                    className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 w-[38%]"
                  >
                    {weekdays.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="time"
                      value={entry.start}
                      onChange={(e) =>
                        updateEntry(idx, "start", e.target.value)
                      }
                      className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 w-[38%]"
                    />
                    <span className="text-gray-500">—</span>
                    <input
                      type="time"
                      value={entry.end}
                      onChange={(e) => updateEntry(idx, "end", e.target.value)}
                      className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 w-[38%]"
                    />
                    <button
                      onClick={() => removeEntry(idx)}
                      className="ml-auto text-red-500 hover:text-red-700 p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={editing ? onSave : onAdd}
              disabled={!newSection.clubId || !newSection.name}
              className="w-full inline-flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={20} />
              <span className="ml-2">{editing ? "Сохранить" : "Добавить"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;
