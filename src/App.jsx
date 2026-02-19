import { useState, useEffect, useRef } from "react";

// ─── STYLES ─────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --maroon: #6B0F1A;
      --maroon-dark: #4A0A12;
      --maroon-light: #8B1A2A;
      --maroon-glow: rgba(107,15,26,0.4);
      --gold: #F5C518;
      --gold-light: #FFD84D;
      --gold-dark: #C8A000;
      --cream: #FFF8EE;
      --white: #FFFFFF;
      --text-dark: #1A0508;
      --text-muted: #7A5C62;
      --sidebar-w: 260px;
      --radius: 16px;
      --shadow: 0 8px 32px rgba(107,15,26,0.15);
      --shadow-lg: 0 20px 60px rgba(107,15,26,0.25);
    }

    html, body { height: 100%; width: 100%; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; background: var(--cream); overflow-x: hidden; }
    #root { min-height: 100%; width: 100%; }

    /* ── ANIMATIONS ── */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes pulse {
      0%,100% { transform: scale(1); }
      50%      { transform: scale(1.05); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes floatBg {
      0%,100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(-20px) rotate(2deg); }
      66%      { transform: translateY(10px) rotate(-1deg); }
    }
    @keyframes borderGlow {
      0%,100% { box-shadow: 0 0 20px var(--maroon-glow); }
      50%      { box-shadow: 0 0 40px rgba(245,197,24,0.4); }
    }
    @keyframes typewriter {
      from { width: 0; } to { width: 100%; }
    }
    @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
    @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes barGrow { from { height: 0; } to { height: var(--h); } }
    @keyframes lineDrawIn { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
    @keyframes chatBubble { from { opacity: 0; transform: translateY(8px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes weatherFade { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ripple { from { transform: scale(0); opacity: 0.4; } to { transform: scale(4); opacity: 0; } }
    @keyframes notifSlide { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--maroon-light); border-radius: 3px; }

    /* ── BUTTON BASE ── */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border: none; border-radius: 50px;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      color: var(--maroon-dark); box-shadow: 0 4px 20px rgba(245,197,24,0.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,197,24,0.6); }
    .btn-ghost { background: transparent; color: var(--gold); border: 1.5px solid var(--gold); }
    .btn-ghost:hover { background: rgba(245,197,24,0.1); transform: translateY(-2px); }

    /* ── INPUT ── */
    .input-group { position: relative; }
    .input-group input {
      width: 100%; padding: 14px 20px 14px 50px;
      background: rgba(255,255,255,0.08); border: 1.5px solid rgba(245,197,24,0.2);
      border-radius: 12px; color: var(--white); font-size: 15px; font-family: 'DM Sans', sans-serif;
      transition: all 0.3s ease; outline: none;
    }
    .input-group input::placeholder { color: rgba(255,255,255,0.4); }
    .input-group input:focus { border-color: var(--gold); background: rgba(255,255,255,0.12); box-shadow: 0 0 0 3px rgba(245,197,24,0.15); }
    .input-group .icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.5); font-size: 18px; }

    /* ── CARD ── */
    .card {
      background: var(--white); border-radius: var(--radius);
      box-shadow: var(--shadow); overflow: hidden;
    }
    .card-glass {
      background: rgba(255,255,255,0.7); backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.8); border-radius: var(--radius); box-shadow: var(--shadow);
    }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 260px; height: 100%;
      background: linear-gradient(160deg, var(--maroon-dark) 0%, var(--maroon) 50%, #8B1A2A 100%);
      display: flex; flex-direction: column;
      box-shadow: 4px 0 30px rgba(107,15,26,0.3);
      overflow: hidden; flex-shrink: 0; position: relative;
    }
    .sidebar::before {
      content: ''; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
    }
    .sidebar-logo {
      padding: 28px 24px; border-bottom: 1px solid rgba(245,197,24,0.15);
      display: flex; align-items: center; gap: 14px;
    }
    .logo-badge {
      width: 46px; height: 46px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 900; color: var(--maroon-dark); flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(245,197,24,0.4); animation: pulse 3s ease infinite;
    }
    .logo-text { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--white); line-height: 1.2; }
    .logo-sub { font-size: 11px; color: rgba(245,197,24,0.7); font-weight: 500; letter-spacing: 1px; text-transform: uppercase; }
    .sidebar-nav { flex: 1; padding: 20px 12px; overflow-y: auto; }
    .nav-section { margin-bottom: 24px; }
    .nav-label { font-size: 10px; font-weight: 700; color: rgba(245,197,24,0.5); letter-spacing: 2px; text-transform: uppercase; padding: 0 12px; margin-bottom: 8px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 12px; cursor: pointer;
      color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500;
      transition: all 0.25s ease; margin-bottom: 2px; position: relative; overflow: hidden;
    }
    .nav-item:hover { background: rgba(245,197,24,0.1); color: var(--gold-light); transform: translateX(3px); }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(245,197,24,0.2) 0%, rgba(245,197,24,0.08) 100%);
      color: var(--gold); border: 1px solid rgba(245,197,24,0.25);
    }
    .nav-item.active::before {
      content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
      width: 3px; height: 60%; background: var(--gold); border-radius: 0 2px 2px 0;
    }
    .nav-icon { font-size: 18px; width: 22px; flex-shrink: 0; }
    .nav-badge { margin-left: auto; background: var(--gold); color: var(--maroon-dark); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
    .sidebar-footer { padding: 16px; border-top: 1px solid rgba(245,197,24,0.15); }
    .user-card {
      display: flex; align-items: center; gap: 12px; padding: 12px;
      background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid rgba(245,197,24,0.1);
      cursor: pointer; transition: all 0.2s ease;
    }
    .user-card:hover { background: rgba(255,255,255,0.1); }
    .user-avatar {
      width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-light));
      display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--maroon-dark); font-size: 15px;
    }
    .user-info { flex: 1; }
    .user-name { font-size: 13px; font-weight: 600; color: var(--white); }
    .user-role { font-size: 11px; color: rgba(245,197,24,0.6); }

    /* ── TOPBAR ── */
    .topbar {
      position: sticky; top: 0; z-index: 50;
      background: rgba(255,248,238,0.92); backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(107,15,26,0.08);
      padding: 14px 28px; display: flex; align-items: center; gap: 16px;
      animation: fadeIn 0.4s ease; width: 100%; min-width: 0;
    }
    .topbar-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--maroon-dark); font-weight: 700; flex: 1; }
    .topbar-actions { display: flex; align-items: center; gap: 12px; }
    .icon-btn {
      width: 40px; height: 40px; border-radius: 12px; border: none;
      background: var(--white); display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 18px; box-shadow: 0 2px 12px rgba(107,15,26,0.1);
      transition: all 0.2s ease; position: relative;
    }
    .icon-btn:hover { background: var(--maroon); color: var(--gold); transform: translateY(-2px); }
    .notif-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: var(--gold); border-radius: 50%; border: 1.5px solid var(--cream); }

    /* ── LAYOUT ── */
    .app-layout { display: flex; min-height: 100vh; width: 100%; position: relative; }
    .main-content {
      flex: 1;
      min-width: 0;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
    }
    .page-content { flex: 1; padding: 28px; animation: fadeIn 0.4s ease; min-width: 0; overflow-x: hidden; }

    /* ── STAT CARDS ── */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
    .stat-card {
      background: var(--white); border-radius: var(--radius); padding: 24px;
      box-shadow: var(--shadow); position: relative; overflow: hidden;
      animation: fadeInUp var(--delay, 0.3s) ease both; cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid rgba(107,15,26,0.05);
    }
    .stat-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
    .stat-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--maroon), var(--gold));
    }
    .stat-accent {
      position: absolute; top: -20px; right: -20px;
      width: 80px; height: 80px; border-radius: 50%;
      background: var(--accent, var(--maroon)); opacity: 0.07;
    }
    .stat-icon { font-size: 28px; margin-bottom: 12px; }
    .stat-value { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: var(--maroon-dark); animation: countUp 0.6s ease both; }
    .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-top: 4px; }
    .stat-change { font-size: 12px; font-weight: 600; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
    .change-up { color: #16a34a; } .change-down { color: #dc2626; }

    /* ── CHARTS ── */
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .chart-card { background: var(--white); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); }
    .chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .chart-title { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--maroon-dark); font-weight: 700; }
    .chart-legend { display: flex; gap: 16px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; }

    /* Bar Chart */
    .bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 160px; }
    .bar-group { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 6px; height: 100%; }
    .bars { display: flex; gap: 4px; align-items: flex-end; height: calc(100% - 26px); width: 100%; justify-content: center; }
    .bar {
      flex: 1; border-radius: 6px 6px 0 0; max-width: 18px;
      animation: barGrow 0.8s ease both;
      animation-delay: var(--delay, 0s);
    }
    .bar-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }

    /* Line Chart SVG */
    .line-chart-wrap { height: 160px; }
    .line-chart-wrap svg { width: 100%; height: 100%; }
    .chart-line { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1000; animation: lineDrawIn 1.5s ease both; }
    .chart-area { opacity: 0.15; animation: fadeIn 1.5s ease both; }

    /* Donut Chart */
    .donut-wrap { display: flex; align-items: center; gap: 24px; }
    .donut-svg { width: 120px; height: 120px; flex-shrink: 0; transform: rotate(-90deg); }
    .donut-segment { transition: stroke-dashoffset 1s ease; }
    .donut-labels { flex: 1; }
    .donut-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .donut-color { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
    .donut-text { font-size: 13px; color: var(--text-muted); flex: 1; }
    .donut-pct { font-size: 13px; font-weight: 700; color: var(--maroon-dark); }

    /* ── BOTTOM GRID ── */
    .bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

    /* ── WEATHER ── */
    .weather-card {
      background: linear-gradient(135deg, var(--maroon) 0%, var(--maroon-dark) 100%);
      border-radius: var(--radius); padding: 24px; color: var(--white);
      position: relative; overflow: hidden; box-shadow: var(--shadow-lg);
      animation: weatherFade 0.6s ease;
    }
    .weather-card::before {
      content: '☁'; position: absolute; right: -20px; top: -20px;
      font-size: 120px; opacity: 0.06; animation: floatBg 6s ease infinite;
    }
    .weather-temp { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900; line-height: 1; color: var(--gold); }
    .weather-city { font-size: 14px; opacity: 0.8; margin-top: 4px; }
    .weather-desc { font-size: 16px; font-weight: 600; margin-top: 8px; }
    .weather-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
    .weather-detail { background: rgba(255,255,255,0.08); border-radius: 10px; padding: 10px; }
    .wd-label { font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; }
    .wd-val { font-size: 16px; font-weight: 700; margin-top: 2px; color: var(--gold-light); }
    .weather-loading { text-align: center; padding: 20px; opacity: 0.7; }

    /* ── CHATBOT ── */
    .chat-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); display: flex; flex-direction: column; height: 340px; }
    .chat-header { padding: 16px 20px; border-bottom: 1px solid rgba(107,15,26,0.08); display: flex; align-items: center; gap: 12px; }
    .chat-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--maroon), var(--maroon-light)); display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .chat-bot-name { font-weight: 700; font-size: 14px; color: var(--maroon-dark); }
    .chat-status { font-size: 11px; color: #16a34a; display: flex; align-items: center; gap: 4px; }
    .chat-status::before { content: ''; width: 6px; height: 6px; background: #16a34a; border-radius: 50%; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .msg { max-width: 80%; animation: chatBubble 0.3s ease; }
    .msg-bot { align-self: flex-start; }
    .msg-user { align-self: flex-end; }
    .msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; }
    .msg-bot .msg-bubble { background: var(--cream); color: var(--text-dark); border-bottom-left-radius: 4px; }
    .msg-user .msg-bubble { background: linear-gradient(135deg, var(--maroon), var(--maroon-light)); color: var(--white); border-bottom-right-radius: 4px; }
    .chat-input-row { padding: 12px 16px; border-top: 1px solid rgba(107,15,26,0.08); display: flex; gap: 8px; }
    .chat-input {
      flex: 1; padding: 10px 14px; border: 1.5px solid rgba(107,15,26,0.1);
      border-radius: 20px; font-size: 13px; font-family: 'DM Sans', sans-serif;
      outline: none; transition: all 0.2s ease;
    }
    .chat-input:focus { border-color: var(--gold); }
    .chat-send {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: linear-gradient(135deg, var(--maroon), var(--maroon-light));
      color: var(--gold); font-size: 16px; cursor: pointer; display: flex;
      align-items: center; justify-content: center; transition: all 0.2s ease; flex-shrink: 0;
    }
    .chat-send:hover { transform: scale(1.1); background: var(--gold); color: var(--maroon); }

    /* ── ACTIVITY ── */
    .activity-card { background: var(--white); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); }
    .activity-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(107,15,26,0.05); animation: fadeInUp 0.4s ease both; }
    .activity-item:last-child { border-bottom: none; }
    .act-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
    .act-text { font-size: 13px; color: var(--text-dark); line-height: 1.5; }
    .act-time { font-size: 11px; color: var(--text-muted); margin-top: 3px; }

    /* ── TABLE ── */
    .table-card { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    .table-head { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(107,15,26,0.08); }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; background: rgba(107,15,26,0.03); }
    td { padding: 14px 16px; font-size: 13px; color: var(--text-dark); border-bottom: 1px solid rgba(107,15,26,0.05); }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(245,197,24,0.04); }
    .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .status-enrolled { background: rgba(22,163,74,0.1); color: #16a34a; }
    .status-pending  { background: rgba(245,197,24,0.15); color: var(--gold-dark); }
    .status-dropped  { background: rgba(220,38,38,0.1); color: #dc2626; }

    /* ── LOGIN PAGE ── */
    .login-page {
      min-height: 100vh; display: flex;
      background: linear-gradient(135deg, var(--maroon-dark) 0%, var(--maroon) 40%, #8B1A2A 70%, #5C0F18 100%);
      position: relative; overflow: hidden;
    }
    .login-bg-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .bg-circle {
      position: absolute; border-radius: 50%;
      background: radial-gradient(circle, rgba(245,197,24,0.12), transparent);
      animation: floatBg var(--dur, 8s) ease infinite;
    }
    .login-left {
      flex: 1; display: flex; flex-direction: column; justify-content: center;
      padding: 60px; color: var(--white); animation: slideInLeft 0.8s ease;
      position: relative; z-index: 2;
    }
    .login-badge {
      display: inline-flex; align-items: center; gap: 12px; margin-bottom: 40px;
    }
    .login-logo {
      width: 64px; height: 64px; background: linear-gradient(135deg, var(--gold), var(--gold-light));
      border-radius: 18px; display: flex; align-items: center; justify-content: center;
      font-size: 30px; font-weight: 900; color: var(--maroon-dark);
      box-shadow: 0 8px 30px rgba(245,197,24,0.4); animation: pulse 3s ease infinite;
    }
    .login-brand { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
    .login-brand span { color: var(--gold); }
    .login-headline {
      font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900;
      line-height: 1.1; margin-bottom: 20px;
    }
    .login-headline .gold { color: var(--gold); }
    .login-sub { font-size: 16px; opacity: 0.7; line-height: 1.7; max-width: 420px; }
    .login-features { display: flex; flex-direction: column; gap: 14px; margin-top: 40px; }
    .feat-item { display: flex; align-items: center; gap: 12px; font-size: 14px; opacity: 0.85; }
    .feat-icon { width: 32px; height: 32px; background: rgba(245,197,24,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
    .login-right {
      width: 480px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      padding: 40px; position: relative; z-index: 2; animation: slideInRight 0.8s ease;
    }
    .login-form {
      width: 100%; background: rgba(255,255,255,0.07); backdrop-filter: blur(30px);
      border: 1px solid rgba(245,197,24,0.2); border-radius: 24px; padding: 44px;
      animation: borderGlow 4s ease infinite;
    }
    .form-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--white); margin-bottom: 6px; }
    .form-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 32px; }
    .form-group { margin-bottom: 18px; }
    .form-label { font-size: 12px; font-weight: 600; color: rgba(245,197,24,0.8); letter-spacing: 0.5px; margin-bottom: 8px; display: block; text-transform: uppercase; }
    .form-footer { text-align: center; margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.4); }
    .form-footer a { color: var(--gold); cursor: pointer; text-decoration: none; }
    .login-divider { display: flex; align-items: center; gap: 16px; margin: 20px 0; }
    .login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
    .login-divider span { font-size: 12px; color: rgba(255,255,255,0.3); }
    .remember-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .remember-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; }
    .remember-label input { accent-color: var(--gold); }
    .forgot-link { font-size: 13px; color: var(--gold); cursor: pointer; opacity: 0.8; }
    .forgot-link:hover { opacity: 1; }
    .error-msg { font-size: 12px; color: #f87171; margin-top: 8px; padding: 8px 12px; background: rgba(248,113,113,0.1); border-radius: 8px; border-left: 3px solid #f87171; }

    /* ── STUDENTS PAGE ── */
    .page-header { margin-bottom: 28px; animation: fadeInUp 0.4s ease; }
    .page-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: var(--maroon-dark); }
    .page-subtitle { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
    .filters-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-box { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--white); border: 1.5px solid rgba(107,15,26,0.1); border-radius: 50px; flex: 1; max-width: 340px; transition: all 0.2s ease; }
    .search-box:focus-within { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(245,197,24,0.1); }
    .search-box input { border: none; outline: none; font-size: 13px; font-family: 'DM Sans', sans-serif; flex: 1; background: transparent; }
    .filter-btn { padding: 10px 18px; border-radius: 50px; border: 1.5px solid rgba(107,15,26,0.1); background: var(--white); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; color: var(--text-dark); font-family: 'DM Sans', sans-serif; }
    .filter-btn.active, .filter-btn:hover { background: var(--maroon); color: var(--white); border-color: var(--maroon); }
    .add-btn {
      margin-left: auto; padding: 10px 20px; border-radius: 50px; border: none;
      background: linear-gradient(135deg, var(--maroon), var(--maroon-light));
      color: var(--gold); font-size: 13px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 6px; transition: all 0.2s ease;
      font-family: 'DM Sans', sans-serif;
    }
    .add-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(107,15,26,0.3); }
    .student-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .student-card {
      background: var(--white); border-radius: var(--radius); padding: 20px;
      box-shadow: var(--shadow); text-align: center; cursor: pointer;
      transition: all 0.3s ease; border: 1px solid rgba(107,15,26,0.05);
      animation: scaleIn 0.4s ease both;
    }
    .student-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(245,197,24,0.3); }
    .student-avatar { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: var(--white); }
    .student-name { font-weight: 700; font-size: 14px; color: var(--maroon-dark); }
    .student-id { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
    .student-course { font-size: 12px; color: var(--maroon); font-weight: 600; margin-top: 8px; padding: 4px 10px; background: rgba(107,15,26,0.06); border-radius: 20px; display: inline-block; }

    /* ── COURSES PAGE ── */
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .course-card {
      background: var(--white); border-radius: var(--radius); overflow: hidden;
      box-shadow: var(--shadow); transition: all 0.3s ease; animation: fadeInUp 0.5s ease both;
    }
    .course-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
    .course-banner { height: 90px; position: relative; display: flex; align-items: center; justify-content: center; font-size: 40px; }
    .course-body { padding: 20px; }
    .course-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--maroon-dark); margin-bottom: 6px; }
    .course-code { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .course-meta { display: flex; gap: 12px; margin-top: 12px; }
    .course-meta-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); }
    .course-progress { margin-top: 14px; }
    .progress-bar-wrap { height: 6px; background: rgba(107,15,26,0.08); border-radius: 3px; overflow: hidden; margin-top: 6px; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, var(--maroon), var(--gold)); border-radius: 3px; transition: width 1s ease; }

    /* ── ENROLLMENT PAGE ── */
    .enrollment-steps { display: flex; align-items: center; gap: 0; margin-bottom: 32px; }
    .step { display: flex; align-items: center; }
    .step-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; transition: all 0.3s ease; }
    .step-active .step-circle { background: var(--maroon); color: var(--gold); }
    .step-done .step-circle { background: var(--gold); color: var(--maroon-dark); }
    .step-pending .step-circle { background: rgba(107,15,26,0.1); color: var(--text-muted); }
    .step-label { font-size: 12px; font-weight: 600; margin-top: 6px; color: var(--text-muted); }
    .step-active .step-label { color: var(--maroon); }
    .step-connector { flex: 1; height: 2px; background: rgba(107,15,26,0.1); margin: 0 8px; }
    .step-wrap { display: flex; flex-direction: column; align-items: center; }
    .enroll-table { background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }

    /* ── REPORTS PAGE ── */
    .reports-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 28px; }
    .report-card {
      background: var(--white); border-radius: var(--radius); padding: 22px;
      box-shadow: var(--shadow); cursor: pointer; transition: all 0.3s ease;
      border-left: 4px solid transparent; animation: fadeInUp 0.4s ease both;
    }
    .report-card:hover { transform: translateX(4px); border-left-color: var(--gold); }
    .report-icon { font-size: 32px; margin-bottom: 12px; }
    .report-name { font-weight: 700; font-size: 15px; color: var(--maroon-dark); margin-bottom: 4px; }
    .report-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
    .report-download { margin-top: 14px; font-size: 12px; color: var(--maroon); font-weight: 600; display: flex; align-items: center; gap: 4px; }

    /* ── SETTINGS PAGE ── */
    .settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
    .settings-nav { background: var(--white); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow); }
    .settings-nav-item { padding: 10px 14px; border-radius: 10px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; color: var(--text-muted); transition: all 0.2s ease; margin-bottom: 4px; }
    .settings-nav-item.active, .settings-nav-item:hover { background: rgba(107,15,26,0.06); color: var(--maroon); font-weight: 600; }
    .settings-content { background: var(--white); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }
    .settings-section { margin-bottom: 28px; }
    .settings-section-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--maroon-dark); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(107,15,26,0.08); }
    .settings-field { margin-bottom: 16px; }
    .settings-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
    .settings-input { width: 100%; padding: 11px 16px; border: 1.5px solid rgba(107,15,26,0.1); border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s ease; color: var(--text-dark); }
    .settings-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(245,197,24,0.1); }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(107,15,26,0.05); }
    .toggle-label { font-size: 14px; color: var(--text-dark); }
    .toggle-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .toggle { position: relative; width: 42px; height: 24px; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; background: rgba(107,15,26,0.15); border-radius: 12px; cursor: pointer; transition: 0.3s; }
    .toggle-slider::before { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: var(--white); transition: 0.3s; }
    .toggle input:checked + .toggle-slider { background: var(--maroon); }
    .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

    /* ── MOBILE HAMBURGER ── */
    .hamburger { display: flex; width: 40px; height: 40px; border-radius: 10px; border: none; background: var(--maroon); color: var(--gold); font-size: 20px; cursor: pointer; align-items: center; justify-content: center; flex-shrink: 0; }
    .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-grid { grid-template-columns: 1fr; }
      .bottom-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 900px) {
      .overlay.open { display: block; }
      .main-content {
        margin-left: 0 !important;
        width: 100% !important;
      }
      .login-left { display: none; }
      .login-right { width: 100%; padding: 24px; }
      .page-content { padding: 20px 16px; }
      .topbar { padding: 12px 16px; }
      .bottom-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-grid { grid-template-columns: 1fr; }
      .bottom-grid { grid-template-columns: 1fr; }
      .page-content { padding: 14px 12px; }
      .reports-grid { grid-template-columns: 1fr 1fr; }
      .settings-layout { grid-template-columns: 1fr; }
      .student-grid { grid-template-columns: repeat(2, 1fr); }
      .stat-value { font-size: 28px; }
      .topbar-title { font-size: 18px; }
      .courses-grid { grid-template-columns: 1fr; }
      .filters-row { flex-wrap: wrap; }
      .search-box { max-width: 100%; width: 100%; }
      .enroll-table { overflow-x: auto; }
      table { min-width: 560px; }
    }

    @media (max-width: 400px) {
      .stats-grid { grid-template-columns: 1fr; }
      .reports-grid { grid-template-columns: 1fr; }
      .login-form { padding: 28px 20px; }
    }
  `}</style>
);

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: "2024-0001", name: "Maria Santos", course: "BSCS", year: 3, status: "Enrolled", gpa: 1.75, avatar: "#6B0F1A" },
  { id: "2024-0002", name: "Juan Dela Cruz", course: "BSIT", year: 2, status: "Enrolled", gpa: 1.50, avatar: "#8B4513" },
  { id: "2024-0003", name: "Ana Reyes", course: "BSIS", year: 4, status: "Enrolled", gpa: 1.25, avatar: "#2C5282" },
  { id: "2024-0004", name: "Carlos Mendoza", course: "BSCS", year: 1, status: "Pending", gpa: 2.00, avatar: "#276749" },
  { id: "2024-0005", name: "Lucia Torres", course: "BSIT", year: 3, status: "Enrolled", gpa: 1.75, avatar: "#744210" },
  { id: "2024-0006", name: "Miguel Garcia", course: "BSIS", year: 2, status: "Dropped", gpa: 3.00, avatar: "#553C9A" },
  { id: "2024-0007", name: "Sofia Lim", course: "BSCS", year: 4, status: "Enrolled", gpa: 1.00, avatar: "#C53030" },
  { id: "2024-0008", name: "Rafael Cruz", course: "BSIT", year: 1, status: "Pending", gpa: 2.25, avatar: "#285E61" },
];

const MOCK_COURSES = [
  { code: "CS101", name: "Introduction to Programming", units: 3, enrolled: 45, cap: 50, instructor: "Dr. Santos", icon: "💻", color: "#6B0F1A" },
  { code: "IT201", name: "Web Development", units: 3, enrolled: 38, cap: 40, instructor: "Prof. Reyes", icon: "🌐", color: "#1A365D" },
  { code: "IS301", name: "Database Management", units: 3, enrolled: 29, cap: 35, instructor: "Dr. Cruz", icon: "🗄️", color: "#1C4532" },
  { code: "CS202", name: "Data Structures", units: 3, enrolled: 40, cap: 45, instructor: "Prof. Lim", icon: "🔢", color: "#553C9A" },
  { code: "IT302", name: "Network Administration", units: 3, enrolled: 22, cap: 30, instructor: "Dr. Garcia", icon: "🔗", color: "#744210" },
  { code: "IS202", name: "Systems Analysis", units: 3, enrolled: 35, cap: 40, instructor: "Prof. Torres", icon: "📊", color: "#285E61" },
];

const MOCK_ENROLLMENTS = [
  { id: "ENR-001", student: "Maria Santos", course: "CS101", date: "2025-06-10", status: "Enrolled", fee: "₱5,200" },
  { id: "ENR-002", student: "Juan Dela Cruz", course: "IT201", date: "2025-06-11", status: "Enrolled", fee: "₱5,200" },
  { id: "ENR-003", student: "Ana Reyes", course: "IS301", date: "2025-06-12", status: "Pending", fee: "₱5,200" },
  { id: "ENR-004", student: "Carlos Mendoza", course: "CS202", date: "2025-06-13", status: "Pending", fee: "₱5,200" },
  { id: "ENR-005", student: "Lucia Torres", course: "IT302", date: "2025-06-14", status: "Dropped", fee: "₱5,200" },
  { id: "ENR-006", student: "Sofia Lim", course: "CS101", date: "2025-06-15", status: "Enrolled", fee: "₱5,200" },
];

const BOT_RESPONSES = {
  "hello": "Hello! Welcome to EduTrack Assistant 👋 How can I help you today?",
  "hi": "Hi there! 😊 I'm here to help with enrollment queries.",
  "enrollment": "Enrollment for the 2nd semester runs from June 10 - July 15, 2025. Visit the Enrollment page for details!",
  "schedule": "Class schedules are available under the Courses section. You can view them by department.",
  "grade": "Grades can be viewed in the student portal. Please contact your registrar for grade-related concerns.",
  "tuition": "Tuition fees vary by program. BSCS/BSIT: ₱25,000/sem. Scholarships are available!",
  "default": "I understand your concern. For detailed assistance, please contact the Registrar's Office or visit us at the Admin Building. 😊",
};

const ACTIVITIES = [
  { text: "Maria Santos enrolled in CS101 - Intro to Programming", time: "2 mins ago", color: "#16a34a" },
  { text: "New course IT402 Network Security has been added", time: "15 mins ago", color: "#6B0F1A" },
  { text: "Juan Dela Cruz updated his profile information", time: "1 hour ago", color: "#F5C518" },
  { text: "Ana Reyes dropped IT205 - Advanced Web Dev", time: "2 hours ago", color: "#dc2626" },
  { text: "System maintenance scheduled for June 20, 2025", time: "3 hours ago", color: "#2563eb" },
];

// ─── WEATHER COMPONENT ───────────────────────────────────────────────────────
function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use Open-Meteo (free, no API key needed)
    const fetchWeather = async () => {
      try {
        // Manila, Philippines coords
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FManila"
        );
        const data = await res.json();
        const wc = data.current.weather_code;
        const desc = wc === 0 ? "Clear Sky" : wc <= 3 ? "Partly Cloudy" : wc <= 49 ? "Foggy" : wc <= 69 ? "Rainy" : wc <= 79 ? "Snowy" : "Thunderstorm";
        const emoji = wc === 0 ? "☀️" : wc <= 3 ? "⛅" : wc <= 49 ? "🌫️" : wc <= 69 ? "🌧️" : "⛈️";
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          desc, emoji,
          city: "Manila, PH",
        });
      } catch {
        setWeather({ temp: 32, humidity: 75, wind: 14, desc: "Partly Cloudy", emoji: "⛅", city: "Manila, PH" });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="weather-card">
      {loading ? (
        <div className="weather-loading">🌀 Loading weather...</div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>📍 {weather.city}</div>
              <div className="weather-temp">{weather.temp}°C</div>
              <div className="weather-desc">{weather.emoji} {weather.desc}</div>
            </div>
            <div style={{ fontSize: 52, marginTop: -8 }}>{weather.emoji}</div>
          </div>
          <div className="weather-details">
            <div className="weather-detail">
              <div className="wd-label">Humidity</div>
              <div className="wd-val">{weather.humidity}%</div>
            </div>
            <div className="weather-detail">
              <div className="wd-label">Wind</div>
              <div className="wd-val">{weather.wind} km/h</div>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 11, opacity: 0.5 }}>Live via Open-Meteo API</div>
        </>
      )}
    </div>
  );
}

// ─── CHATBOT ────────────────────────────────────────────────────────────────
function Chatbot() {
  const [msgs, setMsgs] = useState([
    { role: "bot", text: "Hello! I'm EduBot 🎓 Ask me about enrollment, schedules, tuition, or grades!" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMsgs(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      const key = Object.keys(BOT_RESPONSES).find(k => userMsg.toLowerCase().includes(k));
      setMsgs(m => [...m, { role: "bot", text: BOT_RESPONSES[key || "default"] }]);
    }, 600);
  };

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div>
          <div className="chat-bot-name">EduBot Assistant</div>
          <div className="chat-status">Online</div>
        </div>
      </div>
      <div className="chat-messages">
        {msgs.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <div className="msg-bubble">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chat-input-row">
        <input className="chat-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask EduBot..." />
        <button className="chat-send" onClick={send}>➤</button>
      </div>
    </div>
  );
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
function BarChart() {
  const data = [
    { label: "Jan", a: 120, b: 95 }, { label: "Feb", a: 145, b: 110 },
    { label: "Mar", a: 162, b: 130 }, { label: "Apr", a: 138, b: 115 },
    { label: "May", a: 175, b: 148 }, { label: "Jun", a: 190, b: 162 },
  ];
  const max = 220;
  return (
    <div className="chart-card" style={{ animation: "fadeInUp 0.5s ease" }}>
      <div className="chart-header">
        <div className="chart-title">Enrollment Trends</div>
        <div className="chart-legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: "#6B0F1A" }} />Enrolled</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: "#F5C518" }} />New Students</div>
        </div>
      </div>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div className="bar-group" key={d.label}>
            <div className="bars">
              <div className="bar" style={{ "--h": `${(d.a / max) * 100}%`, height: `${(d.a / max) * 100}%`, background: "linear-gradient(to top, #6B0F1A, #8B1A2A)", "--delay": `${i * 0.1}s` }} />
              <div className="bar" style={{ "--h": `${(d.b / max) * 100}%`, height: `${(d.b / max) * 100}%`, background: "linear-gradient(to top, #F5C518, #FFD84D)", "--delay": `${i * 0.1 + 0.05}s` }} />
            </div>
            <div className="bar-label">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LINE CHART ───────────────────────────────────────────────────────────────
function LineChart() {
  const pts = [30, 55, 40, 70, 58, 80, 65, 90, 75, 95, 80, 100];
  const w = 400; const h = 140; const pad = 10;
  const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - pad * 2));
  const ys = pts.map(p => h - pad - (p / 110) * (h - pad * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = path + ` L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="chart-card" style={{ animation: "fadeInUp 0.6s ease" }}>
      <div className="chart-header">
        <div className="chart-title">GPA Distribution</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>2024-2025</div>
      </div>
      <div className="line-chart-wrap">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B0F1A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6B0F1A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#areaGrad)" className="chart-area" />
          <path d={path} className="chart-line" stroke="#6B0F1A" />
          <path d={path.replace("M", "M").replace(/L/g, "L")} className="chart-line" stroke="#F5C518" strokeWidth="1.5" strokeDasharray="4 4" style={{ transform: "translateY(-8px)" }} />
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r="3" fill="#F5C518" stroke="#6B0F1A" strokeWidth="1.5" style={{ animation: `fadeIn ${0.1 * i + 0.5}s ease both` }} />
          ))}
          {months.map((m, i) => (
            <text key={i} x={xs[i]} y={h - 1} textAnchor="middle" fontSize="9" fill="#7A5C62">{m}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function DonutChart() {
  const segs = [
    { label: "BSCS", pct: 38, color: "#6B0F1A" },
    { label: "BSIT", pct: 32, color: "#F5C518" },
    { label: "BSIS", pct: 20, color: "#8B1A2A" },
    { label: "Others", pct: 10, color: "#C8A000" },
  ];
  const r = 45; const cx = 60; const cy = 60; const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="chart-card" style={{ animation: "fadeInUp 0.7s ease" }}>
      <div className="chart-header">
        <div className="chart-title">By Program</div>
      </div>
      <div className="donut-wrap">
        <svg className="donut-svg" viewBox="0 0 120 120">
          {segs.map((s, i) => {
            const dash = (s.pct / 100) * circ;
            const seg = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="16"
                strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
                style={{ transition: "stroke-dashoffset 1s ease", strokeLinecap: "butt" }} />
            );
            offset += dash;
            return seg;
          })}
          <circle cx={cx} cy={cy} r={r - 10} fill="white" />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#4A0A12">1,247</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#7A5C62">Students</text>
        </svg>
        <div className="donut-labels">
          {segs.map(s => (
            <div key={s.label} className="donut-item">
              <div className="donut-color" style={{ background: s.color }} />
              <div className="donut-text">{s.label}</div>
              <div className="donut-pct">{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function Dashboard() {
  const stats = [
    { icon: "👨‍🎓", label: "Total Students", value: "1,247", change: "+12%", up: true, accent: "#6B0F1A", delay: "0.2s" },
    { icon: "📚", label: "Active Courses", value: "48", change: "+3", up: true, accent: "#F5C518", delay: "0.3s" },
    { icon: "📋", label: "Enrollments", value: "983", change: "+8%", up: true, accent: "#8B1A2A", delay: "0.4s" },
    { icon: "🏆", label: "Avg. GPA", value: "1.85", change: "-0.05", up: false, accent: "#C8A000", delay: "0.5s" },
  ];

  return (
    <div>
      {/* STAT CARDS */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ "--delay": s.delay }}>
            <div className="stat-accent" style={{ "--accent": s.accent }} />
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? "change-up" : "change-down"}`}>
              {s.up ? "↑" : "↓"} {s.change} vs last sem
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <BarChart />
        <LineChart />
      </div>

      {/* BOTTOM GRID */}
      <div className="bottom-grid">
        <WeatherWidget />
        <Chatbot />
        <div className="activity-card">
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "var(--maroon-dark)", marginBottom: 14 }}>Recent Activity</div>
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="activity-item" style={{ "--delay": `${i * 0.1}s` }}>
              <div className="act-dot" style={{ background: a.color, marginTop: 5 }} />
              <div>
                <div className="act-text">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STUDENTS PAGE ────────────────────────────────────────────────────────────
function Students() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Enrolled", "Pending", "Dropped"];
  const filtered = MOCK_STUDENTS.filter(s =>
    (filter === "All" || s.status === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
  );
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Students</div>
        <div className="page-subtitle">Manage student records and profiles</div>
      </div>
      <div className="filters-row">
        <div className="search-box">
          <span>🔍</span>
          <input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {statuses.map(s => <button key={s} className={`filter-btn ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>)}
        <button className="add-btn">+ Add Student</button>
      </div>
      <div className="student-grid">
        {filtered.map((s, i) => (
          <div key={s.id} className="student-card" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="student-avatar" style={{ background: s.avatar }}>{s.name.split(" ").map(n => n[0]).join("")}</div>
            <div className="student-name">{s.name}</div>
            <div className="student-id">{s.id} • Year {s.year}</div>
            <div className="student-course">{s.course}</div>
            <span className={`status-badge status-${s.status.toLowerCase()}`} style={{ marginTop: 8, display: "inline-block" }}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COURSES PAGE ─────────────────────────────────────────────────────────────
function Courses() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Courses</div>
        <div className="page-subtitle">Browse and manage academic courses</div>
      </div>
      <div className="filters-row">
        <div className="search-box"><span>🔍</span><input placeholder="Search courses..." /></div>
        <button className="add-btn">+ Add Course</button>
      </div>
      <div className="courses-grid">
        {MOCK_COURSES.map((c, i) => (
          <div key={c.code} className="course-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="course-banner" style={{ background: `linear-gradient(135deg, ${c.color}22, ${c.color}44)` }}>
              <span style={{ fontSize: 48 }}>{c.icon}</span>
            </div>
            <div className="course-body">
              <div className="course-code">{c.code} • {c.units} Units</div>
              <div className="course-name">{c.name}</div>
              <div className="course-meta">
                <div className="course-meta-item">👨‍🏫 {c.instructor}</div>
                <div className="course-meta-item">👥 {c.enrolled}/{c.cap}</div>
              </div>
              <div className="course-progress">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                  <span>Capacity</span><span>{Math.round((c.enrolled / c.cap) * 100)}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${(c.enrolled / c.cap) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ENROLLMENT PAGE ──────────────────────────────────────────────────────────
function Enrollment() {
  const steps = ["Select Student", "Choose Course", "Review", "Confirm"];
  const [active, setActive] = useState(1);
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Enrollment</div>
        <div className="page-subtitle">Process student course enrollments</div>
      </div>
      {/* Steps */}
      <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "24px 32px", boxShadow: "var(--shadow)", marginBottom: 24 }}>
        <div className="enrollment-steps">
          {steps.map((s, i) => (
            <div key={s} className="step" style={{ flex: 1 }}>
              <div className="step-wrap" onClick={() => setActive(i)} style={{ cursor: "pointer", flex: 1, alignItems: "center" }}>
                <div className={`step-circle ${i < active ? "step-done" : i === active ? "step-active" : "step-pending"}`}>
                  {i < active ? "✓" : i + 1}
                </div>
                <div className={`step-label ${i === active ? "step-active" : ""}`}>{s}</div>
              </div>
              {i < steps.length - 1 && <div className="step-connector" style={{ flex: 1, marginBottom: 18 }} />}
            </div>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="enroll-table">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(107,15,26,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "var(--maroon-dark)" }}>Enrollment Records</span>
          <button className="add-btn">+ New Enrollment</button>
        </div>
        <table>
          <thead><tr>
            <th>ID</th><th>Student</th><th>Course</th><th>Date</th><th>Fee</th><th>Status</th>
          </tr></thead>
          <tbody>
            {MOCK_ENROLLMENTS.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 600, color: "var(--maroon)" }}>{e.id}</td>
                <td>{e.student}</td>
                <td>{e.course}</td>
                <td>{e.date}</td>
                <td>{e.fee}</td>
                <td><span className={`status-badge status-${e.status.toLowerCase()}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function Reports() {
  const reports = [
    { icon: "📊", name: "Enrollment Summary", desc: "Complete overview of all student enrollments by semester and department.", color: "#6B0F1A" },
    { icon: "📈", name: "GPA Analytics", desc: "Academic performance analysis across all programs and year levels.", color: "#1A365D" },
    { icon: "💰", name: "Financial Report", desc: "Tuition fees collected, pending payments, and scholarship breakdowns.", color: "#1C4532" },
    { icon: "🎓", name: "Graduation Report", desc: "Students eligible for graduation and completion status tracking.", color: "#553C9A" },
    { icon: "📅", name: "Attendance Report", desc: "Class attendance rates and patterns across all courses.", color: "#744210" },
    { icon: "🔍", name: "Audit Trail", desc: "System activity logs and administrative action records.", color: "#285E61" },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Reports</div>
        <div className="page-subtitle">Generate and export system reports</div>
      </div>
      <div className="reports-grid">
        {reports.map((r, i) => (
          <div key={r.name} className="report-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="report-icon">{r.icon}</div>
            <div className="report-name">{r.name}</div>
            <div className="report-desc">{r.desc}</div>
            <div className="report-download">⬇ Download PDF</div>
          </div>
        ))}
      </div>
      {/* Summary Charts in Reports */}
      <div className="charts-grid">
        <BarChart />
        <DonutChart />
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function Settings() {
  const [settingsTab, setSettingsTab] = useState("Profile");
  const tabs = [
    { label: "Profile", icon: "👤" }, { label: "Security", icon: "🔒" },
    { label: "Notifications", icon: "🔔" }, { label: "System", icon: "⚙️" },
    { label: "Integrations", icon: "🔗" },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Configure system preferences and account settings</div>
      </div>
      <div className="settings-layout">
        <div className="settings-nav">
          {tabs.map(t => (
            <div key={t.label} className={`settings-nav-item ${settingsTab === t.label ? "active" : ""}`} onClick={() => setSettingsTab(t.label)}>
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
        <div className="settings-content">
          {settingsTab === "Profile" && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Personal Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {["First Name", "Last Name", "Email Address", "Phone Number"].map(f => (
                    <div key={f} className="settings-field">
                      <label className="settings-label">{f}</label>
                      <input className="settings-input" defaultValue={f === "Email Address" ? "admin@edutrack.edu.ph" : f === "First Name" ? "Admin" : f === "Last Name" ? "User" : "+63 912 345 6789"} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="settings-section">
                <div className="settings-section-title">Academic Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="settings-field"><label className="settings-label">Department</label><input className="settings-input" defaultValue="Information Technology" /></div>
                  <div className="settings-field"><label className="settings-label">Role</label><input className="settings-input" defaultValue="System Administrator" /></div>
                </div>
              </div>
            </>
          )}
          {settingsTab === "Notifications" && (
            <div className="settings-section">
              <div className="settings-section-title">Notification Preferences</div>
              {["Email notifications for new enrollments", "SMS alerts for payment updates", "System maintenance announcements", "Grade submission reminders", "Weekly enrollment reports"].map(item => (
                <div key={item} className="toggle-row">
                  <div><div className="toggle-label">{item}</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
                </div>
              ))}
            </div>
          )}
          {settingsTab === "Security" && (
            <div className="settings-section">
              <div className="settings-section-title">Change Password</div>
              {["Current Password", "New Password", "Confirm Password"].map(f => (
                <div key={f} className="settings-field">
                  <label className="settings-label">{f}</label>
                  <input className="settings-input" type="password" placeholder="••••••••" />
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 8 }}>Update Password</button>
            </div>
          )}
          {(settingsTab === "System" || settingsTab === "Integrations") && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{settingsTab === "System" ? "⚙️" : "🔗"}</div>
              <div style={{ fontWeight: 600 }}>{settingsTab} settings coming soon</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Ready for Laravel REST API integration</div>
            </div>
          )}
          {settingsTab !== "Notifications" && settingsTab !== "Security" && settingsTab !== "System" && settingsTab !== "Integrations" && (
            <button className="btn btn-primary" style={{ marginTop: 16 }}>Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", page: "dashboard" },
  { label: "Students", icon: "👨‍🎓", page: "students", badge: "12" },
  { label: "Courses", icon: "📚", page: "courses" },
  { label: "Enrollment", icon: "📋", page: "enrollment", badge: "5" },
  { label: "Reports", icon: "📈", page: "reports" },
  { label: "Settings", icon: "⚙️", page: "settings" },
];

function Sidebar({ page, setPage, onClose }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
          <div className="logo-badge">E</div>
          <div className="logo-text">
            EduTrack<br />
            <span className="logo-sub">Enrollment System</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Main Menu</div>
            {NAV_ITEMS.map(item => (
              <div key={item.page} className={`nav-item ${page === item.page ? "active" : ""}`}
                onClick={() => { setPage(item.page); onClose(); }}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-label">Quick Info</div>
            <div style={{ padding: "10px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              <div>📅 Semester: 2nd, 2024-25</div>
              <div>🏫 Academic Year: 2024-2025</div>
              <div>📌 Version: 1.0.0-beta</div>
            </div>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">System Administrator</div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>⋮</span>
          </div>
        </div>
      </aside>
  );
}

// ─── DASHBOARD LAYOUT ─────────────────────────────────────────────────────────
function DashboardLayout({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const titles = { dashboard: "Dashboard", students: "Students", courses: "Courses", enrollment: "Enrollment", reports: "Reports", settings: "Settings" };

  const handleHamburger = () => {
    if (isMobile) {
      setSidebarOpen(o => !o);
    } else {
      setDesktopCollapsed(c => !c);
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const mainMargin = isMobile ? 0 : (desktopCollapsed ? 0 : 260);

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <Dashboard />;
      case "students":   return <Students />;
      case "courses":    return <Courses />;
      case "enrollment": return <Enrollment />;
      case "reports":    return <Reports />;
      case "settings":   return <Settings />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "36px 40px",
            width: "100%", maxWidth: 380, textAlign: "center",
            boxShadow: "0 30px 80px rgba(107,15,26,0.3)",
            animation: "scaleIn 0.25s ease",
            position: "relative", overflow: "hidden",
          }}>
            {/* top accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--maroon), var(--gold))" }} />

            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--maroon), var(--maroon-light))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 18px", boxShadow: "0 8px 24px rgba(107,15,26,0.25)",
            }}>🚪</div>

            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--maroon-dark)", marginBottom: 8 }}>
              Sign Out?
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 28 }}>
              You're about to sign out of EduTrack.<br />Any unsaved changes may be lost.
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1, padding: "12px", borderRadius: 50, border: "1.5px solid rgba(107,15,26,0.15)",
                  background: "transparent", color: "var(--text-muted)", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.target.style.background = "rgba(107,15,26,0.05)"; e.target.style.color = "var(--maroon)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--text-muted)"; }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutModal(false); onLogout(); }}
                style={{
                  flex: 1, padding: "12px", borderRadius: 50, border: "none",
                  background: "linear-gradient(135deg, var(--maroon), var(--maroon-light))",
                  color: "var(--gold)", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(107,15,26,0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(107,15,26,0.45)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 16px rgba(107,15,26,0.35)"; }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 260, zIndex: 100,
        transform: `translateX(${isMobile ? (sidebarOpen ? 0 : -260) : (desktopCollapsed ? -260 : 0)}px)`,
        transition: "transform 0.3s ease",
      }}>
        <Sidebar page={page} setPage={setPage} open={true} onClose={() => {
          if (isMobile) setSidebarOpen(false);
        }} />
      </div>
      {isMobile && sidebarOpen && (
        <div className="overlay open" onClick={() => setSidebarOpen(false)} />
      )}
      <div
        className="main-content"
        style={{
          marginLeft: mainMargin,
          width: `calc(100% - ${mainMargin}px)`,
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <div className="topbar">
          <button className="hamburger" onClick={handleHamburger}>☰</button>
          <div className="topbar-title">{titles[page]}</div>
          <div className="topbar-actions">
            <button className="icon-btn" title="Notifications">
              🔔<span className="notif-dot" />
            </button>
            <button className="icon-btn" title="Search">🔍</button>
            <button className="icon-btn" title="Sign Out" onClick={() => setShowLogoutModal(true)} style={{ background: "var(--maroon)", color: "var(--gold)" }}>🚪</button>
          </div>
        </div>
        <div className="page-content">{renderPage()}</div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handle = () => {
    if (!email || !pass) { setError("Please fill in all fields."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        {[
          { size: 500, top: "-15%", left: "-10%", dur: "10s" },
          { size: 400, bottom: "-10%", right: "-5%", dur: "14s" },
          { size: 300, top: "30%", right: "20%", dur: "8s" },
          { size: 200, top: "60%", left: "30%", dur: "12s" },
        ].map((c, i) => (
          <div key={i} className="bg-circle" style={{ width: c.size, height: c.size, top: c.top, left: c.left, bottom: c.bottom, right: c.right, "--dur": c.dur }} />
        ))}
      </div>

      <div className="login-left">
        <div className="login-badge">
          <div className="login-logo">🎓</div>
          <div>
            <div className="login-brand">Edu<span>Track</span></div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Enrollment Management System</div>
          </div>
        </div>
        <div className="login-headline">
          Empowering<br />
          <span className="gold">Academic</span><br />
          Excellence
        </div>
        <div className="login-sub">
          A comprehensive, modern enrollment system designed to streamline academic administration and enhance student experiences across all departments.
        </div>
        <div className="login-features">
          {[
            { icon: "📊", text: "Real-time enrollment analytics and reports" },
            { icon: "🔗", text: "Seamless Laravel REST API integration ready" },
            { icon: "🎓", text: "Complete student lifecycle management" },
            { icon: "🌐", text: "Live weather and campus information feed" },
          ].map(f => (
            <div key={f.text} className="feat-item">
              <div className="feat-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-form">
          <div className="form-title">Welcome back</div>
          <div className="form-sub">Sign in to your EduTrack account to continue</div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="icon">✉</span>
              <input type="email" placeholder="admin@edutrack.edu.ph" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="icon">🔒</span>
              <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} style={{ paddingRight: 44 }} />
              <span onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 16 }}>{showPass ? "🙈" : "👁"}</span>
            </div>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <div className="remember-row">
            <label className="remember-label"><input type="checkbox" /> Remember me</label>
            <span className="forgot-link">Forgot password?</span>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 16 }}
            onClick={handle} disabled={loading}>
            {loading ? <span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⟳</span> : null}
            {loading ? " Authenticating..." : "Sign In"}
          </button>

          <div className="login-divider"><span>or</span></div>

          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
            🔑 Login with Student ID
          </button>

          <div className="form-footer">
            Don't have an account? <a>Contact your administrator</a>
          </div>

          <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(245,197,24,0.08)", borderRadius: 10, border: "1px solid rgba(245,197,24,0.15)", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            🎯 Demo: Use any email + password to enter
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <GlobalStyles />
      {loggedIn
        ? <DashboardLayout onLogout={() => setLoggedIn(false)} />
        : <LoginPage onLogin={() => setLoggedIn(true)} />
      }
    </>
  );
}