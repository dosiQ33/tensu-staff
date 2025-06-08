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

const CoachMainPage2: React.FC = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
  
    // Statistics state
    const [selectedStat, setSelectedStat] = useState<string>("attendance");
  
    // Filters for stats table
    const [clubFilter, setClubFilter] = useState<string>("all");
    const [sectionFilter, setSectionFilter] = useState<string>("all");
  
    // Calendar state
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
      { id: 'frozen',      label: 'Заморозки',      icon: Snowflake },
      { id: 'newWeek',     label: 'Новые за неделю', icon: UserPlus },
      { id: 'expiring',    label: 'Скоро истекают',   icon: AlertTriangle },
    ];
  
    // Filters data
    const coaches = ["Иван Иванов", "Мария Петрова", "Сергей Смирнов"];
    const clubs = ["Bars Checkmat", "Titan Fit", "Tigers"];
    const sections = ["BJJ", "Karate", "Boxing", "Fitness"];
  
    // Calendar trainings
    const filteredTrainings = useMemo(
      () => trainings.filter(t =>
        (calendarFilters.coach === 'all' || t.coach === calendarFilters.coach) &&
        (calendarFilters.club === 'all'   || t.club === calendarFilters.club) &&
        (calendarFilters.type === 'all'   || t.section === calendarFilters.type)
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
  
    const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const toggleDay = (day: string) => setNewTraining(prev => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day] }));
    const handleAddTraining = () => { setShowAddTraining(false); setNewTraining({ time: '', endTime: '', coach: '', section: '', club: '', days: [] }); };

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 bg-gray-50">
        {/* Посещаемость - табличка */}
        <section className="bg-white p-4 rounded-xl shadow mb-8">
          <div className="flex items-center gap-4 mb-4">
            <label className="font-medium">Показывать:</label>
            <select
              value={selectedStat}
              onChange={e => setSelectedStat(e.target.value)}
              className="border-gray-300 rounded-lg p-2"
            >
              {statsOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>

          {/* Table Filters */}
          <div className="flex gap-2 mb-4">
            <select value={clubFilter} onChange={e => setClubFilter(e.target.value)} className="border-gray-300 rounded-lg p-2">
              <option value="all">Все клубы</option>
              {clubs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} className="border-gray-300 rounded-lg p-2">
              <option value="all">Все секции</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Клуб</th><th>Секция</th>
                {selectedStat === 'attendance' ? <><th>Время</th><th>Посещаемость (%)</th></> : <th>{statsOptions.find(o => o.id === selectedStat)?.label}</th>}
              </tr>
            </thead>
            <tbody>
              {statRows
                .filter(r => (clubFilter === 'all' || r.club === clubFilter) && (sectionFilter === 'all' || r.section === sectionFilter))
                .map((r, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2">{r.club}</td>
                    <td>{r.section}</td>
                    {selectedStat === 'attendance'
                      ? <><td>{r.slot}</td><td>{r.count}</td></>
                      : <td>{r.count}</td>
                    }
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        {/* Существующие фильтры для календаря */}
        {/* Calendar Filters */}
        <section className="bg-white rounded-xl p-6 shadow mb-8">
          <div className="flex items-center mb-4 text-gray-700 gap-2"><Filter size={20}/><span>Фильтры</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select value={calendarFilters.coach} onChange={e => setCalendarFilters(prev => ({ ...prev, coach: e.target.value }))} className="border-gray-300 rounded-lg p-2">
              <option value="all">Все тренеры</option>
              {coaches.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={calendarFilters.club} onChange={e => setCalendarFilters(prev => ({ ...prev, club: e.target.value }))} className="border-gray-300 rounded-lg p-2">
              <option value="all">Все клубы</option>
              {clubs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={calendarFilters.type} onChange={e => setCalendarFilters(prev => ({ ...prev, type: e.target.value }))} className="border-gray-300 rounded-lg p-2">
              <option value="all">Все секции</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </section>

        {/* Calendar */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={()=>navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            ><ChevronLeft size={28} className="text-gray-600"/></button>
            <h2 className="text-xl font-semibold text-gray-900">{formatDate(currentDate)}</h2>
            <button
              onClick={()=>navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            ><ChevronRight size={28} className="text-gray-600"/></button>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-100 text-gray-500 text-xs font-medium">
              {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=><div key={d} className="py-2 text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day,idx)=>(
                <div
                  key={idx}
                  onClick={()=>day&&setSelectedDay(day.toISOString().split('T')[0])}
                  className={`aspect-square p-2 border border-gray-200 cursor-pointer transition-colors ${!day?'bg-gray-50':day.toDateString()===new Date().toDateString()?'bg-blue-50':'bg-white'} hover:bg-gray-100`}
                >
                  {day&&(
                    <>
                      <div className={`text-sm font-medium ${day.toDateString()===new Date().toDateString()?'text-blue-600':'text-gray-800'}`}>{day.getDate()}</div>
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {getTrainingsForDay(day).slice(0,2).map(t=>(
                          <div key={t.id} className={`text-xs font-medium text-white rounded-full px-2 py-0.5 ${t.color}`}>{t.time} {t.section}</div>
                        ))}
                        {getTrainingsForDay(day).length>2 && <p className="text-xs text-gray-500">+{getTrainingsForDay(day).length-2} еще</p>}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Day Details Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-30">
            <div className="bg-white w-11/12 max-w-md rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Тренировки {new Date(selectedDay).toLocaleDateString('ru-RU',{weekday:'long',month:'long',day:'numeric'})}</h3>
                <button onClick={()=>setSelectedDay(null)}><X size={20} className="text-gray-500 hover:text-gray-700"/></button>
              </div>
              <div className="p-4 space-y-4 max-h-80 overflow-auto">
                {getTrainingsForDay(new Date(selectedDay)).map(t=>(
                  <div key={t.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{t.time} - {t.endTime}</p>
                        <p className="text-sm text-gray-600">{t.section} • {t.club}</p>
                        <p className="text-sm text-gray-600">Тренер: {t.coach}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{t.attendedCount}/{t.totalCount}</p>
                        <p className="text-xs text-gray-500">присутствовали</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{width:`${(t.attendedCount/t.totalCount)*100}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Training Modal */}
        {showAddTraining && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-30">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Добавить тренировку</h3>
                  <button onClick={()=>setShowAddTraining(false)}><X size={20} className="text-gray-500 hover:text-gray-700"/></button>
                </div>
              </div>
              <div className="p-4 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Время начала</label>
                    <input type="time" value={newTraining.time} onChange={e=>setNewTraining(prev=>({...prev,time:e.target.value}))} className="w-full border-gray-300 rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Время конца</label>
                    <input type="time" value={newTraining.endTime} onChange={e=>setNewTraining(prev=>({...prev,endTime:e.target.value}))} className="w-full border-gray-300 rounded-lg p-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тренер</label>
                  <select value={newTraining.coach} onChange={e=>setNewTraining(prev=>({...prev,coach:e.target.value}))} className="w-full border-gray-300 rounded-lg p-2">
                    <option value="">Выбрать тренера</option>
                    {coaches.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Секция</label>
                  <select value={newTraining.section} onChange={e=>setNewTraining(prev=>({...prev,section:e.target.value}))} className="w-full border-gray-300 rounded-lg p-2">
                    <option value="">Выбрать секцию</option>
                    {sections.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Клуб</label>
                  <select value={newTraining.club} onChange={e=>setNewTraining(prev=>({...prev,club:e.target.value}))} className="w-full border-gray-300 rounded-lg p-2">
                    <option value="">Выбрать клуб</option>
                    {clubs.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дни недели</label>
                  <div className="grid grid-cols-3 gap-2">
                    {daysOfWeek.map(day=>(
                      <button type="button" key={day} onClick={()=>toggleDay(day)} className={`py-2 px-3 rounded-lg font-medium transition ${newTraining.days.includes(day)?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{day.slice(0,3)}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleAddTraining} disabled={!newTraining.time||!newTraining.endTime||!newTraining.coach||!newTraining.section||!newTraining.club||newTraining.days.length===0} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Сохранить</button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Add Button */}
      <button onClick={()=>setShowAddTraining(true)} className="fixed bottom-24 right-6 bg-blue-600 p-4 rounded-full shadow-lg text-white hover:bg-blue-700 transition-colors"><Plus size={24}/></button>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 w-full bg-white border-t shadow flex justify-around py-2">
        {[
          { icon: Home, label: "Главная", path: "/coach/main" },
          { icon: Users, label: "Мои студенты", path: "/coach/students" },
          { icon: BarChart2, label: "Управление", path: "/coach/management" },
          { icon: User, label: "Профиль", path: "/coach/profile" },
        ].map(b=>(
          <button key={b.label} onClick={()=>navigate(b.path)} className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
            <b.icon size={24}/>
            <span className="text-xs mt-1">{b.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default CoachMainPage2;
