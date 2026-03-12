// src/components/WeatherWidget.jsx
import { useState, useEffect } from 'react';
import { geocodeCity, reverseGeocode, fetchWeather, getWeatherInfo, windDirection } from '../services/weatherApi';

const DEFAULT_CITY = 'Tagum';

function ForecastCard({ date, code, high, low }) {
  const { desc, emoji } = getWeatherInfo(code);
  const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)', borderRadius: 10,
      padding: '10px 8px', textAlign: 'center', flex: 1, minWidth: 80,
    }}>
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{day}</div>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{Math.round(high)}°C</div>
      <div style={{ fontSize: 11, opacity: 0.6 }}>{Math.round(low)}°C</div>
      <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>{desc}</div>
    </div>
  );
}

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

export default function WeatherWidget() {
  const [input, setInput]         = useState('');
  const [location, setLocation]   = useState(null);
  const [current, setCurrent]     = useState(null);
  const [forecast, setForecast]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => { loadCity(DEFAULT_CITY); }, []);

  const loadCity = async (city) => {
    setLoading(true);
    setError('');
    try {
      const loc  = await geocodeCity(city);
      const data = await fetchWeather(loc.lat, loc.lon);
      setLocation(loc);
      setCurrent(data.current);
      // skip today (index 0), take next 5 days
      setForecast(
        data.daily.time.slice(1, 6).map((date, i) => ({
          date,
          code: data.daily.weather_code[i + 1],
          high: data.daily.temperature_2m_max[i + 1],
          low:  data.daily.temperature_2m_min[i + 1],
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) loadCity(input.trim());
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); return; }
    setLocLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const loc  = await reverseGeocode(coords.latitude, coords.longitude);
          const data = await fetchWeather(loc.lat, loc.lon);
          setLocation(loc);
          setCurrent(data.current);
          setForecast(
            data.daily.time.slice(1, 6).map((date, i) => ({
              date,
              code: data.daily.weather_code[i + 1],
              high: data.daily.temperature_2m_max[i + 1],
              low:  data.daily.temperature_2m_min[i + 1],
            }))
          );
        } catch (err) {
          setError(err.message);
        } finally {
          setLocLoading(false);
        }
      },
      () => { setError('Location access denied. Search by city name instead.'); setLocLoading(false); }
    );
  };

  const { desc, emoji } = current ? getWeatherInfo(current.weather_code) : {};

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
          {location
            ? `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}, ${location.country}`
            : 'Tagum City, Davao del Norte, Philippines'
          } · Powered by Open-Meteo
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search city..."
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
        }}>{loading ? '...' : '🔍'}</button>
        <button type="button" onClick={handleGeolocate} disabled={locLoading}
          title="Use my location" style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 14,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            cursor: locLoading ? 'not-allowed' : 'pointer',
            opacity: locLoading ? 0.7 : 1,
          }}>{locLoading ? '...' : '📍'}</button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)',
          borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 12,
        }}>
          ⚠️ {error}
          <button onClick={() => { setError(''); loadCity(DEFAULT_CITY); }} style={{
            marginLeft: 10, background: 'none', border: 'none',
            color: 'var(--gold)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline',
          }}>Reset to Tagum City</button>
        </div>
      )}

      {/* Loading */}
      {(loading || locLoading) && !current && (
        <div style={{ textAlign: 'center', opacity: 0.6, padding: '24px 0', fontSize: 13 }}>
          Fetching weather data...
        </div>
      )}

      {/* Current weather */}
      {current && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
                {Math.round(current.temperature_2m)}°C
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                {location?.name}, {location?.country}
              </div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>{desc}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            <DetailPill icon="💧" label="Humidity"   value={`${current.relative_humidity_2m}%`} />
            <DetailPill icon="🌡️" label="Feels like" value={`${Math.round(current.apparent_temperature)}°C`} />
            <DetailPill icon="💨" label="Wind"       value={`${current.wind_speed_10m.toFixed(1)} km/h ${windDirection(current.wind_direction_10m)}`} />
            <DetailPill icon="👁️" label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} />
          </div>

          {forecast.length > 0 && (
            <>
              <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                5-Day Forecast
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {forecast.map((f, i) => <ForecastCard key={i} {...f} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}