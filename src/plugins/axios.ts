import axios from 'axios';

export default function axiosSetup() {
  axios.defaults.baseURL = import.meta.env.VITE_API || '__API__';
  axios.defaults.params = { lang: 'uk', appid: import.meta.env.VITE_OPENWEATHER_API_KEY };
}
