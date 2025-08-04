import type { Training } from "@/types/types";
import { Clock, MapPin, Users, X } from "lucide-react";

export const DayDetailsModal: React.FC<{
  day: string;
  onClose: () => void;
  trainings: Training[];
}> = ({ day, onClose, trainings }) => {

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Тренировки{" "}
              {new Date(day).toLocaleDateString("ru-RU", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          {trainings.map((t) => (
            <div key={t.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {t.time} - {t.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-600">{t.club}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {t.coach} • {t.section}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-gray-900">
                    {t.attendedCount}/{t.totalCount}
                  </div>
                  <div className="text-xs text-gray-500">участников</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all"
                  style={{
                    width: `${(t.attendedCount / t.totalCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
