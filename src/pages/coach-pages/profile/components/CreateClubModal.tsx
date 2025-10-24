import React, { useState, useEffect } from "react";
import { X, Building2 } from "lucide-react";
import type { CreateClubRequest } from "@/functions/axios/requests";
import PhoneInput from "react-phone-number-input";
import ReactCountryFlag from "react-country-flag";
import "react-phone-number-input/style.css";

interface CreateClubModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClubRequest) => void;
  loading?: boolean;
}

export const CreateClubModal: React.FC<CreateClubModalProps> = ({
  show,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState<CreateClubRequest>({
    name: "",
    description: "",
    city: "",
    address: "",
    logo_url: "",
    cover_url: "",
    phone: "",
    telegram_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    if (show) {
      setForm({
        name: "",
        description: "",
        city: "",
        address: "",
        logo_url: "",
        cover_url: "",
        phone: "",
        telegram_url: "",
        instagram_url: "",
      });
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePhoneChange = (value?: string) => {
    setForm((f) => ({ ...f, phone: value || "" }));
  };

  const handleSubmit = () => onSubmit(form);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full h-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Создать клуб</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {[
            {
              label: "Название клуба",
              name: "name",
              type: "text",
              placeholder: "Bars Checkmat",
              required: true,
            },
            {
              label: "Описание",
              name: "description",
              type: "textarea",
              placeholder: "Brazilian Jiu-Jitsu академия...",
            },
            {
              label: "Город",
              name: "city",
              type: "text",
              placeholder: "Алматы",
            },
            {
              label: "Адрес",
              name: "address",
              type: "text",
              placeholder: "ул. Абая, 150",
            },
            {
              label: "Телефон",
              name: "phone",
              type: "phone",
              placeholder: "+7 701 123 4567",
            },
            {
              label: "Логотип URL",
              name: "logo_url",
              type: "url",
              placeholder: "https://...",
            },
            {
              label: "Обложка URL",
              name: "cover_url",
              type: "url",
              placeholder: "https://...",
            },
            {
              label: "Telegram",
              name: "telegram_url",
              type: "url",
              placeholder: "https://t.me/...",
            },
            {
              label: "Instagram",
              name: "instagram_url",
              type: "url",
              placeholder: "https://instagram.com/...",
            },
          ].map(({ label, name, type, placeholder, required }) => (
            <div key={name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={form[name as keyof CreateClubRequest] as string}
                  onChange={handleChange}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              ) : type === "phone" ? (
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
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
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
              ) : (
                <input
                  name={name}
                  type={type}
                  value={form[name as keyof CreateClubRequest] as string}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name}
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 shadow-sm"
          >
            {loading && (
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Создание..." : "Создать клуб"}
          </button>
        </div>
      </div>
    </div>
  );
};
