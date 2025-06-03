/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTelegram } from "../../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import OnboardingBgImg from "../../../assets/onboarding-bg.png";

export default function OnboardingPage() {
  const { user, sendData } = useTelegram();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Состояние для анимации: false → true через 1 секунду
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Capture initData (raw) or fallback to initDataUnsafe, then save and display
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.error("Telegram WebApp SDK not found");
      return;
    }
    tg.ready();

    // Try to get the raw initData, fallback to stringified initDataUnsafe
    // @ts-ignore
    const rawInitData: string | undefined = (tg as unknown).initData;
    let initDataString = "";
    if (rawInitData) {
      initDataString = rawInitData;
    } else if (tg.initDataUnsafe) {
      initDataString = JSON.stringify(tg.initDataUnsafe);
    }

    if (initDataString) {
      setToken(initDataString);
      localStorage.setItem("telegramInitData", initDataString);
    }
  }, []);

  // Populate user info when available
  useEffect(() => {
    if (!user) return;
    setFullName([user.first_name, user.last_name].filter(Boolean).join(" "));
    setBio(user.username ? `@${user.username}` : "");
    if (user.phone_number) {
      setPhone(user.phone_number);
    }
  }, [user]);

  const canProceed = phone.trim().length > 0;

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

          {/* Bio / Username */}
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-3-6v6"
                />
              </svg>
              Логин (Bio)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Например, @username"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          {/* Phone Number */}
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
                  d="M3 5a2 2 0 012-2h2.586A2 2 0 019 3.586l1.707 1.707a2 2 0 01.586 1.414V7a2 2 0 012 2v6a2 2 0 01-2 2h-1.293a2 2 0 01-1.414-.586L8.586 15H7a2 2 0 01-2-2V7a2 2 0 012-2z"
                />
              </svg>
              Номер телефона <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-____"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
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
        </form>
      </div>
    </div>
  );
}