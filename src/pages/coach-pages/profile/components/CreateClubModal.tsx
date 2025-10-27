import React, { useState, useEffect } from "react";
import { X, Building2, Info } from "lucide-react";

interface CreateClubModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export const CreateClubModal: React.FC<CreateClubModalProps> = ({
  show,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (show) {
      setForm({
        name: "",
        description: "",
        city: "",
        address: "",
        phone: "",
      });
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => onSubmit(form);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full h-full max-w-md shadow-2xl overflow-hidden">
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

        <div className="px-6 py-6 space-y-5 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {[
            { label: "Название клуба", name: "name", type: "text", placeholder: "Bars Checkmat", required: true },
            { label: "Описание", name: "description", type: "textarea", placeholder: "Brazilian Jiu-Jitsu академия..." },
            { label: "Город", name: "city", type: "text", placeholder: "Алматы" },
            { label: "Адрес", name: "address", type: "text", placeholder: "ул. Абая, 150" },
            { label: "Телефон", name: "phone", type: "tel", placeholder: "+7 701 123 4567" },
          ].map(({ label, name, type, placeholder, required }) => (
            <div key={name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              ) : (
                <input
                  name={name}
                  type={type}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              )}
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Настройка тарифов</div>
                <div>Тарифы можно настроить после создания клуба в разделе Membership</div>
              </div>
            </div>
          </div>
        </div>

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
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 shadow-sm"
          >
            {loading ? "Создание..." : "Создать клуб"}
          </button>
        </div>
      </div>
    </div>
  );
};
