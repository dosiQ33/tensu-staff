import { useState } from 'react';
import { useTelegram } from '../../../hooks/useTelegram';
import { Card, CardContent } from '../../../components/ui/card';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Home, BarChart2, Calendar, User } from 'lucide-react';

// Map weekdays to JS getDay() index
const weekdayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function MainPage() {
  const { user } = useTelegram();
  const fullName = user
    ? `${user.first_name} ${user.last_name ?? ''}`.trim()
    : 'Athlete';

  // Mock attendance data; replace with real backend data
  const [attendanceData] = useState([
    { name: 'Present', value: 75 },
    { name: 'Absent', value: 25 },
  ]);
  const COLORS = ['#10B981', '#EF4444'];

  // Sample upcoming sessions; pull from API in future
  const upcomingSessions = [
    { weekday: 'Monday', type: 'Gi', time: '20:00-22:00' },
    { weekday: 'Wednesday', type: 'No gi', time: '20:00-22:00' },
    { weekday: 'Friday', type: 'No gi', time: '20:00-22:00' },
  ];

  

  // Initialize statuses for each session: upcoming | active | skipped
  const [statuses, setStatuses] = useState<
    Record<number, 'upcoming' | 'active' | 'skipped'>
  >(() => {
    const today = new Date().getDay();
    const init: Record<number, 'upcoming' | 'active' | 'skipped'> = {};
    upcomingSessions.forEach((s, i) => {
      const day = weekdayMap[s.weekday];
      init[i] = day < today ? 'skipped' : 'upcoming';
    });
    return init;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back,{' '}
            <span className="text-blue-600">
              {fullName.split(' ')[0]}
            </span>
            !
          </h1>
          <p className="text-sm text-gray-500">
            Here's your training dashboard
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              fullName
            )}`}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Attendance Card */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              Attendance Overview
            </h2>
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={4}
                  >
                    {attendanceData.map((_entry, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold"
                  >
                    {attendanceData[0].value}%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions Card */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">
              BARS CHECKMAT BJJ CLUB
            </h2>
            <ul className="space-y-2">
              {upcomingSessions.map((s, i) => {
                const status = statuses[i] ?? 'upcoming';
                
                return (
                  <li
                    key={i}
                    className="bg-white rounded-lg p-3 shadow hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{s.weekday}</span>
                      <div className="flex items-center space-x-2">
                        {s.weekday === 'Monday' && status === 'upcoming' ? (
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="1"
                            onChange={() =>
                              setStatuses((prev) => ({
                                ...prev,
                                [i]: 'active',
                              }))
                            }
                            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        ) : (
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : status === 'skipped'
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() +
                              status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {s.type} · {s.time}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Monthly Goal Card */}
        <Card className="col-span-full rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Monthly Goal</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">9 / 12</p>
                <p className="text-sm">sessions attended</p>
              </div>
              <div className="w-1/2">
                <div className="h-2 bg-white bg-opacity-40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>0</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-white shadow-t flex justify-around items-center">
        <button className="flex flex-col items-center text-blue-600">
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <BarChart2 size={20} />
          <span className="text-xs">Stats</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <Calendar size={20} />
          <span className="text-xs">Schedule</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <User size={20} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </motion.div>
  );
}