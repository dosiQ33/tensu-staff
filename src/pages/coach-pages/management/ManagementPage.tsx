import React, { useState, useMemo, useEffect } from "react";
import TabNavigation from "./components/TabNavigation";
import StaffFilter from "./components/StaffFilter";
import StaffCard from "./components/StaffCard";
import AddStaffModal from "./components/AddStaffModal";
import SectionCard from "./components/SectionCard";
import AddSectionModal from "./components/AddSectionModal";
import type {
  Filters,
  NewStaff,
  NewSection,
  Staff,
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

const ManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "sections">("staff");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    roles: [],
    clubs: [],
    sections: [],
  });

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<CreateSectionResponse | null>(
    null
  );
  const [newStaff, setNewStaff] = useState<NewStaff>({
    role: "",
    phone: "",
    clubId: "",
  });
  const [newSection, setNewSection] = useState<NewSection>({
    clubId: "",
    name: "",
    description: "",
    telegramLink: "",
    coaches: [],
  });

  // raw API data
  const [sectionsRaw, setSectionsRaw] = useState<CreateSectionResponse[]>([]);
  const [clubsRaw, setClubsRaw] = useState<CreateClubResponse[]>([]);
  // const [invitationsRaw, setInvitationsRaw] = useState<Invitation[]>([]);

  // UI models
  const [sections, setSections] = useState<CreateSectionResponse[]>([]);
  // const [clubs, setClubs] = useState<CreateClubResponse[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  const allRoles = ["coach", "admin"];

  // 1) fetch all
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

        // raw
        setSectionsRaw(secRes.data);
        setClubsRaw(clubRes.data);
        // setInvitationsRaw(invRes.data.invitations);

        // sections & clubs pass-through
        setSections(secRes.data);
        // setClubs(clubRes.data);

        // map invitations → Staff
        const staffList: Staff[] = invRes.data.invitations.map((inv) => {
          // find club name
          const club = clubRes.data.find((c) => c.id === inv.club_id);
          return {
            id: inv.id.toString(),
            name: "", // API invitation doesn't include name
            surname: "", // fill from separate staff API later if needed
            telegramUsername: undefined,
            role: inv.role as "coach" | "admin",
            sports: [],
            clubs: club ? [club.name] : [],
            phone: inv.phone_number,
            status: "active",
          };
        });
        setStaff(staffList);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    })();
  }, []);

  const handleAddInvitation = async () => {
    const token = localStorage.getItem("telegramToken") || "";
    if (!newStaff.clubId) return;

    const payload: CreateStuffInvitationRequest = {
      phone_number: newStaff.phone,
      role: newStaff.role,
    };

    try {
      const { data } = await invitationsApi.create(
        newStaff.clubId,
        payload,
        token
      );
      const invitation = data as Invitation;
      // append newly created invitation to both raw & UI state
      // setInvitationsRaw((prev) => [...prev, invitation]);
      setStaff((prev) => [
        ...prev,
        {
          id: invitation.id.toString(),
          name: "",
          surname: "",
          telegramUsername: undefined,
          role: invitation.role as "coach" | "admin",
          sports: [],
          clubs: clubsRaw
            .filter((c) => c.id === invitation.club_id)
            .map((c) => c.name),
          phone: invitation.phone_number,
          status: "active",
        },
      ]);

      setShowAddStaff(false);
      setNewStaff({ role: "", phone: "", clubId: "" });
    } catch (err) {
      console.error("Ошибка создания приглашения:", err);
    }
  };

  // filteredStaff по фильтрам
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const s = filters.search.toLowerCase();
      return (
        (!s ||
          member.phone?.toLowerCase().includes(s) ||
          member.role.toLowerCase().includes(s)) &&
        (filters.roles.length === 0 || filters.roles.includes(member.role)) &&
        (filters.clubs.length === 0 ||
          member.clubs.some((c) => filters.clubs.includes(c)))
      );
    });
  }, [staff, filters]);

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

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
              allClubs={clubsRaw}
              allSections={sectionsRaw}
              filters={filters}
              onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            />
          )}
        </div>
      </div>

      <div className="px-4 py-2">
        {activeTab === "staff" ? (
          <>
            <div className="text-sm text-gray-600 mb-3">
              {filteredStaff.length} сотрудников
            </div>
            <div className="space-y-2">
              {filteredStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  expanded={expanded.has(member.id)}
                  onToggle={toggleExpanded}
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
            <div className="text-sm text-gray-600 mb-3">
              {sections.length} спортивных секций
            </div>
            <div className="space-y-4">
              {sections.map((sec) => (
                <SectionCard
                  key={sec.id}
                  section={sec}
                  onEdit={setEditingSection}
                />
              ))}
              <button
                onClick={() => setShowAddSection(true)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Добавить Новую Секцию
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
        onChange={(field, value) =>
          setNewStaff((prev) => ({ ...prev, [field]: value as string }))
        }
        onAdd={handleAddInvitation}
        onClose={() => setShowAddStaff(false)}
      />

      <AddSectionModal
        show={showAddSection || Boolean(editingSection)}
        editing={Boolean(editingSection)}
        allStaff={staff}
        allClubs={clubsRaw}
        newSection={newSection}
        onChange={(f, v) =>
          setNewSection((prev) => ({ ...prev, [f]: v as string }))
        }
        onToggleCoach={(coach) =>
          setNewSection((prev) => ({
            ...prev,
            coaches: prev.coaches.includes(coach)
              ? prev.coaches.filter((c) => c !== coach)
              : [...prev.coaches, coach],
          }))
        }
        onSave={() => {
          /* handle save */
        }}
        onAdd={() => {
          /* handle add */
        }}
        onClose={() => {
          setShowAddSection(false);
          setEditingSection(null);
        }}
      />

      <BottomNav />
    </div>
  );
};

export default ManagementPage;
