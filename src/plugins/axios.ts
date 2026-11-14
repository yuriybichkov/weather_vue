import axios from 'axios';
import { getLocale } from '@/i18n';

export default function axiosSetup() {
  axios.defaults.baseURL = import.meta.env.VITE_API || 'https://api.openweathermap.org';
  axios.defaults.params = { appid: import.meta.env.VITE_OPENWEATHER_API_KEY, units: 'metric' };

  // The API answer (descriptions) follows the current UI language.
  axios.interceptors.request.use(config => {
    config.params = { ...config.params, lang: getLocale() };
    return config;
  });
}
