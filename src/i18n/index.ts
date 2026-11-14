import { createI18n } from 'vue-i18n';

export type AppLocale = 'en' | 'uk';

const STORAGE_KEY = 'weather:locale';

const messages = {
  en: {
    app: { title: 'Weather' },
    tabs: { weather: 'Weather', favorites: 'Favorites' },
    addBlock: 'Add city block',
    maxBlocks: 'Maximum {max} weather blocks',
    search: {
      placeholder: 'Search city...',
      searching: 'Searching...',
      notFound: 'City not found',
      error: 'City search failed',
    },
    card: {
      humidity: 'Humidity',
      wind: 'Wind',
      pressure: 'Pressure',
      clouds: 'Clouds',
      feelsLike: 'Feels like {temp}',
      windUnit: 'm/s',
      pressureUnit: 'hPa',
      retry: 'Try again',
      emptyTitle: 'Choose a city',
      emptyHint: 'Start typing a city name in the search field.',
      locating: 'Detecting your location...',
      forecast: 'Forecast',
      averageNote: 'Daily average temperature',
      hourlyNote: 'Temperature by hours',
    },
    range: { label: 'Range', day: 'Day', week: '5 days' },
    period: { label: 'Time of day', day: 'Day', night: 'Night' },
    chart: { temperature: 'Temperature, °C' },
    favorites: {
      add: 'Add to favorites',
      remove: 'Remove from favorites',
      emptyTitle: 'No favorite cities yet',
      emptyText: 'Press the star on a weather card to add a city here.',
      limitTitle: 'Favorites limit reached',
      limitText:
        'To add {city}, remove one of the cities below because the maximum is {max}. Click a city to replace it.',
      cancel: 'Cancel',
    },
    remove: {
      title: 'Remove weather block?',
      text: 'The weather block {city} will be removed.',
      textEmpty: 'This weather block will be removed.',
      confirm: 'Remove',
      cancel: 'Cancel',
      title_btn: 'Remove block',
      lastBlock: 'At least one block must stay',
    },
    errors: { loadWeather: 'Could not load the weather. Please try again.' },
    modal: { close: 'Close' },
    language: 'Language',
  },
  uk: {
    app: { title: 'Погода' },
    tabs: { weather: 'Погода', favorites: 'Вибране' },
    addBlock: 'Додати блок міста',
    maxBlocks: 'Максимум {max} блоків погоди',
    search: {
      placeholder: 'Пошук міста...',
      searching: 'Пошук...',
      notFound: 'Місто не знайдено',
      error: 'Помилка пошуку міста',
    },
    card: {
      humidity: 'Вологість',
      wind: 'Вітер',
      pressure: 'Тиск',
      clouds: 'Хмарність',
      feelsLike: 'Відчувається як {temp}',
      windUnit: 'м/с',
      pressureUnit: 'гПа',
      retry: 'Спробувати ще раз',
      emptyTitle: 'Оберіть місто',
      emptyHint: 'Почніть вводити назву міста в полі пошуку.',
      locating: 'Визначаємо ваше місцезнаходження...',
      forecast: 'Прогноз',
      averageNote: 'Середня добова температура',
      hourlyNote: 'Температура по годинах',
    },
    range: { label: 'Період', day: 'День', week: '5 днів' },
    period: { label: 'Час доби', day: 'День', night: 'Ніч' },
    chart: { temperature: 'Температура, °C' },
    favorites: {
      add: 'Додати у вибране',
      remove: 'Видалити з вибраного',
      emptyTitle: 'Вибраних міст ще немає',
      emptyText: 'Натисніть зірочку на картці погоди, щоб додати місто сюди.',
      limitTitle: 'Досягнуто ліміт вибраного',
      limitText:
        'Для додавання міста {city} видаліть одне з міст нижче, тому що максимум {max}. Натисніть на місто, щоб замінити його.',
      cancel: 'Скасувати',
    },
    remove: {
      title: 'Видалити блок погоди?',
      text: 'Блок погоди {city} буде видалено.',
      textEmpty: 'Цей блок погоди буде видалено.',
      confirm: 'Видалити',
      cancel: 'Скасувати',
      title_btn: 'Видалити блок',
      lastBlock: 'Має залишитися хоча б один блок',
    },
    errors: { loadWeather: 'Не вдалося завантажити погоду. Спробуйте ще раз.' },
    modal: { close: 'Закрити' },
    language: 'Мова',
  },
};

const detectLocale = (): AppLocale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'uk') return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('uk') ? 'uk' : 'en';
};

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages,
});

export const setLocale = (locale: AppLocale) => {
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage unavailable */
  }
};

export const getLocale = (): AppLocale => i18n.global.locale.value as AppLocale;
