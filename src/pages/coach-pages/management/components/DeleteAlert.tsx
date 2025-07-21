import { groupsApi, sectionsApi } from "@/functions/axios/axiosFunctions";
import React from "react";
import { toast } from "react-toastify";

interface DeleteSectionAlertProps {
  show: boolean;
  onClose: () => void;
  refresh: () => void;
  id: number;
  state: string;
  setDeletedCount?: (count: number) => void;
}

const DeleteAlert: React.FC<DeleteSectionAlertProps> = ({
  show,
  onClose,
  refresh,
  id,
  state,
  setDeletedCount
}) => {
  const token = localStorage.getItem("telegramToken") || "";
  const deleteById = async (id: number) => {
    try {
      const res =
        state === "group"
          ? await groupsApi.deleteById(id, token)
          : await sectionsApi.delete(id, token);
      if (res.status === 200) {
        toast.success(
          state === "group"
            ? "Группа удалена успешно"
            : "Секция удалена успешно"
        );
        if (state === "group" && setDeletedCount) {
          setDeletedCount(1);
        }
      }
      onClose();
      refresh();
    } catch {
      toast.error("Не удалось удалить секцию");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {state === "group" ? "Удалить группу" : "Удалить секцию"}?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Вы не сможете отменить это действие. Все связанные данные будут
          удалены.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Отменить
          </button>
          <button
            onClick={() => deleteById(id)}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700 focus:outline-none"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;
