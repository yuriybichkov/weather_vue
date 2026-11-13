import axios, { type AxiosResponse } from 'axios';
import type { Place } from '@/types/weather.ts';

class WeatherClient {
  public searchPlace = async (query: string): Promise<AxiosResponse<Place[]>> => {
    return axios.get('/geo/1.0/direct', {
      params: { q: query, limit: 5 },
      paramsSerializer: { indexes: null },
    });
  };

  public getCurrentWeather = async (lat: number, lon: number): Promise<AxiosResponse<any>> => {
    return axios.get('/data/2.5/weather', { params: { lat, lon } });
  };

  public getForecast = async (lat: number, lon: number): Promise<AxiosResponse<any>> => {
    return axios.get('/data/2.5/forecast', { params: { lat, lon } });
  };
}

export default new WeatherClient();
