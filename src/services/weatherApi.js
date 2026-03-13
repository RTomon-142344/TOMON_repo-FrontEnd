const GEO_URL     = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_URL = 'https://api.open-meteo.com/v1';


const WMO_CODES = {
  0:  { desc: 'Clear sky',          emoji: '☀️'  },
  1:  { desc: 'Mainly clear',       emoji: '🌤️'  },
  2:  { desc: 'Partly cloudy',      emoji: '⛅'  },
  3:  { desc: 'Overcast',           emoji: '☁️'  },
  45: { desc: 'Foggy',              emoji: '🌫️'  },
  48: { desc: 'Icy fog',            emoji: '🌫️'  },
  51: { desc: 'Light drizzle',      emoji: '🌦️'  },
  53: { desc: 'Drizzle',            emoji: '🌦️'  },
  55: { desc: 'Heavy drizzle',      emoji: '🌧️'  },
  61: { desc: 'Slight rain',        emoji: '🌧️'  },
  63: { desc: 'Rain',               emoji: '🌧️'  },
  65: { desc: 'Heavy rain',         emoji: '🌧️'  },
  71: { desc: 'Slight snow',        emoji: '🌨️'  },
  73: { desc: 'Snow',               emoji: '❄️'  },
  75: { desc: 'Heavy snow',         emoji: '❄️'  },
  80: { desc: 'Slight showers',     emoji: '🌦️'  },
  81: { desc: 'Showers',            emoji: '🌧️'  },
  82: { desc: 'Violent showers',    emoji: '⛈️'  },
  95: { desc: 'Thunderstorm',       emoji: '⛈️'  },
  96: { desc: 'Thunderstorm+hail',  emoji: '⛈️'  },
  99: { desc: 'Thunderstorm+hail',  emoji: '⛈️'  },
};

export function getWeatherInfo(code) {
  return WMO_CODES[code] || { desc: 'Unknown', emoji: '🌡️' };
}

// ── Geocode city name → { lat, lon, name, country } ──────────
export async function geocodeCity(city) {
  const res  = await fetch(`${GEO_URL}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (!data.results?.length) throw new Error(`City "${city}" not found.`);
  const r = data.results[0];
  return { lat: r.latitude, lon: r.longitude, name: r.name, country: r.country, admin1: r.admin1 };
}

// ── Reverse geocode coords → city name ───────────────────────
export async function reverseGeocode(lat, lon) {
  
  const res  = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  const data = await res.json();
  return {
    lat, lon,
    name:    data.city || data.locality || 'Unknown',
    country: data.countryCode || '',
    admin1:  data.principalSubdivision || '',
  };
}

// ── Fetch weather for given coords ───────────────────────────
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude:   lat,
    longitude:  lon,
    current:    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,visibility',
    daily:      'weather_code,temperature_2m_max,temperature_2m_min',
    timezone:   'auto',
    forecast_days: 6,
  });
  const res  = await fetch(`${WEATHER_URL}/forecast?${params}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.reason || 'Failed to fetch weather.');
  return data;
}

export function windDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}