import React from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import ReactCountryFlag from "react-country-flag";
import "react-phone-number-input/style.css";
import type { CreateClubResponse } from "@/functions/axios/responses";
import type { NewStaff } from "@/types/types";

interface AddStaffModalProps {
  show: boolean;
  allRoles: string[];
  allClubs: CreateClubResponse[];
  newStaff: NewStaff;
  onChange: (field: keyof NewStaff, value: unknown) => void;
  onAdd: () => void;
  onClose: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  show,
  allRoles,
  allClubs,
  newStaff,
  onChange,
  onAdd,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-[92%] max-w-md rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="text-lg font-semibold text-gray-800">
            Добавить персонал
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {/* Role Selector */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Роль
            </label>
            <div className="relative">
              <select
                value={newStaff.role}
                onChange={(e) => onChange("role", e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              >
                <option value="">– выбрать роль –</option>
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Номер телефона
            </label>
            <div
              className="relative"
              style={
              {
                "--PhoneInputCountryFlag-borderColor": "transparent",
                "--PhoneInputCountryFlag-borderWidth": "0px",
              } as React.CSSProperties
              }
            >
              <PhoneInput
              international
              defaultCountry="KZ"
              value={newStaff.phone}
              onChange={(value) => onChange("phone", (value || "").replace(/^\+/, ""))}
              placeholder="+7 701 123 4567"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 shadow-sm ring-0 focus:ring-0 focus:border-none focus:outline-none transition"
              flagComponent={({ country }) =>
                country ? (
                <ReactCountryFlag
                  countryCode={country}
                  svg={false}
                  style={{ fontSize: "25px", lineHeight: "30px" }}
                />
                ) : null
              }
              />
            </div>
          </div>

          {/* Club Selector */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Клуб
            </label>
            <div className="relative">
              <select
                value={String(newStaff.clubId || "")}
                onChange={(e) => onChange("clubId", e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              >
                <option value="">– выбрать клуб –</option>
                {allClubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end px-5 pb-5 pt-2">
          <button
            onClick={onAdd}
            disabled={!newStaff.role || !newStaff.phone || !newStaff.clubId}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-50"
          >
            <Plus size={20} className="mr-2" /> Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
