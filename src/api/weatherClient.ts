import axios, { type AxiosResponse } from 'axios';
import type { CurrentWeather, ForecastResponse, Place } from '@/types/weather.ts';

class WeatherClient {
  public searchPlace = async (query: string): Promise<AxiosResponse<Place[]>> => {
    return axios.get('/geo/1.0/direct', { params: { q: query, limit: 5 } });
  };

  /** Used to get localized names (local_names) for the IP-detected city. */
  public reversePlace = async (lat: number, lon: number): Promise<AxiosResponse<Place[]>> => {
    return axios.get('/geo/1.0/reverse', { params: { lat, lon, limit: 1 } });
  };

  public getCurrentWeather = async (
    lat: number,
    lon: number,
  ): Promise<AxiosResponse<CurrentWeather>> => {
    return axios.get('/data/2.5/weather', { params: { lat, lon } });
  };

  /** 5 day / 3 hour forecast. */
  public getForecast = async (lat: number, lon: number): Promise<AxiosResponse<ForecastResponse>> => {
    return axios.get('/data/2.5/forecast', { params: { lat, lon } });
  };
}

export default new WeatherClient();
