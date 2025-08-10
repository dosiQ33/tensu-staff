import React, { useMemo, useState } from "react";
import type { Lesson } from "@/functions/axios/responses";
import { scheduleApi } from "@/functions/axios/axiosFunctions";
import type { UpdateLessonRequest } from "@/functions/axios/requests";
import { X } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

export const EditLessonModal: React.FC<{
  lesson: Lesson;
  token: string;
  onClose: () => void;
  onSaved?: () => void;
}> = ({ lesson, token, onClose, onSaved }) => {
  const { lang } = useI18n();
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await scheduleApi.deleteLesson(lesson.id, token);
      onSaved?.();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/30 z-50 flex items-end">
      <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Редактировать тренировку</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-3 space-y-3 overflow-y-auto">
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

          <div className="sticky bottom-0 bg-white pt-2 pb-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 active:scale-[0.99] disabled:bg-gray-300"
            >
              {lang === 'kk' ? 'Өзгерістерді сақтау' : 'Сохранить изменения'}
            </button>
          </div>

          {/* Danger zone */}
          <div className="mt-1">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-3 rounded-xl text-red-700 font-semibold active:scale-[0.99]"
              >
                {lang === 'kk' ? 'Жаттығуды жою' : 'Удалить тренировку'}
              </button>
            ) : (
              <div className="border bg-red-50 rounded-xl p-3 space-y-3">
                <p className="text-sm text-red-700">
                  {lang === 'kk'
                    ? 'Жаттығуды жою қайтарылмайды. Бұл әрекетті болдырмау мүмкін емес.'
                    : 'Удаление тренировки необратимо. Это действие нельзя отменить.'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    {lang === 'kk' ? 'Бас тарту' : 'Отмена'}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
                  >
                    {lang === 'kk' ? 'Толық жою' : 'Удалить'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


