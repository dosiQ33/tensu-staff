import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

type Lang = 'ru' | 'kk';

type Dict = Record<string, string>;

const RU: Dict = {
  'nav.home': 'Главная',
  'nav.students': 'Мои студенты',
  'nav.management': 'Управление',
  'nav.profile': 'Профиль',
  'management.title': 'Панель Управления',
  'students.search': 'Найти студентов...',

  'language.change': 'Сменить язык',
  'language.russian': 'Русский',
  'language.kazakh': 'Қазақша',
  'language.save': 'Сохранить',
  'language.cancel': 'Отмена',
};

const KK: Dict = {
  'nav.home': 'Басты бет',
  'nav.students': 'Менің оқушыларым',
  'nav.management': 'Басқару',
  'nav.profile': 'Профиль',
  'management.title': 'Басқару панелі',

  'language.change': 'Тілді өзгерту',
  'language.russian': 'Орысша',
  'language.kazakh': 'Қазақша',
  'language.save': 'Сақтау',
  'language.cancel': 'Бас тарту',
};

const dictionaries: Record<Lang, Dict> = { ru: RU, kk: KK };

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    const stored = localStorage.getItem('appLang') as Lang | null;
    if (stored === 'ru' || stored === 'kk') {
      setLangState(stored);
    } else {
      // Initialize from Telegram or browser language
      const tg = window.Telegram?.WebApp;
      const browserLang = navigator.language?.toLowerCase();
      const tgLang = (tg && tg.initDataUnsafe && (tg.initDataUnsafe as { user?: { language_code?: string } }).user?.language_code) || undefined;
      const effective = (tgLang || browserLang || 'ru').toLowerCase();
      setLangState(effective.startsWith('kk') ? 'kk' : 'ru');
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('appLang', l);
  };

  const t = useMemo(() => {
    return (key: string) => {
      const dict = dictionaries[lang] || RU;
      return dict[key] || key;
    };
  }, [lang]);

  // Reflect current language on the <html> tag to influence native pickers (Android/Chrome) and a11y
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang === 'kk' ? 'kk-KZ' : 'ru-RU');
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};


