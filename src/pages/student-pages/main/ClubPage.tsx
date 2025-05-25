import React, { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { useNavigate } from "react-router-dom";

interface Session {
  date: string;
  title: string;
  time: string;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

const coaches = [
  { name: "Arman Alimkhanov", initials: "AA" },
  // add more coaches here as needed
];

const sessions: Session[] = [
  { date: "2025-05-02", title: "Gi", time: "10:00 AM" },
  { date: "2025-05-05", title: "Gi", time: "6:00 PM" },
  { date: "2025-05-07", title: "Gi", time: "8:00 AM" },
  { date: "2025-05-09", title: "No gi", time: "7:00 PM" },
  { date: "2025-05-12", title: "No gi sparring day", time: "8:00 AM" },
  { date: "2025-05-14", title: "Gi", time: "7:00 PM" },
  { date: "2025-05-16", title: "Gi", time: "8:00 AM" },
  { date: "2025-05-18", title: "Gi", time: "7:00 PM" },
  { date: "2025-05-19", title: "No gi", time: "7:00 PM" },
];

const news: NewsItem[] = [
  {
    id: "1",
    date: "2025-05-25",
    title: "Summer Schedule Released",
    description:
      "Check out our new summer training schedule starting June 1st!",
  },
  {
    id: "2",
    date: "2025-05-20",
    title: "New Coach Joined",
    description:
      "Please welcome Coach Lisa to our team for advanced boxing sessions.",
  },
  {
    id: "3",
    date: "2025-05-10",
    title: "Outdoor Training",
    description:
      "Join our outdoor bootcamp every Saturday morning at the park.",
  },
];

const ClubPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(new Date(2025, 5 - 1, 1))
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const navigate = useNavigate();

  const prevMonth = () =>
    setCurrentMonth(
      addDays(currentMonth, -1 * startOfMonth(currentMonth).getDate())
    );
  const nextMonth = () => setCurrentMonth(addDays(endOfMonth(currentMonth), 1));

  const generateCalendar = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const monthDays = generateCalendar();

  const dayHasSession = (day: Date) =>
    sessions.some((s) => isSameDay(parseISO(s.date), day));

  const getSessionsForDay = (day: Date) =>
    sessions.filter((s) => isSameDay(parseISO(s.date), day));

  const handleDayClick = (day: Date) => {
    if (!dayHasSession(day)) return;
    setSelectedDay((prev) => (prev && isSameDay(prev, day) ? null : day));
  };

  return (
    <>
      <div className="max-w-md mx-auto px-4 pt-4 pb-30 bg-gray-50 min-h-screen">
        {/* Club Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            BARS CHECKMAT
          </h1>
        </header>

        {/* Club Description */}
        <p className="text-gray-700 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique.
        </p>

        {/* Calendar */}
        <Card className="mb-8 relative">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-medium text-gray-800">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="font-semibold text-gray-600">
                  {d}
                </div>
              ))}

              {monthDays.map((day, idx) => {
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day)}
                    className={`h-12 p-1 rounded-lg relative cursor-pointer
                    ${
                      !isSameMonth(day, currentMonth)
                        ? "text-gray-300"
                        : "text-gray-800"
                    }
                    ${
                      dayHasSession(day)
                        ? "bg-emerald-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="absolute top-1 left-1 text-xs">
                      {format(day, "d")}
                    </span>
                    {dayHasSession(day) && (
                      <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
                    )}

                    {/* Popup */}
                    {isSelected && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-xs w-32">
                        {getSessionsForDay(day).map((s, i) => (
                          <>
                            <div key={i} className="mb-1 last:mb-0">
                              <div className="font-semibold">{s.title}</div>
                              <div className="text-gray-500">{s.time}</div>
                            </div>
                            {s.date === "2025-05-02" && (
                              <div key={i} className="mb-1 last:mb-0">
                                <div className="font-semibold">{s.title}</div>
                                <div className="text-gray-500">{"8:00 PM"}</div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sessions Legend */}
            <div className="mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded-full"></span>
                <span>Training Session</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coaches Section */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Meet our coaches
        </h2>
        <div className="space-y-4 mb-8">
          {coaches.map((coach) => (
            <Card
              key={coach.name}
              className="rounded-lg shadow overflow-hidden flex flex-col items-center"
            >
              <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl text-gray-400">{coach.initials}</span>
              </div>
              <CardContent className="py-4">
                <p className="text-center text-lg font-medium text-gray-800">
                  {coach.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* News Section */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Latest Announcements
        </h2>
        <div className="space-y-4 mb-8">
          {news.map((item) => (
            <Card key={item.id} className="border-gray-200">
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">
                    {format(parseISO(item.date), "MMM d, yyyy")}
                  </p>
                  <span className="text-sm font-medium text-blue-600">New</span>
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-700 text-sm mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <nav className="h-16 bg-white shadow-t flex justify-around items-center fixed bottom-14 z-10 w-full">
        <button
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/main")}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/trainings")}
        >
          <Calendar size={20} />
          <span className="text-xs">Trainings</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/stats")}
        >
          <BarChart2 size={20} />
          <span className="text-xs">Stats</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/profile")}
        >
          <User size={20} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </>
  );
};

export default ClubPage;
