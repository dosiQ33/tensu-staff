// AddSectionModal.tsx
import React, { useState } from "react";
import { X, Plus, ChevronDown, CheckCircle } from "lucide-react";
import type { NewSection, ScheduleEntry, Staff } from "@/types/types";
import type { CreateClubResponse } from "@/functions/axios/responses";
import { sectionsApi, groupsApi } from "@/functions/axios/axiosFunctions";
import { toast } from "react-toastify";

interface AddSectionModalProps {
  show: boolean;
  editing: boolean;
  allClubs: CreateClubResponse[];
  allStaff: Staff[];
  userFullName: string;
  userId: number;
  newSection: NewSection & {
    groups?: {
      id?: number;
      name?: string;
      level?: string;
      capacity?: number;
      price?: number;
      active?: boolean;
      description?: string;
      coach_id?: number;
      tags?: string[];
      schedule?: ScheduleEntry[];
    }[];
  };
  onChange: (
    field: keyof NewSection | "schedule" | "groups",
    value: unknown
  ) => void;
  onSave: () => void;
  onClose: () => void;
}

const token = localStorage.getItem("telegramToken") || "";

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
  userFullName,
  userId,
  newSection,
  onChange,
  onSave,
  onClose,
}) => {
  const [sectionCreated, setSectionCreated] = useState(false);
  if (!show) return null;

  const groups = newSection.groups || [];

  const addGroup = () => {
    const newGroup = {
      id: Date.now(),
      name: "",
      level: "",
      capacity: null,
      price: null,
      active: true,
      description: "",
      coach_id: newSection.coach_id,
      tags: [] as string[],
      schedule: [] as ScheduleEntry[],
    };
    onChange("groups", [...groups, newGroup]);
  };

  const updateGroup = (
    idx: number,
    field: keyof (typeof groups)[0],
    value: unknown
  ) => {
    const updated = groups.map((g, i) =>
      i === idx ? { ...g, [field]: value } : g
    );
    onChange("groups", updated);
  };

  const removeGroup = (idx: number) => {
    const updated = groups.filter((_, i) => i !== idx);
    onChange("groups", updated);
  };

  const addGroupEntry = (gIdx: number) => {
    const sched = groups[gIdx].schedule || [];
    const entry: ScheduleEntry = { day: weekdays[0], start: "", end: "" };
    const updatedSched = [...sched, entry];
    updateGroup(gIdx, "schedule", updatedSched);
  };

  const updateGroupEntry = (
    gIdx: number,
    eIdx: number,
    field: keyof ScheduleEntry,
    value: unknown
  ) => {
    const sched = groups[gIdx].schedule || [];
    const updatedSched = sched.map((e, i) =>
      i === eIdx ? { ...(e as ScheduleEntry), [field]: value } : e
    );
    updateGroup(gIdx, "schedule", updatedSched);
  };

  const removeGroupEntry = (gIdx: number, eIdx: number) => {
    const sched = groups[gIdx].schedule || [];
    const updatedSched = sched.filter((_, i) => i !== eIdx);
    updateGroup(gIdx, "schedule", updatedSched);
  };

  const buildScheduleObject = (entries: ScheduleEntry[]) =>
    entries.reduce<Record<string, { start: string; end: string }>>(
      (acc, { day, start, end }) => {
        acc[day] = { start, end };
        return acc;
      },
      {}
    );

  const handleCreate = async () => {
    try {
      const sectionPayload = {
        club_id: newSection.club_id,
        name: newSection.name,
        description: newSection.description ?? "",
        coach_id: newSection.coach_id,
        active: newSection.active ?? true,
      };
      const { data: createdSection } = await sectionsApi.create(
        sectionPayload,
        token
      );

      if (createdSection.id) {
        setSectionCreated(true);
      }

      const sectionId = createdSection.id;

      for (const grp of groups) {
        const groupPayload = {
          section_id: sectionId,
          name: grp.name,
          description: grp.description ?? "",
          schedule: buildScheduleObject(grp.schedule || []),
          price: grp.price,
          capacity: grp.capacity,
          level: grp.level,
          coach_id: grp.coach_id ?? newSection.coach_id ?? userId,
          tags: grp.tags ?? [],
          active: grp.active,
        };
        await groupsApi.create(groupPayload, token);
      }

      toast.success("Секция и группы успешно созданы");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Не удалось создать секцию и группы");
    }
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
          {/* Club & Section Name */}
          {sectionCreated ? (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                {newSection.name}
              </h3>
              <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                <CheckCircle className="w-4 h-4 mr-1" />
                Создан
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Клуб */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Клуб <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center border border-gray-300 bg-white w-full rounded-xl shadow-sm">
                  <select
                    value={newSection.club_id ?? (allClubs[0]?.id || "")}
                    onChange={(e) =>
                      onChange("club_id", Number(e.target.value))
                    }
                    className="appearance-none block py-2.5 px-4 w-full pr-10 text-gray-900 outline-none"
                  >
                    {allClubs.length > 1 && (
                      <option value="">Выберите клуб</option>
                    )}
                    {allClubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="mr-2" />
                </div>
              </div>
              {/* Название секции */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Название секции <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
                />
              </div>
            </div>
          )}

          {/* Price, Coach */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Тренер */}
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Тренер <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center border border-gray-300 bg-white w-full rounded-xl shadow-sm">
                <select
                  value={newSection.coach_id ?? userId}
                  onChange={(e) => onChange("coach_id", Number(e.target.value))}
                  className="block w-full py-2.5 px-4 appearance-none"
                >
                  <option value={Number(userId)}>
                    {userFullName} (выбрать себя)
                  </option>
                  {allStaff
                    .filter((s) => s.role === "coach")
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.surname}
                      </option>
                    ))}
                </select>
                <ChevronDown className="mr-2" />
              </div>
            </div>
          </div>

          {/* Группы */}
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-800">Группы</h3>
            </div>
            <div className="mt-3 space-y-6">
              {groups.map((group, gIdx) => (
                <div key={gIdx} className="bg-gray-50 p-4 rounded-md space-y-4">
                  {/* Поля группы */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Имя группы <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) =>
                          updateGroup(gIdx, "name", e.target.value)
                        }
                        className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Уровень
                      </label>
                      <input
                        type="text"
                        value={group.level}
                        onChange={(e) =>
                          updateGroup(gIdx, "level", e.target.value)
                        }
                        className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Вместимость
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={group.capacity}
                        onChange={(e) =>
                          /^\d*$/.test(e.target.value) &&
                          updateGroup(gIdx, "capacity", Number(e.target.value))
                        }
                        className="block w-full appearance-none border border-gray-300 rounded-xl py-2.5 px-4"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Цена (₸)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={group.price}
                        onChange={(e) =>
                          /^\d*$/.test(e.target.value) &&
                          updateGroup(gIdx, "price", Number(e.target.value))
                        }
                        className="block w-full appearance-none border border-gray-300 rounded-xl py-2.5 px-4"
                      />
                    </div>
                  </div>

                  {/* Расписание */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-800">
                        Расписание
                      </h4>
                      <button
                        onClick={() => addGroupEntry(gIdx)}
                        className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
                      >
                        <Plus size={16} />
                        <span className="ml-1">Добавить время</span>
                      </button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {(group.schedule || []).map(
                        (entry: ScheduleEntry, eIdx) => (
                          <div
                            key={eIdx}
                            className="flex flex-col gap-2 bg-white p-2 rounded-md border border-gray-200"
                          >
                            <select
                              value={entry.day}
                              onChange={(e) =>
                                updateGroupEntry(
                                  gIdx,
                                  eIdx,
                                  "day",
                                  e.target.value
                                )
                              }
                              className="p-2 border rounded-md border-gray-400"
                            >
                              {weekdays.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <div className="flex flex-row gap-2 items-center">
                              <input
                                type="time"
                                value={entry.start}
                                onChange={(e) =>
                                  updateGroupEntry(
                                    gIdx,
                                    eIdx,
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="p-2 border rounded-md border-gray-400"
                              />
                              <span className="text-gray-400">—</span>
                              <input
                                type="time"
                                value={entry.end}
                                onChange={(e) =>
                                  updateGroupEntry(
                                    gIdx,
                                    eIdx,
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="p-2 border rounded-md border-gray-400"
                              />
                            </div>

                            <button
                              onClick={() => removeGroupEntry(gIdx, eIdx)}
                              className="ml-auto text-red-500 hover:text-red-700 p-1 rounded-full"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Удалить группу */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeGroup(gIdx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Удалить группу
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addGroup}
              className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
            >
              <Plus size={16} />
              <span className="ml-1">Добавить группу</span>
            </button>
          </div>

          {/* Действие: создать или сохранить */}
          <div className="pt-4">
            <button
              onClick={editing ? onSave : handleCreate}
              className="w-full inline-flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            >
              <span className="ml-2">{editing ? "Сохранить" : "Добавить"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;
