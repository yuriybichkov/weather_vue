# Weather

Weather app on **Vue 3 + TypeScript + Pinia + axios**, data from [OpenWeather](https://openweathermap.org/).
No CSS frameworks and no UI libraries. The chart is plain `chart.js` (no vue-chartjs).

## Run

```sh
npm install
npm run dev        # development
npm run build      # type-check + production build (dist/)
```

`.env`:

```
VITE_OPENWEATHER_API_KEY=<your key>
VITE_API=https://api.openweathermap.org
```

## Requirements checklist

| # | Requirement | Where |
|---|-------------|-------|
| 1 | City input with autocomplete (debounced, ignores stale answers, Esc / outside click closes) | `SearchPlace.vue` |
| 2 | Requests via axios | `api/weatherClient.ts`, `plugins/axios.ts` |
| 3 | Weather card for the current day | `WeatherCard.vue` |
| 4 | Hourly temperature chart (chart.js, no Vue wrapper) | `TemperatureChart.vue` |
| 5 | Several blocks, `+` button, max 5, each with its own search | `WeatherComponent.vue`, store |
| 6 | Block removal with a confirmation modal (the last block cannot be removed) | `ConfirmModal.vue` |
| 7 | "Favorites" tab, star + orange frame on favorite cities, `localStorage`, max 5, modal "to add X remove a city because the maximum is 5" (click a city to replace it); in the tab the city cannot be changed, only the day / 5 days switch | `FavoritesView.vue`, `FavoritesLimitModal.vue` |
| 8 | Responsive: container 1200px max, 360px min | `assets/main.css` |
| 9 | Day / 5 days switch: card and chart per day, using the mean of the 3-hourly values (forecast5 API) | `utils/weather.ts` |
| 10 | Default city detected by IP (ipapi.co, fallback ipwho.is) | `composables/useUserLocation.ts` |
| 11 | Preloaders: city detection, search, card loading, refresh overlay | `AppSpinner.vue` |
| 12 | en / uk interface **and** API answers (`lang` param is added to every request); choice is remembered | `i18n/index.ts` |
| 13 | Day / Night switch (uses the API `pod` flag; a night is kept together across midnight) | `utils/weather.ts` |

## Extra functionality (14)

- Night mode changes the card theme (dark card and chart).
- The period (day/night) starts from the city's real current time.
- Click a favorite in the limit modal to replace it with the new city.
- Localised city names via reverse geocoding for the IP-detected city.
- Late in the day the hourly chart continues into the next day so it stays readable.
- Error state with a "Try again" button; weather is cached and shared between blocks and the Favorites tab.
- Accessible markup: dialog roles, `aria-pressed` toggles, focus return after a modal, keyboard friendly.
