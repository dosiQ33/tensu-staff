import type { StatRow, Training } from "@/types/types";
import {
  AlertTriangle,
  Filter,
  Snowflake,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

// Constants
const statsOptions = [
  { id: "attendance", label: "Посещаемость", icon: Users },
  { id: "frozen", label: "Заморозки", icon: Snowflake },
  { id: "newWeek", label: "Новые за неделю", icon: UserPlus },
  { id: "expiring", label: "Скоро истекают", icon: AlertTriangle },
];

const clubs = ["Bars Checkmat", "Titan Fit", "Tigers"];
const sections = ["BJJ", "Karate", "Boxing", "Fitness"];

export const StatsSection: React.FC<{ trainings: Training[] }> = ({trainings}) => {
  const [showStatsFilters, setShowStatsFilters] = useState(false);
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [selectedStat, setSelectedStat] = useState<string>("attendance");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  const attendanceRows = useMemo<StatRow[]>(
    () =>
      trainings
        .filter(t => t.date === todayKey)
        .map(t => ({
          club: t.club,
          section: t.section,
          slot: `${t.time}-${t.endTime}`,
          count: Math.round((t.attendedCount / t.totalCount) * 100),
        })),
    [trainings, todayKey]
  );

  // Generate rows for each stat
  const statRows = useMemo<StatRow[]>(() => {
    if (selectedStat === "attendance") return attendanceRows;
    // Example counts for other stats
    const exampleCount =
      selectedStat === "frozen" ? 3 : selectedStat === "newWeek" ? 2 : 5;
    return attendanceRows.map((r) => ({
      club: r.club,
      section: r.section,
      count: exampleCount,
    }));
  }, [attendanceRows, selectedStat]);

  const filteredStatRows = useMemo(() => {
    return statRows.filter(
      (r) =>
        (clubFilter === "all" || r.club === clubFilter) &&
        (sectionFilter === "all" || r.section === sectionFilter)
    );
  }, [statRows, clubFilter, sectionFilter]);

  return (
    <section className="bg-white rounded-lg border border-gray-200 mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">Статистика</h2>
          <button
            onClick={() => setShowStatsFilters(!showStatsFilters)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Stat Type Selector */}
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {statsOptions.map((stat) => (
            <button
              key={stat.id}
              onClick={() => setSelectedStat(stat.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedStat === stat.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {stat.label}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showStatsFilters && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Клубы
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setClubFilter("all")}
                  className={`px-2 py-1 text-xs rounded-full ${
                    clubFilter === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-white text-gray-600 border border-gray-300"
                  }`}
                >
                  Все клубы
                </button>
                {clubs.map((club) => (
                  <button
                    key={club}
                    onClick={() => setClubFilter(club)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      clubFilter === club
                        ? "bg-blue-100 text-blue-800"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    {club}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Секции
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSectionFilter("all")}
                  className={`px-2 py-1 text-xs rounded-full ${
                    sectionFilter === "all"
                      ? "bg-green-100 text-green-800"
                      : "bg-white text-gray-600 border border-gray-300"
                  }`}
                >
                  Все секции
                </button>
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setSectionFilter(section)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      sectionFilter === section
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-3">Клуб</th>
                <th className="py-2 px-3">Секция</th>
                {selectedStat === "attendance" && (
                  <th className="py-2 px-3">Время</th>
                )}
                <th className="py-2 pl-3">
                  {selectedStat === "attendance"
                    ? "Посещаемость (%)"
                    : statsOptions.find((o) => o.id === selectedStat)?.label}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStatRows.map((r, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-3">{r.club}</td>
                  <td className="py-2 px-3">{r.section}</td>
                  {selectedStat === "attendance" && (
                    <td className="py-2 px-3">{r.slot}</td>
                  )}
                  <td className="py-2 pl-3 font-medium">
                    {r.count}
                    {selectedStat === "attendance" ? "%" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
