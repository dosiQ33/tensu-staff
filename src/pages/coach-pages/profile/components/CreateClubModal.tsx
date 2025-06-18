import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateClubRequest } from '@/functions/axios/requests';

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
    name: '',
    description: '',
    city: '',
    address: '',
    logo_url: '',
    cover_url: '',
    phone: '',
    telegram_url: '',
    instagram_url: '',
    // timezone: 'Asia/Almaty',
    // currency: 'KZT',
    extra: {},
  });

  // сброс формы при открытии
  useEffect(() => {
    if (show) {
      setForm({
        name: '',
        description: '',
        city: '',
        address: '',
        logo_url: '',
        cover_url: '',
        phone: '',
        telegram_url: '',
        instagram_url: '',
        // timezone: 'Asia/Almaty',
        // currency: 'KZT',
        extra: {},
      });
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create New Club</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your club name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Almaty"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 701 123 4567"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover URL</label>
              <input
                name="cover_url"
                value={form.cover_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram URL</label>
              <input
                name="telegram_url"
                value={form.telegram_url}
                onChange={handleChange}
                placeholder="https://t.me/yourclub"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/yourclub"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
          >
            {loading ? 'Creating...' : 'Create Club'}
          </button>
        </div>
      </div>
    </div>
  );
};