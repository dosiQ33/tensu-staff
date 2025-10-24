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
  Activity,
  Clock,
  BarChart3,
  PieChart,
  Edit2,
  ChevronRight,
  FileText,
  Globe,
  Mail,
  Check,
  MapPin,
  Building2,
} from "lucide-react";
import {
  clubsApi,
  invitationsApi,
  staffApi,
  sectionsApi,
  groupsApi,
} from "@/functions/axios/axiosFunctions";
import { CreateClubModal } from "./components/CreateClubModal";
import type {
  ClubWithRole,
  GetClubsLimitCheckResponse,
  Invitation,
} from "@/functions/axios/responses";
import { BottomNav } from "@/components/Layout";
import type { Club } from "@/types/types";
import { Spinner, Skeleton, SkeletonLine } from "@/components/ui";
import { useI18n } from "@/i18n/i18n";
import { MembershipConfigurator } from "./components/MembershipConfigurator";

const CoachProfile: React.FC = () => {
  const { t, lang, setLang } = useI18n();
  const [showLangSheet, setShowLangSheet] = useState(false);
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
  const [selectedClubTab, setSelectedClubTab] = useState<"analytics" | "membership">("analytics");
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [clubSectionsOverview, setClubSectionsOverview] = useState
    Array<{ sectionId: number; sectionName: string; groups: Array<{ id: number; name: string }> }>
  >([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitInfo, setLimitInfo] = useState<GetClubsLimitCheckResponse | null>(null);

  const initialName = localStorage.getItem("telegramFullName") || "";
  const [name, setName] = useState(initialName);
  const [phone] = useState(localStorage.getItem("telegramPhone") || "");
  const [avatar] = useState(localStorage.getItem("telegramAvatar") || "");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialName);
  const [isSavingName, setIsSavingName] = useState(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [loadingClubs, setLoadingClubs] = useState<boolean>(false);

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
    try {
      const formatted = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "KZT",
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      }).format(amount);
      if (/KZT/i.test(formatted)) {
        const numberPart = amount.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
        return `${numberPart} \u00A0₸`;
      }
      return formatted.replace(/KZT/gi, "₸");
    } catch {
      return `${amount.toLocaleString("ru-RU")} \u00A0₸`;
    }
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
  };

  useEffect(() => {
    const load = async () => {
      if (!selectedClub) return;
      setMembershipLoading(true);
      setClubSectionsOverview([]);
      try {
        const token = localStorage.getItem("telegramToken") || "";
        const clubIdNum = Number(selectedClub.id);
        if (!token || Number.isNaN(clubIdNum)) {
          setMembershipLoading(false);
          return;
        }
        const secRes = await sectionsApi.getByClubId(clubIdNum, token);
        const sections: Array<{ id: number; name: string }> = (secRes.data as unknown as Array<{
          id: number;
          name: string;
        }>) ?? [];
        const groupsLists = await Promise.all(
          sections.map((s) => groupsApi.getBySectionId(s.id, token).then((r) => ({ s, groups: r.data })))
        );
        const overview = groupsLists.map(({ s, groups }) => ({
          sectionId: s.id,
          sectionName: (s && typeof s.name === 'string') ? s.name : "Секция",
          groups: ((groups as unknown as Array<{ id: number; name: string }>) ?? []).map((g) => ({ id: g.id, name: g.name })),
        }));
        setClubSectionsOverview(overview);
      } catch (e) {
        console.warn("Не удалось загрузить секции/группы", e);
      } finally {
        setMembershipLoading(false);
      }
    };
    load();
  }, [selectedClub]);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSavingName(true);
    const parts = nameInput.trim().split(" ");
    const first_name = parts[0];
    const last_name = parts.slice(1).join(" ") || undefined;

    try {
      const token = localStorage.getItem("telegramToken")!;
      await staffApi.updateMe({ first_name, last_name }, token);
      const me = await staffApi.getMe(token);
      const apiName = `${me.data.first_name}${me.data.last_name ? " " + me.data.last_name : ""}`.trim();
      setName(apiName || nameInput);
      localStorage.setItem("telegramFullName", apiName || nameInput);
      setEditingName(false);
    } catch (err) {
      console.error("Не удалось сохранить имя:", err);
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
    setLoadingClubs(true);
    clubsApi
      .getMy(token)
      .then((res) => {
        setClubs(res.data.clubs.map(mapClub));
      })
      .catch(console.error)
      .finally(() => setLoadingClubs(false));
    invitationsApi
      .getMyPending(token)
      .then((res) => {
        if (res.data.invitations.length > 0) {
          setMyInvitations(res.data.invitations);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("telegramToken");
    if (!token) return;
    staffApi
      .getMe(token)
      .then((res) => {
        const apiName = `${res.data.first_name}${res.data.last_name ? " " + res.data.last_name : ""}`.trim();
        if (apiName) {
          setName(apiName);
          setNameInput(apiName);
          localStorage.setItem("telegramFullName", apiName);
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
            <h1 className="text-xl font-semibold text-gray-900">{t('profile.title')}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          {/* Limit Popup */}
          {showLimitPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="text-orange-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Лимит клубов достигнут
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Вы уже создали {limitInfo?.current_clubs} из {limitInfo?.max_clubs}.<br />
                  {limitInfo?.reason || "Обратитесь в поддержку для расширения лимита."}
                </p>
                <button
                  onClick={() => setShowLimitPopup(false)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Понятно
                </button>
              </div>
            </div>
          )}

          {/* Personal Info Card */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img className="w-16 h-16 rounded-full object-cover" src={avatar} alt="Avatar" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      disabled={isSavingName}
                      className="flex-1 border-b-2 border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 bg-transparent transition-colors"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <Check size={18} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(name);
                        setEditingName(false);
                      }}
                      disabled={isSavingName}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {name}
                    </h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-1">+{phone}</div>
              </div>
            </div>
          </div>

          {/* Create Club Modal */}
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('clubs.mine')} ({clubs.length + myInvitations.length})
              </h3>
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center gap-2"
              >
                <Building2 size={18} />
                {t('club.create')}
              </button>
            </div>

            {/* Loading State */}
            {loadingClubs && (
              <>
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="flex-1">
                          <SkeletonLine width="w-2/3" className="mb-2" />
                          <SkeletonLine width="w-1/2" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Clubs List */}
            {!loadingClubs && clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Club Header */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                        {club.logo || "🏢"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {club.name}
                        </h4>
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

                {/* Club Stats */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-700">
                          {t('stats.students')}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-800">
                        {club.students}
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        {club.studentGrowth >= 0 ? (
                          <TrendingUp className="text-green-600" size={12} />
                        ) : (
                          <TrendingDown className="text-red-600" size={12} />
                        )}
                        <span className={club.studentGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                          {club.studentGrowth > 0 ? "+" : ""}{club.studentGrowth} этот месяц
                        </span>
                      </div>
                    </div>

                    {club.userRole === "owner" && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-green-600 text-[16px] leading-none font-bold">₸</span>
                          <span className="text-sm font-medium text-green-700">
                            {t('stats.revenue')}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                          {formatCurrency(club.monthlyRevenue)}
                        </div>
                        <div className="text-xs text-green-600 mt-1">{t('stats.perMonth')}</div>
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

                  {/* Payment Info */}
                  {club.userRole === "owner" && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">
                            {club.plan} {t('plan.title')}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            club.paymentStatus
                          )}`}
                        >
                          {club.paymentStatus.charAt(0).toUpperCase() + club.paymentStatus.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {t('payment.next')}: {formatDate(club.nextPayment)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowPaymentHistory(club.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            {t('payment.history')}
                          </button>
                          <button
                            onClick={() => handlePayment(club.id)}
                            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                              club.paymentStatus === "paid"
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : club.paymentStatus === "pending"
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          >
                            {t(`payment.action.${getPaymentAction(club.paymentStatus).toLowerCase().replace(' ', '')}`)}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Invitations */}
            {myInvitations.length > 0 && (
              <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-orange-600" size={20} />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {t('invite.title')} ({myInvitations.length})
                  </h4>
                </div>
                <ul className="space-y-3">
                  {myInvitations.map((invitation) => (
                    <li
                      key={invitation.id}
                      className="p-4 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getRoleIcon(invitation.role)}
                            <span className="font-semibold text-gray-900">
                              {getRoleLabel(invitation.role)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            в клубе{" "}
                            <span className="font-semibold text-blue-600">
                              {invitation.club.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {invitation.phone_number}
                          </div>
                        </div>

                        {acceptDeclineLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptInvitation(invitation.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm shadow-sm"
                            >
                              {t('action.accept')}
                            </button>
                            <button
                              onClick={() => declineInvitation(invitation.id)}
                              className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                            >
                              {t('action.decline')}
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty State */}
            {!loadingClubs && clubs.length === 0 && myInvitations.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building2 className="text-gray-400" size={40} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-lg">Нет клубов</h4>
                <p className="text-sm text-gray-600 mb-6">
                  Создайте свой первый клуб для начала работы
                </p>
                <button
                  onClick={handleCreateClick}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  Создать первый клуб
                </button>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden border border-gray-200">
            {[
              {
                label: t('language.change'),
                icon: Globe,
                onClick: () => setShowLangSheet(true),
              },
              {
                label: "Политика конфиденциальности",
                icon: FileText,
                onClick: () => { window.location.href = '/privacy'; },
              },
              {
                label: "Напишите нам",
                icon: Mail,
                onClick: () => {
                  const tg = window.Telegram?.WebApp;
                  const mailto = 'mailto:support@tensu.kz';
                  if (tg && typeof tg.openLink === 'function') {
                    tg.openLink(mailto);
                  } else {
                    window.location.href = mailto;
                  }
                },
              },
            ].map(({ label, icon: Icon, onClick }, i, arr) => (
              <button
                key={label}
                onClick={onClick}
                className={`
                  w-full flex items-center justify-between p-4 
                  hover:bg-gray-50 transition-colors
                  ${i !== arr.length - 1 ? "border-b border-gray-100" : ""}
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

        {/* Club Details Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedClub.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(selectedClub.userRole)}
                      <span className="text-sm text-gray-600">
                        {getRoleLabel(selectedClub.userRole)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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

              <div className="overflow-y-auto p-4 space-y-6" style={{ maxHeight: 'calc(90vh - 160px)' }}>
                {selectedClubTab === "analytics" && (
                  <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="text-blue-600" size={18} />
                          <span className="text-sm font-medium text-blue-700">
                            Студенты
                          </span>
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
                          <span className="text-green-600 text-[18px] leading-none font-bold">₸</span>
                          <span className="text-sm font-medium text-green-700">
                            Доход
                          </span>
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
                          <span className="text-sm font-medium text-purple-700">
                            Тренировки
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-purple-800 mb-1">
                          {selectedClub.analytics.totalWorkouts}
                        </div>
                        <div className="text-xs text-purple-600">Этот месяц</div>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-orange-600" size={18} />
                          <span className="text-sm font-medium text-orange-700">
                            Пик
                          </span>
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
                        <h3 className="font-semibold text-gray-900">
                          Доход по месяцам
                        </h3>
                      </div>
                      <div className="flex items-end justify-between h-32 gap-2">
                        {selectedClub.analytics.revenueHistory.map((item, index) => {
                          const maxRevenue = Math.max(
                            ...selectedClub.analytics.revenueHistory.map((r) => r.amount)
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
                              <div className="text-xs text-gray-500 mt-1">
                                {item.month}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Student Growth */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-gray-700" size={20} />
                        <h3 className="font-semibold text-gray-900">
                          Прирост студентов
                        </h3>
                      </div>
                      <div className="flex items-end justify-between h-24 gap-2">
                        {selectedClub.analytics.studentHistory.map((item, index) => {
                          const maxStudents = Math.max(
                            ...selectedClub.analytics.studentHistory.map((s) => s.count)
                          );
                          const height = (item.count / maxStudents) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="text-xs text-gray-600 mb-1">
                                {item.count}
                              </div>
                              <div
                                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                                style={{ height: `${height}%` }}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {item.month}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section Distribution */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <PieChart className="text-gray-700" size={20} />
                        <h3 className="font-semibold text-gray-900">
                          Распределение по секциям
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {selectedClub.analytics.sectionDistribution.map((section, index) => {
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
                  <div className="space-y-4">
                    {membershipLoading ? (
                      <div className="text-center py-8">
                        <Spinner size="lg" />
                        <div className="text-sm text-gray-600 mt-3">
                          Загрузка секций и групп...
                        </div>
                      </div>
                    ) : (
                      <MembershipConfigurator
                        clubId={selectedClub.id}
                        sections={clubSectionsOverview}
                      />
                    )}
                  </div>
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    История платежей
                  </h2>
                  <button
                    onClick={() => setShowPaymentHistory(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Language Sheet */}
        {showLangSheet && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowLangSheet(false)}
            />
            <div
              className="bg-white w-full rounded-t-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">{t('language.change')}</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setLang('ru');
                    setShowLangSheet(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    lang === 'ru'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t('language.russian')}
                </button>
                <button
                  onClick={() => {
                    setLang('kk');
                    setShowLangSheet(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    lang === 'kk'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t('language.kazakh')}
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
