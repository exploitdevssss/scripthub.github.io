import { useState, useEffect } from 'react';
import { HubConfig, UIElement, HubTheme, NotificationElement } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

export function PreviewPanel({ config }: { config: HubConfig }) {
  const [activeTabId, setActiveTabId] = useState<string | null>(config.tabs[0]?.id || null);
  const [toastMsg, setToastMsg] = useState<{ title: string; message: string; color: string } | null>(null);
  const theme = config.theme || { accent: '#a855f7', bg: '#1a1a24', bgAlt: '#2d2d3b', preset: 'neon-purple' };

  const width = Math.min(Math.max(theme.width || 560, 400), 700);
  const height = Math.min(Math.max(theme.height || 460, 300), 580);
  const radius = theme.borderRadius ?? 10;
  const opacity = (theme.opacity ?? 100) / 100;

  useEffect(() => {
    if (config.activeTabId && config.tabs.some(t => t.id === config.activeTabId)) {
      setActiveTabId(config.activeTabId);
    } else if (config.tabs.length > 0 && !config.tabs.some(t => t.id === activeTabId)) {
      setActiveTabId(config.tabs[0].id);
    }
  }, [config.activeTabId, config.tabs]);

  const activeTab = config.tabs.find(t => t.id === activeTabId);

  const fireToast = (el: NotificationElement) => {
    const colors = { info: theme.accent, success: '#22c55e', warning: '#f59e0b', error: '#ef4444' };
    setToastMsg({ title: el.title, message: el.message, color: colors[el.notifType] || theme.accent });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = config.tabs.find(t => t.id === tabId);
    const notif = tab?.elements.find(el => el.type === 'notification' && (el as NotificationElement).trigger === 'tab-load') as NotificationElement | undefined;
    if (notif) fireToast(notif);
  };

  return (
    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-20" style={{ backgroundColor: theme.accent }} />
      <div className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-15" style={{ backgroundColor: theme.accent }} />

      {/* Hub Window */}
      <motion.div
        key={`${width}-${height}-${radius}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6),_0_0_0_1px_rgba(255,255,255,0.05)]"
        style={{
          backgroundColor: theme.bg,
          opacity,
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${radius}px`,
          border: `1px solid ${theme.accent}33`,
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-5 border-b flex-shrink-0"
          style={{ backgroundColor: theme.bgAlt, borderColor: 'rgba(255,255,255,0.06)', height: '45px' }}
        >
          <span
            className="font-bold text-[17px] tracking-wide truncate pr-4"
            style={{ color: theme.titleColor || '#ffffff', fontFamily: 'sans-serif' }}
          >
            {config.name || "Untitled Hub"}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="h-[40px] flex items-center px-3 gap-1.5 overflow-x-auto no-scrollbar border-b flex-shrink-0"
          style={{ backgroundColor: theme.bgAlt + 'cc', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          {config.tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap"
              style={
                activeTabId === tab.id
                  ? { backgroundColor: theme.accent, color: '#fff' }
                  : { color: '#9fa0b4', backgroundColor: 'transparent' }
              }
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Elements */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 custom-scrollbar min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId || 'empty'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col gap-2.5 min-h-full"
            >
              {activeTab ? (
                activeTab.elements.length > 0 ? (
                  activeTab.elements.map(el => (
                    <PreviewElement
                      key={el.id}
                      element={el}
                      theme={theme}
                      bg={theme.bgAlt}
                      radius={radius}
                      onFireNotif={fireToast}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#6e6f85] text-sm mt-10 border-2 border-dashed border-white/5 rounded-xl p-8">
                    <p>Tab is empty</p>
                    <p className="text-xs mt-1">Add elements from the sidebar.</p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center text-[#6e6f85] text-sm mt-10">
                  Create a tab to begin.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="h-[28px] flex items-center px-4 border-t flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.04)', backgroundColor: theme.bgAlt + '80' }}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: theme.accent + '99' }}>
            Press RightAlt to toggle
          </span>
        </div>

        {/* In-hub notification toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-2xl"
              style={{ backgroundColor: toastMsg.color + '22', border: `1px solid ${toastMsg.color}50` }}
            >
              <Bell size={14} style={{ color: toastMsg.color }} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[12px] font-bold truncate">{toastMsg.title}</p>
                <p className="text-[11px] truncate" style={{ color: toastMsg.color + 'cc' }}>{toastMsg.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function PreviewElement({
  element, theme, bg, radius, onFireNotif
}: {
  element: UIElement;
  theme: HubTheme;
  bg: string;
  radius: number;
  onFireNotif: (el: NotificationElement) => void;
}) {
  const br = `${Math.max(4, radius * 0.6)}px`;

  if (element.type === 'section') {
    return (
      <div className="font-bold text-[11px] tracking-widest uppercase mt-3 mb-0.5 pl-1" style={{ color: theme.accent }}>
        {element.label}
      </div>
    );
  }

  if (element.type === 'notification') {
    const el = element as NotificationElement;
    const colors = { info: theme.accent, success: '#22c55e', warning: '#f59e0b', error: '#ef4444' };
    const icons = { info: 'ℹ', success: '✓', warning: '⚠', error: '✕' };
    const c = colors[el.notifType] || theme.accent;
    return (
      <button
        onClick={() => onFireNotif(el)}
        className="w-full text-left p-3 flex items-start gap-3 transition-all hover:brightness-110 active:scale-[0.99]"
        style={{ backgroundColor: c + '15', border: `1px solid ${c}40`, borderRadius: br }}
        title="Click to preview this notification"
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: c + '30', color: c }}>
          {icons[el.notifType]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{el.title}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: c + 'cc' }}>{el.message}</p>
          <p className="text-[10px] mt-1" style={{ color: c + '80' }}>
            🔔 {el.trigger === 'hub-load' ? 'On hub load' : 'On tab switch'} · {el.duration}s · Click to preview
          </p>
        </div>
      </button>
    );
  }

  if (element.type === 'button') {
    return (
      <button
        className="w-full py-2.5 text-[13px] font-semibold transition-all border border-white/5 active:scale-[0.98] hover:brightness-110 text-white"
        style={{ backgroundColor: bg, borderRadius: br }}
      >
        {element.label}
      </button>
    );
  }

  if (element.type === 'toggle') {
    const [on, setOn] = useState(element.defaultState);
    useEffect(() => { setOn(element.defaultState); }, [element.defaultState]);

    return (
      <button
        onClick={() => setOn(!on)}
        className="w-full flex justify-between items-center px-4 py-2.5 text-white text-[13px] border border-white/5 transition-all active:scale-[0.99] hover:brightness-110"
        style={{ backgroundColor: bg, borderRadius: br }}
      >
        <span className="font-semibold">{element.label}</span>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={on
              ? { color: theme.accent, backgroundColor: theme.accent + '22' }
              : { color: '#6e6f85', backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            {on ? 'ON' : 'OFF'}
          </span>
          <div className="w-8 h-4 rounded-full relative shadow-inner overflow-hidden border border-white/5" style={{ backgroundColor: '#15161e' }}>
            <motion.div animate={{ width: on ? '100%' : '0%' }} transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 bottom-0 rounded-full" style={{ backgroundColor: theme.accent }} />
            <motion.div animate={{ x: on ? 16 : 0 }} transition={{ duration: 0.2 }}
              className="absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </button>
    );
  }

  if (element.type === 'slider') {
    const [val, setVal] = useState(element.defaultValue);
    useEffect(() => { setVal(element.defaultValue); }, [element.defaultValue]);
    const pct = Math.max(0, Math.min(100, ((val - element.min) / Math.max(1, element.max - element.min)) * 100));

    return (
      <div className="w-full p-3.5 border border-white/5 flex flex-col gap-2.5 shadow-sm" style={{ backgroundColor: bg, borderRadius: br }}>
        <div className="flex justify-between text-white text-[13px] font-semibold">
          <span>{element.label}</span>
          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ color: theme.accent, backgroundColor: theme.accent + '22' }}>
            {val}
          </span>
        </div>
        <input
          type="range" min={element.min} max={element.max} value={val}
          onChange={e => setVal(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${theme.accent} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`, accentColor: theme.accent }}
        />
        <div className="flex justify-between text-[10px] text-[#6e6f85] font-medium font-mono">
          <span>{element.min}</span>
          <span>{element.max}</span>
        </div>
      </div>
    );
  }

  return null;
}
