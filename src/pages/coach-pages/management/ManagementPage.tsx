// src/pages/coach-pages/management/ManagementPage.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import TabNavigation from "./components/TabNavigation";
import StaffFilter from "./components/StaffFilter";
import AddStaffModal from "./components/AddStaffModal";
import AddSectionModal from "./components/AddSectionModal";
import AddPricingModal from "./components/AddPricingModal";
import { PricingPanel } from "./components/PricingPanel";
import { SectionsPanel } from "./components/SectionPanel";
import { StaffPanel } from "./components/StaffPanel";
import type { Filters, NewStaff, NewSection, Staff } from "@/types/types";
import type { PricingPackage } from "@/types/pricing.types";
import { BottomNav } from "@/components/Layout";
import { X } from "lucide-react";
import {
  clubsApi,
  invitationsApi,
  sectionsApi,
  teamApi,
} from "@/functions/axios/axiosFunctions";
import type { CreateStuffInvitationRequest } from "@/functions/axios/requests";
import type {
  CreateSectionResponse,
  CreateClubResponse,
  Invitation,
} from "@/functions/axios/responses";
import { useI18n } from "@/i18n/i18n";
import { mockPricingPackages } from "@/data/mockPricingData";

const ManagementPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeManagementTab") || "staff"
  );
  const userFullName = localStorage.getItem("telegramFullName") || "";
  const userId = Number(localStorage.getItem("userId"));

  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: "",
    roles: [],
    clubs: [],
    sections: [],
  });

  // Section state
  const [sectionEditing, setSectionEditing] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSection, setNewSection] = useState
    NewSection & { valid_from?: string; valid_until?: string }
  >({
    club_id: undefined,
    name: "",
    coach_id: undefined,
    description: "",
    active: true,
    valid_from: "",
    valid_until: "",
  });
  const [sections, setSections] = useState<CreateSectionResponse[]>([]);
  const [activeSection, setActiveSection] = useState
    CreateSectionResponse | undefined
  >(undefined);
  const [sectionCreateAllowed, setSectionCreateAllowed] = useState(false);

  // Staff state
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaff>({
    role: "",
    phone: "",
    clubId: "",
  });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffCreateAllowed, setStaffCreateAllowed] = useState(false);

  // Pricing state
  const [packages, setPackages] = useState<PricingPackage[]>(mockPricingPackages);
  const [showAddPricing, setShowAddPricing] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);

  // Club state
  const [clubsRaw, setClubsRaw] = useState<CreateClubResponse[]>([]);
  const [ownedClubs, setOwnedClubs] = useState<CreateClubResponse[]>([]);

  // Alert modals
  const [showSecNotAllowed, setShowSecNotAllowed] = useState(false);
  const [showStaffNotAllowed, setShowStaffNotAllowed] = useState(false);

  const allRoles = ["owner", "coach", "admin"];

  // Section handlers
  const handleSectionChange = useCallback(
    (field: keyof NewSection, value: unknown) => {
      setNewSection((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const addSection = () => {
    setActiveSection(undefined);
    if (!sectionCreateAllowed) {
      setShowSecNotAllowed(true);
      return;
    }
    setNewSection({
      club_id: clubsRaw.length === 1 ? clubsRaw[0]?.id : undefined,
      name: "",
      coach_id: userId,
      description: "",
      active: true,
    });
    setShowAddSection(true);
  };

  const editSection = (sectionId: number) => {
    const sec = sections.find((s) => s.id === sectionId)!;
    setActiveSection(sec);
    setNewSection({
      club_id: sec.club_id,
      name: sec.name,
      coach_id: sec.coach_id,
      description: sec.description,
      active: sec.active,
    });
    setSectionEditing(true);
    setShowAddSection(true);
  };

  const onAddSectionModalClose = () => {
    setShowAddSection(false);
    setSectionEditing(false);
  };

  // Staff handlers
  const addStaff = () => {
    if (!staffCreateAllowed) {
      setShowStaffNotAllowed(true);
      return;
    }
    setShowAddStaff(true);
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
          role: typedInvitation.role as "owner" | "coach" | "admin",
          sports: [],
          clubs: clubsRaw
            .filter((c) => c.id === typedInvitation.club_id)
            .map((c) => c.name),
          phone: typedInvitation.phone_number,
          status: typedInvitation.status,
        },
      ]);
      setShowAddStaff(false);
      setNewStaff({ role: "", phone: "", clubId: "" });
    } catch (err) {
      console.error("Ошибка создания приглашения:", err);
    }
  };

  // Pricing handlers
  const addPricing = () => {
    setEditingPackage(null);
    setShowAddPricing(true);
  };

  const editPricing = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setShowAddPricing(true);
  };

  const handleSavePricing = (pkg: PricingPackage) => {
    if (editingPackage) {
      setPackages(packages.map((p) => (p.id === pkg.id ? pkg : p)));
    } else {
      setPackages([...packages, pkg]);
    }
    setShowAddPricing(false);
    setEditingPackage(null);
  };

  const handleDeletePricing = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
  };

  // Filtered staff
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

  // Load data on mount
  useEffect(() => {
    const token = localStorage.getItem("telegramToken") || "";
    if (!token) return;

    (async () => {
      try {
        const [secRes, clubRes, teamRes, invRes] = await Promise.all([
          sectionsApi.getMy(token),
          clubsApi.getMy(token),
          teamApi.get(token),
          invitationsApi.getMy(token),
        ]);

        console.log(secRes.data);

        setClubsRaw(clubRes.data.clubs.map((w) => w.club));
        setOwnedClubs(
          clubRes.data.clubs
            .filter((w) => w.role === "owner" || w.role === "admin")
            .map((w) => w.club)
        );

        setSections(secRes.data);

        if (clubRes.data.clubs.length > 0) {
          setSectionCreateAllowed(true);
          setStaffCreateAllowed(true);
        }

        // Map team members
        const teamMembers: Staff[] = (
          teamRes.data.staff_members as unknown[]
        ).map((m) => {
          const member = m as {
            id: number | string;
            first_name: string;
            last_name: string;
            username?: string;
            clubs_and_roles: Array<{ role: string; club_name: string }>;
            phone_number?: string;
          };
          return {
            id: member.id.toString(),
            name: member.first_name,
            surname: member.last_name,
            telegramUsername: member.username,
            role: (member.clubs_and_roles[0]?.role as Staff["role"]) || "coach",
            sports: [] as string[],
            clubs: member.clubs_and_roles.map((cr) => cr.club_name),
            phone: member.phone_number,
            status: "active",
          };
        });

        // Map pending invitations
        const pendingInvs: Staff[] = invRes.data.invitations
          .filter((inv) => inv.status === "pending")
          .map((inv) => {
            const wrapper = clubRes.data.clubs.find(
              (w) => w.club.id === inv.club_id
            );
            return {
              id: inv.id.toString(),
              name: "",
              surname: "",
              telegramUsername: undefined,
              role: inv.role as Staff["role"],
              sports: [] as string[],
              clubs: wrapper ? [wrapper.club.name] : [],
              phone: inv.phone_number,
              status: "pending",
            };
          });

        setStaff([...teamMembers, ...pendingInvs]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Handle tab change with localStorage
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeManagementTab", tab);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-50">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              {t("management.title")}
            </h1>
            <TabNavigation activeTab={activeTab} onChange={handleTabChange} />
            {activeTab === "staff" && (
              <StaffFilter
                filters={filters}
                allClubs={clubsRaw}
                onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-2">
          {activeTab === "staff" && (
            <StaffPanel staff={filteredStaff} onAdd={addStaff} />
          )}
          {activeTab === "sections" && (
            <SectionsPanel
              sections={sections}
              onEdit={editSection}
              onAdd={addSection}
            />
          )}
          {activeTab === "pricing" && (
            <PricingPanel
              packages={packages}
              onAdd={addPricing}
              onEdit={editPricing}
              onDelete={handleDeletePricing}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav page="management" />
      </div>

      {/* Modals */}
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
        editing={sectionEditing}
        allClubs={ownedClubs}
        allStaff={staff}
        newSection={newSection}
        userFullName={userFullName}
        userId={userId}
        activeSection={activeSection}
        refresh={() => window.location.reload()}
        onChange={handleSectionChange}
        onClose={onAddSectionModalClose}
      />

      <AddPricingModal
        show={showAddPricing}
        package={editingPackage}
        clubs={clubsRaw}
        sections={sections}
        onClose={() => {
          setShowAddPricing(false);
          setEditingPackage(null);
        }}
        onSave={handleSavePricing}
      />

      {/* Alert Modals */}
      {showSecNotAllowed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white w-[95%] max-w-md shadow-xl ring-1 ring-gray-200 rounded-2xl px-6 py-5">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowSecNotAllowed(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Невозможно создать секцию
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Пожалуйста, сначала создайте клуб
              </p>
            </div>
          </div>
        </div>
      )}

      {showStaffNotAllowed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white w-[95%] max-w-md shadow-xl ring-1 ring-gray-200 rounded-2xl px-6 py-5">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowStaffNotAllowed(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Невозможно добавить тренера
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Пожалуйста, сначала создайте клуб
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagementPage;
