// ManagementPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import TabNavigation from "./components/TabNavigation";
import StaffFilter from "./components/StaffFilter";
import StaffCard from "./components/StaffCard";
import AddStaffModal from "./components/AddStaffModal";
import AddSectionModal from "./components/AddSectionModal";
import type {
  Filters,
  NewStaff,
  NewSection,
  Staff,
  ScheduleEntry,
} from "@/types/types";
import { BottomNav } from "@/components/Layout";
import { Plus } from "lucide-react";
import {
  clubsApi,
  invitationsApi,
  sectionsApi,
} from "@/functions/axios/axiosFunctions";
import type { CreateStuffInvitationRequest } from "@/functions/axios/requests";
import type {
  CreateSectionResponse,
  CreateClubResponse,
  Invitation,
} from "@/functions/axios/responses";
import SectionCard from "./components/SectionCard";

const ManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "sections">("staff");
  const userFullName = localStorage.getItem("telegramFullName") || "";
  const userId = localStorage.getItem("userId") || "";
  const [filters, setFilters] = useState<Filters>({
    search: "",
    roles: [],
    clubs: [],
    sections: [],
  });

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  const [newStaff, setNewStaff] = useState<NewStaff>({
    role: "",
    phone: "",
    clubId: "",
  });
  const [newSection, setNewSection] = useState<NewSection>({
    clubId: undefined,
    name: "",
    price: undefined,
    level: "",
    capacity: undefined,
    coachId: undefined,
    tags: [],
    schedule: [],
  });

  const [clubsRaw, setClubsRaw] = useState<CreateClubResponse[]>([]);
  const [sectionsRaw, setSectionsRaw] = useState<CreateSectionResponse[]>([]);

  const [staff, setStaff] = useState<Staff[]>([]);
  const [sections, setSections] = useState<CreateSectionResponse[]>([]);

  const allRoles = ["coach", "admin"];

  useEffect(() => {
    const token = localStorage.getItem("telegramToken") || "";
    if (!token) return;
    (async () => {
      try {
        const [secRes, clubRes, invRes] = await Promise.all([
          sectionsApi.getMy(token),
          clubsApi.getMy(token),
          invitationsApi.getMy(token),
        ]);
        setSectionsRaw(secRes.data);
        setClubsRaw(clubRes.data);
        setSections(secRes.data);
        setStaff(
          invRes.data.invitations.map((inv) => {
            const club = clubRes.data.find((c) => c.id === inv.club_id);
            return {
              id: inv.id.toString(),
              name: "",
              surname: "",
              telegramUsername: undefined,
              role: inv.role as "coach" | "admin",
              sports: [],
              clubs: club ? [club.name] : [],
              phone: inv.phone_number,
              status: "pending",
            };
          })
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    })();
  }, []);

  const handleAddSection = async () => {
    const token = localStorage.getItem("telegramToken") || "";
    if (!newSection.clubId || !newSection.name) return;

    // Конвертируем массив ScheduleEntry[] в объект для API
    const buildSchedule = (
      entries: ScheduleEntry[]
    ): Record<string, { start: string; end: string }[]> => {
      return entries.reduce((acc, { day, start, end }) => {
        if (!acc[day]) acc[day] = [];
        acc[day].push({ start, end });
        return acc;
      }, {} as Record<string, { start: string; end: string }[]>);
    };

    try {
      const payload = {
        club_id: newSection.clubId,
        name: newSection.name,
        level: newSection.level,
        capacity: newSection.capacity,
        price: newSection.price,
        coach_id: newSection.coachId ?? undefined,
        tags: newSection.tags,
        schedule: buildSchedule(newSection.schedule || []),
        active: true,
      };

      const { data } = await sectionsApi.create(payload, token);
      setSectionsRaw((prev) => [...prev, data]);
      setSections((prev) => [...prev, data]);
      setShowAddSection(false);
      setNewSection({
        clubId: undefined,
        name: "",
        price: data.price,
        level: data.level,
        capacity: data.capacity,
        coachId: data.coach_id,
        tags: [],
        schedule: [],
      });
    } catch (err) {
      console.error("Ошибка создания секции:", err);
    }
  };

  const handleAddInvitation = async () => {
    const token = localStorage.getItem("telegramToken") || "";
    if (!newStaff.clubId) return;
    const payload: CreateStuffInvitationRequest = {
      phone_number: newStaff.phone,
      role: newStaff.role,
    };
    try {
      const { data: invitation } = await invitationsApi.create(
        newStaff.clubId,
        payload,
        token
      );
      const typedInvitation = invitation as Invitation;
      setStaff((prev) => [
        ...prev,
        {
          id: typedInvitation.id.toString(),
          name: "",
          surname: "",
          telegramUsername: undefined,
          role: typedInvitation.role as "coach" | "admin",
          sports: [],
          clubs: clubsRaw
            .filter((c) => c.id === typedInvitation.club_id)
            .map((c) => c.name),
          phone: typedInvitation.phone_number,
          status: "pending",
        },
      ]);
      setShowAddStaff(false);
      setNewStaff({ role: "", phone: "", clubId: "" });
    } catch (err) {
      console.error("Ошибка создания приглашения:", err);
    }
  };

  const filteredStaff = useMemo(() => {
    const s = filters.search.toLowerCase();
    return staff.filter(
      (m) =>
        (!s ||
          (m.phone && m.phone.toLowerCase().includes(s)) ||
          m.role.includes(s)) &&
        (filters.roles.length === 0 || filters.roles.includes(m.role)) &&
        (filters.clubs.length === 0 ||
          m.clubs.some((c) => filters.clubs.includes(c)))
    );
  }, [staff, filters]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Панель Управления
          </h1>
          <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === "staff" && (
            <StaffFilter
              filters={filters}
              allClubs={clubsRaw}
              allSections={sectionsRaw}
              onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            />
          )}
        </div>
      </div>
      <div className="px-4 py-2">
        {activeTab === "staff" ? (
          <>
            <div className="mb-3 text-sm text-gray-600">
              {filteredStaff.length} сотрудников
            </div>
            <div className="space-y-2">
              {filteredStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  expanded={false}
                  onToggle={() => {}}
                />
              ))}
              <button
                onClick={() => setShowAddStaff(true)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Добавить Тренера/Администратора
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 text-sm text-gray-600">
              {sections.length} секций
            </div>
            <div className="space-y-4">
              {sections.map((sec) => (
                <SectionCard key={sec.id} section={sec} onEdit={() => {}} />
              ))}
              <button
                onClick={() => setShowAddSection(true)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Добавить Секцию
              </button>
            </div>
          </>
        )}
      </div>
      <AddStaffModal
        show={showAddStaff}
        allRoles={allRoles}
        allClubs={clubsRaw}
        newStaff={newStaff}
        onChange={(f, v) =>
          setNewStaff((prev) => ({ ...prev, [f]: v as string }))
        }
        onAdd={handleAddInvitation}
        onClose={() => setShowAddStaff(false)}
      />
      <AddSectionModal
        show={showAddSection}
        editing={false}
        allClubs={clubsRaw}
        allStaff={staff}
        newSection={newSection}
        userFullName={userFullName}
        userId={userId}
        onChange={(f, v) =>
          setNewSection((prev) => ({ ...prev, [f]: v as unknown }))
        }
        onAdd={handleAddSection}
        onSave={() => {}}
        onClose={() => setShowAddSection(false)}
      />
      <BottomNav page="management" />
    </div>
  );
};
export default ManagementPage;
