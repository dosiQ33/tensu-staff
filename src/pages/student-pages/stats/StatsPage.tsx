import React from "react";
import { Flame, Award, Droplets } from "lucide-react";
import LineChart from "./components/LineChart";
import { Home, User, Calendar, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Render Stats Screen
const StatsPage: React.FC = () => {
  const navigate = useNavigate();

  const userData = {
    fullName: "Alex Johnson",
    phoneNumber: "+7 (777) 123-4567",
    membershipExpiry: "2025-06-30",
    daysLeft: 43,
    avatar: null, // Will use initial instead
    streak: 12, // Days in a row
    calories: 12470, // Monthly
    achievements: [
      { name: "Early Bird", count: 15, icon: <Flame size={18} /> },
      { name: "Perfect Week", count: 3, icon: <Award size={18} /> },
      { name: "Hydration Hero", count: 30, icon: <Droplets size={18} /> },
    ],
    paymentHistory: [
      { date: "2025-04-15", amount: "15,000₸" },
      { date: "2025-03-15", amount: "15,000₸" },
      { date: "2025-02-15", amount: "15,000₸" },
    ],
    workoutStats: {
      total: 67,
      average: "3.2 per week",
      personal: 42,
      group: 25,
      monthlyData: [4, 8, 12, 14, 10, 15, 4],
    },
    currentMonth: {
      personal: 60,
      group: 40,
    },
  };

  return (
    <>
      <div className="px-6 py-8 pb-20">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Statistics
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Workouts</div>
            <div className="text-2xl font-semibold text-gray-800 mt-1">
              {userData.workoutStats.total}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Average</div>
            <div className="text-2xl font-semibold text-gray-800 mt-1">
              {userData.workoutStats.average}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">
            Monthly Progress
          </h3>
          <LineChart data={userData.workoutStats.monthlyData} />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-md font-medium text-gray-800 mb-4">
            Training Type Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Personal Training</span>
                <span className="font-medium text-gray-800">
                  {userData.workoutStats.personal}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${
                      (userData.workoutStats.personal /
                        userData.workoutStats.total) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Group Training</span>
                <span className="font-medium text-gray-800">
                  {userData.workoutStats.group}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{
                    width: `${
                      (userData.workoutStats.group /
                        userData.workoutStats.total) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="h-16 bg-white shadow-t flex justify-around items-center fixed bottom-0 z-10 w-full">
        <button
          className="flex flex-col items-center text-gray-400"
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
          className="flex flex-col items-center text-blue-600"
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

export default StatsPage;
