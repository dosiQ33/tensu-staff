import type { StatRow, Training } from "@/types/types";
import {
  AlertTriangle,
  Filter,
  Snowflake,
  UserPlus,
  Users,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";

// Constants
const statsOptions = [
  { id: "attendance", label: "Посещаемость", icon: Users },
  { id: "frozen", label: "Заморозки", icon: Snowflake },
  { id: "newWeek", label: "Новые за неделю", icon: UserPlus },
  { id: "expiring", label: "Скоро истекают", icon: AlertTriangle },
];

const clubs = ["Bars Checkmat", "Titan Fit", "Tigers"];
const sections = ["BJJ", "Karate", "Boxing", "Fitness", "Wrestling", "MMA", "Yoga", "CrossFit"];
const timeSlots = [
  { id: "morning", label: "Утро (06:00-12:00)", start: "06:00", end: "12:00" },
  { id: "afternoon", label: "День (12:00-18:00)", start: "12:00", end: "18:00" },
  { id: "evening", label: "Вечер (18:00-24:00)", start: "18:00", end: "24:00" },
];

export const StatsSection: React.FC<{ trainings: Training[] }> = ({trainings}) => {
  const [showStatsFilters, setShowStatsFilters] = useState(false);
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [selectedStat, setSelectedStat] = useState<string>("attendance");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSectionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    return statRows.filter((r) => {
      const clubMatch = clubFilter === "all" || r.club === clubFilter;
      const sectionMatch = sectionFilter === "all" || r.section === sectionFilter;
      
      let timeMatch = true;
      if (timeFilter !== "all" && r.slot) {
        const timeSlot = timeSlots.find(slot => slot.id === timeFilter);
        if (timeSlot) {
          const [slotStart] = r.slot.split('-');
          const slotHour = parseInt(slotStart.split(':')[0]);
          const startHour = parseInt(timeSlot.start.split(':')[0]);
          const endHour = parseInt(timeSlot.end.split(':')[0]);
          timeMatch = slotHour >= startHour && slotHour < endHour;
        }
      }
      
      return clubMatch && sectionMatch && timeMatch;
    });
  }, [statRows, clubFilter, sectionFilter, timeFilter]);

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
          <div className="space-y-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-4">
            {/* Club Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Клубы
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setClubFilter("all")}
                  className={`px-3 py-2 text-sm rounded-xl font-medium transition-all ${
                    clubFilter === "all"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Все клубы
                </button>
                {clubs.map((club) => (
                  <button
                    key={club}
                    onClick={() => setClubFilter(club)}
                    className={`px-3 py-2 text-sm rounded-xl font-medium transition-all ${
                      clubFilter === club
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {club}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Filter - Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Секции
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>
                    {sectionFilter === "all" ? "Все секции" : sectionFilter}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${showSectionDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {showSectionDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSectionFilter("all");
                        setShowSectionDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                        sectionFilter === "all" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                      }`}
                    >
                      Все секции
                    </button>
                    {sections.map((section) => (
                      <button
                        key={section}
                        onClick={() => {
                          setSectionFilter(section);
                          setShowSectionDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                          sectionFilter === section ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                <Clock size={16} />
                Время
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimeFilter("all")}
                  className={`px-3 py-2 text-sm rounded-xl font-medium transition-all ${
                    timeFilter === "all"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Весь день
                </button>
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setTimeFilter(slot.id)}
                    className={`px-3 py-2 text-sm rounded-xl font-medium transition-all ${
                      timeFilter === slot.id
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Mobile Friendly */}
        <div className="space-y-3">
          {filteredStatRows.length > 0 ? (
            filteredStatRows.map((r, idx) => (
              <div key={idx} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {r.club}
                      </span>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        {r.section}
                      </span>
                    </div>
                    {selectedStat === "attendance" && r.slot && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock size={12} />
                        <span>{r.slot}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {r.count}
                      {selectedStat === "attendance" ? "%" : ""}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedStat === "attendance"
                        ? "посещаемость"
                        : statsOptions.find((o) => o.id === selectedStat)?.label.toLowerCase()}
                    </div>
                  </div>
                </div>
                {selectedStat === "attendance" && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(r.count, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Нет данных для выбранных фильтров</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
