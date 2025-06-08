/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  MessageCircle,
  Edit3,
  Plus,
  X,
  Users,
  Settings,
  ExternalLink,
  Shield,
  User,
  Crown,
  UserCheck,
  Pause,
  AlertCircle,
  BarChart2,
  Home,
} from "lucide-react";

interface Staff {
  id: string;
  name: string;
  surname: string;
  telegramUsername?: string;
  role: "coach" | "admin" | "head_coach" | "assistant";
  sports: string[];
  groups: string[];
  phone?: string;
  status: "active" | "blocked" | "vacation";
}

interface SportsSection {
  id: string;
  name: string;
  icon: string;
  description: string;
  telegramLink: string;
  coaches: string[];
  color: string;
}

interface Filters {
  search: string;
  roles: string[];
  groups: string[];
  sports: string[];
}

interface NewStaff {
  name: string;
  surname: string;
  telegramUsername: string;
  role: string;
  sports: string[];
  groups: string[];
  phone: string;
}

interface NewSection {
  name: string;
  description: string;
  telegramLink: string;
  coaches: string[];
}

const ManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "sections">("staff");
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    roles: [],
    groups: [],
    sports: [],
  });
  const [expandedStaff, setExpandedStaff] = useState<Set<string>>(new Set());
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<SportsSection | null>(
    null
  );
  const [newStaff, setNewStaff] = useState<NewStaff>({
    name: "",
    surname: "",
    telegramUsername: "",
    role: "",
    sports: [],
    groups: [],
    phone: "",
  });
  const [newSection, setNewSection] = useState<NewSection>({
    name: "",
    description: "",
    telegramLink: "",
    coaches: [],
  });

  // Sample data
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

  const sportsSections: SportsSection[] = [
    {
      id: "1",
      name: "Karate",
      icon: "🥋",
      description: "Traditional karate training for all ages and skill levels",
      telegramLink: "https://t.me/karate_group",
      coaches: ["Mike Smith", "David Wilson"],
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Boxing",
      icon: "🥊",
      description: "Professional boxing training and fitness",
      telegramLink: "https://t.me/boxing_group",
      coaches: ["Sarah Connor", "Carlos Lopez"],
      color: "bg-red-500",
    },
    {
      id: "3",
      name: "Fitness",
      icon: "💪",
      description: "General fitness and conditioning classes",
      telegramLink: "https://t.me/fitness_group",
      coaches: ["Sarah Connor"],
      color: "bg-green-500",
    },
  ];

  const allRoles = ["coach", "admin", "head_coach", "assistant"];
  const allGroups = [...new Set(staff.flatMap((s) => s.groups))];
  const allSports = [...new Set(staff.flatMap((s) => s.sports))];

  // Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        filters.search === "" ||
        `${member.name} ${member.surname}`
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        (member.telegramUsername &&
          member.telegramUsername
            .toLowerCase()
            .includes(filters.search.toLowerCase()));

      const matchesRoles =
        filters.roles.length === 0 || filters.roles.includes(member.role);
      const matchesGroups =
        filters.groups.length === 0 ||
        filters.groups.some((group) => member.groups.includes(group));
      const matchesSports =
        filters.sports.length === 0 ||
        filters.sports.some((sport) => member.sports.includes(sport));

      return matchesSearch && matchesRoles && matchesGroups && matchesSports;
    });
  }, [staff, filters]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "head_coach":
        return <Crown className="text-yellow-600" size={16} />;
      case "admin":
        return <Shield className="text-purple-600" size={16} />;
      case "coach":
        return <User className="text-blue-600" size={16} />;
      case "assistant":
        return <UserCheck className="text-green-600" size={16} />;
      default:
        return <User className="text-gray-600" size={16} />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "head_coach":
        return "Head Coach";
      case "admin":
        return "Administrator";
      case "coach":
        return "Coach";
      case "assistant":
        return "Assistant";
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      case "vacation":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return null;
      case "blocked":
        return <AlertCircle size={14} />;
      case "vacation":
        return <Pause size={14} />;
      default:
        return null;
    }
  };

  const toggleExpanded = (staffId: string) => {
    setExpandedStaff((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(staffId)) {
        newSet.delete(staffId);
      } else {
        newSet.add(staffId);
      }
      return newSet;
    });
  };

  const handleAddStaff = () => {
    console.log("Adding staff:", newStaff);
    setShowAddStaff(false);
    setNewStaff({
      name: "",
      surname: "",
      telegramUsername: "",
      role: "",
      sports: [],
      groups: [],
      phone: "",
    });
  };

  const handleAddSection = () => {
    console.log("Adding section:", newSection);
    setShowAddSection(false);
    setNewSection({
      name: "",
      description: "",
      telegramLink: "",
      coaches: [],
    });
  };

  const handleEditSection = (section: SportsSection) => {
    setEditingSection(section);
    setNewSection({
      name: section.name,
      description: section.description,
      telegramLink: section.telegramLink,
      coaches: section.coaches,
    });
  };

  const handleSaveSection = () => {
    console.log("Saving section:", editingSection?.id, newSection);
    setEditingSection(null);
    setNewSection({
      name: "",
      description: "",
      telegramLink: "",
      coaches: [],
    });
  };

  const toggleArrayItem = (
    array: string[],
    item: string,
    setter: (fn: (prev: any) => any) => void,
    field: string
  ) => {
    setter((prev: any) => ({
      ...prev,
      [field]: array.includes(item)
        ? array.filter((i) => i !== item)
        : [...array, item],
    }));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-35">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Management Panel
            </h1>

            {/* Tab Navigation */}
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab("staff")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition-colors ${
                  activeTab === "staff"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users size={16} />
                  Staff
                </div>
              </button>
              <button
                onClick={() => setActiveTab("sections")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition-colors ${
                  activeTab === "sections"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Settings size={16} />
                  Sections
                </div>
              </button>
            </div>

            {/* Search and Filters for Staff */}
            {activeTab === "staff" && (
              <>
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filter chips */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Roles
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {allRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              roles: prev.roles.includes(role)
                                ? prev.roles.filter((r) => r !== role)
                                : [...prev.roles, role],
                            }));
                          }}
                          className={`px-2 py-1 text-xs rounded-full ${
                            filters.roles.includes(role)
                              ? "bg-blue-100 text-blue-800"
                              : "bg-white text-gray-600 border border-gray-300"
                          }`}
                        >
                          {getRoleLabel(role)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Groups
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {allGroups.slice(0, 3).map((group) => (
                          <button
                            key={group}
                            onClick={() => {
                              setFilters((prev) => ({
                                ...prev,
                                groups: prev.groups.includes(group)
                                  ? prev.groups.filter((g) => g !== group)
                                  : [...prev.groups, group],
                              }));
                            }}
                            className={`px-2 py-1 text-xs rounded-full ${
                              filters.groups.includes(group)
                                ? "bg-green-100 text-green-800"
                                : "bg-white text-gray-600 border border-gray-300"
                            }`}
                          >
                            {group.length > 8
                              ? group.substring(0, 8) + "..."
                              : group}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sports
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {allSports.map((sport) => (
                          <button
                            key={sport}
                            onClick={() => {
                              setFilters((prev) => ({
                                ...prev,
                                sports: prev.sports.includes(sport)
                                  ? prev.sports.filter((s) => s !== sport)
                                  : [...prev.sports, sport],
                              }));
                            }}
                            className={`px-2 py-1 text-xs rounded-full ${
                              filters.sports.includes(sport)
                                ? "bg-purple-100 text-purple-800"
                                : "bg-white text-gray-600 border border-gray-300"
                            }`}
                          >
                            {sport}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-2">
          {activeTab === "staff" ? (
            <>
              <div className="text-sm text-gray-600 mb-3">
                {filteredStaff.length} staff member
                {filteredStaff.length !== 1 ? "s" : ""}
              </div>

              <div className="space-y-2">
                {filteredStaff.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getRoleIcon(member.role)}
                          <span className="font-medium text-gray-900">
                            {member.name} {member.surname}
                          </span>
                          {member.telegramUsername && (
                            <span className="text-xs text-gray-500">
                              {member.telegramUsername}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          {getRoleLabel(member.role)}
                        </div>

                        {member.sports.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <span className="font-medium">Sports:</span>
                            <span>{member.sports.join(", ")}</span>
                          </div>
                        )}

                        {member.groups.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <button
                              onClick={() => toggleExpanded(member.id)}
                              className="font-medium text-blue-600 hover:text-blue-800"
                            >
                              Groups ({member.groups.length})
                              {expandedStaff.has(member.id) ? " ▼" : " ▶"}
                            </button>
                            {expandedStaff.has(member.id) && (
                              <div className="mt-1 text-xs">
                                {member.groups.join(", ")}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            member.status
                          )}`}
                        >
                          {getStatusIcon(member.status)}
                          {member.status}
                        </div>

                        <div className="flex gap-2">
                          {member.phone && (
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Phone size={16} />
                            </button>
                          )}
                          {member.telegramUsername && (
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <MessageCircle size={16} />
                            </button>
                          )}
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit3 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowAddStaff(true)}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Coach/Administrator
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-3">
                {sportsSections.length} sports section
                {sportsSections.length !== 1 ? "s" : ""}
              </div>

              <div className="space-y-4">
                {sportsSections.map((section) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{section.icon}</div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {section.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ExternalLink size={14} className="text-blue-600" />
                            <a
                              href={section.telegramLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Telegram Group
                            </a>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Coaches:{" "}
                            </span>
                            <span className="text-sm text-gray-600">
                              {section.coaches.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEditSection(section)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowAddSection(true)}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add New Section
                </button>
              </div>
            </>
          )}
        </div>

        {/* Add Staff Modal */}
        {showAddStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end pb-12">
            <div className="bg-white w-full max-h-[85vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add Staff Member
                  </h2>
                  <button
                    onClick={() => setShowAddStaff(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newStaff.name}
                      onChange={(e) =>
                        setNewStaff((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newStaff.surname}
                      onChange={(e) =>
                        setNewStaff((prev) => ({
                          ...prev,
                          surname: e.target.value,
                        }))
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={newStaff.telegramUsername}
                    onChange={(e) =>
                      setNewStaff((prev) => ({
                        ...prev,
                        telegramUsername: e.target.value,
                      }))
                    }
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) =>
                      setNewStaff((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Role</option>
                    {allRoles.map((role) => (
                      <option key={role} value={role}>
                        {getRoleLabel(role)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sports
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSports.map((sport) => (
                      <button
                        key={sport}
                        type="button"
                        onClick={() =>
                          toggleArrayItem(
                            newStaff.sports,
                            sport,
                            setNewStaff,
                            "sports"
                          )
                        }
                        className={`px-3 py-1 text-sm rounded-full ${
                          newStaff.sports.includes(sport)
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Groups
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allGroups.map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() =>
                          toggleArrayItem(
                            newStaff.groups,
                            group,
                            setNewStaff,
                            "groups"
                          )
                        }
                        className={`px-3 py-1 text-sm rounded-full ${
                          newStaff.groups.includes(group)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddStaff}
                  disabled={
                    !newStaff.name || !newStaff.surname || !newStaff.role
                  }
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                >
                  Add Staff Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Section Modal */}
        {(showAddSection || editingSection) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end pb-12">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingSection ? "Edit Section" : "Add New Section"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddSection(false);
                      setEditingSection(null);
                      setNewSection({
                        name: "",
                        description: "",
                        telegramLink: "",
                        coaches: [],
                      });
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Name
                  </label>
                  <input
                    type="text"
                    value={newSection.name}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newSection.description}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telegram Group Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://t.me/group_name"
                    value={newSection.telegramLink}
                    onChange={(e) =>
                      setNewSection((prev) => ({
                        ...prev,
                        telegramLink: e.target.value,
                      }))
                    }
                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Coaches
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {staff
                      .filter((s) => s.role !== "admin")
                      .map((coach) => (
                        <button
                          key={coach.id}
                          type="button"
                          onClick={() =>
                            toggleArrayItem(
                              newSection.coaches,
                              `${coach.name} ${coach.surname}`,
                              setNewSection,
                              "coaches"
                            )
                          }
                          className={`px-3 py-1 text-sm rounded-full ${
                            newSection.coaches.includes(
                              `${coach.name} ${coach.surname}`
                            )
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {coach.name} {coach.surname}
                        </button>
                      ))}
                  </div>
                </div>

                <button
                  onClick={
                    editingSection ? handleSaveSection : handleAddSection
                  }
                  disabled={!newSection.name || !newSection.description}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                >
                  {editingSection ? "Save Changes" : "Add Section"}
                </button>
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
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/coach/management")}
        >
          <BarChart2 size={20} />
          <span className="text-xs">Управление</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate("/coach/profile")}
        >
          <User size={20} />
          <span className="text-xs">Профиль</span>
        </button>
      </nav>
    </>
  );
};

export default ManagementPage;
