import React, { useState, useEffect } from "react";
import { Droplets, Calendar, Zap } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Home, BarChart2, User } from "lucide-react";

const TrainingsPage: React.FC = () => {
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <>
      <div
        className={`px-6 py-8 pb-40 opacity-0 transition-opacity duration-300 ease-in-out ${
          animateIn ? "opacity-100" : ""
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Training Options
        </h2>

        {/* Personal Training Block with card hover effects */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div className="p-5 relative">
            {/* Visual indicator for quick recognition */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500"></div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 pl-3 group-hover:text-indigo-600 transition-colors duration-200">
              Personal Training
            </h3>
            <p className="text-gray-600 text-sm mb-4 pl-3">
              One-on-one sessions with a personal trainer tailored to your goals
              and fitness level.
            </p>
            <button className="w-full py-3 relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-md font-medium group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
              <div className="relative z-10 flex items-center justify-center">
                <span>Select Personal Training</span>
                <ChevronRight
                  size={18}
                  className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
              {/* Button shine effect on hover */}
              <div className="absolute top-0 -left-full h-full w-1/3 bg-white opacity-20 transform rotate-12 transition-transform duration-700 group-hover:translate-x-96"></div>
            </button>
          </div>
        </div>

        {/* Group Training Block with enhanced UI */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div className="p-5 relative">
            {/* Visual indicator for quick recognition */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500"></div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2 pl-3 group-hover:text-cyan-600 transition-colors duration-200">
              Group Training
            </h3>
            <p className="text-gray-600 text-sm mb-4 pl-3">
              Join a motivating group session led by experienced trainers.
              Various programs available.
            </p>
            <button className="w-full py-3 relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md font-medium group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
              <div className="relative z-10 flex items-center justify-center">
                <span>Select Group Training</span>
                <ChevronRight
                  size={18}
                  className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
              {/* Button shine effect on hover */}
              <div className="absolute top-0 -left-full h-full w-1/3 bg-white opacity-20 transform rotate-12 transition-transform duration-700 group-hover:translate-x-96"></div>
            </button>
          </div>
        </div>

        {/* Upcoming Classes with interactive elements */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar size={18} className="mr-2 text-indigo-500" />
            Today's Classes
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm flex justify-between items-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
              {/* Status indicator */}
              <div className="absolute top-0 right-0">
                <div className="w-16 h-16 bg-green-500 opacity-10 rotate-45 transform translate-x-8 -translate-y-8"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <Zap size={16} className="text-indigo-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                    Crossfit
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <div className="flex items-center mr-3">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                      <span className="text-green-700 text-xs">Available</span>
                    </div>
                    <span>18:00 - 19:00</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-md text-sm font-medium hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 group-hover:shadow-sm">
                Join Now
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm flex justify-between items-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
              {/* Status indicator */}
              <div className="absolute top-0 right-0">
                <div className="w-16 h-16 bg-amber-500 opacity-10 rotate-45 transform translate-x-8 -translate-y-8"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-500"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                    <path d="M8 12h8" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                    Yoga
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <div className="flex items-center mr-3">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1"></div>
                      <span className="text-amber-700 text-xs">
                        Almost full
                      </span>
                    </div>
                    <span>19:30 - 20:30</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 rounded-md text-sm font-medium hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 group-hover:shadow-sm">
                Join Now
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm flex justify-between items-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
              {/* Status indicator */}
              <div className="absolute top-0 right-0">
                <div className="w-16 h-16 bg-red-500 opacity-10 rotate-45 transform translate-x-8 -translate-y-8"></div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-full flex items-center justify-center mr-3 shadow-sm opacity-70">
                  <Droplets size={16} className="text-blue-500" />
                </div>
                <div className="opacity-70">
                  <div className="font-semibold text-gray-800">
                    Aqua Fitness
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <div className="flex items-center mr-3">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
                      <span className="text-red-700 text-xs">Full</span>
                    </div>
                    <span>20:45 - 21:45</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed">
                Sold Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className="h-16 bg-white shadow-t flex justify-around items-center fixed bottom-14 z-10 w-full">
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/main")}
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button
          className="flex flex-col items-center text-blue-600"
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

export default TrainingsPage;
