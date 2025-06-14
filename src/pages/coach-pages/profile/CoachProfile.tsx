import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Copy,
  Crown,
  Shield,
  Users,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Eye,
  X,
  DollarSign,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  BarChart2,
  Home,
} from "lucide-react";
import { clubsApi } from "@/functions/axios/axiosFunctions";
import { CreateClubModal } from "./components/CreateClubModal";

interface Club {
  id: string;
  name: string;
  logo: string;
  userRole: "owner" | "admin" | "coach";
  sections: number;
  students: number;
  monthlyRevenue: number;
  studentGrowth: number;
  plan: string;
  nextPayment: string;
  paymentStatus: "paid" | "pending" | "expired";
  analytics: {
    totalStudents: number;
    newStudents: number;
    lostStudents: number;
    weeklyRevenue: number;
    averageTicket: number;
    totalWorkouts: number;
    peakHours: string;
    revenueHistory: { month: string; amount: number }[];
    studentHistory: { month: string; count: number }[];
    sectionDistribution: { name: string; count: number; color: string }[];
  };
  paymentHistory: {
    date: string;
    amount: number;
    method: string;
    status: string;
  }[];
}

const CoachProfile: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  // Sample user data
  const userData = {
    name: localStorage.getItem("telegramFullName") || "",
    phone: localStorage.getItem("telegramPhone") || "",
    avatar: localStorage.getItem("telegramAvatar"),
    fakeAvatar: "👤",
  };

  const [clubs, setClubs] = useState<Club[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="text-yellow-600" size={16} />;
      case "admin":
        return <Shield className="text-purple-600" size={16} />;
      case "coach":
        return <User className="text-blue-600" size={16} />;
      default:
        return <User className="text-gray-600" size={16} />;
    }
  };

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentAction = (status: string) => {
    switch (status) {
      case "paid":
        return "View";
      case "pending":
        return "Pay Now";
      case "expired":
        return "Renew";
      default:
        return "View";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In real app, show a toast notification
    console.log("Copied to clipboard:", text);
  };

  const handlePayment = (clubId: string) => {
    console.log("Processing payment for club:", clubId);
    // In real app, this would open payment flow
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-30">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          </div>
        </div>

        {/* Personal Info */}
        <div className="px-4 py-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-4">
              {userData.avatar ? (
                <img className="w-10 h-10 rounded-full" src={userData.avatar} />
              ) : (
                <div className="text-4xl">{userData.fakeAvatar}</div>
              )}

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {userData.name}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span className="text-sm">+{userData.phone}</span>
                    <button
                      onClick={() => copyToClipboard(userData.phone)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600"
            >
              + Create Club
            </button>
          </div>

          <CreateClubModal
            show={showCreate}
            loading={isCreating}
            onClose={() => setShowCreate(false)}
            onSubmit={async (data) => {
              setIsCreating(true);
              try {
                const { data: created } = await clubsApi.create(
                  data,
                  localStorage.getItem("telegramToken")!
                );
                const uiClub: Club = {
                  id: created.id.toString(),
                  name: created.name,
                  logo: created.logo_url,
                  userRole: "owner",
                  sections: 0,
                  students: 0,
                  monthlyRevenue: 0,
                  studentGrowth: 0,
                  plan: "Basic",
                  nextPayment: "",
                  paymentStatus: "pending",
                  analytics: {
                    totalStudents: 0,
                    newStudents: 0,
                    lostStudents: 0,
                    weeklyRevenue: 0,
                    averageTicket: 0,
                    totalWorkouts: 0,
                    peakHours: "",
                    revenueHistory: [],
                    studentHistory: [],
                    sectionDistribution: [],
                  },
                  paymentHistory: [],
                };
                setClubs((prev) => [...prev, uiClub]);
                setShowCreate(false);
              } catch (e) {
                console.error("Ошибка создания клуба", e);
              } finally {
                setIsCreating(false);
              }
            }}
          />

          {/* Clubs Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              My Clubs ({clubs.length})
            </h3>

            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Club Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{club.logo}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {club.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          {getRoleIcon(club.userRole)}
                          <span className="text-gray-600">
                            {getRoleLabel(club.userRole)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedClub(club)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Details
                    </button>
                  </div>
                </div>

                {/* Club Stats */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-700">
                          Students
                        </span>
                      </div>
                      <div className="text-xl font-bold text-blue-800">
                        {club.students}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        {club.studentGrowth > 0 ? (
                          <TrendingUp className="text-green-600" size={12} />
                        ) : (
                          <TrendingDown className="text-red-600" size={12} />
                        )}
                        <span
                          className={
                            club.studentGrowth > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {club.studentGrowth > 0 ? "+" : ""}
                          {club.studentGrowth} this month
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-700">
                          Revenue
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-800">
                        {formatCurrency(club.monthlyRevenue)}
                      </div>
                      <div className="text-sm text-green-600">Monthly</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    {club.sections} sections • Peak hours:{" "}
                    {club.analytics.peakHours}
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-gray-600" size={16} />
                        <span className="text-sm font-medium text-gray-700">
                          {club.plan} Plan
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          club.paymentStatus
                        )}`}
                      >
                        {club.paymentStatus.charAt(0).toUpperCase() +
                          club.paymentStatus.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Next payment: {formatDate(club.nextPayment)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPaymentHistory(club.id)}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          History
                        </button>
                        <button
                          onClick={() => handlePayment(club.id)}
                          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                            club.paymentStatus === "paid"
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : club.paymentStatus === "pending"
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          {getPaymentAction(club.paymentStatus)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Club Analytics Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedClub.name} Analytics
                  </h2>
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="text-blue-600" size={16} />
                      <span className="text-sm font-medium text-blue-700">
                        Total Students
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {selectedClub.analytics.totalStudents}
                    </div>
                    <div className="text-xs text-blue-600">
                      +{selectedClub.analytics.newStudents} new, -
                      {selectedClub.analytics.lostStudents} lost
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="text-sm font-medium text-green-700">
                        Weekly Revenue
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(selectedClub.analytics.weeklyRevenue)}
                    </div>
                    <div className="text-xs text-green-600">
                      Avg ticket:{" "}
                      {formatCurrency(selectedClub.analytics.averageTicket)}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="text-purple-600" size={16} />
                      <span className="text-sm font-medium text-purple-700">
                        Workouts
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      {selectedClub.analytics.totalWorkouts}
                    </div>
                    <div className="text-xs text-purple-600">This month</div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-orange-600" size={16} />
                      <span className="text-sm font-medium text-orange-700">
                        Peak Hours
                      </span>
                    </div>
                    <div className="text-xl font-bold text-orange-800">
                      {selectedClub.analytics.peakHours}
                    </div>
                    <div className="text-xs text-orange-600">Busiest time</div>
                  </div>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="text-gray-600" size={18} />
                    <h3 className="font-semibold text-gray-900">
                      Revenue Trend
                    </h3>
                  </div>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {selectedClub.analytics.revenueHistory.map(
                      (item, index) => {
                        const maxRevenue = Math.max(
                          ...selectedClub.analytics.revenueHistory.map(
                            (r) => r.amount
                          )
                        );
                        const height = (item.amount / maxRevenue) * 100;
                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div className="text-xs text-gray-600 mb-1">
                              {formatCurrency(item.amount / 1000)}k
                            </div>
                            <div
                              className="w-full bg-blue-500 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {item.month}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Student Growth */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="text-gray-600" size={18} />
                    <h3 className="font-semibold text-gray-900">
                      Student Growth
                    </h3>
                  </div>
                  <div className="flex items-end justify-between h-24 gap-2">
                    {selectedClub.analytics.studentHistory.map(
                      (item, index) => {
                        const maxStudents = Math.max(
                          ...selectedClub.analytics.studentHistory.map(
                            (s) => s.count
                          )
                        );
                        const height = (item.count / maxStudents) * 100;
                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div className="text-xs text-gray-600 mb-1">
                              {item.count}
                            </div>
                            <div
                              className="w-full bg-green-500 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {item.month}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Section Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="text-gray-600" size={18} />
                    <h3 className="font-semibold text-gray-900">
                      Section Distribution
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedClub.analytics.sectionDistribution.map(
                      (section, index) => {
                        const percentage =
                          (section.count /
                            selectedClub.analytics.totalStudents) *
                          100;
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded ${section.color}`}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {section.count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${section.color}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Modal */}
        {showPaymentHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[70vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment History
                  </h2>
                  <button
                    onClick={() => setShowPaymentHistory(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4">
                <div className="space-y-3">
                  {clubs
                    .find((c) => c.id === showPaymentHistory)
                    ?.paymentHistory.map((payment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(payment.date)} • {payment.method}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
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

export default CoachProfile;
