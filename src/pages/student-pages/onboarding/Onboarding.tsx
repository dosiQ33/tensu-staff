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
      sendData({ fullName, phone });
    },
    [canProceed, fullName, phone, sendData, user]
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
        className={`relative w-[95%] max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 z-10
                    transition-all duration-500 ${showCard ? "opacity-95 translate-y-0" : "opacity-0 translate-y-10"}`}
>
        {/* Sport Icon + Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            Добро пожаловать!
          </h1>
          <p className="mt-1 text-sm text-gray-600 text-center">
            Пожалуйста разрешите доступ к вашему номеру телефона, чтобы продолжить
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
              Имя и Фамилия <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Введите ваше имя"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
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
                value={"+" + phone}
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
              onClick={() => navigate("/coach/main")}
            >
              Приступить
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
