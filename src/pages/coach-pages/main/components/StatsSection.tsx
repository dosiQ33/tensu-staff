import type { StatRow, Training } from "@/types/types";
import {
  AlertTriangle,
  Filter,
  Snowflake,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { Select, Input } from "@/components/ui";

// Constants
const statsOptions = [
  { id: "attendance", label: "Посещаемость", icon: Users },
  { id: "frozen", label: "Заморозки", icon: Snowflake },
  { id: "newWeek", label: "Новые за неделю", icon: UserPlus },
  { id: "expiring", label: "Скоро истекают", icon: AlertTriangle },
];

const fallbackClubs = ["Bars Checkmat", "Titan Fit", "Tigers"];
const fallbackSections = ["BJJ", "Karate", "Boxing", "Fitness"];

export const StatsSection: React.FC<{ trainings: Training[] }> = ({trainings}) => {
  const [showStatsFilters, setShowStatsFilters] = useState(false);
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [selectedStat, setSelectedStat] = useState<string>("attendance");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  type Period = "today" | "week" | "month" | "custom";
  const [timeFilter, setTimeFilter] = useState<Period>("today");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Unique options derived from data (fallbacks if empty)
  const clubOptions = useMemo(() => {
    const unique = Array.from(new Set((trainings || []).map(t => t.club))).filter(Boolean);
    const list = unique.length ? unique : fallbackClubs;
    return [{ value: "all", label: "Все клубы" }, ...list.map(c => ({ value: c, label: c }))];
  }, [trainings]);

  const sectionOptions = useMemo(() => {
    const unique = Array.from(new Set((trainings || []).map(t => t.section))).filter(Boolean);
    const list = unique.length ? unique : fallbackSections;
    return [{ value: "all", label: "Все секции" }, ...list.map(s => ({ value: s, label: s }))];
  }, [trainings]);

  const periodOptions = [
    { value: "today", label: "Сегодня" },
    { value: "week", label: "Эта неделя" },
    { value: "month", label: "Этот месяц" },
    { value: "custom", label: "Период…" },
  ];

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    // Make Monday first day of the week
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return d;
  };

  const isWithinSelectedPeriod = useCallback((dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    if (timeFilter === "today") {
      return dateStr === todayKey;
    }
    if (timeFilter === "week") {
      const start = getStartOfWeek(today);
      start.setHours(0,0,0,0);
      const end = new Date();
      end.setHours(23,59,59,999);
      return d >= start && d <= end;
    }
    if (timeFilter === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      return d >= start && d <= end;
    }
    // custom
    if (customFrom && customTo) {
      const start = new Date(customFrom + 'T00:00:00');
      const end = new Date(customTo + 'T23:59:59');
      return d >= start && d <= end;
    }
    return true;
  }, [timeFilter, customFrom, customTo, todayKey]);

  const attendanceRows = useMemo<StatRow[]>(
    () =>
      trainings
        .filter(t => isWithinSelectedPeriod(t.date))
        .map(t => ({
          club: t.club,
          section: t.section,
          slot: `${t.time}-${t.endTime}`,
          count: Math.round((t.attendedCount / t.totalCount) * 100),
        })),
    [trainings, isWithinSelectedPeriod]
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Клуб"
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                options={clubOptions}
              />
              <Select
                label="Секция"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                options={sectionOptions}
              />
              <Select
                label="Период"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as Period)}
                options={periodOptions}
              />
            </div>

            {timeFilter === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="С"
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
                <Input
                  label="По"
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                />
              </div>
            )}
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
