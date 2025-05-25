import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTelegram } from "../../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const { user, sendData } = useTelegram();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Welcome to the training tracker!
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Let’s get your profile set up.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username / Bio
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!canProceed}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              canProceed
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() =>
              bio === "@arman198701"
                ? navigate("/coach/main")
                : navigate("/main")
            }
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
}
