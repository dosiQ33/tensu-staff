import React, { useMemo, useState } from "react";
import type { Lesson } from "@/functions/axios/responses";
import { scheduleApi } from "@/functions/axios/axiosFunctions";
import type { UpdateLessonRequest } from "@/functions/axios/requests";
import { X } from "lucide-react";

export const EditLessonModal: React.FC<{
  lesson: Lesson;
  token: string;
  onClose: () => void;
  onSaved?: () => void;
}> = ({ lesson, token, onClose, onSaved }) => {
  const [plannedDate, setPlannedDate] = useState(lesson.planned_date);
  const [plannedStartTime, setPlannedStartTime] = useState(
    lesson.planned_start_time.slice(0, 5)
  );
  const [duration, setDuration] = useState<number>(lesson.duration_minutes);
  const [location, setLocation] = useState<string>(lesson.location || "");
  const [notes, setNotes] = useState<string>(lesson.notes || "");
  const [status, setStatus] = useState<UpdateLessonRequest["status"]>(
    lesson.status
  );
  const [coachId, setCoachId] = useState<number>(lesson.coach_id);
  const [saving, setSaving] = useState(false);

  const payload: UpdateLessonRequest = useMemo(
    () => ({
      planned_date: plannedDate,
      planned_start_time: plannedStartTime,
      actual_date: lesson.actual_date || plannedDate,
      actual_start_time:
        lesson.actual_start_time?.slice(0, 5) || plannedStartTime,
      duration_minutes: duration,
      status,
      coach_id: coachId,
      location,
      notes,
    }),
    [plannedDate, plannedStartTime, lesson.actual_date, lesson.actual_start_time, duration, status, coachId, location, notes]
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      await scheduleApi.updateLesson(lesson.id, payload, token);
      onSaved?.();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Редактировать тренировку</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg p-2"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
              <input
                type="time"
                className="w-full border border-gray-200 rounded-lg p-2"
                value={plannedStartTime}
                onChange={(e) => setPlannedStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Длительность (мин)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg p-2"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={5}
                step={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select
                className="w-full border border-gray-200 rounded-lg p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as UpdateLessonRequest["status"])}
              >
                <option value="scheduled">Запланировано</option>
                <option value="cancelled">Отменено</option>
                <option value="completed">Проведено</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тренер ID</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg p-2"
                value={coachId}
                onChange={(e) => setCoachId(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg p-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};


