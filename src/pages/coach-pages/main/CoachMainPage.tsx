import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Snowflake,
  UserPlus,
  AlertTriangle,
  Filter,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Home,
  User,
  Clock,
  MapPin,
} from "lucide-react";

// Base training record
type Training = {
  id: string;
  date: string;
  time: string;
  endTime: string;
  coach: string;
  section: string;
  club: string;
  attendedCount: number;
  totalCount: number;
  color: string;
};

// Row for non-attendance stats
interface StatRow {
  club: string;
  section: string;
  slot?: string;
  count: number;
}

const CoachMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Statistics state
  const [selectedStat, setSelectedStat] = useState<string>("attendance");

  // Filters for stats table
  const [showStatsFilters, setShowStatsFilters] = useState(false);
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  // Calendar state
  const [showCalendarFilters, setShowCalendarFilters] = useState(false);
  const [calendarFilters, setCalendarFilters] = useState({ coach: "all", club: "all", type: "all" });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [newTraining, setNewTraining] = useState<{ time: string; endTime: string; coach: string; section: string; club: string; days: string[] }>(
    { time: "", endTime: "", coach: "", section: "", club: "", days: [] }
  );

  // Sample data
  const trainings: Training[] = [
    { id: "b1", date: "2025-06-08", time: "09:00", endTime: "11:00", coach: "Иван Иванов", section: "BJJ", club: "Bars Checkmat", attendedCount: 12, totalCount: 15, color: "bg-blue-500" },
    { id: "b2", date: "2025-06-08", time: "20:00", endTime: "22:00", coach: "Иван Иванов", section: "BJJ", club: "Bars Checkmat", attendedCount: 8, totalCount: 10, color: "bg-blue-500" },
    { id: "t1", date: "2025-06-08", time: "18:00", endTime: "20:00", coach: "Мария Петрова", section: "Karate", club: "Titan Fit", attendedCount: 9, totalCount: 12, color: "bg-red-500" },
    { id: "tg1", date: "2025-06-08", time: "10:00", endTime: "11:30", coach: "Сергей Смирнов", section: "Boxing", club: "Tigers", attendedCount: 6, totalCount: 8, color: "bg-green-500" },
    { id: "tg2", date: "2025-06-08", time: "17:00", endTime: "18:30", coach: "Сергей Смирнов", section: "Fitness", club: "Tigers", attendedCount: 14, totalCount: 15, color: "bg-purple-500" },
  ];

  const todayKey = new Date().toISOString().split("T")[0];

  // Attendance rows
  const attendanceRows = useMemo<StatRow[]>(() =>
    trainings
      .filter(t => t.date === todayKey)
      .map(t => ({ club: t.club, section: t.section, slot: `${t.time}-${t.endTime}`, count: Math.round((t.attendedCount / t.totalCount) * 100) })),
    [trainings, todayKey]
  );

  // Generate rows for each stat
  const statRows = useMemo<StatRow[]>(() => {
    if (selectedStat === 'attendance') return attendanceRows;
    // Example counts for other stats
    const exampleCount = selectedStat === 'frozen' ? 3 : selectedStat === 'newWeek' ? 2 : 5;
    return attendanceRows.map(r => ({ club: r.club, section: r.section, count: exampleCount }));
  }, [attendanceRows, selectedStat]);

  // Stats options
  const statsOptions = [
    { id: 'attendance', label: 'Посещаемость', icon: Users },
    { id: 'frozen', label: 'Заморозки', icon: Snowflake },
    { id: 'newWeek', label: 'Новые за неделю', icon: UserPlus },
    { id: 'expiring', label: 'Скоро истекают', icon: AlertTriangle },
  ];

  // Filters data
  const coaches = ["Иван Иванов", "Мария Петрова", "Сергей Смирнов"];
  const clubs = ["Bars Checkmat", "Titan Fit", "Tigers"];
  const sections = ["BJJ", "Karate", "Boxing", "Fitness"];

  // Calendar trainings
  const filteredTrainings = useMemo(
    () => trainings.filter(t =>
      (calendarFilters.coach === 'all' || t.coach === calendarFilters.coach) &&
      (calendarFilters.club === 'all' || t.club === calendarFilters.club) &&
      (calendarFilters.type === 'all' || t.section === calendarFilters.type)
    ),
    [trainings, calendarFilters]
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= total; d++) days.push(new Date(year, month, d));
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const formatDate = (d: Date) => d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const navigateMonth = (dir: 'prev' | 'next') => setCurrentDate(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() + (dir === 'next' ? 1 : -1)); return nd; });

  const getTrainingsForDay = (day: Date | null) => day ? filteredTrainings.filter(t => t.date === day.toISOString().split('T')[0]) : [];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const toggleDay = (day: string) => setNewTraining(prev => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day] }));
  const handleAddTraining = () => { setShowAddTraining(false); setNewTraining({ time: '', endTime: '', coach: '', section: '', club: '', days: [] }); };

  // Filter stats rows
  const filteredStatRows = useMemo(() => {
    return statRows.filter(r => 
      (clubFilter === 'all' || r.club === clubFilter) && 
      (sectionFilter === 'all' || r.section === sectionFilter)
    );
  }, [statRows, clubFilter, sectionFilter]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="px-4 py-2">
        {/* Statistics Section */}
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
                      onClick={() => setClubFilter('all')}
                      className={`px-2 py-1 text-xs rounded-full ${
                        clubFilter === 'all'
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
                      onClick={() => setSectionFilter('all')}
                      className={`px-2 py-1 text-xs rounded-full ${
                        sectionFilter === 'all'
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
                    {selectedStat === 'attendance' && <th className="py-2 px-3">Время</th>}
                    <th className="py-2 pl-3">{selectedStat === 'attendance' ? 'Посещаемость (%)' : statsOptions.find(o => o.id === selectedStat)?.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatRows.map((r, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 pr-3">{r.club}</td>
                      <td className="py-2 px-3">{r.section}</td>
                      {selectedStat === 'attendance' && <td className="py-2 px-3">{r.slot}</td>}
                      <td className="py-2 pl-3 font-medium">{r.count}{selectedStat === 'attendance' ? '%' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="bg-white rounded-lg border border-gray-200 mb-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium text-gray-900">Расписание</h2>
              <button
                onClick={() => setShowCalendarFilters(!showCalendarFilters)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter size={20} />
              </button>
            </div>

            {/* Calendar Filters */}
            {showCalendarFilters && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тренеры
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setCalendarFilters(prev => ({ ...prev, coach: 'all' }))}
                      className={`px-2 py-1 text-xs rounded-full ${
                        calendarFilters.coach === 'all'
                          ? "bg-blue-100 text-blue-800"
                          : "bg-white text-gray-600 border border-gray-300"
                      }`}
                    >
                      Все тренеры
                    </button>
                    {coaches.map((coach) => (
                      <button
                        key={coach}
                        onClick={() => setCalendarFilters(prev => ({ ...prev, coach }))}
                        className={`px-2 py-1 text-xs rounded-full ${
                          calendarFilters.coach === coach
                            ? "bg-blue-100 text-blue-800"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        {coach}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Клубы
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setCalendarFilters(prev => ({ ...prev, club: 'all' }))}
                      className={`px-2 py-1 text-xs rounded-full ${
                        calendarFilters.club === 'all'
                          ? "bg-green-100 text-green-800"
                          : "bg-white text-gray-600 border border-gray-300"
                      }`}
                    >
                      Все клубы
                    </button>
                    {clubs.map((club) => (
                      <button
                        key={club}
                        onClick={() => setCalendarFilters(prev => ({ ...prev, club }))}
                        className={`px-2 py-1 text-xs rounded-full ${
                          calendarFilters.club === club
                            ? "bg-green-100 text-green-800"
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
                    Тип тренировки
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setCalendarFilters(prev => ({ ...prev, type: 'all' }))}
                      className={`px-2 py-1 text-xs rounded-full ${
                        calendarFilters.type === 'all'
                          ? "bg-purple-100 text-purple-800"
                          : "bg-white text-gray-600 border border-gray-300"
                      }`}
                    >
                      Все типы
                    </button>
                    {sections.map((type) => (
                      <button
                        key={type}
                        onClick={() => setCalendarFilters(prev => ({ ...prev, type }))}
                        className={`px-2 py-1 text-xs rounded-full ${
                          calendarFilters.type === type
                            ? "bg-purple-100 text-purple-800"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h3 className="text-base font-medium text-gray-900 capitalize">{formatDate(currentDate)}</h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-gray-100 text-gray-500 text-xs font-medium">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                  <div key={d} className="py-2 text-center">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    onClick={() => day && setSelectedDay(day.toISOString().split('T')[0])}
                    className={`min-h-[60px] p-1 border border-gray-200 cursor-pointer transition-colors ${
                      !day ? 'bg-gray-50' : day.toDateString() === new Date().toDateString() ? 'bg-blue-50' : 'bg-white'
                    } hover:bg-gray-100`}
                  >
                    {day && (
                      <>
                        <div className={`text-xs font-medium mb-1 ${
                          day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-800'
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-0.5">
                          {getTrainingsForDay(day).slice(0, 2).map(t => (
                            <div key={t.id} className={`text-[10px] text-white rounded px-1 py-0.5 truncate ${t.color}`}>
                              {t.time}
                            </div>
                          ))}
                          {getTrainingsForDay(day).length > 2 && (
                            <p className="text-[10px] text-gray-500">+{getTrainingsForDay(day).length - 2}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Day Details Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Тренировки {new Date(selectedDay).toLocaleDateString('ru-RU', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-3">
                {getTrainingsForDay(new Date(selectedDay)).map(t => (
                  <div key={t.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={14} className="text-gray-500" />
                          <span className="font-medium text-gray-900">{t.time} - {t.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{t.club}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{t.coach} • {t.section}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold text-gray-900">{t.attendedCount}/{t.totalCount}</div>
                        <div className="text-xs text-gray-500">участников</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all" 
                        style={{ width: `${(t.attendedCount / t.totalCount) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Training Modal */}
        {showAddTraining && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Добавить тренировку</h2>
                  <button
                    onClick={() => setShowAddTraining(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Время начала</label>
                    <input
                      type="time"
                      value={newTraining.time}
                      onChange={e => setNewTraining(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Время конца</label>
                    <input
                      type="time"
                      value={newTraining.endTime}
                      onChange={e => setNewTraining(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тренер</label>
                  <select
                    value={newTraining.coach}
                    onChange={e => setNewTraining(prev => ({ ...prev, coach: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выбрать тренера</option>
                    {coaches.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Секция</label>
                  <select
                    value={newTraining.section}
                    onChange={e => setNewTraining(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выбрать секцию</option>
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Клуб</label>
                  <select
                    value={newTraining.club}
                    onChange={e => setNewTraining(prev => ({ ...prev, club: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выбрать клуб</option>
                    {clubs.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дни недели</label>
                  <div className="grid grid-cols-3 gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                          newTraining.days.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddTraining}
                  disabled={!newTraining.time || !newTraining.endTime || !newTraining.coach || !newTraining.section || !newTraining.club || newTraining.days.length === 0}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddTraining(true)}
        className="fixed bottom-24 right-4 bg-blue-500 p-4 rounded-full shadow-lg text-white hover:bg-blue-600 transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate("/coach/main")}
            className="flex flex-col items-center p-2 text-blue-600"
          >
            <Home size={20} />
            <span className="text-xs mt-1">Главная</span>
          </button>
          <button
            onClick={() => navigate("/coach/students")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Users size={20} />
            <span className="text-xs mt-1">Мои студенты</span>
          </button>
          <button
            onClick={() => navigate("/coach/management")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Управление</span>
          </button>
          <button
            onClick={() => navigate("/coach/profile")}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <User size={20} />
            <span className="text-xs mt-1">Профиль</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CoachMainPage;