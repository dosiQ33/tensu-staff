import React, { useState } from "react";
import {
  Phone,
  Edit2,
  CreditCard,
  Pause,
  Play,
  Bell,
  Globe,
  MessageCircle,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Star,
  TrendingUp,
  AlertTriangle,
  Gift,
  BarChart2,
  Calendar,
  Home,
  User,
  ChevronDown,
  ChevronUp,
  DeleteIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Membership {
  id: string;
  clubName: string;
  section: string;
  type: "group" | "personal" | "single";
  status: "active" | "frozen" | "expired";
  expiryDate: string;
  frozenUntil?: string;
  price: number;
  daysLeft: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "success" | "failed" | "pending";
  method: string;
  clubName: string;
  description: string;
}

interface AttendanceRecord {
  date: string;
  attended: boolean;
  sessionType: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState<string | null>(null);
  const [selectedPaymentClub, setSelectedPaymentClub] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [userName, setUserName] = useState("Alex Chen");
  const [freezeStartDate, setFreezeStartDate] = useState("");
  const [showFullAttendance, setShowFullAttendance] = useState(false);
  const [showFullPayments, setShowFullPayments] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  // Sample data
  const userData = {
    name: "Alex Chen",
    phone: "+1 (555) 123-4567",
    avatar: "AC",
    isFirstTimeUser: true,
  };

  const memberships: Membership[] = [
    {
      id: "1",
      clubName: "Elite Martial Arts",
      section: "Advanced Karate",
      type: "group",
      status: "active",
      expiryDate: "2025-05-30",
      price: 25000,
      daysLeft: 6,
    },
    {
      id: "2",
      clubName: "Downtown Boxing",
      section: "Personal Training",
      type: "personal",
      status: "frozen",
      expiryDate: "2025-06-15",
      frozenUntil: "2025-06-01",
      price: 200,
      daysLeft: 22,
    },
    {
      id: "3",
      clubName: "Fitness Center",
      section: "Group Fitness",
      type: "group",
      status: "expired",
      expiryDate: "2025-05-20",
      price: 80,
      daysLeft: -4,
    },
  ];

  const payments: Payment[] = [
    {
      id: "1",
      date: "2025-05-15",
      amount: 250000,
      status: "success",
      method: "Credit Card",
      clubName: "Elite Martial Arts",
      description: "Monthly membership",
    },
    {
      id: "2",
      date: "2025-05-10",
      amount: 200,
      status: "success",
      method: "Bank Transfer",
      clubName: "Downtown Boxing",
      description: "Personal training package",
    },
    {
      id: "3",
      date: "2025-05-01",
      amount: 80,
      status: "failed",
      method: "Credit Card",
      clubName: "Fitness Center",
      description: "Monthly membership",
    },
    {
      id: "4",
      date: "2025-04-15",
      amount: 25000,
      status: "success",
      method: "Credit Card",
      clubName: "Elite Martial Arts",
      description: "Monthly membership",
    },
    {
      id: "5",
      date: "2025-04-10",
      amount: 200,
      status: "success",
      method: "PayPal",
      clubName: "Downtown Boxing",
      description: "Personal training package",
    },
    {
      id: "6",
      date: "2025-04-01",
      amount: 80,
      status: "success",
      method: "Bank Transfer",
      clubName: "Fitness Center",
      description: "Monthly membership",
    },
    {
      id: "7",
      date: "2025-03-15",
      amount: 25000,
      status: "success",
      method: "Credit Card",
      clubName: "Elite Martial Arts",
      description: "Monthly membership",
    },
    {
      id: "8",
      date: "2025-03-10",
      amount: 200,
      status: "pending",
      method: "Bank Transfer",
      clubName: "Downtown Boxing",
      description: "Personal training package",
    },
  ];

  const attendanceHistory: AttendanceRecord[] = [
    { date: "2025-05-23", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-21", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-19", attended: false, sessionType: "Karate Class" },
    { date: "2025-05-16", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-14", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-12", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-09", attended: false, sessionType: "Karate Class" },
    { date: "2025-05-07", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-05", attended: true, sessionType: "Karate Class" },
    { date: "2025-05-02", attended: true, sessionType: "Karate Class" },
    { date: "2025-04-30", attended: false, sessionType: "Karate Class" },
    { date: "2025-04-28", attended: true, sessionType: "Karate Class" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "frozen":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "expired":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-emerald-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle size={16} />;
      case "failed":
        return <XCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KZT",
    }).format(amount);
  };

  const isExpiringSoon = (daysLeft: number) => {
    return daysLeft <= 7 && daysLeft > 0;
  };

  const handleFreeze = (membershipId: string) => {
    console.log("Freezing membership:", membershipId, freezeStartDate);
    setShowFreezeModal(null);
    setFreezeStartDate("");
  };

  const handleUnfreeze = (membershipId: string) => {
    console.log("Unfreezing membership:", membershipId);
  };

  const handlePayment = (membershipId: string) => {
    console.log("Processing payment for membership:", membershipId);
  };

  const filteredPayments =
    selectedPaymentClub === "all"
      ? payments
      : payments.filter((p) => p.clubName === selectedPaymentClub);

  const attendanceRate =
    (attendanceHistory.filter((a) => a.attended).length /
      attendanceHistory.length) *
    100;

  const uniqueClubs = [...new Set(payments.map((p) => p.clubName))];

  return (
    <>
      <div className="min-h-screen bg-gray-100 pb-30">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">My profile</h1>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* First Time User Banner */}
          {userData.isFirstTimeUser && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                <Gift size={60} className="text-white/20" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Star
                    size={20}
                    className="text-yellow-300"
                    fill="currentColor"
                  />
                  <span className="font-semibold">First Time Bonus!</span>
                </div>
                <p className="text-sm text-purple-100 mb-3">
                  Get 20% off your next payment when you pay online for the
                  first time!
                </p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                  Claim Discount
                </button>
              </div>
            </div>
          )}

          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {userData.avatar}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">
                    {userName}
                  </h2>
                )}
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Phone size={16} />
                  <span>{userData.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 size={20} />
              </button>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    console.log("Saving:", userName);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUserName(userData.name);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Memberships Carousel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                My Memberships
              </h3>
              <div className="flex gap-1">
                {memberships.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-gray-300 rounded-full"
                  />
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <div
                className="flex gap-4 pb-2"
                style={{ width: `${memberships.length * 300}px` }}
              >
                {memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className={`min-w-80 bg-white rounded-2xl border-2 transition-all ${
                      isExpiringSoon(membership.daysLeft)
                        ? "border-amber-300 bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Expiring Soon Animation */}
                    {isExpiringSoon(membership.daysLeft) && (
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-t-2xl">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="animate-pulse" />
                          <span className="font-medium text-sm">
                            Expires in {membership.daysLeft} days!
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {membership.clubName}
                          </h4>
                          <p className="text-gray-600">{membership.section}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-500 capitalize">
                              {membership.type} training
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              Expires {formatDate(membership.expiryDate)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            membership.status
                          )}`}
                        >
                          {membership.status.charAt(0).toUpperCase() +
                            membership.status.slice(1)}
                        </span>
                      </div>

                      {membership.status === "frozen" &&
                        membership.frozenUntil && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-blue-700">
                              <Pause size={16} />
                              <span className="text-sm font-medium">
                                Frozen until{" "}
                                {formatDate(membership.frozenUntil)}
                              </span>
                            </div>
                          </div>
                        )}

                      <div className="flex gap-3">
                        {(membership.status === "expired" ||
                          isExpiringSoon(membership.daysLeft)) && (
                          <button
                            onClick={() => handlePayment(membership.id)}
                            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <CreditCard size={18} />
                            Pay with Kaspi {formatCurrency(membership.price)}
                          </button>
                        )}

                        {membership.status === "active" && (
                          <button
                            onClick={() => setShowFreezeModal(membership.id)}
                            className="px-4 py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                          >
                            <Pause size={18} />
                            Freeze
                          </button>
                        )}

                        {membership.status === "frozen" && (
                          <button
                            onClick={() => handleUnfreeze(membership.id)}
                            className="px-4 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-medium hover:bg-emerald-200 transition-colors flex items-center gap-2"
                          >
                            <Play size={18} />
                            Unfreeze
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-2xl px-6 pt-6 pb-2 border border-gray-200">
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => setIsAttendanceOpen((open) => !open)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Attendance Rate
                  </h3>
                  <p className="text-sm text-gray-600">
                    {showFullAttendance ? "All time" : "Last 5 sessions"}
                  </p>
                </div>
              </div>
              {/* 3. Arrow toggles direction */}
              {isAttendanceOpen ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>

            {/* 4. Only render the details if open */}
            {isAttendanceOpen && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-emerald-600">
                    {attendanceRate.toFixed(0)}%
                  </div>
                  <button
                    onClick={() => setShowFullAttendance(!showFullAttendance)}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                  >
                    {showFullAttendance ? "Show Less" : "View All"}
                  </button>
                </div>
                <div className="space-y-2">
                  {(showFullAttendance
                    ? attendanceHistory
                    : attendanceHistory.slice(0, 5)
                  ).map((record, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            record.attended
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {record.attended ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatDate(record.date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {record.sessionType}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          record.attended ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {record.attended ? "Attended" : "Missed"}
                      </span>
                    </div>
                  ))}
                </div>
                {showFullAttendance && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {attendanceHistory.filter((a) => a.attended).length}
                        </div>
                        <div className="text-sm text-gray-600">Attended</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {attendanceHistory.filter((a) => !a.attended).length}
                        </div>
                        <div className="text-sm text-gray-600">Missed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {attendanceHistory.length}
                        </div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl px-6 pt-6 pb-3 border border-gray-200">
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => setIsPaymentsOpen((open) => !open)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Payment History
                  </h3>
                  <p className="text-sm text-gray-600">
                    {showFullPayments ? "All payments" : "Recent payments"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {showFullPayments && uniqueClubs.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                      value={selectedPaymentClub}
                      onChange={(e) => setSelectedPaymentClub(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Clubs</option>
                      {uniqueClubs.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  onClick={() => setShowFullPayments(!showFullPayments)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {showFullPayments ? "Show Less" : "View All"}
                </button>
              </div>
              {isPaymentsOpen ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>

            {isPaymentsOpen && (
              <>
                <div className="space-y-3">
                  {(showFullPayments
                    ? filteredPayments
                    : filteredPayments.slice(0, 3)
                  ).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`${getPaymentStatusColor(payment.status)}`}
                        >
                          {getPaymentStatusIcon(payment.status)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {payment.clubName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(payment.date)} • {payment.method}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium ${getPaymentStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>

                {showFullPayments && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-emerald-600">
                          {formatCurrency(
                            filteredPayments
                              .filter((p) => p.status === "success")
                              .reduce((sum, p) => sum + p.amount, 0)
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Total Paid</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {
                            filteredPayments.filter(
                              (p) => p.status === "success"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600">Successful</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">
                          {
                            filteredPayments.filter(
                              (p) => p.status === "failed"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Settings</h3>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Notifications
                    </div>
                    <div className="text-sm text-gray-600">
                      Membership & payment alerts
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            </div>

            {/* Language */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Language</div>
                    <div className="text-sm text-gray-600">
                      App interface language
                    </div>
                  </div>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="EN">English</option>
                  <option value="RU">Русский</option>
                  <option value="KZ">Қазақша</option>
                </select>
              </div>
            </div>

            {/* Delete */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <DeleteIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Покинуть клуб</div>
                    <div className="text-sm text-gray-600">
                      Finish membership
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support & Legal */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Contact Support
                  </div>
                  <div className="text-sm text-gray-600">
                    Get help with your account
                  </div>
                </div>
              </button>

              <div className="border-t border-gray-100">
                <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      Privacy Policy
                    </div>
                    <div className="text-sm text-gray-600">
                      How we protect your data
                    </div>
                  </div>
                </button>
              </div>

              <div className="border-t border-gray-100">
                <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      Terms of Service
                    </div>
                    <div className="text-sm text-gray-600">App usage terms</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Freeze Modal */}
        {showFreezeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white w-full max-h-[70vh] rounded-t-3xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Freeze Membership
                  </h2>
                  <button
                    onClick={() => setShowFreezeModal(null)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Pause size={20} />
                    <span className="font-medium">Temporary Freeze</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    You can freeze your membership for up to 30 days. Your
                    expiry date will be extended accordingly.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={freezeStartDate}
                    onChange={(e) => setFreezeStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={
                      freezeStartDate || new Date().toISOString().split("T")[0]
                    }
                    className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => handleFreeze(showFreezeModal)}
                  disabled={!freezeStartDate}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Freeze Membership
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <nav className="h-20 bg-white shadow-t flex justify-around items-center fixed bottom-0 z-10 w-full">
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
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/stats")}
        >
          <BarChart2 size={20} />
          <span className="text-xs">Stats</span>
        </button>
        <button
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/profile")}
        >
          <User size={20} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </>
  );
};

export default ProfilePage;
