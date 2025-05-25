// src/components/MainPage2.tsx
import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

type Training = {
  icon: string; // you can swap these emojis for SVG/Icon components
  title: string;
  subtitle?: string;
  time: string;
};

const trainings: Training[] = [
  { icon: "🏋️", title: "BJJ", subtitle: "Gi", time: "Tomorrow 20:00–21:00" },
  { icon: "⚽", title: "Football", subtitle: "", time: "Tuesday 14:00–16:00" },
  { icon: "🏋️", title: "BJJ", subtitle: "Gi", time: "Friday 20:00–21:00" },
];

const MainPage2: React.FC = () => {
  //   const monthlyDone = 9;
  //   const monthlyTotal = 12;
  //   const monthlyPct = Math.round((monthlyDone / monthlyTotal) * 100);

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
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
        <div className="w-1 bg-lime-300" />
        <div className="p-4 flex-1">
          <p className="text-base text-gray-800 mb-1">
            Please checkin for today’s class
          </p>
          <p className="text-sm text-gray-600">20:00–21:00</p>
        </div>

        <div>
          <button className="m-4 ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md">
            SCAN QR
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg mr-3">
              {trainings[0].icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {trainings[0].title}{" "}
                {trainings[0].subtitle && (
                  <span className="text-gray-500">
                    – {trainings[0].subtitle}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Trainings */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Trainings
      </h2>
      <div className="space-y-4 mb-10">
        {trainings.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg mr-3">
                {t.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {t.title}{" "}
                  {t.subtitle && (
                    <span className="text-gray-500">– {t.subtitle}</span>
                  )}
                </p>
              </div>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {t.time}
            </span>
            {/* Progress bar (you can wire this up to real data) */}
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "100%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Goal */}
      {/* <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-800">Monthly Goal</span>
          <span className="text-sm text-gray-600">
            {monthlyDone} / {monthlyTotal}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${monthlyPct}%` }}
          />
        </div>
      </div> */}
      <Card className="col-span-full rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            BARS CHECKMAT Monthly Goal
          </h2>
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

      <Card className="col-span-full rounded-2xl shadow-lg bg-gradient-to-r from-purple-400 to-blue-500 text-white">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">
            FOOTBALL CLUB Monthly Goal
          </h2>
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
    </div>
  );
};

export default MainPage2;
