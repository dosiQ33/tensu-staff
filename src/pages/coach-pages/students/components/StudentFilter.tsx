import React from "react";
import { Search } from "lucide-react";

interface Filters {
  search: string;
  coaches: string[];
  groups: string[];
  types: string[];
  status: string;
}

interface StudentFilterProps {
  filters: Filters;
  allCoaches: string[];
  allGroups: string[];
  allTypes: string[];
  onChange: (f: Partial<Filters>) => void;
}

const StudentFilter: React.FC<StudentFilterProps> = ({
  filters,
  allCoaches,
  allGroups,
  allTypes,
  onChange,
}) => {
  const statusOptions = [
    { value: "all", label: "Все" },
    { value: "active", label: "Активные" },
    { value: "frozen", label: "Замороженные" },
    { value: "inactive", label: "Неактивные" },
  ];

  return (
    <>
      {/* Поиск */}
      <div className="relative mb-3">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Найти студентов..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Статус */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Статус
        </label>
        <div className="flex flex-wrap gap-1">
          {statusOptions.map((option) => {
            const selected = filters.status === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onChange({ status: option.value })}
                className={`px-2 py-1 text-xs rounded-full ${
                  selected
                    ? "bg-blue-100 text-blue-800"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Тренеры */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Тренеры
          </label>
          <div className="flex flex-wrap gap-1">
            {allCoaches.length === 0 ? (
              <span className="text-xs text-gray-400">Нет тренеров</span>
            ) : (
              allCoaches.map((coach) => {
                const selected = filters.coaches.includes(coach);
                const label = coach.length > 8 ? `${coach.slice(0, 8)}…` : coach;
                return (
                  <button
                    key={coach}
                    onClick={() => {
                      const next = selected
                        ? filters.coaches.filter((c) => c !== coach)
                        : [...filters.coaches, coach];
                      onChange({ coaches: next });
                    }}
                    className={`px-2 py-1 text-xs rounded-full ${
                      selected
                        ? "bg-blue-100 text-blue-800"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Группы */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Группы
          </label>
          <div className="flex flex-wrap gap-1">
            {allGroups.length === 0 ? (
              <span className="text-xs text-gray-400">Нет групп</span>
            ) : (
              allGroups.map((group) => {
                const selected = filters.groups.includes(group);
                const label = group.length > 8 ? `${group.slice(0, 8)}…` : group;
                return (
                  <button
                    key={group}
                    onClick={() => {
                      const next = selected
                        ? filters.groups.filter((g) => g !== group)
                        : [...filters.groups, group];
                      onChange({ groups: next });
                    }}
                    className={`px-2 py-1 text-xs rounded-full ${
                      selected
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Типы тренировок */}
      {allTypes.length > 0 && (
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Тип тренировки
          </label>
          <div className="flex flex-wrap gap-1">
            {allTypes.map((type) => {
              const selected = filters.types.includes(type);
              const label = type.length > 10 ? `${type.slice(0, 10)}…` : type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    const next = selected
                      ? filters.types.filter((t) => t !== type)
                      : [...filters.types, type];
                    onChange({ types: next });
                  }}
                  className={`px-2 py-1 text-xs rounded-full ${
                    selected
                      ? "bg-purple-100 text-purple-800"
                      : "bg-white text-gray-600 border border-gray-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentFilter;
