/* eslint-disable @typescript-eslint/no-explicit-any */
// AddSectionModal.tsx
import React, { useEffect, useState } from "react";
import { X, Plus, ChevronDown, CheckCircle, Users } from "lucide-react";
import type { NewSection, Staff } from "@/types/types";
import type {
  CreateClubResponse,
  CreateSectionResponse,
} from "@/functions/axios/responses";
import { sectionsApi, groupsApi } from "@/functions/axios/axiosFunctions";
import { toast } from "react-toastify";
import DeleteSectionAlert from "./DeleteSectionAlert";

interface AddSectionModalProps {
  show: boolean;
  editing: boolean;
  allClubs: CreateClubResponse[];
  allStaff: Staff[];
  userFullName: string;
  userId: number;
  activeSection?: CreateSectionResponse;
  newSection: NewSection & { valid_from?: string; valid_until?: string };
  refresh: () => void;
  onChange: (field: keyof NewSection, value: unknown) => void;
  onClose: () => void;
}

type ScheduleRow = { day: string; start: string; end: string };

interface GroupForm {
  id?: number;
  section_id: number;
  name: string;
  level: string;
  capacity: number;
  price: number;
  description: string;
  active: boolean;
  coach_id: number;
  tags: string[];
  schedule: ScheduleRow[];
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

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  show,
  editing,
  allClubs,
  allStaff,
  userFullName,
  userId,
  activeSection,
  newSection,
  refresh,
  onChange,
  onClose,
}) => {
  const [sectionCreated, setSectionCreated] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [groups, setGroups] = useState<GroupForm[]>([]);
  const [createdSection, setCreatedSection] = useState<
    CreateSectionResponse | undefined
  >(undefined);

  const deleteSection = () => {
    setShowDeleteAlert(true);
  };

  // Load existing groups when modal opens or activeSection changes
  useEffect(() => {
    if (!show) return;
    (async () => {
      if (activeSection) {
        try {
          const res = await groupsApi.getBySectionId(activeSection.id, token);
          const forms: GroupForm[] = res.data.map((g: any) => ({
            id: g.id,
            section_id: g.section_id,
            name: g.name,
            level: g.level,
            capacity: g.capacity,
            price: g.price,
            description: g.description,
            active: g.active,
            coach_id: g.coach_id,
            tags: g.tags || [],
            schedule: Object.entries(g.schedule.weekly_pattern).flatMap(
              ([day, slots]) =>
                (slots as any[]).map((s) => ({
                  day,
                  start: s.time,
                  end: new Date(
                    Date.parse(`1970-01-01T${s.time}`) + s.duration * 60000
                  )
                    .toISOString()
                    .substr(11, 5),
                }))
            ),
          }));
          setGroups(forms);
        } catch (err) {
          console.error(err);
        }
      } else {
        setGroups([]);
      }
    })();
  }, [show, activeSection]);

  if (!show) return null;

  // Handlers for groups
  const addGroup = () => {
    setGroups((g) => [
      ...g,
      {
        section_id: activeSection?.id ?? newSection.club_id!,
        name: "",
        level: "",
        capacity: 0,
        price: 0,
        description: "",
        active: true,
        coach_id: newSection.coach_id!,
        tags: [],
        schedule: [],
      },
    ]);
  };

  const updateGroup = (idx: number, field: keyof GroupForm, value: any) => {
    setGroups((g) =>
      g.map((grp, i) => (i === idx ? { ...grp, [field]: value } : grp))
    );
  };

  const removeGroup = async (idx: number, groupId: number | undefined) => {
    if (editing && activeSection?.club_id) {
      await groupsApi.deleteById(groupId, token);
    }
    setGroups((g) => g.filter((_, i) => i !== idx));
  };

  // Handlers for schedule rows
  const addScheduleRow = (gIdx: number) => {
    setGroups((g) =>
      g.map((grp, i) =>
        i === gIdx
          ? {
              ...grp,
              schedule: [
                ...grp.schedule,
                { day: weekdays[0], start: "", end: "" },
              ],
            }
          : grp
      )
    );
  };

  const updateScheduleRow = (
    gIdx: number,
    rowIdx: number,
    field: keyof ScheduleRow,
    value: string
  ) => {
    setGroups((g) =>
      g.map((grp, i) =>
        i === gIdx
          ? {
              ...grp,
              schedule: grp.schedule.map((row, j) =>
                j === rowIdx ? { ...row, [field]: value } : row
              ),
            }
          : grp
      )
    );
  };

  const removeScheduleRow = (gIdx: number, rowIdx: number) => {
    setGroups((g) =>
      g.map((grp, i) =>
        i === gIdx
          ? { ...grp, schedule: grp.schedule.filter((_, j) => j !== rowIdx) }
          : grp
      )
    );
  };

  // Build final ScheduleEntry object
  const buildScheduleEntry = (rows: ScheduleRow[]) => {
    const pattern: Record<string, { time: string; duration: number }[]> = {};
    rows.forEach(({ day, start, end }) => {
      const duration =
        (Date.parse(`1970-01-01T${end}`) - Date.parse(`1970-01-01T${start}`)) /
        60000;
      if (!pattern[day]) pattern[day] = [];
      pattern[day].push({ time: start, duration });
    });
    return {
      weekly_pattern: pattern,
      valid_from: newSection.valid_from || "",
      valid_until: newSection.valid_until || "",
    };
  };

  const handleSave = async () => {
    try {
      const sectionId =
        activeSection?.id ?? createdSection?.id ?? newSection.id!;

      const secPayload = {
        club_id: newSection.club_id!,
        name: newSection.name,
        description: newSection.description || "",
        coach_id: newSection.coach_id!,
        active: newSection.active ?? true,
      };
      await sectionsApi.updateById(secPayload, sectionId, token);
      toast.success("Секция успешно обновлена");

      for (const grp of groups) {
        const payload = {
          section_id: sectionId,
          name: grp.name,
          description: grp.description,
          schedule: buildScheduleEntry(grp.schedule),
          price: grp.price,
          capacity: grp.capacity,
          level: grp.level,
          coach_id: grp.coach_id,
          tags: grp.tags,
          active: grp.active,
        };
        if (grp.id) {
          await groupsApi.updateById(payload, grp.id, token);
          toast.success("Группы успешно обновлены");
        } else {
          if (grp.name) {
            await groupsApi.create(payload, token);
            toast.success("Группы успешно добавлены");
          }
        }
      }
      refresh();
    } catch {
      toast.error("Невозможно создать секцию");
    }
  };

  // Create section + groups
  const handleCreate = async () => {
    if (createdSection?.id) {
      refresh();
      return;
    }
    try {
      const secPayload = {
        club_id: newSection.club_id!,
        name: newSection.name,
        description: newSection.description || "",
        coach_id: newSection.coach_id!,
        active: newSection.active ?? true,
      };
      const { data: created } = await sectionsApi.create(secPayload, token);
      setCreatedSection(created);
      setSectionCreated(true);
      toast.success("Секция успешно создана");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Секция с таким названием уже создана");
      }
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
                Секция создана
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Клуб */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Клуб {!editing && <span className="text-red-500">*</span>}
                </label>
                <div className="space-y-1">
                  {editing ? (
                    <div className="block w-full py-2.5 px-4 border border-gray-300 rounded-xl bg-gray-100 text-gray-900">
                      {allClubs.find(
                        (c) =>
                          c.id ===
                          (activeSection?.club_id ?? newSection.club_id)
                      )?.name || "—"}
                    </div>
                  ) : (
                    <div className="relative flex items-center border border-gray-300 bg-white w-full rounded-xl shadow-sm">
                      <select
                        value={
                          activeSection?.club_id ??
                          newSection.club_id ??
                          (allClubs[0]?.id || "")
                        }
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
                  )}
                </div>
              </div>
              {/* Название секции */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Название секции{" "}
                  {!editing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="block w-full border border-gray-300 rounded-xl py-2.5 px-4"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Тренер */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Тренер {!editing && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative flex items-center border border-gray-300 bg-white w-full rounded-xl shadow-sm">
                    <select
                      value={newSection.coach_id ?? userId}
                      onChange={(e) =>
                        onChange("coach_id", Number(e.target.value))
                      }
                      className="block w-full py-2.5 px-4 appearance-none"
                    >
                      <option value={userId}>
                        {userFullName} (выбрать себя)
                      </option>
                      {allStaff
                        .filter((s) => s.role === "coach")
                        .map(
                          (s) =>
                            s.status !== "pending" && (
                              <option key={s.id} value={s.id}>
                                {s.name} {s.surname}
                              </option>
                            )
                        )}
                    </select>
                    <ChevronDown className="mr-2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Группы */}
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Группы</h3>
              {activeSection?.groups && activeSection?.groups?.length > 0 && (
                <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Уже создано: {activeSection?.groups?.length}
                  </span>
                </div>
              )}
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
                        onClick={() => addScheduleRow(gIdx)}
                        className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
                      >
                        <Plus size={16} />
                        <span className="ml-1">Добавить время</span>
                      </button>
                    </div>

                    <div className="mt-2 space-y-3">
                      {group.schedule.map((row, rowIdx) => (
                        <div
                          key={rowIdx}
                          className="flex flex-col gap-2 bg-white p-2 rounded-md border border-gray-200"
                        >
                          {/* День недели */}
                          <select
                            value={row.day}
                            onChange={(e) =>
                              updateScheduleRow(
                                gIdx,
                                rowIdx,
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

                          {/* Время начала и конца */}
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={row.start}
                              onChange={(e) =>
                                updateScheduleRow(
                                  gIdx,
                                  rowIdx,
                                  "start",
                                  e.target.value
                                )
                              }
                              className="p-2 border rounded-md border-gray-400"
                            />
                            <span className="text-gray-400">—</span>
                            <input
                              type="time"
                              value={row.end}
                              onChange={(e) =>
                                updateScheduleRow(
                                  gIdx,
                                  rowIdx,
                                  "end",
                                  e.target.value
                                )
                              }
                              className="p-2 border rounded-md border-gray-400"
                            />
                          </div>

                          {/* Удалить строку */}
                          <button
                            onClick={() => removeScheduleRow(gIdx, rowIdx)}
                            className="self-end text-red-500 hover:text-red-700 p-1 rounded-full"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Удалить группу */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeGroup(gIdx, group?.id)}
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
              disabled={
                !newSection.club_id || !newSection.name || !newSection.coach_id
              }
              onClick={editing || sectionCreated ? handleSave : handleCreate}
              className="w-full inline-flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            >
              <span className="ml-2">
                {editing || sectionCreated ? "Сохранить" : "Добавить"}
              </span>
            </button>

            {activeSection?.id && (
              <button
                onClick={deleteSection}
                className="mt-5 w-full inline-flex justify-center items-center py-3 px-4 text-red-700 font-medium focus:outline-none"
              >
                Удалить секцию
              </button>
            )}
          </div>
        </div>
      </div>
      {activeSection?.id && (
        <DeleteSectionAlert
          show={showDeleteAlert}
          onClose={() => setShowDeleteAlert(false)}
          refresh={refresh}
          sectionId={activeSection?.id}
        />
      )}
    </div>
  );
};

export default AddSectionModal;
