import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  MessageCircle,
  Filter,
  X,
  Calendar,
  Users,
  Award,
  CreditCard,
  Pause,
  Play,
  RotateCcw,
  BarChart2,
  Home,
  User,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  surname: string;
  telegramUsername?: string;
  coaches: string[];
  groups: string[];
  type: string;
  status: "active" | "frozen" | "inactive";
  membershipUntil: string;
  phone?: string;
  visitHistory: { date: string; attended: boolean }[];
  paymentHistory: { date: string; amount: number; description: string }[];
}

interface Filters {
  search: string;
  coaches: string[];
  groups: string[];
  types: string[];
  status: string;
}

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  // Sample data
  const allStudents: Student[] = [
    {
      id: "1",
      name: "Alex",
      surname: "Johnson",
      telegramUsername: "@alexj",
      coaches: ["Mike Smith", "Sarah Connor"],
      groups: ["Advanced Karate", "Competition"],
      type: "Karate",
      status: "active",
      membershipUntil: "2025-07-15",
      phone: "+1234567890",
      visitHistory: [
        { date: "2025-05-20", attended: true },
        { date: "2025-05-18", attended: true },
        { date: "2025-05-15", attended: false },
      ],
      paymentHistory: [
        { date: "2025-05-01", amount: 120, description: "Monthly membership" },
        { date: "2025-04-01", amount: 120, description: "Monthly membership" },
      ],
    },
    {
      id: "2",
      name: "Maria",
      surname: "Rodriguez",
      telegramUsername: "@maria_r",
      coaches: ["Carlos Lopez"],
      groups: ["Beginner Boxing"],
      type: "Boxing",
      status: "frozen",
      membershipUntil: "2025-06-10",
      visitHistory: [
        { date: "2025-05-10", attended: true },
        { date: "2025-05-08", attended: true },
      ],
      paymentHistory: [
        { date: "2025-05-01", amount: 100, description: "Monthly membership" },
      ],
    },
    {
      id: "3",
      name: "David",
      surname: "Chen",
      coaches: ["Mike Smith"],
      groups: ["Intermediate Karate"],
      type: "Karate",
      status: "active",
      membershipUntil: "2025-05-30",
      phone: "+9876543210",
      visitHistory: [
        { date: "2025-05-22", attended: true },
        { date: "2025-05-20", attended: true },
      ],
      paymentHistory: [
        { date: "2025-05-01", amount: 110, description: "Monthly membership" },
      ],
    },
    {
      id: "4",
      name: "Emma",
      surname: "Wilson",
      telegramUsername: "@emma_w",
      coaches: ["Sarah Connor", "Carlos Lopez"],
      groups: ["Advanced Boxing", "Fitness"],
      type: "Boxing",
      status: "inactive",
      membershipUntil: "2025-04-15",
      visitHistory: [{ date: "2025-04-10", attended: true }],
      paymentHistory: [
        { date: "2025-04-01", amount: 130, description: "Monthly membership" },
      ],
    },
    {
      id: "5",
      name: "James",
      surname: "Brown",
      coaches: ["Mike Smith"],
      groups: ["Beginner Karate"],
      type: "Karate",
      status: "active",
      membershipUntil: "2025-08-20",
      phone: "+5555555555",
      visitHistory: [
        { date: "2025-05-21", attended: true },
        { date: "2025-05-19", attended: false },
      ],
      paymentHistory: [
        { date: "2025-05-01", amount: 90, description: "Monthly membership" },
      ],
    },
  ];

  const [filters, setFilters] = useState<Filters>({
    search: "",
    coaches: [],
    groups: [],
    types: [],
    status: "all",
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filter options
  const allCoaches = [...new Set(allStudents.flatMap((s) => s.coaches))];
  const allGroups = [...new Set(allStudents.flatMap((s) => s.groups))];
  const allTypes = [...new Set(allStudents.map((s) => s.type))];

  // Filter students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesSearch =
        filters.search === "" ||
        `${student.name} ${student.surname}`
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesCoaches =
        filters.coaches.length === 0 ||
        filters.coaches.some((coach) => student.coaches.includes(coach));

      const matchesGroups =
        filters.groups.length === 0 ||
        filters.groups.some((group) => student.groups.includes(group));

      const matchesTypes =
        filters.types.length === 0 || filters.types.includes(student.type);

      const matchesStatus =
        filters.status === "all" || student.status === filters.status;

      return (
        matchesSearch &&
        matchesCoaches &&
        matchesGroups &&
        matchesTypes &&
        matchesStatus
      );
    });
  }, [allStudents, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "frozen":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (date: string) => {
    const membershipDate = new Date(date);
    const today = new Date();
    const diffTime = membershipDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusChange = (
    studentId: string,
    newStatus: "active" | "frozen" | "inactive"
  ) => {
    // In real app, this would make an API call
    console.log(`Changing student ${studentId} status to ${newStatus}`);
  };

  const handleRenewMembership = (studentId: string) => {
    // In real app, this would open payment flow
    console.log(`Renewing membership for student ${studentId}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-30">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-semibold text-gray-900">Students</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-3">
              {["all", "active", "frozen", "inactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters((prev) => ({ ...prev, status }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.status === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                {/* Coaches Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coaches
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {allCoaches.map((coach) => (
                      <button
                        key={coach}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            coaches: prev.coaches.includes(coach)
                              ? prev.coaches.filter((c) => c !== coach)
                              : [...prev.coaches, coach],
                          }));
                        }}
                        className={`px-2 py-1 text-xs rounded-full ${
                          filters.coaches.includes(coach)
                            ? "bg-blue-100 text-blue-800"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        {coach}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Groups Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Groups
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {allGroups.map((group) => (
                      <button
                        key={group}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            groups: prev.groups.includes(group)
                              ? prev.groups.filter((g) => g !== group)
                              : [...prev.groups, group],
                          }));
                        }}
                        className={`px-2 py-1 text-xs rounded-full ${
                          filters.groups.includes(group)
                            ? "bg-green-100 text-green-800"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Types Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Types
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {allTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            types: prev.types.includes(type)
                              ? prev.types.filter((t) => t !== type)
                              : [...prev.types, type],
                          }));
                        }}
                        className={`px-2 py-1 text-xs rounded-full ${
                          filters.types.includes(type)
                            ? "bg-purple-100 text-purple-800"
                            : "bg-white text-gray-600 border border-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Students List */}
        <div className="px-4 py-2">
          <div className="text-sm text-gray-600 mb-3">
            {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
          </div>

          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {student.name} {student.surname}
                      </span>
                      {student.telegramUsername && (
                        <span className="text-xs text-gray-500">
                          {student.telegramUsername}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{student.coaches.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={14} />
                        <span>{student.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Groups: {student.groups.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>

                    <div
                      className={`text-xs ${
                        isExpiringSoon(student.membershipUntil)
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Until {formatDate(student.membershipUntil)}
                    </div>

                    <div className="flex gap-2">
                      {student.phone && (
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Phone size={16} />
                        </button>
                      )}
                      {student.telegramUsername && (
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <MessageCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedStudent.name} {selectedStudent.surname}
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedStudent.status
                        )}`}
                      >
                        {selectedStudent.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valid until:</span>
                      <span
                        className={`ml-2 ${
                          isExpiringSoon(selectedStudent.membershipUntil)
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {formatDate(selectedStudent.membershipUntil)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRenewMembership(selectedStudent.id)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Renew Membership
                  </button>

                  {selectedStudent.status === "active" ? (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedStudent.id, "frozen")
                      }
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                    >
                      <Pause size={16} />
                      Freeze
                    </button>
                  ) : selectedStudent.status === "frozen" ? (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedStudent.id, "active")
                      }
                      className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
                    >
                      <Play size={16} />
                      Unfreeze
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedStudent.id, "active")
                      }
                      className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
                    >
                      <RotateCcw size={16} />
                      Reactivate
                    </button>
                  )}
                </div>

                {/* Visit History */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} />
                    Visit History
                  </h3>
                  <div className="space-y-2">
                    {selectedStudent.visitHistory.map((visit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-600">
                          {formatDate(visit.date)}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            visit.attended ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {visit.attended ? "Attended" : "Missed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment History */}
                <div className="pb-20">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard size={18} />
                    Payment History
                  </h3>
                  <div className="space-y-2">
                    {selectedStudent.paymentHistory.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 px-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            ${payment.amount}
                          </div>
                          <div className="text-xs text-gray-600">
                            {payment.description}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatDate(payment.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <nav className="h-16 bg-white shadow-t flex justify-around items-center fixed bottom-0 z-10 w-full">
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/main")}
        >
          <Home size={20} />
          <span className="text-xs">Главная</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/students")}
        >
          <Users size={20} />
          <span className="text-xs">Мои студенты</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/management")}
        >
          <BarChart2 size={20} />
          <span className="text-xs">Управление</span>
        </button>
        <button
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/coach/profie")}
        >
          <User size={20} />
          <span className="text-xs">Профиль</span>
        </button>
      </nav>
    </>
  );
};

export default StudentsPage;
