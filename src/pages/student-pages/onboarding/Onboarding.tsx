/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTelegram } from "../../../hooks/useTelegram";
import { AsYouType } from "libphonenumber-js";
import OnboardingBgImg from "../../../assets/onboarding-bg.png";

export default function OnboardingPage() {
  const { user, sendData } = useTelegram();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Telegram WebApp instance
  const [tg, setTg] = useState<unknown>(null);

  // Плавный fade-in + slide-up всей области с карточками
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Инициализация Telegram WebApp и получение initData
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegramApp = window.Telegram.WebApp;
      telegramApp.ready();
      (telegramApp as any).expand();
      setTg(telegramApp);

      // Собираем initData (raw или unsafe)
      // @ts-ignore
      const rawInitData: string | undefined = (telegramApp as any).initData;
      let initDataString = "";
      if (rawInitData) {
        initDataString = rawInitData;
      } else if ((telegramApp as any).initDataUnsafe) {
        // @ts-ignore
        initDataString = JSON.stringify((telegramApp as any).initDataUnsafe);
      }
      if (initDataString) {
        setToken(initDataString);
        localStorage.setItem("telegramInitData", initDataString);
      }
    } else {
      console.error("Telegram WebApp SDK not found");
    }
  }, []);

  // Заполняем fullName и phone, если данные пользователя уже есть
  useEffect(() => {
    if (!user) return;
    setFullName([user.first_name, user.last_name].filter(Boolean).join(" "));
    if ((user as any).phone_number) {
      const digits = (user as any).phone_number.replace(/\D/g, "");
      const formatted = new AsYouType().input("+" + digits);
      setPhone(formatted);
    }
  }, [user]);

  // Номер текущего шага: 1 — первая карточка, 2 — вторая
  const [step, setStep] = useState<1 | 2>(1);

  // Роль для шага 2
  const [role, setRole] = useState<"coach" | "student" | "">("");

  // Условие для кнопки «Далее» (шаг 1)
  const canProceedStep1 = fullName.trim().length > 0 && phone.trim().length > 0;
  // Условие для кнопки «приступить» (шаг 2)
  const canProceedStep2 = role !== "";

  // Запросить телефон через Telegram
  const requestPhoneContact = () => {
    if (!tg) return;
    setPhone("");
    // @ts-ignore
    if (typeof (tg as any).requestContact === "function") {
      // @ts-ignore
      (tg as any).requestContact((granted: boolean, contactData: any) => {
        if (granted && contactData?.responseUnsafe?.contact?.phone_number) {
          const rawNumber = contactData.responseUnsafe.contact.phone_number;
          const formatted = new AsYouType().input(rawNumber);
          setPhone(formatted);
        }
      });
    } else {
      console.warn("Метод requestContact недоступен");
    }
  };

  // Обработчик «Далее» — просто переводим на шаг 2
  const handleNext = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!canProceedStep1 || !user) return;
      setStep(2);
    },
    [canProceedStep1, user]
  );

  // Обработчик «приступить» — отправляем все данные (fullName, phone, role)
  const handleFinish = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!canProceedStep2 || !user) return;
      sendData({ fullName, phone, role });
    },
    [canProceedStep2, fullName, phone, role, sendData, user]
  );

  // Пока user === null, показываем «Загружаем ваши данные…»
  if (user === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600">
        <p className="text-white text-lg animate-pulse">
          Загружаем ваши данные…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Бэкграунд */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${OnboardingBgImg})` }}
        aria-hidden="true"
      />

      {/* Внешний контейнер карточек с плавным появлением */}
      <div
        className={`
          relative w-[95%] max-w-md z-10 transition-all duration-800
          ${showCard ? "opacity-95 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* ВНЕШНИЙ «VIEWPORT» для двух карточек (фиксированная ширина, overflow-hidden) */}
        <div className="overflow-hidden w-full">
          {/* FLEX-контейнер, где две карточки отрисованы рядом */}
          <div
            className={`
              flex transition-transform duration-500 ease-in-out
              ${step === 1 ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            {/* ── КАРТОЧКА 1 (шаг 1) ── */}
            <div className="flex-shrink-0 w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="flex flex-col items-center">
                <h1 className="text-[28px] font-extrabold text-gray-800 text-center leading-snug">
                  Добро пожаловать!
                </h1>
                <p className="mt-1 text-[20px] text-gray-600 text-center leading-snug">
                  Пожалуйста разрешите доступ к вашему номеру телефона, чтобы
                  продолжить
                </p>
              </div>

              {/* Токен (если есть) */}
              <div>
                <p className="text-xs text-gray-500 text-center break-all">
                  {token ? `Токен: ${token}` : "Токен недоступен"}
                </p>
              </div>

              {/* Форма шага 1 */}
              <form onSubmit={handleNext} className="space-y-5">
                {/* Поле Full Name */}
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700">
                    Имя и Фамилия <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Введите ваше полное имя"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
                  />
                </div>

                {/* Кнопка запроса телефона, если его ещё нет */}
                {!phone ? (
                  <div>
                    <button
                      type="button"
                      onClick={requestPhoneContact}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-[40px] transition-colors duration-200"
                    >
                      Получить номер из Telegram
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700">
                      Ваш номер <span className="ml-1 text-red-500">*</span>
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg font-bold text-gray-800">
                      {"+" + phone}
                    </div>
                  </div>
                )}

                {/* Кнопка «Далее» (активна, когда fullName + phone заполнены) */}
                {phone && (
                  <button
                    type="submit"
                    disabled={!canProceedStep1}
                    className={`
                      w-full py-3 rounded-[40px] font-semibold text-white transition
                      ${
                        canProceedStep1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700"
                          : "bg-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    Далее
                  </button>
                )}
              </form>
            </div>

            {/* ── КАРТОЧКА 2 (шаг 2) ── */}
            <div className="flex-shrink-0 w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 h-max">
              <div className="flex flex-col items-center">
                <h1 className="text-[28px] leading-snug font-extrabold text-gray-800">
                  Кто вы в нашем приложении?
                </h1>
                <p className="mt-1 text-[20px] text-gray-600 leading-snug">
                  Это поможет нам настроить всё под вас
                </p>
              </div>

              {/* Форма выбора роли (шаг 2) */}
              <form onSubmit={handleFinish} className="space-y-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("coach")}
                      className={`
                        w-full py-3 rounded-[40px] font-semibold transition border
                        ${
                          role === "coach"
                            ? "border-blue-600 text-blue-600 bg-white"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }
                      `}
                    >
                      Тренер
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`
                        w-full py-3 rounded-[40px] font-semibold transition border
                        ${
                          role === "student"
                            ? "border-blue-600 text-blue-600 bg-white"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }
                      `}
                    >
                      Студент
                    </button>
                  </div>
                </div>

                {/* Кнопка «приступить» (активна, когда роль выбрана) */}
                <button
                  type="submit"
                  disabled={!canProceedStep2}
                  className={`
                    w-full py-3 rounded-[40px] font-semibold text-white transition
                    ${
                      canProceedStep2
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700"
                        : "bg-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  Приступить
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
