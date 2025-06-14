import React, { useState, useMemo, useEffect } from "react";
import TabNavigation from "./components/TabNavigation";
import StaffFilter from "./components/StaffFilter";
import StaffCard from "./components/StaffCard";
import AddStaffModal from "./components/AddStaffModal";
import SectionCard from "./components/SectionCard";
import AddSectionModal from "./components/AddSectionModal";
import type {
  Staff,
  SportsSection,
  Filters,
  NewStaff,
  NewSection,
} from "@/types/types";
import { BottomNav } from "@/components/Layout";
import { Plus } from "lucide-react";
import { sectionsApi } from "@/functions/axios/axiosFunctions";

const ManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'staff' | 'sections'>('staff');
  const [filters, setFilters] = useState<Filters>({ search: '', roles: [], groups: [], sports: [] });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<SportsSection | null>(null);
  const [newStaff, setNewStaff] = useState<NewStaff>({ name: '', surname: '', telegramUsername: '', role: '', sports: [], groups: [], phone: '' });
  const [newSection, setNewSection] = useState<NewSection>({ clubId: '', name: '', description: '', telegramLink: '', coaches: [] });

  const [sections, setSections] = useState<SportsSection[]>([]);
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);

  // Fetch sections (clubs) from API
  useEffect(() => {
    const token = localStorage.getItem('telegramToken') || '';
    sectionsApi.getMy(token).then(response => {
      const data = response.data as { id: string; name: string; icon?: string; description?: string; telegramLink?: string; coaches?: string[]; color?: string }[];
      setClubs(data.map(c => ({ id: c.id, name: c.name })));
      setSections(data.map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon || '🏟️',
        description: c.description || '',
        telegramLink: c.telegramLink || '',
        coaches: c.coaches || [],
        color: c.color || 'bg-gray-200',
      })));
    });
  }, []);

  // Sample data omitted for brevity (move to a data file or fetch from API)
  const staff: Staff[] = [
    {
      id: "1",
      name: "Mike",
      surname: "Smith",
      telegramUsername: "@mike_smith",
      role: "head_coach",
      sports: ["Karate", "Self Defense"],
      groups: ["Advanced Karate", "Competition", "Adults"],
      phone: "+1234567890",
      status: "active",
    },
    {
      id: "2",
      name: "Sarah",
      surname: "Connor",
      telegramUsername: "@sarah_connor",
      role: "coach",
      sports: ["Boxing", "Fitness"],
      groups: ["Advanced Boxing", "Fitness Group", "Women Only"],
      phone: "+1234567891",
      status: "active",
    },
    {
      id: "3",
      name: "Carlos",
      surname: "Lopez",
      role: "coach",
      sports: ["Boxing"],
      groups: ["Beginner Boxing", "Intermediate Boxing"],
      phone: "+1234567892",
      status: "vacation",
    },
    {
      id: "4",
      name: "Lisa",
      surname: "Johnson",
      telegramUsername: "@lisa_admin",
      role: "admin",
      sports: [],
      groups: [],
      phone: "+1234567893",
      status: "active",
    },
    {
      id: "5",
      name: "David",
      surname: "Wilson",
      telegramUsername: "@david_assist",
      role: "assistant",
      sports: ["Karate"],
      groups: ["Beginner Karate", "Kids"],
      status: "blocked",
    },
  ];
  // const sportsSections: SportsSection[] = [
  //   {
  //     id: "1",
  //     name: "Karate",
  //     icon: "🥋",
  //     description: "Traditional karate training for all ages and skill levels",
  //     telegramLink: "https://t.me/karate_group",
  //     coaches: ["Mike Smith", "David Wilson"],
  //     color: "bg-blue-500",
  //   },
  //   {
  //     id: "2",
  //     name: "Boxing",
  //     icon: "🥊",
  //     description: "Professional boxing training and fitness",
  //     telegramLink: "https://t.me/boxing_group",
  //     coaches: ["Sarah Connor", "Carlos Lopez"],
  //     color: "bg-red-500",
  //   },
  //   {
  //     id: "3",
  //     name: "Fitness",
  //     icon: "💪",
  //     description: "General fitness and conditioning classes",
  //     telegramLink: "https://t.me/fitness_group",
  //     coaches: ["Sarah Connor"],
  //     color: "bg-green-500",
  //   },
  // ];
  const allRoles = ["coach", "admin", "head_coach", "assistant"];
  const allGroups = [...new Set(staff.flatMap((s) => s.groups))];
  const allSports = [...new Set(staff.flatMap((s) => s.sports))];

  const filteredStaff = useMemo(
    () => staff.filter(member => {
      const matchesSearch =
        !filters.search ||
        `${member.name} ${member.surname}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        (member.telegramUsername || '').toLowerCase().includes(filters.search.toLowerCase());
      const matchesRoles = !filters.roles.length || filters.roles.includes(member.role);
      const matchesGroups = !filters.groups.length || filters.groups.some(g => member.groups.includes(g));
      const matchesSports = !filters.sports.length || filters.sports.some(s => member.sports.includes(s));
      return matchesSearch && matchesRoles && matchesGroups && matchesSports;
    }),
    [staff, filters]
  );

  const toggleExpanded = (id: string) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const toggleArrayItem = <K extends keyof NewStaff>(array: string[], item: string, field: K) => {
    const next = array.includes(item) ? array.filter(i => i !== item) : [...array, item];
    setNewStaff(prev => ({ ...prev, [field]: next }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Management Panel
          </h1>
          <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === "staff" && (
            <StaffFilter
              filters={filters}
              allRoles={allRoles}
              allGroups={allGroups}
              allSports={allSports}
              onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            />
          )}
        </div>
      </div>
      <div className="px-4 py-2">
        {activeTab === "staff" ? (
          <>
            <div className="text-sm text-gray-600 mb-3">
              {filteredStaff.length} staff member
              {filteredStaff.length !== 1 && "s"}
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
                <Plus size={20} /> Add Coach/Administrator
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-3">
              {sections.length} sports section
              {sections.length !== 1 && "s"}
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
                <Plus size={20} /> Add New Section
              </button>
            </div>
          </>
        )}
      </div>
      <AddStaffModal
        show={showAddStaff}
        allSports={allSports}
        allGroups={allGroups}
        allRoles={allRoles}
        newStaff={newStaff}
        onChange={(f, v) => setNewStaff((prev) => ({ ...prev, [f]: v }))}
        onToggleArray={toggleArrayItem}
        onAdd={() => {
          /* handle add */
        }}
        onClose={() => setShowAddStaff(false)}
      />
      <AddSectionModal
        show={showAddSection || Boolean(editingSection)}
        editing={Boolean(editingSection)}
        allCoaches={staff}
        allClubs={clubs}
        newSection={newSection}
        onChange={(f, v) => setNewSection((prev) => ({ ...prev, [f]: v }))}
        onToggleCoach={(coach) => setNewSection((prev) => ({
          ...prev,
          coaches: prev.coaches.includes(coach)
            ? prev.coaches.filter((c) => c !== coach)
            : [...prev.coaches, coach],
        }))}
        onSave={() => {
          /* handle save */
        } }
        onAdd={() => {
          /* handle add */
        } }
        onClose={() => {
          setShowAddSection(false);
          setEditingSection(null);
        } } 
        />
      <BottomNav />
    </div>
  );
};

export default ManagementPage;