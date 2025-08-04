import { scheduleApi } from '@/functions/axios/axiosFunctions';
import type { GetWeekScheduleResponse } from '@/functions/axios/responses';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const CalendarSection: React.FC<{ token: string | null }> = ({ token }) => {
  // Weekly view is more suitable for scheduling details
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = today.getDate() - (day === 0 ? 6 : day - 1); // Monday as first
    return new Date(today.setDate(diff));
  });
  const [weekData, setWeekData] = useState<GetWeekScheduleResponse | null>(null);

  const fetchWeek = async (start: Date) => {
    // setLoading(true);
    const dateStr = start.toISOString().split('T')[0];
    try {
      const res = await scheduleApi.getWeekSchedule(dateStr, token);
      setWeekData(res.data);
    } catch (e) {
      console.error('Failed to load week schedule', e);
    } finally {
    //   setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWeek(weekStart);
  }, [weekStart, token]);

  const navigateWeek = (dir: 'prev' | 'next') => {
    setWeekStart(ws => {
      const nd = new Date(ws);
      nd.setDate(nd.getDate() + (dir === 'next' ? 7 : -7));
      return nd;
    });
  };

  if (!weekData) return <p className="p-4 text-center">Loading week...</p>;

  return (
    <section className="bg-white rounded-lg border border-gray-200 mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigateWeek('prev')} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button>
          <h2 className="text-lg font-medium text-gray-900">
            {weekData.week_start} – {weekData.week_end}
          </h2>
          <button onClick={() => navigateWeek('next')} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20}/></button>
        </div>

        <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-600">
          {weekData.days.map(day => (
            <div key={day.schedule_date} className="py-2">
              <div>{new Date(day.schedule_date).toLocaleDateString('ru-RU', { weekday: 'short' })}</div>
              <div>{day.schedule_date.slice(5)}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {weekData.days.map(day => (
            <div key={day.schedule_date} className="border border-gray-200 min-h-[80px] p-2">
              {day.lessons.length ? day.lessons.map(lesson => (
                <div key={lesson.id} className="mb-1 text-xs bg-blue-500 text-white rounded px-1">
                  {lesson.planned_start_time.slice(0,5)}
                </div>
              )) : <p className="text-xs text-gray-400">—</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};