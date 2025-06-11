/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [avatar, setAvatar] = useState<string | unknown | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [tg, setTg] = useState<any>(null);
  const [showCard, setShowCard] = useState(false);

  // плавно показываем карточку
  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegramApp = window.Telegram.WebApp;
      telegramApp.ready();
      telegramApp.expand();
      setTg(telegramApp);

      const rawInitData = telegramApp.initData || JSON.stringify(telegramApp.initDataUnsafe || {});
      setToken(rawInitData);
      localStorage.setItem("telegramInitData", rawInitData);
    } else {
      console.error("Telegram WebApp SDK not found");
    }
  }, []);

  // Когда появляется user, заполняем поля
  useEffect(() => {
    if (!user) return;
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
    setFullName(name);
    setAvatar(user.photo_url);

    if (user.phone_number) {
      const digits = user.phone_number.replace(/\D/g, "");
      setPhone(new AsYouType().input("+" + digits));
    }

    localStorage.setItem("telegramUser", JSON.stringify(user));
    localStorage.setItem("telegramFullName", JSON.stringify(name));
    localStorage.setItem("telegramPhone", JSON.stringify(phone));
    localStorage.setItem("telegramAvatar", JSON.stringify(avatar ?? ""));
  }, [user]);

  // Запросить телефон
  const requestPhoneContact = () => {
    if (!tg?.requestContact) return;
    // сбросим старый телефон
    setPhone("");
    tg.requestContact((granted: boolean, result: any) => {
      console.log("Telegram contact callback:", granted, result);
      setContactData(result);
      if (granted && result?.responseUnsafe?.contact?.phone_number) {
        const rawNumber = result.responseUnsafe.contact.phone_number;
        setPhone(new AsYouType().input(rawNumber));
      }
    });
  };

  // Как только contactData установился — шлём на бэкенд и переходим
  useEffect(() => {
    if (!contactData?.response) return;
    const postAndNavigate = async () => {
      try {
        const resp = await fetch("https://195.49.215.106:8000/api/v1/stuff/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact_init_data: contactData.response,
            preferences: {
              additionalProp1: {}
            }
          }),
        });
        if (!resp.ok) {
          console.error("Ошибка отправки contact data:", resp.statusText);
          navigate("/coach/main");
        } else {
          // можно прочитать ответ, если нужно:
          // const data = await resp.json();
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        sendData({ fullName, phone, avatar });
      }
    };
    postAndNavigate();
  }, [contactData, token, fullName, phone, avatar, navigate, sendData]);

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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${OnboardingBgImg})` }}
        aria-hidden="true"
      />
      <div
        className={`
          relative w-[95%] max-w-md z-10 transition-all duration-800
          ${showCard ? "opacity-95 translate-y-0" : "opacity-0 translate-y-10"}
        `}
      > 
        <div className="overflow-hidden w-full">
          <div className="flex transition-transform duration-500 ease-in-out">
            <div className="flex-shrink-0 w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="flex flex-col items-center">
                <h1 className="text-[28px] font-extrabold text-gray-800 text-center leading-snug">
                  Добро пожаловать!
                </h1>
                <p className="mt-1 text-[20px] text-gray-600 text-center">
                  Пожалуйста, разрешите доступ к вашему номеру телефона
                </p>
              </div>

              <p className="text-xs text-gray-500 text-center break-all">
                {token ? `Токен: ${token}` : "Токен недоступен"}
              </p>

              <div className="w-full overflow-x-auto">
                {contactData?.response ? (
                  <pre className="text-xs text-gray-500 whitespace-pre-wrap break-words">
                    {contactData.response}
                  </pre>
                ) : (
                  <p className="text-xs text-gray-500 text-center">
                    Данные контакта ещё не получены
                  </p>
                )}
              </div>

              {!phone && (
                <button
                  type="button"
                  onClick={requestPhoneContact}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-[40px]"
                >
                  Получить номер из Telegram
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}