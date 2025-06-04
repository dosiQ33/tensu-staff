// src/components/MainPage2.tsx
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { ChevronRight } from "lucide-react";
import { Home, BarChart2, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Training data
type Training = {
  icon: string; // swap for your SVG/Icon components if needed
  title: string;
  subtitle?: string;
  time: string;
};

const trainings: Training[] = [
  { icon: "🏋️", title: "BARS Checkmat", subtitle: "Gi", time: "Tomorrow 20:00–21:00" },
  { icon: "⚽", title: "Futsal Lovers", subtitle: "", time: "Tuesday 14:00–16:00" },
  { icon: "🏋️", title: "BARS Checkmat", subtitle: "Gi", time: "Friday 20:00–21:00" },
];

const MainPage2: React.FC = () => {
  const navigate = useNavigate();
  const notificationCount = 3; 

  return (
    <>
      <div className="max-w-md mx-auto pt-4 pb-30 px-4 bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between h-14 mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back, Madi
          </h1>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            MA
          </div>
        </header>

        {/* Today’s Class Card */}
        <div className="flex items-start bg-white border border-gray-200 rounded-lg overflow-hidden mb-8 p-4">
          <div className="w-1 bg-lime-300"></div>
          <div className="pl-4 flex-1">
            <p className="text-base text-gray-800 mb-1">
              Check-in for other class
            </p>
            <p className="text-sm text-gray-600">20:00–21:00</p>
          </div>
          <button className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md">
            SCAN QR
          </button>
        </div>

        {/* Upcoming Trainings */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Trainings
        </h2>
        <div className="space-y-4 mb-10">
          {trainings.map((t, i) => (
            <div
              key={i}
              className="relative bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center" onClick={()=>navigate("/club-page")}>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg mr-3">
                  {t.icon}
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {t.title}{" "}
                  {t.subtitle && (
                    <span className="text-gray-500">– {t.subtitle}</span>
                  )}
                </p>
              </div>

              <div className="flex items-center">
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {t.time}
                </span>
                <button
                  onClick={() => console.log("Clicked training", trainings[i])}
                >
                  <ChevronRight className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Goals Carousel */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Goals
        </h2>
        <div className="mb-6">
          <div className="flex overflow-x-auto space-x-4 px-4 py-2 scroll-smooth snap-x snap-mandatory">
            <Card className="snap-start min-w-[100%] rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-blue-500 text-white">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  BARS CHECKMAT Monthly Goal
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">11 / 12</p>
                    <p className="text-sm">sessions attended</p>
                  </div>
                  <div className="w-1/2">
                    <div className="h-2 bg-white bg-opacity-40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>0</span>
                      <span>12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="snap-start min-w-[100%] rounded-2xl shadow-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  FOOTBALL CLUB Monthly Goal
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">9 / 12</p>
                    <p className="text-sm">sessions attended</p>
                  </div>
                  <div className="w-1/2">
                    <div className="h-2 bg-white bg-opacity-40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>0</span>
                      <span>12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
          className="relative flex flex-col items-center text-gray-400"
          onClick={() => navigate("/profile")}
        >
          <User size={20} />
          {/* Notification badge */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {notificationCount}
            </span>
          )}
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </>
  );
};

export default MainPage2;
