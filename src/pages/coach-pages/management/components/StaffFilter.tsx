import React from 'react';
import { Search } from 'lucide-react';
import type { Filters } from '@/types/types';
import { getRoleLabel } from '@/utils';

interface StaffFilterProps {
  filters: Filters;
  allRoles: string[];
  allGroups: string[];
  allSports: string[];
  onChange: (f: Partial<Filters>) => void;
}

const StaffFilter: React.FC<StaffFilterProps> = ({ filters, allRoles, allGroups, allSports, onChange }) => (
  <>
    <div className="relative mb-3">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        placeholder="Найти сотрудников..."
        value={filters.search}
        onChange={e => onChange({ search: e.target.value })}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    {/* Roles */}
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">Роли</label>
      <div className="flex flex-wrap gap-1">
        {allRoles.map(role => (
          <button
            key={role}
            onClick={() => {
              const next = filters.roles.includes(role)
                ? filters.roles.filter((r: string) => r !== role)
                : [...filters.roles, role];
              onChange({ roles: next });
            }}
            className={`px-2 py-1 text-xs rounded-full ${
              filters.roles.includes(role)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            {getRoleLabel(role as never)}
          </button>
        ))}
      </div>
    </div>
    {/* Groups & Sports */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Группы</label>
        <div className="flex flex-wrap gap-1">
          {allGroups.map(group => (
            <button
              key={group}
              onClick={() => {
                const next = filters.groups.includes(group)
                  ? filters.groups.filter((g: string) => g !== group)
                  : [...filters.groups, group];
                onChange({ groups: next });
              }}
              className={`px-2 py-1 text-xs rounded-full ${
                filters.groups.includes(group)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              {group.length > 8 ? `${group.slice(0, 8)}…` : group}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Секции</label>
        <div className="flex flex-wrap gap-1">
          {allSports.map(sport => (
            <button
              key={sport}
              onClick={() => {
                const next = filters.sports.includes(sport)
                  ? filters.sports.filter((s: string) => s !== sport)
                  : [...filters.sports, sport];
                onChange({ sports: next });
              }}
              className={`px-2 py-1 text-xs rounded-full ${
                filters.sports.includes(sport)
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default StaffFilter;