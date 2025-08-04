import React, { useState, useMemo } from "react";
import type { Training } from "@/types/types";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { DayDetailsModal } from "./DayDetailsModal";

const coaches = ['Иван Иванов', 'Мария Петрова', 'Сергей Смирнов'];
const clubs = ['Bars Checkmat', 'Titan Fit', 'Tigers'];
const sections = ['BJJ', 'Karate', 'Boxing', 'Fitness'];

export const CalendarSection: React.FC<{ trainings: Training[] }> = ({ trainings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [calendarFilters, setCalendarFilters] = useState({ coach: 'all', club: 'all', type: 'all' });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const filteredTrainings = useMemo(
    () =>
      trainings.filter(t =>
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

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const formatDate = (d: Date) => d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const navigateMonth = (dir: 'prev' | 'next') =>
    setCurrentDate(d => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() + (dir === 'next' ? 1 : -1));
      return nd;
    });
  const getTrainingsForDay = (day: Date | null) =>
    day ? filteredTrainings.filter(t => t.date === day.toISOString().split('T')[0]) : [];

  return (
    <section className="bg-white rounded-lg mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">Расписание</h2>
          <button onClick={() => setShowFilters(f => !f)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Filter size={20} />
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тренеры</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setCalendarFilters(prev => ({ ...prev, coach: 'all' }))}
                  className={`px-2 py-1 text-xs rounded-full ${
                    calendarFilters.coach === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'
                  }`}
                >
                  Все тренеры
                </button>
                {coaches.map(coach => (
                  <button
                    key={coach}
                    onClick={() => setCalendarFilters(prev => ({ ...prev, coach }))}
                    className={`px-2 py-1 text-xs rounded-full ${
                      calendarFilters.coach === coach ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'
                    }`}
                  >
                    {coach}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Клубы</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setCalendarFilters(prev => ({ ...prev, club: 'all' }))}
                  className={`px-2 py-1 text-xs rounded-full ${
                    calendarFilters.club === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'
                  }`}
                >
                  Все клубы
                </button>
                {clubs.map(club => (
                  <button
                    key={club}
                    onClick={() => setCalendarFilters(prev => ({ ...prev, club }))}
                    className={`px-2 py-1 text-xs rounded-full ${
                      calendarFilters.club === club ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'
                    }`}
                  >
                    {club}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип тренировки</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setCalendarFilters(prev => ({ ...prev, type: 'all' }))}
                  className={`px-2 py-1 text-xs rounded-full ${
                    calendarFilters.type === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'
                  }`}
                >
                  Все типы
                </button>
                {sections.map(section => (
                  <button
                    key={section}
                    onClick={() => setCalendarFilters(prev => ({ ...prev, type: section }))}
                    className={`px-2 py-1 text-xs rounded-full ${
                      calendarFilters.type === section ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigateMonth('prev')} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-base font-medium capitalize">{formatDate(currentDate)}</h3>
          <button onClick={() => navigateMonth('next')} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>

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
                  !day
                    ? 'bg-gray-50'
                    : day.toDateString() === new Date().toDateString()
                    ? 'bg-blue-50'
                    : 'bg-white'
                } hover:bg-gray-100`}
              >
                {day && (
                  <>
                    <div className={`text-xs font-medium mb-1 ${
                      day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-800'
                    }`}>{day.getDate()}</div>
                    <div className="space-y-0.5">
                      {getTrainingsForDay(day).slice(0, 2).map(t => (
                        <div key={t.id} className={`text-[10px] text-white rounded px-1 py-0.5 truncate ${t.color}`}>{t.time}</div>
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

        {selectedDay && <DayDetailsModal day={selectedDay} onClose={() => setSelectedDay(null)} trainings={getTrainingsForDay(new Date(selectedDay))} />}
      </div>
    </section>
  );
};