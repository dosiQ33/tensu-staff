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

interface Training {
  id: string;
  date: string;
  time: string;
  endTime: string;
  coach: string;
  type: string;
  group?: string;
  attendedCount: number;
  totalCount: number;
  color: string;
}

interface Filters {
  coach: string;
  group: string;
  type: string;
}

interface NewTraining {
  time: string;
  endTime: string;
  coach: string;
  type: string;
  group: string;
  days: string[];
}

const CoachMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<Filters>({
    coach: "all",
    group: "all",
    type: "all",
  });
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newTraining, setNewTraining] = useState<NewTraining>({
    time: "",
    endTime: "",
    coach: "",
    type: "",
    group: "",
    days: [],
  });

  // Sample data
  const trainings: Training[] = [
    {
      id: "1",
      date: "2025-05-23",
      time: "18:00",
      endTime: "19:30",
      coach: "Mike Smith",
      type: "Karate",
      group: "Advanced",
      attendedCount: 8,
      totalCount: 10,
      color: "bg-blue-500",
    },
    {
      id: "2",
      date: "2025-05-23",
      time: "20:00",
      endTime: "21:00",
      coach: "Sarah Connor",
      type: "Boxing",
      group: "Beginners",
      attendedCount: 12,
      totalCount: 15,
      color: "bg-red-500",
    },
    {
      id: "3",
      date: "2025-05-24",
      time: "17:00",
      endTime: "18:30",
      coach: "Carlos Lopez",
      type: "Boxing",
      group: "Intermediate",
      attendedCount: 6,
      totalCount: 8,
      color: "bg-red-500",
    },
    {
      id: "4",
      date: "2025-05-25",
      time: "19:00",
      endTime: "20:30",
      coach: "Mike Smith",
      type: "Karate",
      group: "Competition",
      attendedCount: 15,
      totalCount: 18,
      color: "bg-blue-500",
    },
    {
      id: "5",
      date: "2025-05-26",
      time: "18:30",
      endTime: "20:00",
      coach: "Sarah Connor",
      type: "Fitness",
      attendedCount: 20,
      totalCount: 25,
      color: "bg-green-500",
    },
  ];

  const coaches = ["Mike Smith", "Sarah Connor", "Carlos Lopez"];
  const groups = ["Beginners", "Intermediate", "Advanced", "Competition"];
  const types = ["Karate", "Boxing", "Fitness"];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Today's stats
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayTrainings = trainings.filter((t) => t.date === today);
    const totalAttended = todayTrainings.reduce(
      (sum, t) => sum + t.attendedCount,
      0
    );
    const totalExpected = todayTrainings.reduce(
      (sum, t) => sum + t.totalCount,
      0
    );

    return {
      attendance: `${totalAttended}/${totalExpected}`,
      frozen: 3,
      newStudents: 2,
      expiring: 5,
    };
  }, [trainings]);

  // Filter trainings
  const filteredTrainings = useMemo(() => {
    return trainings.filter((training) => {
      return (
        (filters.coach === "all" || training.coach === filters.coach) &&
        (filters.group === "all" || training.group === filters.group) &&
        (filters.type === "all" || training.type === filters.type)
      );
    });
  }, [trainings, filters]);

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTrainingsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return filteredTrainings.filter((t) => t.date === dateStr);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleAddTraining = () => {
    // In real app, this would make an API call
    console.log("Adding training:", newTraining);
    setShowAddTraining(false);
    setNewTraining({
      time: "",
      endTime: "",
      coach: "",
      type: "",
      group: "",
      days: [],
    });
  };

  const toggleDay = (day: string) => {
    setNewTraining((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-30">
        {/* Header with Stats */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <Users className="text-green-600" size={18} />
                  <div>
                    <div className="text-sm text-green-600 font-medium">
                      Today's Attendance
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {todayStats.attendance}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Snowflake className="text-blue-600" size={18} />
                  <div>
                    <div className="text-sm text-blue-600 font-medium">
                      On Freeze
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {todayStats.frozen}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2">
                  <UserPlus className="text-purple-600" size={18} />
                  <div>
                    <div className="text-sm text-purple-600 font-medium">
                      New This Week
                    </div>
                    <div className="text-lg font-bold text-purple-700">
                      +{todayStats.newStudents}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-orange-600" size={18} />
                  <div>
                    <div className="text-sm text-orange-600 font-medium">
                      Expiring Soon
                    </div>
                    <div className="text-lg font-bold text-orange-700">
                      {todayStats.expiring}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter size={16} />
                <span>Filters</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={filters.coach}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, coach: e.target.value }))
                  }
                  className="text-xs py-2 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Coaches</option>
                  {coaches.map((coach) => (
                    <option key={coach} value={coach}>
                      {coach}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.group}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, group: e.target.value }))
                  }
                  className="text-xs py-2 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Groups</option>
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="text-xs py-2 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="px-4 py-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(currentDate)}
            </h2>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Days of week headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-2 px-1 text-center text-xs font-medium text-gray-500 bg-gray-50"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const dayTrainings = getTrainingsForDay(day);
                const isToday =
                  day && day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    onClick={() =>
                      day && setSelectedDay(day.toISOString().split("T")[0])
                    }
                    className={`min-h-20 p-1 border-b border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !day ? "bg-gray-25" : ""
                    } ${isToday ? "bg-blue-50" : ""}`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-sm font-medium mb-1 ${
                            isToday ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {day.getDate()}
                        </div>

                        <div className="space-y-1">
                          {dayTrainings.slice(0, 2).map((training) => (
                            <div
                              key={training.id}
                              className={`text-xs px-1 py-0.5 rounded text-white ${training.color}`}
                            >
                              <div className="font-medium">{training.time}</div>
                              <div className="truncate">{training.type}</div>
                            </div>
                          ))}
                          {dayTrainings.length > 2 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{dayTrainings.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Training Button */}
          <button
            onClick={() => setShowAddTraining(true)}
            className="w-full mt-4 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Training
          </button>
        </div>

        {/* Day Details Modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[70vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Trainings -{" "}
                    {new Date(selectedDay).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4">
                <div className="space-y-3">
                  {getTrainingsForDay(new Date(selectedDay)).map((training) => (
                    <div
                      key={training.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {training.time} - {training.endTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            {training.type} • {training.group}
                          </div>
                          <div className="text-sm text-gray-600">
                            Coach: {training.coach}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {training.attendedCount}/{training.totalCount}
                          </div>
                          <div className="text-xs text-gray-500">attended</div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (training.attendedCount / training.totalCount) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {getTrainingsForDay(new Date(selectedDay)).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No trainings scheduled for this day
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Training Modal */}
        {showAddTraining && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end pb-12">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add Training
                  </h2>
                  <button
                    onClick={() => setShowAddTraining(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Time inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newTraining.time}
                        onChange={(e) =>
                          setNewTraining((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newTraining.endTime}
                        onChange={(e) =>
                          setNewTraining((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Coach dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coach
                    </label>
                    <select
                      value={newTraining.coach}
                      onChange={(e) =>
                        setNewTraining((prev) => ({
                          ...prev,
                          coach: e.target.value,
                        }))
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Coach</option>
                      {coaches.map((coach) => (
                        <option key={coach} value={coach}>
                          {coach}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Training type dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Training Type
                    </label>
                    <select
                      value={newTraining.type}
                      onChange={(e) =>
                        setNewTraining((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Type</option>
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Group dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group
                    </label>
                    <select
                      value={newTraining.group}
                      onChange={(e) =>
                        setNewTraining((prev) => ({
                          ...prev,
                          group: e.target.value,
                        }))
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Days of week */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days of Week
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`py-2 px-3 text-sm rounded-lg font-medium transition-colors ${
                            newTraining.days.includes(day)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleAddTraining}
                    disabled={
                      !newTraining.time ||
                      !newTraining.endTime ||
                      !newTraining.coach ||
                      !newTraining.type ||
                      newTraining.days.length === 0
                    }
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Save Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <nav className="h-16 bg-white shadow-t flex justify-around items-center fixed bottom-14 z-10 w-full">
        <button
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/coach/main")}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/students")}
        >
          <Users size={20} />
          <span className="text-xs">My students</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/management")}
        >
          <BarChart2 size={20} />
          <span className="text-xs">Management</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/profile")}
        >
          <User size={20} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </>
  );
};

export default CoachMainPage;
