import React, { useState } from 'react';
import {
  User, Crown, Shield, Users, TrendingUp, TrendingDown, CreditCard, Eye, X,
  Activity, Clock, BarChart3, PieChart, Edit2, ChevronRight, FileText, Globe,
  Mail, Check, Building2
} from 'lucide-react';
import { CreateClubModal } from './components/CreateClubModal';
import { MembershipConfigurator } from './components/MembershipConfigurator';
import { BottomNav } from '@/components/Layout';

// MOCK DATA
const mockUser = {
  name: "Асет Нурланов",
  phone: "7011234567",
  avatar: null,
};

const mockClubsData = [
  {
    id: "1",
    name: "Bars Checkmat",
    logo: "🥋",
    userRole: "owner",
    sections: 3,
    students: 45,
    monthlyRevenue: 2500000,
    studentGrowth: 8,
    plan: "Premium",
    nextPayment: "2025-11-15",
    paymentStatus: "paid",
    analytics: {
      totalStudents: 45,
      newStudents: 8,
      lostStudents: 2,
      weeklyRevenue: 625000,
      averageTicket: 50000,
      totalWorkouts: 156,
      peakHours: "18:00-20:00",
      revenueHistory: [
        { month: "Июл", amount: 2000000 },
        { month: "Авг", amount: 2300000 },
        { month: "Сен", amount: 2500000 },
        { month: "Окт", amount: 2500000 },
      ],
      studentHistory: [
        { month: "Июл", count: 32 },
        { month: "Авг", count: 37 },
        { month: "Сен", count: 42 },
        { month: "Окт", count: 45 },
      ],
      sectionDistribution: [
        { name: "BJJ", count: 25, color: "bg-blue-500" },
        { name: "Бокс", count: 12, color: "bg-green-500" },
        { name: "MMA", count: 8, color: "bg-purple-500" },
      ],
    },
    paymentHistory: [
      { date: "2025-10-15", amount: 50000, method: "Kaspi", status: "Paid" },
      { date: "2025-09-15", amount: 50000, method: "Kaspi", status: "Paid" },
    ],
  },
  {
    id: "2",
    name: "Fight Academy",
    logo: "🥊",
    userRole: "coach",
    sections: 1,
    students: 18,
    monthlyRevenue: 0,
    studentGrowth: 3,
    plan: "Basic",
    nextPayment: "",
    paymentStatus: "pending",
    analytics: {
      totalStudents: 18,
      newStudents: 3,
      lostStudents: 1,
      weeklyRevenue: 0,
      averageTicket: 0,
      totalWorkouts: 72,
      peakHours: "19:00-21:00",
      revenueHistory: [],
      studentHistory: [],
      sectionDistribution: [],
    },
    paymentHistory: [],
  },
];

const mockInvitationsData = [
  {
    id: 1,
    phone_number: "+77012345678",
    role: "coach",
    club: { name: "Titan Gym" },
  },
];

const mockSectionsOverview = [
  {
    sectionId: 1,
    sectionName: "BJJ",
    groups: [
      { id: 1, name: "Начинающие" },
      { id: 2, name: "Продвинутые" },
    ],
  },
  {
    sectionId: 2,
    sectionName: "Бокс",
    groups: [
      { id: 3, name: "Детская группа" },
    ],
  },
];

const CoachProfile: React.FC = () => {
  const [name, setName] = useState(mockUser.name);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(mockUser.name);
  const [clubs, setClubs] = useState(mockClubsData);
  const [invitations, setInvitations] = useState(mockInvitationsData);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [selectedClubTab, setSelectedClubTab] = useState<"analytics" | "membership">("analytics");
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(null);
  const [showLangSheet, setShowLangSheet] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [lang, setLang] = useState("ru");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU").format(amount) + " ₸";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
    switch (role) {
      case "admin":
        return "Администратор";
      case "coach":
        return "Тренер";
      case "owner":
        return "Владелец";
      default:
        return role;
    }
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

  const handleCreateClub = (data: any) => {
    const newClub = {
      id: String(Date.now()),
      name: data.name,
      logo: "🏢",
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
    setClubs([...clubs, newClub]);
    setShowCreateClub(false);
  };

  const acceptInvitation = (invitationId: number) => {
    setInvitations(invitations.filter((i) => i.id !== invitationId));
  };

  const declineInvitation = (invitationId: number) => {
    setInvitations(invitations.filter((i) => i.id !== invitationId));
  };

  return (
    <>
      <div className="bg-gray-50 pb-30 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Профиль</h1>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Personal Info Card - БЕЗ РОЛИ */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold shadow-sm">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="flex-1 border-b-2 border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 bg-transparent"
                    />
                    <button
                      onClick={() => {
                        setName(nameInput);
                        setEditingName(false);
                      }}
                      className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <Check size={18} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(name);
                        setEditingName(false);
                      }}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-1">+{mockUser.phone}</div>
              </div>
            </div>
          </div>

          {/* Create Club Modal */}
          <CreateClubModal
            show={showCreateClub}
            onClose={() => setShowCreateClub(false)}
            onSubmit={handleCreateClub}
          />

          {/* Clubs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Мои клубы ({clubs.length + invitations.length})
              </h3>
              <button
                onClick={() => setShowCreateClub(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center gap-2"
              >
                <Building2 size={18} />
                Создать
              </button>
            </div>

            {/* Clubs List - С РОЛЯМИ В КАРТОЧКАХ */}
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                        {club.logo}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{club.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleIcon(club.userRole)}
                          <span className="text-sm text-gray-600 font-medium">
                            {getRoleLabel(club.userRole)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedClub(club)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm font-medium"
                    >
                      <Eye size={16} />
                      Детали
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-700">Студенты</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-800">{club.students}</div>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <TrendingUp className="text-green-600" size={12} />
                        <span className="text-green-600">+{club.studentGrowth} этот месяц</span>
                      </div>
                    </div>

                    {club.userRole === "owner" && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-green-600 text-[16px] font-bold">₸</span>
                          <span className="text-sm font-medium text-green-700">Доход</span>
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                          {formatCurrency(club.monthlyRevenue)}
                        </div>
                        <div className="text-xs text-green-600 mt-1">в месяц</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Activity size={14} />
                    <span>{club.sections} секции</span>
                    <span>•</span>
                    <Clock size={14} />
                    <span>Пик: {club.analytics.peakHours}</span>
                  </div>

                  {club.userRole === "owner" && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">{club.plan} план</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            club.paymentStatus
                          )}`}
                        >
                          {club.paymentStatus === "paid" ? "Оплачен" : "Ожидает"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          След. платёж: {formatDate(club.nextPayment)}
                        </div>
                        <button
                          onClick={() => setShowPaymentHistory(club.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          История
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Invitations - С ФУНКЦИОНАЛОМ */}
            {invitations.length > 0 && (
              <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-orange-600" size={20} />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Приглашения ({invitations.length})
                  </h4>
                </div>
                <ul className="space-y-3">
                  {invitations.map((inv) => (
                    <li key={inv.id} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getRoleIcon(inv.role)}
                            <span className="font-semibold text-gray-900">
                              {getRoleLabel(inv.role)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            в клубе <span className="font-semibold text-blue-600">{inv.club.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{inv.phone_number}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptInvitation(inv.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm shadow-sm"
                          >
                            Принять
                          </button>
                          <button
                            onClick={() => declineInvitation(inv.id)}
                            className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                          >
                            Отклонить
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            {[
              { label: "Изменить язык", icon: Globe, onClick: () => setShowLangSheet(true) },
              { label: "Политика конфиденциальности", icon: FileText, onClick: () => {} },
              { label: "Напишите нам", icon: Mail, onClick: () => {} },
            ].map(({ label, icon: Icon, onClick }, i, arr) => (
              <button
                key={label}
                onClick={onClick}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  i !== arr.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-blue-500" size={20} />
                  <span className="text-base font-medium text-gray-800">{label}</span>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
            ))}
          </div>
        </div>

        {/* Club Details Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedClub.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(selectedClub.userRole)}
                      <span className="text-sm text-gray-600">{getRoleLabel(selectedClub.userRole)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedClubTab("analytics")}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      selectedClubTab === "analytics"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Аналитика
                  </button>
                  <button
                    onClick={() => setSelectedClubTab("membership")}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      selectedClubTab === "membership"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Membership
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-6" style={{ maxHeight: "calc(90vh - 160px)" }}>
                {selectedClubTab === "analytics" && (
                  <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="text-blue-600" size={18} />
                          <span className="text-sm font-medium text-blue-700">Студенты</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-800 mb-1">
                          {selectedClub.analytics.totalStudents}
                        </div>
                        <div className="text-xs text-blue-600">
                          +{selectedClub.analytics.newStudents} новые • -
                          {selectedClub.analytics.lostStudents} ушли
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 text-[18px] font-bold">₸</span>
                          <span className="text-sm font-medium text-green-700">Доход</span>
                        </div>
                        <div className="text-2xl font-bold text-green-800 mb-1">
                          {formatCurrency(selectedClub.analytics.weeklyRevenue)}
                        </div>
                        <div className="text-xs text-green-600">
                          Средний чек: {formatCurrency(selectedClub.analytics.averageTicket)}
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="text-purple-600" size={18} />
                          <span className="text-sm font-medium text-purple-700">Тренировки</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-800 mb-1">
                          {selectedClub.analytics.totalWorkouts}
                        </div>
                        <div className="text-xs text-purple-600">Этот месяц</div>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-orange-600" size={18} />
                          <span className="text-sm font-medium text-orange-700">Пик</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-800 mb-1">
                          {selectedClub.analytics.peakHours}
                        </div>
                        <div className="text-xs text-orange-600">Загруженные часы</div>
                      </div>
                    </div>

                    {/* Revenue Trend */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="text-gray-700" size={20} />
                        <h3 className="font-semibold text-gray-900">Доход по месяцам</h3>
                      </div>
                      <div className="flex items-end justify-between h-32 gap-2">
                        {selectedClub.analytics.revenueHistory.map((item: any, index: number) => {
                          const maxRevenue = Math.max(
                            ...selectedClub.analytics.revenueHistory.map((r: any) => r.amount)
                          );
                          const height = (item.amount / maxRevenue) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="text-xs text-gray-600 mb-1">
                                {formatCurrency(item.amount / 1000)}k
                              </div>
                              <div
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                                style={{ height: `${height}%` }}
                              />
                              <div className="text-xs text-gray-500 mt-1">{item.month}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section Distribution */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <PieChart className="text-gray-700" size={20} />
                        <h3 className="font-semibold text-gray-900">Распределение по секциям</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedClub.analytics.sectionDistribution.map((section: any, index: number) => {
                          const percentage =
                            (section.count / selectedClub.analytics.totalStudents) * 100;
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded ${section.color}`} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {section.name}
                                  </span>
                                  <span className="text-sm text-gray-600 font-medium">
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
                        })}
                      </div>
                    </div>
                  </>
                )}

                {selectedClubTab === "membership" && (
                  <MembershipConfigurator clubId={selectedClub.id} sections={mockSectionsOverview} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment History Modal */}
        {showPaymentHistory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[70vh] rounded-t-2xl overflow-hidden shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">История платежей</h2>
                  <button
                    onClick={() => setShowPaymentHistory(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
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
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {formatCurrency(payment.amount)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {formatDate(payment.date)} • {payment.method}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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

        {/* Language Sheet */}
        {showLangSheet && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowLangSheet(false)} />
            <div className="bg-white w-full rounded-t-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">Изменить язык</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setLang("ru");
                    setShowLangSheet(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    lang === "ru"
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Русский
                </button>
                <button
                  onClick={() => {
                    setLang("kk");
                    setShowLangSheet(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    lang === "kk"
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Қазақша
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav page="profile" />
    </>
  );
};

export default CoachProfile;
