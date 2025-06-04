/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import { useTelegram } from "../../../hooks/useTelegram";
import { AsYouType } from "libphonenumber-js";
import OnboardingBgImg from "../../../assets/onboarding-bg.png";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, sendData } = useTelegram();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const step = 1;

  // Telegram WebApp instance
  const [tg, setTg] = useState<unknown>(null);

  // fade-in + slide-up для обёртки карточек
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

      // Читаем initData (raw или initDataUnsafe)
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

  // Когда user появляется, заполняем fullName, phone и avatar (если есть)
  useEffect(() => {
    if (!user) return;

    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
    setFullName(name);

    const photoUrl = (user as any).photo_url as string | undefined;
    setAvatar(photoUrl);

    let formattedPhone = "";
    if ((user as any).phone_number) {
      const digits = (user as any).phone_number.replace(/\D/g, "");
      formattedPhone = new AsYouType().input("+" + digits);
      setPhone(formattedPhone);
    }

    // —> СОХРАНЯЕМ всё, что получили от Telegram, в localStorage:
    try {
      localStorage.setItem("telegramUser", JSON.stringify(user));
      localStorage.setItem(
        "telegramFullName",
        JSON.stringify(name)
      );
      localStorage.setItem(
        "telegramPhone",
        JSON.stringify(formattedPhone)
      );
      localStorage.setItem("telegramAvatar", JSON.stringify(photoUrl));
    } catch (e) {
      console.warn("Не удалось сохранить Telegram данные в localStorage:", e);
    }
  }, [user]);

  // canProceedStep1: fullName + phone заполнены
  const canProceedStep1 = fullName.trim().length > 0 && phone.trim().length > 0;

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

  const handleNext = () => {
    sendData({
      fullName,
      phone,
      avatar,
    });

    localStorage.setItem(
      "telegramFullName",
      JSON.stringify(fullName)
    );
    
    navigate("/main");
    
  }


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

      {/* Обёртка для появления (fade + slide) */}
      <div
        className={`
          relative w-[95%] max-w-md z-10 transition-all duration-800
          ${showCard ? "opacity-95 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      >
        {/* «Viewport» с overflow-hidden */}
        <div className="overflow-hidden w-full">
          {/* flex-контейнер: 2 карточки рядом, по ширине экрана */}
          <div
            className={`
              flex transition-transform duration-500 ease-in-out
              ${step === 1 ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            {/* ── Карточка 1 (шаг 1) ── */}
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

                {/* Кнопка запроса телефона */}
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

                {/* Кнопка «Далее» */}
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
          </div>
        </div>
      </div>
    </div>
  );
}