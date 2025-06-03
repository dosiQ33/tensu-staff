/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTelegram } from "../../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import { AsYouType } from "libphonenumber-js";
import OnboardingBgImg from "../../../assets/onboarding-bg.png";

export default function OnboardingPage() {
  const { user, sendData } = useTelegram();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState(""); // отформатированная строка
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Telegram WebApp instance
  const [tg, setTg] = useState<unknown>(null);

  // Состояние для анимации: false → true через 1 секунду
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Инициализируем Telegram WebApp и сохраняем в state
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegramApp = window.Telegram.WebApp;
      telegramApp.ready();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (telegramApp as any).expand();
      setTg(telegramApp);

      // Сохраняем initData
      // @ts-ignore
      const rawInitData: string | undefined = (telegramApp as unknown).initData;
      let initDataString = "";
      if (rawInitData) {
        initDataString = rawInitData;
      } else if (telegramApp.initDataUnsafe) {
        initDataString = JSON.stringify(telegramApp.initDataUnsafe);
      }

      if (initDataString) {
        setToken(initDataString);
        localStorage.setItem("telegramInitData", initDataString);
      }
    } else {
      console.error("Telegram WebApp SDK not found");
    }
  }, []);

  // Заполняем fullName, bio, phone (если есть) при появлении user
  useEffect(() => {
    if (!user) return;

    // Имя/фамилия остаются редактируемыми
    setFullName([user.first_name, user.last_name].filter(Boolean).join(" "));

    // Если есть username, сохраняем в state
    if (user.username) {
      setBio(`@${user.username}`);
    }

    // Telegram WebApp НЕ передаёт телефон напрямую,
    // но если вдруг есть, форматируем
    if (user.phone_number) {
      const digits = user.phone_number.replace(/\D/g, "");
      const formatted = new AsYouType().input("+" + digits);
      setPhone(formatted);
    }
  }, [user]);

  const canProceed = phone.trim().length > 0;

  // Запрос контактных данных у Telegram
  const requestPhoneContact = () => {
    if (!tg) return;
    setPhone(""); // сбиваем старое, если было
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

  // Обработчик отправки
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!canProceed || !user) return;
      sendData({ fullName, bio, phone });
    },
    [canProceed, fullName, bio, phone, sendData, user]
  );

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
      {/* Фоновое изображение */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${OnboardingBgImg})` }}
        aria-hidden="true"
      />

      {/* Main Card: условная анимация */}
      <div
        className={`
          relative w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 space-y-6 z-10
          transition-all duration-500
          ${showCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* Sport Icon + Title */}
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-600 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 15V9M18 15V9M18 9h-2M8 9H6m12 6h2m-2 0h-2m-4 0h4m-4 0H8m4 0v-6"
            />
          </svg>
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            Добро пожаловать!
          </h1>
          <p className="mt-1 text-sm text-gray-600 text-center">
            Ваш персональный трекер тренировок
          </p>
        </div>

        {/* Display token (optional) */}
        <div>
          <p className="text-xs text-gray-500 text-center break-all">
            {token ? `Токен: ${token}` : "Токен недоступен"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9.015 9.015 0 0112 15c2.21 0 4.21.896 5.879 2.354M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Имя и Фамилия
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Введите ваше имя"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          {/* Bio / Username (read-only, если есть) */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              {bio && "Bio"}
            </label>
            {bio && (
              <input
                type="text"
                disabled
                value={bio}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            )}
          </div>

          {!phone ? (
            <div>
              <button
                type="button"
                onClick={requestPhoneContact}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Получить номер из Telegram
              </button>
            </div>
          ) : (
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                Номер телефона <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="tel"
                disabled={true}
                value={phone}
                // onChange={(e) => {
                //   // Убираем всё, кроме '+' и цифр
                //   let raw = e.target.value.replace(/[^\d+]/g, "");
                //   // Гарантируем, что начинается с '+'
                //   if (!raw.startsWith("+")) {
                //     raw = "+" + raw.replace(/\++/g, "");
                //   }
                //   // Форматируем через AsYouType
                //   const formatted = new AsYouType().input(raw);
                //   setPhone(formatted);
                // }}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
            </div>
          )}

          {phone && (
            <button
              type="submit"
              disabled={!canProceed}
              className={`
                      w-full py-3 rounded-lg font-semibold text-white transition 
                      ${
                        canProceed
                          ? "bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }
                    `}
              onClick={() =>
                bio === "@arman198701"
                  ? navigate("/coach/main")
                  : navigate("/main")
              }
            >
              Приступить
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
