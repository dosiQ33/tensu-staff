import { useState, useEffect, type FormEvent } from "react";

interface ClubSelectorProps {
  /** Функция, которая получит массив выбранных клубов при сабмите */
  onFinish: (selectedClubs: string[]) => void;
}

export default function ClubSelector({ onFinish }: ClubSelectorProps) {
  // Пример списка всех доступных клубов (можно заменить реальным API)
  const [allClubs] = useState<string[]>([
    "Iron Gym",
    "FitZone",
    "Sparta",
    "Titan Club",
    "ProFit",
    "Energy Fitness",
    "Bars Checkmat",
  ]);

  // Локальные состояния
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);

  // Debounce для searchTerm: обновляем debouncedTerm через 300 мс после последнего ввода
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Фильтруем все клубы по debouncedTerm и исключаем уже выбранные
  const filteredClubs = allClubs.filter(
    (club) =>
      club.toLowerCase().includes(debouncedTerm.toLowerCase()) &&
      !clubs.includes(club)
  );

  // Условие активности кнопки «Приступить» (активна, если выбран хотя бы один клуб)
  const canProceed = clubs.length > 0;

  // Когда пользователь кликает по клубу в списке поиска
  const handleSelectClub = (club: string) => {
    setClubs((prev) => [...prev, club]);
    setSearchTerm("");
    setDebouncedTerm("");
  };

  // Удалить клуб из выбранных
  const handleRemoveClub = (clubToRemove: string) => {
    setClubs((prev) => prev.filter((c) => c !== clubToRemove));
  };

  // Сабмит формы: передаём массив выбранных клубов вверх
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;
    onFinish(clubs);
  };

  return (
    <div className="flex-shrink-0 w-full m-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 h-max">
      <div className="flex flex-col items-center">
        <h1 className="text-[28px] leading-snug font-extrabold text-gray-800">
          Найдите ваш клуб
        </h1>
        <p className="mt-1 text-[20px] text-gray-600 leading-snug text-center">
          Это поможет нам настроить всё под вас
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Поисковый инпут */}
        <div>
          <input
            type="text"
            placeholder="Поиск клуба…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
          />

          {/* Блок с плавным появлением/скрытием */}
          <div
            className={`
              mt-2 overflow-hidden transition-[max-height,opacity] duration-300
              ${debouncedTerm ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <ul className="space-y-2">
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => (
                  <li key={club}>
                    <button
                      type="button"
                      onClick={() => handleSelectClub(club)}
                      className="w-full text-left font-semibold text-gray-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
                    >
                      {club}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">Клубы не найдены</li>
              )}
            </ul>
          </div>
        </div>

        {/* Выбранные клубы */}
        {clubs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {clubs.map((club) => (
              <div
                key={club}
                className="flex items-center max-w-full border border-blue-600 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                <span className="truncate">{club}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveClub(club)}
                  className="ml-2 text-blue-600 hover:text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Кнопка "Приступить" */}
        <button
          type="submit"
          disabled={!canProceed}
          className={`
            w-full py-3 rounded-[40px] font-semibold text-white transition
            ${
              canProceed
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700"
                : "bg-gray-500 cursor-not-allowed"
            }
          `}
        >
          Приступить
        </button>
      </form>
    </div>
  );
}
