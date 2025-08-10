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
  'schedule.title': 'Расписание',
  'filters.coaches': 'Тренеры',
  'filters.allCoaches': 'Все тренеры',
  'filters.clubs': 'Клубы',
  'filters.allClubs': 'Все клубы',
  'calendar.weekdays': 'Пн,Вт,Ср,Чт,Пт,Сб,Вс',
  'day.modal.title': 'Тренировки',
  'day.modal.add': 'Добавить тренировку',
  'day.modal.empty': 'Тренировок нет',
  'add.date': 'Дата',
  'add.save': 'Сохранить',
  'edit.save': 'Сохранить изменения',
  'edit.delete': 'Удалить тренировку',
  'edit.delete.warn': 'Удаление тренировки необратимо. Это действие нельзя отменить.',
  'common.cancel': 'Отмена',
  'common.deleteForever': 'Удалить',
  'profile.title': 'Профиль',
  'clubs.mine': 'Мои клубы',
  'club.details': 'Детали',
  'stats.students': 'Студенты',
  'stats.revenue': 'Доход',
  'stats.perMonth': 'Помесячно',
  'stats.peakHours': 'Пиковые часы',
  'plan.title': 'План',
  'payment.next': 'Следующая оплата',
  'payment.history': 'История',
  'payment.action.view': 'Открыть',
  'payment.action.paynow': 'Оплатить',
  'payment.action.renew': 'Продлить',
  'role.admin': 'Администратор',
  'role.coach': 'Тренер',
  'role.owner': 'Владелец',
  'role.pending': 'В ожидании',
  'invite.title': 'Приглашения',
  'invite.role': 'Роль',
  'action.accept': 'Принять',
  'action.decline': 'Отклонить',
  'club.create': 'Создать клуб',
  'privacy.menu': 'Политика конфиденциальности',
  'contact.writeUs': 'Напишите нам',

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
  'students.search': 'Оқушыларды іздеу...',
  'schedule.title': 'Кесте',
  'filters.coaches': 'Жаттықтырушылар',
  'filters.allCoaches': 'Барлық жаттықтырушылар',
  'filters.clubs': 'Клубтар',
  'filters.allClubs': 'Барлық клубтар',
  'calendar.weekdays': 'Дс,Сс,Ср,Бс,Жм,Сб,Жс',
  'day.modal.title': 'Жаттығулар',
  'day.modal.add': 'Жаттығу қосу',
  'day.modal.empty': 'Жаттығулар жоқ',
  'add.date': 'Күні',
  'add.save': 'Сақтау',
  'edit.save': 'Өзгерістерді сақтау',
  'edit.delete': 'Жаттығуды жою',
  'edit.delete.warn': 'Жаттығуды жою қайтарылмайды. Бұл әрекетті болдырмау мүмкін емес.',
  'common.cancel': 'Бас тарту',
  'common.deleteForever': 'Жою',
  'profile.title': 'Профиль',
  'clubs.mine': 'Менің клубтарым',
  'club.details': 'Егжей-тегжей',
  'stats.students': 'Оқушылар',
  'stats.revenue': 'Табыс',
  'stats.perMonth': 'Ай сайын',
  'stats.peakHours': 'Шекті сағаттар',
  'plan.title': 'Жоспар',
  'payment.next': 'Келесі төлем',
  'payment.history': 'Төлем тарихы',
  'payment.action.view': 'Ашу',
  'payment.action.paynow': 'Төлеу',
  'payment.action.renew': 'Ұзарту',
  'role.admin': 'Әкімші',
  'role.coach': 'Жаттықтырушы',
  'role.owner': 'Иесі',
  'role.pending': 'Күтуде',
  'invite.title': 'Шақырулар',
  'invite.role': 'Рөлі',
  'action.accept': 'Қабылдау',
  'action.decline': 'Бас тарту',
  'club.create': 'Клуб құру',
  'privacy.menu': 'Құпиялық саясаты',
  'contact.writeUs': 'Бізге жазыңыз',

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


