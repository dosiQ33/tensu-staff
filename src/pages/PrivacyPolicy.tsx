import React from 'react';
import { useI18n } from '@/i18n/i18n';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();

  const RU = (
    <div className="space-y-4">
      <p>
        Настоящая Политика конфиденциальности (далее — Политика) описывает порядок
        обработки персональных данных и иные сведения, собираемые ТОО «Tensu» при
        использовании веб‑сайта <a className="text-blue-600 underline" href="https://www.tensu.kz" target="_blank" rel="noreferrer">tensu.kz</a> и
        Telegram Mini App «Tensu». Политика разработана с учетом требований законодательства Республики Казахстан, включая Закон РК «О персональных данных и их защите».
      </p>

      <h2 className="text-base font-semibold">1. Оператор и контактные данные</h2>
      <p>
        Оператор: ТОО «Tensu». По вопросам конфиденциальности: 
        <a className="text-blue-600 underline ml-1" href="mailto:privacy@tensu.kz">privacy@tensu.kz</a>.
      </p>

      <h2 className="text-base font-semibold">2. Обрабатываемые данные</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Идентификатор пользователя Telegram, имя, фамилия, фото, username;</li>
        <li>Контактные данные (телефон, email — при предоставлении пользователем);</li>
        <li>Данные об абонементах, тренировках, посещаемости, группах и клубах;</li>
        <li>Технические данные: IP‑адрес, данные устройства и лог‑файлы.</li>
      </ul>

      <h2 className="text-base font-semibold">3. Цели обработки</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Предоставление функционала приложения и личного кабинета;</li>
        <li>Учет тренировок, платежей, статусов и аналитики;</li>
        <li>Коммуникация с пользователями, поддержка и уведомления;</li>
        <li>Соблюдение требований законодательства РК и обеспечение безопасности.</li>
      </ul>

      <h2 className="text-base font-semibold">4. Правовые основания</h2>
      <p>Согласие субъекта персональных данных и иные основания, предусмотренные законодательством Республики Казахстан.</p>

      <h2 className="text-base font-semibold">5. Передача и хранение</h2>
      <p>
        Данные могут обрабатываться с использованием облачных сервисов и передаваться обработчикам по договорам поручения при соблюдении требований законодательства РК. Сроки хранения определяются целями обработки и требованиями закона.
      </p>

      <h2 className="text-base font-semibold">6. Права пользователя</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Получать сведения об обработке, требовать уточнения, блокирования или уничтожения данных;</li>
        <li>Отзывать согласие на обработку, направив запрос на <a className="text-blue-600 underline" href="mailto:privacy@tensu.kz">privacy@tensu.kz</a>;</li>
        <li>Обращаться в уполномоченный орган по защите персональных данных РК.</li>
      </ul>

      <h2 className="text-base font-semibold">7. Файлы cookie и аналитика</h2>
      <p>
        Мы можем использовать cookie и аналогичные технологии для обеспечения работы сервиса, сохранения настроек и аналитики. Вы можете управлять cookie в настройках браузера.
      </p>

      <h2 className="text-base font-semibold">8. Изменения Политики</h2>
      <p>Актуальная версия Политики всегда доступна на сайте <a className="text-blue-600 underline" href="https://www.tensu.kz" target="_blank" rel="noreferrer">tensu.kz</a>. Продолжая пользоваться сервисом, вы соглашаетесь с обновленной редакцией.</p>

      <h2 className="text-base font-semibold">9. Контакты</h2>
      <p>
        Вопросы по Политике: <a className="text-blue-600 underline" href="mailto:privacy@tensu.kz">privacy@tensu.kz</a>. Веб‑сайт: <a className="text-blue-600 underline" href="https://www.tensu.kz" target="_blank" rel="noreferrer">tensu.kz</a>.
      </p>
    </div>
  );

  const KK = (
    <div className="space-y-4">
      <p>
        Осы Құпиялылық саясаты (бұдан әрі — Саясат) «Tensu» ЖШС‑нің
        <a className="text-blue-600 underline ml-1" href="https://www.tensu.kz" target="_blank" rel="noreferrer">tensu.kz</a> веб‑сайтын және «Tensu» Telegram Mini App қолданбасын пайдалану кезінде
        жиналатын жеке деректерді өңдеу тәртібін сипаттайды. Саясат Қазақстан Республикасының заңнамасы, соның ішінде «Жеке деректер және оларды қорғау туралы» ҚР Заңы талаптарына сәйкес әзірленген.
      </p>

      <h2 className="text-base font-semibold">1. Оператор және байланыс деректері</h2>
      <p>
        Оператор: «Tensu» ЖШС. Құпиялық мәселелері бойынша: 
        <a className="text-blue-600 underline ml-1" href="mailto:privacy@tensu.kz">privacy@tensu.kz</a>.
      </p>

      <h2 className="text-base font-semibold">2. Өңделетін деректер</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Telegram пайдаланушы идентификаторы, аты‑жөні, фото, username;</li>
        <li>Байланыс деректері (телефон, email — пайдаланушы берген жағдайда);</li>
        <li>Абонементтер, жаттығулар, қатысу, топтар мен клубтар туралы деректер;</li>
        <li>Техникалық деректер: IP‑мекенжай, құрылғы деректері және лог‑файлдар.</li>
      </ul>

      <h2 className="text-base font-semibold">3. Өңдеу мақсаттары</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Қолданба функционалын және жеке кабинетті ұсыну;</li>
        <li>Жаттығуларды, төлемдерді, мәртебелерді және аналитиканы есепке алу;</li>
        <li>Пайдаланушылармен байланыс, қолдау және хабарламалар;</li>
        <li>ҚР заңнамасы талаптарын сақтау және қауіпсіздікті қамтамасыз ету.</li>
      </ul>

      <h2 className="text-base font-semibold">4. Құқықтық негіздер</h2>
      <p>Жеке деректер субъектісінің келісімі және ҚР заңнамасында көзделген өзге негіздер.</p>

      <h2 className="text-base font-semibold">5. Беру және сақтау</h2>
      <p>
        Деректер бұлттық сервистерді пайдалана отырып өңделуі мүмкін және ҚР заңнамасының талаптарын сақтай отырып,
        шарттар бойынша өңдеушілерге берілуі мүмкін. Сақтау мерзімдері өңдеу мақсаттарына және заң талаптарына сәйкес айқындалады.
      </p>

      <h2 className="text-base font-semibold">6. Пайдаланушы құқықтары</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Өңдеу туралы ақпарат алу, деректерді нақтылау, бұғаттау немесе жоюды талап ету;</li>
        <li><a className="text-blue-600 underline" href="mailto:privacy@tensu.kz">privacy@tensu.kz</a> мекенжайына өтінім жіберу арқылы келісімді кері қайтарып алу;</li>
        <li>Жеке деректерді қорғау жөніндегі уәкілетті органға жүгіну.</li>
      </ul>

      <h2 className="text-base font-semibold">7. Cookie және аналитика</h2>
      <p>
        Қызмет жұмысы, баптаулар және аналитика үшін cookie және соған ұқсас технологиялар пайдаланылуы мүмкін. Cookie файлдарын браузер параметрлерінде басқара аласыз.
      </p>

      <h2 className="text-base font-semibold">8. Саясаттағы өзгерістер</h2>
      <p>Саясаттың өзекті нұсқасы әрқашан <a className="text-blue-600 underline" href="https://www.tensu.kz" target="_blank" rel="noreferrer">tensu.kz</a> сайтында қолжетімді. Қызметті пайдалануды жалғастыра отырып, жаңартылған нұсқаға келісесіз.</p>

      <h2 className="text-base font-semibold">9. Байланыс</h2>
      <p>
        Саясат бойынша сұрақтар: <a className="text-blue-600 underline" href="mailto:privacy@tensu.kz">privacy@tensu.kz</a>. Веб‑сайт: <a className="text-blue-600 underline" href="https://www.tensu.kz" target="_blank" rel="noreferrer">tensu.kz</a>.
      </p>
    </div>
  );

  const title = lang === 'kk' ? 'Құпиялылық саясаты' : 'Политика конфиденциальности';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
      </div>

      <div className="px-4 py-4 text-sm text-gray-800">
        {lang === 'kk' ? KK : RU}
      </div>
    </div>
  );
};

export default PrivacyPolicy;


