import React, { useState } from "react";
import type { Staff } from "@/types/types";
import {
  getRoleIcon,
  getRoleLabel,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
} from "@/utils";
import { Phone, MessageCircle, Edit3 } from "lucide-react";

interface StaffCardProps {
  member: Staff;
}

const StaffCard: React.FC<StaffCardProps> = ({ member }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
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
              <span className="font-medium">Sports:</span>{" "}
              {member.sports.join(", ")}
            </div>
          )}
          {member.clubs.length > 0 && (
            <div className="text-sm text-gray-600">
              <button
                onClick={() => setExpanded(!expanded)}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Clubs ({member.clubs.length}) {expanded ? "▼" : "▶"}
              </button>
              {expanded && (
                <div className="mt-1 text-xs">{member.clubs.join(", ")}</div>
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
            {getStatusIcon(member.status)} {getStatusLabel(member.status)}
          </div>
          <div className="flex gap-2">
            {member.phone && (
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <Phone size={16} />
                {member.phone}
              </button>
            )}
            {member.telegramUsername && (
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <MessageCircle size={16} />
              </button>
            )}
            <button className="p-1 text-gray-400 hover:text-blue-600">
              <Edit3 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
