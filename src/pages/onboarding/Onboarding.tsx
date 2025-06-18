/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AsYouType } from "libphonenumber-js";
import OnboardingBgImg from "@/assets/onboarding-bg.png";
import { useTelegram } from "@/hooks/useTelegram";
import { staffApi } from "@/functions/axios/axiosFunctions";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, sendData } = useTelegram();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [tg, setTg] = useState<any>(null);
  const [showCard, setShowCard] = useState(false);

  // флаг, чтобы checkStuffExists вызвался только один раз
  const [hasChecked, setHasChecked] = useState(false);

  const [showInvitationAlert, setShowInvitationAlert] = useState(false);

  // плавное появление карточки
  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // один раз после того, как получили token, проверяем, есть ли профиль
  useEffect(() => {
    if (token && !hasChecked) {
      setHasChecked(true);
      (async () => {
        try {
          const resp = await staffApi.getMe(token);
          if ((resp.status === 200 || resp.status === 201) && resp.data) {
            localStorage.setItem("telegramUser", JSON.stringify(resp.data.username));
            localStorage.setItem("telegramFullName", resp.data.first_name + " " + resp.data.last_name);
            localStorage.setItem("telegramPhone", resp.data.phone_number);
            localStorage.setItem("telegramAvatar", resp.data.photo_url);
            localStorage.setItem("telegramId", resp.data.telegram_id.toString());
            localStorage.setItem("telegramToken", token || "");
            // navigate("/coach/profile");
          }
        } catch (e) {
            console.error("Ошибка getMe:", e);
        }
      })();
    }
  }, [token, hasChecked, navigate]);

  // инициализация Telegram WebApp — только ставим токен, не дергаем API
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const telegramApp = window.Telegram.WebApp;
      telegramApp.ready();
      telegramApp.expand();
      setTg(telegramApp);

      const rawInitData =
        telegramApp.initData ||
        JSON.stringify(telegramApp.initDataUnsafe || {});
      setToken(rawInitData);
      localStorage.setItem("telegramInitData", rawInitData);
    } else {
      console.error("Telegram WebApp SDK not found");
    }
  }, []);

  // как только приходит user из Telegram — сохраняем данные
  useEffect(() => {
    if (!user) return;
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
    setFullName(name);
    setAvatar(user.photo_url.toString());

    if (user.phone_number) {
      const digits = user.phone_number.replace(/\D/g, "");
      setPhone(new AsYouType().input("+" + digits));
    }

    localStorage.setItem("telegramUser", JSON.stringify(user));
    localStorage.setItem("telegramFullName", name);
    localStorage.setItem("telegramPhone", phone);
    localStorage.setItem("telegramAvatar", avatar);
    localStorage.setItem("telegramToken", token || "");
  }, [user, phone, avatar, token]);

  // запросить контакт
  const requestPhoneContact = () => {
    if (!tg?.requestContact) return;
    setPhone("");
    tg.requestContact((granted: boolean, result: any) => {
      setContactData(result);
      if (granted && result?.responseUnsafe?.contact?.phone_number) {
        const raw = result.responseUnsafe.contact.phone_number;
        setPhone(new AsYouType().input(raw));
      }
    });
  };

  // отправка контактных данных и переход в профиль
  useEffect(() => {
    if (!contactData?.response) return;

    (async () => {
      try {
        const response = await staffApi.create(
          { contact_init_data: contactData.response, preferences: {} },
          token!
        );

        if (response.status !== 200 && response.status !== 201) {
            // navigate("/coach/profile");
        }
        if (response.status === 404) {
          setShowInvitationAlert(true);
        }
        // после успешного создания — сразу в профиль
        // navigate("/coach/profile");
      } catch (err) {
        console.error("Ошибка создания staff:", err);
      } finally {
        sendData({ fullName, phone, avatar });
      }
    })();
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
        {showInvitationAlert && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-lg">
            <p className="text-sm">
              Вы не являетесь тренером или администратором клуба. Пожалуйста, свяжитесь с вашим клубом для получения доступа.
            </p>
          </div>
        )}
        <div className="overflow-hidden w-full">
          <div className="flex transition-transform duration-500 ease-in-out">
            <div className="flex-shrink-0 w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="flex flex-col items-center">
                <h1 className="text-[28px] font-extrabold text-gray-800 text-center leading-snug">
                  Добро пожаловать, {fullName}!
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

              {!phone ? (
                <button
                  onClick={requestPhoneContact}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-[40px]"
                >
                  Получить номер из Telegram
                </button>
              ) : (
                <button
                  onClick={() => navigate("/coach/profile")}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-teal-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-[40px]"
                >
                  Продолжить
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}