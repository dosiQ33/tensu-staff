import { Plus } from "lucide-react";

export const FloatingAddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="fixed bottom-28 right-4 bg-blue-500 p-4 rounded-full shadow-lg text-white hover:bg-blue-600">
    <Plus size={24} />
  </button>
);