import React, { useEffect, useState } from "react";
import {
  User,
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
  Check,
  Edit2,
  ChevronRight,
  FileText,
  Globe,
  Mail,
} from "lucide-react";
import {
  clubsApi,
  invitationsApi,
  staffApi,
} from "@/functions/axios/axiosFunctions";
import { CreateClubModal } from "./components/CreateClubModal";
import type {
  ClubWithRole,
  GetClubsLimitCheckResponse,
  Invitation,
} from "@/functions/axios/responses";
import { BottomNav } from "@/components/Layout";
import type { Club } from "@/types/types";
import { Spinner } from "@/components/ui";

const CoachProfile: React.FC = () => {
  const refresh = () => window.location.reload();
  const mapClub = ({ club: c, role }: ClubWithRole): Club => ({
    id: c.id.toString(),
    name: c.name,
    logo: c.logo_url,
    userRole: role,
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
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [acceptDeclineLoading, setAcceptDeclineLoading] = useState(false);

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(
    null
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitInfo, setLimitInfo] = useState<GetClubsLimitCheckResponse | null>(
    null
  );

  const initialName = localStorage.getItem("telegramFullName") || "";
  const [name, setName] = useState(initialName);
  const [phone] = useState(localStorage.getItem("telegramPhone") || "");
  const [avatar] = useState(localStorage.getItem("telegramAvatar") || "");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialName);
  const [isSavingName, setIsSavingName] = useState(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="text-yellow-600" size={16} />;
      case "admin":
        return <Shield className="text-purple-600" size={16} />;
      case "coach":
        return <User className="text-blue-600" size={16} />;
      case "pending":
        return <Clock className="text-orange-600" size={16} />;
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
      case "pending":
        return "В ожидании";
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

  const handlePayment = (clubId: string) => {
    console.log("Processing payment for club:", clubId);
    // In real app, this would open payment flow
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSavingName(true);
    const parts = nameInput.trim().split(" ");
    const first_name = parts[0];
    const last_name = parts.slice(1).join(" ") || undefined;

    try {
      const token = localStorage.getItem("telegramToken")!;
      await staffApi.updateMe({ first_name, last_name }, token);
      console.log("First name updated successfully:", first_name, last_name);
      // после успешного ответа
      setName(nameInput);
      localStorage.setItem("telegramFullName", nameInput);
      setEditingName(false);
    } catch (err) {
      console.error("Не удалось сохранить имя:", err);
      // можно показать toast или ошибку пользователю
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCreateClick = async () => {
    try {
      const token = localStorage.getItem("telegramToken")!;
      const res = await clubsApi.getLimitsCheck(token);
      setLimitInfo(res.data);
      if (res.data.can_create) {
        setShowCreate(true);
      } else {
        setShowLimitPopup(true);
      }
    } catch (e) {
      console.error("Ошибка проверки лимита клубов", e);
    }
  };

  const acceptInvitation = async (invitationId: number) => {
    try {
      setAcceptDeclineLoading(true);
      const token = localStorage.getItem("telegramToken")!;
      await invitationsApi.accept(invitationId, token);
      setAcceptDeclineLoading(false);

      refresh();
    } catch (e) {
      setAcceptDeclineLoading(false);
      console.error("Ошибка принятия приглашения", e);
    }
  };

  const declineInvitation = async (invitationId: number) => {
    try {
      setAcceptDeclineLoading(true);
      const token = localStorage.getItem("telegramToken")!;
      await invitationsApi.decline(invitationId, token);
      setAcceptDeclineLoading(false);
      refresh();
    } catch (e) {
      setAcceptDeclineLoading(false);
      console.error("Ошибка отклонения приглашения", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("telegramToken")!;
    clubsApi
      .getMy(token)
      .then((res) => {
        setClubs(res.data.clubs.map(mapClub));
      })
      .catch(console.error);
    invitationsApi
      .getMyPending(token)
      .then((res) => {
        if (res.data.invitations.length > 0) {
          setMyInvitations(res.data.invitations);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="bg-gray-50 pb-30 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Профиль</h1>
          </div>
        </div>

        {/* Personal Info */}
        <div className="px-4 py-4">
          {/* попап о превышении лимита */}
          {showLimitPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-lg text-center">
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  Лимит клубов достигнут
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Вы уже создали {limitInfo?.current_clubs} из{" "}
                  {limitInfo?.max_clubs}.<br />
                  {limitInfo?.reason ||
                    "Обратитесь в поддержку для расширения лимита."}
                </p>
                <button
                  onClick={() => setShowLimitPopup(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img className="w-10 h-10 rounded-full" src={avatar} />
              ) : (
                <div className="text-4xl">👤</div>
              )}

              <div className="flex-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      disabled={isSavingName}
                      className="border-b border-gray-300 focus:border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 mb-1 transition-colors"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="p-1 hover:bg-green-100 rounded-full"
                    >
                      <Check size={16} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(name);
                        setEditingName(false);
                      }}
                      disabled={isSavingName}
                      className="p-1 hover:bg-red-100 rounded-full"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {name}
                    </h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">+{phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600"
            >
              + Создать клуб
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
              Мои Клубы ({clubs.length + myInvitations.length})
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
                      Детали
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
                          {club.studentGrowth} этот месяц
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
                      <div className="text-sm text-green-600">Помесячно</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    {club.sections} секции • Пик часов:{" "}
                    {club.analytics.peakHours}
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-gray-600" size={16} />
                        <span className="text-sm font-medium text-gray-700">
                          {club.plan} План
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
                        Следующая оплата: {formatDate(club.nextPayment)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPaymentHistory(club.id)}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          История
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
            {myInvitations.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Приглашения ({myInvitations.length})
                </h4>
                <ul className="space-y-3">
                  {myInvitations.map((invitation) => (
                    <li
                      key={invitation.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invitation.phone_number}
                        </div>
                        <div className="text-xs text-gray-600">
                          Роль:{" "}
                          <span className="font-bold text-blue-500">
                            {getRoleLabel(invitation.role)}
                          </span>{" "}
                          в клубе{" "}
                          <span className="font-bold text-blue-500">
                            {getRoleLabel(invitation.club.name)}
                          </span>
                        </div>
                      </div>
                      {acceptDeclineLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              acceptInvitation(invitation.id);
                            }}
                            className="px-3 ml-2 mr-2 py-1 text-xs font-bold pt-2 pb-2 pl-4 pr-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Принять
                          </button>
                          <button
                            onClick={() => {
                              declineInvitation(invitation.id);
                            }}
                            className="px-3 py-1 text-xs bg-transparent-500 font-bold pt-2 pb-2 pl-4 pr-4 text-red-700 rounded hover:bg-blue-600 transition-colors "
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Club Analytics Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedClub.name} Аналитика
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
                        Общее количество студентов
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {selectedClub.analytics.totalStudents}
                    </div>
                    <div className="text-xs text-blue-600">
                      +{selectedClub.analytics.newStudents} новые, -
                      {selectedClub.analytics.lostStudents} ушли
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="text-sm font-medium text-green-700">
                        Недельный Доход
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(selectedClub.analytics.weeklyRevenue)}
                    </div>
                    <div className="text-xs text-green-600">
                      Средний чек:{" "}
                      {formatCurrency(selectedClub.analytics.averageTicket)}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="text-purple-600" size={16} />
                      <span className="text-sm font-medium text-purple-700">
                        Тренировки
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      {selectedClub.analytics.totalWorkouts}
                    </div>
                    <div className="text-xs text-purple-600">Этот месяц</div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-orange-600" size={16} />
                      <span className="text-sm font-medium text-orange-700">
                        Пиковые Часы
                      </span>
                    </div>
                    <div className="text-xl font-bold text-orange-800">
                      {selectedClub.analytics.peakHours}
                    </div>
                    <div className="text-xs text-orange-600">
                      Загруженные дни
                    </div>
                  </div>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="text-gray-600" size={18} />
                    <h3 className="font-semibold text-gray-900">
                      Доход по месяцам
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
                      Прирост Студентов
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
                      Распределение по Секциям
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
          <div className="fixed inset-0 bg-gray-50 bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[70vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    История Платежей
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
        <div className="bg-white rounded-2xl shadow-md relative mt-2 overflow-visible">
          {[
            {
              label: "Сменить язык",
              icon: Globe,
              onClick: () => {
                /*…*/
              },
            },
            {
              label: "Политика конфиденциальности",
              icon: FileText,
              onClick: () => {
                /*…*/
              },
            },
            {
              label: "Напишите нам",
              icon: Mail,
              onClick: () => {
                /*…*/
              },
            },
          ].map(({ label, icon: Icon, onClick }, i, arr) => (
            <button
              key={label}
              onClick={onClick}
              className={`
            w-full flex items-center justify-between p-4 
            hover:bg-gray-50 transition-colors border-gray-300 border-b-1 last:border-b-0
            ${i === 0 ? "rounded-t-2xl" : ""}
            ${i === arr.length - 1 ? "rounded-b-2xl" : ""}
          `}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-blue-500" size={20} />
                <span className="text-base font-medium text-gray-800">
                  {label}
                </span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          ))}
        </div>
      </div>

      <BottomNav page="profile" />
    </>
  );
};

export default CoachProfile;
