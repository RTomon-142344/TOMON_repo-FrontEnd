// src/components/WeatherWidget.jsx
import { useState, useEffect } from 'react';
import {
  getCurrentWeather, getWeatherByCoords, getForecast,
  windDirection, iconUrl,
} from '../services/weatherApi';

const DEFAULT_CITY = 'Tagum';

// ── 5-day forecast card ──────────────────────────────────────
function ForecastCard({ entry }) {
  const date = new Date(entry.valid_date);
  const day  = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', borderRadius: 10,
      padding: '10px 8px', textAlign: 'center', flex: 1, minWidth: 80,
    }}>
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{day}</div>
      <img
        src={iconUrl(entry.weather.icon)}
        alt={entry.weather.description}
        style={{ width: 40, height: 40 }}
        onError={e => { e.target.style.display = 'none'; }}
      />
      <div style={{ fontWeight: 700, fontSize: 15 }}>{Math.round(entry.high_temp)}°C</div>
      <div style={{ fontSize: 11, opacity: 0.6 }}>{Math.round(entry.low_temp)}°C</div>
      <div style={{ fontSize: 10, opacity: 0.65, textTransform: 'capitalize', marginTop: 2 }}>
        {entry.weather.description}
      </div>
    </div>
  );
}

// ── Detail pill ──────────────────────────────────────────────
function DetailPill({ icon, label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', borderRadius: 8,
      padding: '6px 12px', fontSize: 12, flex: 1, minWidth: 100,
    }}>
      {icon} <span style={{ opacity: 0.7 }}>{label}: </span><strong>{value}</strong>
    </div>
  );
}

// ── Main WeatherWidget ───────────────────────────────────────
export default function WeatherWidget() {
  const [input, setInput]           = useState('');
  const [weather, setWeather]       = useState(null);
  const [forecast, setForecast]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError]           = useState('');

  // ── Auto-load Tagum City on mount ───────────────────────
  useEffect(() => {
    fetchCity(DEFAULT_CITY);
  }, []);

  const fetchCity = async (city) => {
    setLoading(true);
    setError('');
    try {
      const [w, f] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);
      setWeather(w);
      setForecast(f);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Search by city name ─────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    fetchCity(input.trim());
  };

  // ── Use device GPS ──────────────────────────────────────
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }
    setLocLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const w = await getWeatherByCoords(coords.latitude, coords.longitude);
          setWeather(w);
          const f = await getForecast(w.city_name);
          setForecast(f);
        } catch (err) {
          setError(err.message);
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please search by city name.');
        setLocLoading(false);
      }
    );
  };

  const noApiKey = !import.meta.env.VITE_WEATHER_API_KEY;

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--maroon-dark) 0%, var(--maroon) 60%, #1a3a5c 100%)',
      borderRadius: 'var(--radius-lg)', padding: 24, color: '#fff',
      boxShadow: 'var(--shadow-lg)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: 1, textTransform: 'uppercase' }}>
          🌤 Weather Forecast
        </div>
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
          Tagum City, Davao del Norte, Philippines · Powered by Weatherbit
        </div>
      </div>

      {/* No API key warning */}
      {noApiKey && (
        <div style={{
          background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.4)',
          borderRadius: 8, padding: '10px 12px', fontSize: 12, marginBottom: 12,
        }}>
          ⚙️ Add <code style={{ background: 'rgba(0,0,0,0.2)', padding: '1px 4px', borderRadius: 4 }}>
            VITE_WEATHER_API_KEY=your_key
          </code> to your frontend <code style={{ background: 'rgba(0,0,0,0.2)', padding: '1px 4px', borderRadius: 4 }}>.env</code> file.
        </div>
      )}

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search another city..."
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            fontSize: 13, outline: 'none',
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: '8px 14px', borderRadius: 8, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: 'var(--gold)', color: 'var(--maroon-dark)',
          fontWeight: 700, fontSize: 13, opacity: loading ? 0.7 : 1,
        }}>
          {loading ? '...' : '🔍'}
        </button>
        <button type="button" onClick={handleGeolocate} disabled={locLoading}
          title="Use my location" style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 14,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            cursor: locLoading ? 'not-allowed' : 'pointer',
            opacity: locLoading ? 0.7 : 1,
          }}>
          {locLoading ? '...' : '📍'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)',
          borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 12,
        }}>
          ⚠️ {error}
          <button
            onClick={() => fetchCity(DEFAULT_CITY)}
            style={{
              marginLeft: 10, background: 'none', border: 'none',
              color: 'var(--gold)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline',
            }}>
            Reset to Tagum City
          </button>
        </div>
      )}

      {/* Loading state */}
      {(loading || locLoading) && !weather && (
        <div style={{ textAlign: 'center', opacity: 0.6, padding: '24px 0', fontSize: 13 }}>
          Fetching weather data...
        </div>
      )}

      {/* Current weather */}
      {weather && (
        <div>
          {/* City + main temp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <img
              src={iconUrl(weather.weather.icon)}
              alt={weather.weather.description}
              style={{ width: 64, height: 64 }}
              onError={e => { e.target.style.fontSize = '48px'; e.target.outerHTML = '<span style="font-size:48px">🌡️</span>'; }}
            />
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
                {Math.round(weather.temp)}°C
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {weather.city_name}, {weather.country_code}
              </div>
              <div style={{ fontSize: 13, opacity: 0.75, textTransform: 'capitalize' }}>
                {weather.weather.description}
              </div>
            </div>
          </div>

          {/* Detail pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            <DetailPill icon="💧" label="Humidity"   value={`${weather.rh}%`} />
            <DetailPill icon="🌡️" label="Feels like" value={`${Math.round(weather.app_temp)}°C`} />
            <DetailPill icon="💨" label="Wind"       value={`${weather.wind_spd.toFixed(1)} m/s ${windDirection(weather.wind_dir)}`} />
            <DetailPill icon="👁️" label="Visibility" value={`${weather.vis} km`} />
          </div>

          {/* 5-day forecast */}
          {forecast.length > 0 && (
            <>
              <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                5-Day Forecast
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {forecast.map((f, i) => <ForecastCard key={i} entry={f} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}