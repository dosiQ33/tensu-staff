import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Calendar,
  CreditCard,
  Pause,
  Play,
  RotateCcw
} from "lucide-react";
import { BottomNav } from "@/components/Layout";
import { SkeletonLine, SkeletonAvatar } from "@/components/ui";
import { useI18n } from "@/i18n/i18n";
import StudentCard from "./components/StudentCard";
import StudentFilter from "./components/StudentFilter";

import { studentsApi } from "@/functions/axios/axiosFunctions";
// import types if needed for stricter typing

interface StudentUI {
  id: string;
  name: string;
  surname: string;
  telegramUsername?: string;
  phone?: string;
  coaches: string[];
  groups: string[];
  type: string;
  status: "active" | "frozen" | "inactive";
  membershipUntil: string;
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
  const { t } = useI18n();
  const [allStudents, setAllStudents] = useState<StudentUI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("telegramToken");
    if (!token) return;
    setIsLoading(true);
    setError(null);
    studentsApi
      .getList(token)
      .then((res) => {
        const mapped: StudentUI[] = (res.data.users || []).map((u) => ({
          id: u.id.toString(),
          name: u.first_name || "",
          surname: u.last_name || "",
          telegramUsername: u.username ? `@${u.username}` : undefined,
          phone: u.phone_number || undefined,
          coaches: [],
          groups: [],
          type: "—",
          status: "active",
          membershipUntil: new Date().toISOString().slice(0, 10),
          visitHistory: [],
          paymentHistory: [],
        }));
        setAllStudents(mapped);
      })
      .catch(() => setError("Не удалось загрузить студентов"))
      .finally(() => setIsLoading(false));
  }, []);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    coaches: [],
    groups: [],
    types: [],
    status: "all",
  });

  const [selectedStudent, setSelectedStudent] = useState<StudentUI | null>(null);

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
            <h1 className="text-xl font-semibold text-gray-900 mb-3">Студенты</h1>

            {/* Filters */}
            <StudentFilter
              filters={filters}
              allCoaches={allCoaches}
              allGroups={allGroups}
              allTypes={allTypes}
              onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
            />
          </div>
        </div>

        {/* Students List */}
        <div className="px-4 py-2">
          <div className="mb-3 text-sm text-gray-600">
            {isLoading ? "Загрузка…" : error ? error : `${filteredStudents.length} студентов`}
          </div>

          <div className="space-y-2">
            {isLoading && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <SkeletonAvatar />
                      <div className="flex-1 space-y-2">
                        <SkeletonLine width="w-1/2" />
                        <SkeletonLine width="w-1/3" />
                        <SkeletonLine width="w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoading && filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onStudentClick={setSelectedStudent}
              />
            ))}
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end">
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
                      <span className="text-gray-600">Статус:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedStudent.status
                        )}`}
                      >
                        {selectedStudent.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Типы:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Валидно до:</span>
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
                    Обновить членство
                  </button>

                  {selectedStudent.status === "active" ? (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedStudent.id, "frozen")
                      }
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                    >
                      <Pause size={16} />
                      Заморозить
                    </button>
                  ) : selectedStudent.status === "frozen" ? (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedStudent.id, "active")
                      }
                      className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
                    >
                      <Play size={16} />
                      Разморозить
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleStatusChange(selectedStudent.id, "active")
                      }
                      className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
                    >
                      <RotateCcw size={16} />
                      Возобновить
                    </button>
                  )}
                </div>

                {/* Visit History */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} />
                    История Посещений
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
                    История Оплат
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
      <BottomNav page="students"/>
    </>
  );
};

export default StudentsPage;
