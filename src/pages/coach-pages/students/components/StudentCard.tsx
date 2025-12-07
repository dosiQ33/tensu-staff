import React, { useState } from "react";
import { Phone, MessageCircle, Calendar } from "lucide-react";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    surname: string;
    telegramUsername?: string;
    phone?: string;
    coaches: string[];
    groups: string[];
    type: string;
    status: "active" | "frozen" | "inactive";
    membershipUntil: string;
  };
  onStudentClick?: (student: StudentCardProps["student"]) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onStudentClick }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "frozen":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активен";
      case "frozen":
        return "Заморожен";
      case "inactive":
        return "Неактивен";
      default:
        return status;
    }
  };

  const isExpiringSoon = (date: string) => {
    const membershipDate = new Date(date);
    const today = new Date();
    const diffTime = membershipDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onStudentClick?.(student)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">
            {student.name} {student.surname}
          </span>
          {student.telegramUsername && (
            <span className="text-xs text-gray-500">
              {student.telegramUsername}
            </span>
          )}
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            student.status
          )}`}
        >
          {getStatusLabel(student.status)}
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-2">
            {student.type}
          </div>
          {student.groups.length > 0 && (
            <div className="text-sm text-gray-600 mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Группы ({student.groups.length}) {expanded ? "▼" : "▶"}
              </button>
              {expanded && (
                <div className="mt-1 text-xs">{student.groups.join(", ")}</div>
              )}
            </div>
          )}
          {student.coaches.length > 0 && (
            <div className="text-xs text-gray-500">
              Тренеры: {student.coaches.join(", ")}
            </div>
          )}
          <div className={`flex items-center gap-1 text-xs mt-1 ${
            isExpiringSoon(student.membershipUntil)
              ? "text-red-600 font-medium"
              : "text-gray-500"
          }`}>
            <Calendar size={12} />
            <span>До {formatDate(student.membershipUntil)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {student.phone && (
              <a
                href={`tel:+${student.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600 flex items-center gap-1 text-[17px]"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone size={17} />
              </a>
            )}

            {student.telegramUsername && (
              <a
                href={`https://t.me/${student.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600 flex items-center gap-1 text-[17px]"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
