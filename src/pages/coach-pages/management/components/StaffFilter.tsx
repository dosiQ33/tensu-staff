import React from "react";
import { Search } from "lucide-react";
import type { Filters } from "@/types/types";
import { getRoleLabel } from "@/utils";
import type {
  CreateClubResponse,
  CreateSectionResponse,
} from "@/functions/axios/responses";

interface StaffFilterProps {
  filters: Filters;
  allClubs: CreateClubResponse[];
  allSections: CreateSectionResponse[];
  onChange: (f: Partial<Filters>) => void;
}

const StaffFilter: React.FC<StaffFilterProps> = ({
  filters,
  allClubs,
  allSections,
  onChange,
}) => {
  const roles = ["owner", "coach", "admin"] as const;

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
          placeholder="Найти сотрудников..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Роли */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Роли
        </label>
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => {
            const selected = filters.roles.includes(role);
            return (
              <button
                key={role}
                onClick={() => {
                  const nextRoles = selected
                    ? filters.roles.filter((r) => r !== role)
                    : [...filters.roles, role];
                  onChange({ roles: nextRoles });
                }}
                className={`px-2 py-1 text-xs rounded-full ${
                  selected
                    ? "bg-blue-100 text-blue-800"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                {getRoleLabel(role)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Клубы */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Клубы
          </label>
          <div className="flex flex-wrap gap-1">
            {allClubs.map((club) => {
              const selected = filters.clubs.includes(club.name);
              // Укорачиваем длинные названия
              const label = club.name &&
                club.name.length > 8 ? `${club.name.slice(0, 8)}…` : club.name;
              return (
                <button
                  key={club.id}
                  onClick={() => {
                    const next = selected
                      ? filters.clubs.filter((c) => c !== club.name)
                      : [...filters.clubs, club.name];
                    onChange({ clubs: next });
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
            })}
          </div>
        </div>

        {/* Секции */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Секции
          </label>
          <div className="flex flex-wrap gap-1">
            {allSections.map((section) => {
              const selected = filters.sections.includes(section.name);
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    const next = selected
                      ? filters.sections.filter((s) => s !== section.name)
                      : [...filters.sections, section.name];
                    onChange({ sections: next });
                  }}
                  className={`px-2 py-1 text-xs rounded-full ${
                    selected
                      ? "bg-purple-100 text-purple-800"
                      : "bg-white text-gray-600 border border-gray-300"
                  }`}
                >
                  {section.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffFilter;
