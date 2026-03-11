// src/services/weatherApi.js
// Uses Weatherbit API (https://www.weatherbit.io)


const API_KEY  = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.weatherbit.io/v2.0';

function checkKey() {
  if (!API_KEY) throw new Error('Add VITE_WEATHER_API_KEY to your frontend .env file.');
}

// ── Current weather by city name ─────────────────────────────
export async function getCurrentWeather(city) {
  checkKey();
  const res = await fetch(
    `${BASE_URL}/current?city=${encodeURIComponent(city)}&key=${API_KEY}&units=M`
  );
  const data = await res.json();
  if (!res.ok || !data.data?.length) throw new Error(data.error || `City "${city}" not found.`);
  return data.data[0]; // Weatherbit returns array, we take first result
}

// ── Current weather by coordinates ───────────────────────────
export async function getWeatherByCoords(lat, lon) {
  checkKey();
  const res = await fetch(
    `${BASE_URL}/current?lat=${lat}&lon=${lon}&key=${API_KEY}&units=M`
  );
  const data = await res.json();
  if (!res.ok || !data.data?.length) throw new Error('Could not fetch weather for your location.');
  return data.data[0];
}

// ── 5-day daily forecast by city name ────────────────────────
export async function getForecast(city) {
  checkKey();
  const res = await fetch(
    `${BASE_URL}/forecast/daily?city=${encodeURIComponent(city)}&key=${API_KEY}&units=M&days=6`
  );
  const data = await res.json();
  if (!res.ok || !data.data?.length) throw new Error(data.error || `Forecast not found for "${city}".`);
  return data.data.slice(1, 6); // skip today, return next 5 days
}

// ── Wind direction from degrees ───────────────────────────────
export function windDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── Weatherbit icon URL ───────────────────────────────────────
// Weatherbit provides icon codes like "c01d", "r01d", etc.
export function iconUrl(code) {
  return `https://www.weatherbit.io/static/img/icons/${code}.png`;
}