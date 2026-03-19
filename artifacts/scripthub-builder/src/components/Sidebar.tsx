import { useState } from 'react';
import { Plus, Trash2, AlignLeft, ToggleLeft, SlidersHorizontal, MousePointerClick, Palette, Bell, ChevronUp, ChevronDown, Copy, RotateCcw, Settings2 } from 'lucide-react';
import { UIElement, ElementType, THEME_PRESETS, HubTheme, ROBLOX_FONTS, NotificationElement } from '../lib/types';
import { useHubBuilder } from '../hooks/use-hub-builder';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_LABELS: Record<string, string> = {
  'neon-purple': 'Neon Purple',
  'cyber-cyan': 'Cyber Cyan',
  'blood-red': 'Blood Red',
  'matrix-green': 'Matrix Green',
  'electric-blue': 'Electric Blue',
  'gold-rush': 'Gold Rush',
};

export function Sidebar({ builder }: { builder: ReturnType<typeof useHubBuilder> }) {
  const {
    config, activeTab, updateName, addTab, updateTab, deleteTab, setActiveTab,
    addElement, updateTheme, resetToDefault,
  } = builder;
  const [themeOpen, setThemeOpen] = useState(false);
  const [hubSettingsOpen, setHubSettingsOpen] = useState(false);

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full z-20 shadow-xl shadow-black/50">
      {/* Header */}
      <div className="p-5 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent flex items-center gap-2">
            <span className="text-primary text-xl">{"</>"}</span> SCRIPTHUB
          </h1>
          <button
            onClick={resetToDefault}
            title="Reset to defaults"
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Window Title</label>
          <input
            value={config.name}
            onChange={e => updateName(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            placeholder="Enter Hub Name..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {/* Theme Section */}
        <div className="p-5 border-b border-border/50">
          <button onClick={() => setThemeOpen(v => !v)} className="w-full flex items-center justify-between mb-1 group">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 cursor-pointer">
              <Palette size={11} />
              UI Theme
            </label>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-border/60 flex-shrink-0" style={{ backgroundColor: config.theme?.accent || '#a855f7' }} />
              <ChevronDown size={12} className={`text-muted-foreground transition-transform ${themeOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {themeOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 flex flex-col gap-3">
                  {/* Preset swatches */}
                  <div>
                    <p className="text-[10px] text-muted-foreground/70 mb-2">Presets</p>
                    <div className="grid grid-cols-3 gap-2">
                      {THEME_PRESETS.map(preset => (
                        <button
                          key={preset.preset}
                          onClick={() => updateTheme(preset)}
                          title={PRESET_LABELS[preset.preset]}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                            config.theme?.preset === preset.preset
                              ? 'border-primary/60 bg-primary/10'
                              : 'border-border/40 bg-background hover:border-border'
                          }`}
                        >
                          <div className="w-full h-6 rounded-md border border-white/10" style={{ backgroundColor: preset.bg }}>
                            <div className="w-1/2 h-full rounded-md" style={{ backgroundColor: preset.accent }} />
                          </div>
                          <span className="text-[9px] text-muted-foreground font-medium leading-tight text-center">{PRESET_LABELS[preset.preset]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom colors */}
                  <div>
                    <p className="text-[10px] text-muted-foreground/70 mb-2">Custom Colors</p>
                    <div className="grid grid-cols-2 gap-2">
                      <ColorField label="Accent" value={config.theme?.accent || '#a855f7'} onChange={v => updateTheme({ accent: v, preset: 'custom' })} />
                      <ColorField label="Background" value={config.theme?.bg || '#1a1a24'} onChange={v => updateTheme({ bg: v, preset: 'custom' })} />
                      <ColorField label="BG Alt" value={config.theme?.bgAlt || '#2d2d3b'} onChange={v => updateTheme({ bgAlt: v, preset: 'custom' })} />
                      <ColorField label="Title Color" value={config.theme?.titleColor || '#ffffff'} onChange={v => updateTheme({ titleColor: v })} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hub Settings */}
        <div className="p-5 border-b border-border/50">
          <button onClick={() => setHubSettingsOpen(v => !v)} className="w-full flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 cursor-pointer">
              <Settings2 size={11} />
              Hub Settings
            </label>
            <ChevronDown size={12} className={`text-muted-foreground transition-transform ${hubSettingsOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {hubSettingsOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="pt-3 flex flex-col gap-3">
                  {/* Width / Height */}
                  <div className="grid grid-cols-2 gap-2">
                    <RangeField
                      label={`Width: ${config.theme?.width || 560}px`}
                      min={400} max={750} value={config.theme?.width || 560}
                      onChange={v => updateTheme({ width: v })}
                      accent={config.theme?.accent}
                    />
                    <RangeField
                      label={`Height: ${config.theme?.height || 460}px`}
                      min={300} max={580} value={config.theme?.height || 460}
                      onChange={v => updateTheme({ height: v })}
                      accent={config.theme?.accent}
                    />
                  </div>
                  {/* Border Radius */}
                  <RangeField
                    label={`Corner Radius: ${config.theme?.borderRadius ?? 10}`}
                    min={0} max={20} value={config.theme?.borderRadius ?? 10}
                    onChange={v => updateTheme({ borderRadius: v })}
                    accent={config.theme?.accent}
                    fullWidth
                  />
                  {/* Opacity */}
                  <RangeField
                    label={`Opacity: ${config.theme?.opacity ?? 100}%`}
                    min={50} max={100} value={config.theme?.opacity ?? 100}
                    onChange={v => updateTheme({ opacity: v })}
                    accent={config.theme?.accent}
                    fullWidth
                  />
                  {/* Font */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Title Font</label>
                    <select
                      value={config.theme?.font || 'GothamBold'}
                      onChange={e => updateTheme({ font: e.target.value })}
                      className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {ROBLOX_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Interface Tabs</label>
            <button onClick={addTab} className="text-primary hover:text-primary/80 transition-colors p-1 bg-primary/10 rounded-md hover:bg-primary/20">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {config.tabs.map(tab => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={tab.id}
                  className={`group flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                    config.activeTabId === tab.id
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                      : 'bg-background border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex-1 px-1">
                    {config.activeTabId === tab.id ? (
                      <input
                        value={tab.name}
                        onChange={e => updateTab(tab.id, e.target.value)}
                        className="bg-transparent w-full text-sm font-semibold outline-none text-primary"
                        onClick={e => e.stopPropagation()}
                        placeholder="Tab Name"
                      />
                    ) : (
                      <span className="text-sm font-medium">{tab.name}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground/50">{tab.elements.length}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTab(tab.id); }}
                    className={`p-1.5 rounded-md transition-colors ${
                      config.activeTabId === tab.id
                        ? 'text-primary/60 hover:text-destructive hover:bg-destructive/10'
                        : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive'
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {config.tabs.length === 0 && (
              <div className="text-xs text-muted-foreground/50 text-center py-4 border border-dashed border-border/50 rounded-lg">
                No tabs yet.
              </div>
            )}
          </div>
        </div>

        {/* Elements Editor */}
        {activeTab && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Elements: <span className="text-foreground">{activeTab.name}</span>
              </label>
              <span className="text-[10px] text-muted-foreground/60">{activeTab.elements.length} items</span>
            </div>

            <div className="flex bg-background rounded-lg border border-border/50 p-1 gap-1 mb-5 justify-between">
              <ToolboxButton icon={AlignLeft} label="Section" onClick={() => addElement('section')} />
              <ToolboxButton icon={MousePointerClick} label="Button" onClick={() => addElement('button')} />
              <ToolboxButton icon={ToggleLeft} label="Toggle" onClick={() => addElement('toggle')} />
              <ToolboxButton icon={SlidersHorizontal} label="Slider" onClick={() => addElement('slider')} />
              <ToolboxButton icon={Bell} label="Notif" onClick={() => addElement('notification')} />
            </div>

            <div className="flex flex-col gap-3 pb-20">
              <AnimatePresence mode="popLayout">
                {activeTab.elements.map((el, idx) => (
                  <ElementEditorCard
                    key={el.id}
                    element={el}
                    builder={builder}
                    isFirst={idx === 0}
                    isLast={idx === activeTab.elements.length - 1}
                  />
                ))}
              </AnimatePresence>
              {activeTab.elements.length === 0 && (
                <div className="text-xs text-muted-foreground/50 text-center py-6 border border-dashed border-border/50 rounded-lg">
                  Add elements using the toolbar above.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="relative flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-border/50 cursor-pointer bg-transparent p-0.5 flex-shrink-0"
        />
        <span className="text-[10px] text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  );
}

function RangeField({ label, min, max, value, onChange, accent, fullWidth }: {
  label: string; min: number; max: number; value: number;
  onChange: (v: number) => void; accent?: string; fullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? '' : ''}`}>
      <label className="text-[10px] text-muted-foreground font-medium">{label}</label>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${accent || '#a855f7'} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%)`,
          accentColor: accent || '#a855f7',
        }}
      />
    </div>
  );
}

function ToolboxButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`Add ${label}`}
      className="flex-1 flex flex-col items-center gap-1 p-2 hover:bg-card rounded-md text-muted-foreground hover:text-primary transition-all active:scale-95"
    >
      <Icon size={15} />
      <span className="text-[9px] font-medium">{label}</span>
    </button>
  );
}

function ElementEditorCard({
  element, builder, isFirst, isLast
}: {
  element: UIElement;
  builder: ReturnType<typeof useHubBuilder>;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { updateElement, deleteElement, duplicateElement, moveElementUp, moveElementDown } = builder;

  const iconMap = {
    button: MousePointerClick,
    toggle: ToggleLeft,
    slider: SlidersHorizontal,
    section: AlignLeft,
    notification: Bell,
  };
  const Icon = iconMap[element.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-background border border-border/60 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header row */}
      <div
        className="flex items-center gap-2.5 p-3 cursor-pointer hover:bg-card/80 transition-colors select-none group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`p-1.5 rounded-md flex-shrink-0 ${
          element.type === 'notification' ? 'bg-yellow-500/10 text-yellow-400' :
          element.type === 'section' ? 'bg-accent/10 text-accent' :
          'bg-primary/10 text-primary'
        }`}>
          <Icon size={13} />
        </div>
        <div className="flex-1 truncate font-medium text-sm text-foreground/90">{element.label || 'Unnamed'}</div>
        <span className="text-[9px] text-muted-foreground/50 capitalize flex-shrink-0">{element.type}</span>
        <ChevronDown size={12} className={`text-muted-foreground/50 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Action bar */}
      <div className="flex border-t border-border/30 bg-card/20">
        <button onClick={() => moveElementUp(element.id)} disabled={isFirst} className="flex-1 py-1.5 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors hover:bg-card/60">
          <ChevronUp size={12} />
        </button>
        <button onClick={() => moveElementDown(element.id)} disabled={isLast} className="flex-1 py-1.5 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors hover:bg-card/60 border-l border-border/30">
          <ChevronDown size={12} />
        </button>
        <button onClick={() => duplicateElement(element.id)} className="flex-1 py-1.5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:bg-card/60 border-l border-border/30">
          <Copy size={12} />
        </button>
        <button onClick={() => deleteElement(element.id)} className="flex-1 py-1.5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10 border-l border-border/30">
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded editor */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-card/30 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <Field label="Display Label">
                <input
                  value={element.label}
                  onChange={e => updateElement(element.id, { label: e.target.value })}
                  className="bg-background border border-border/50 rounded-md px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all w-full"
                />
              </Field>

              {element.type === 'button' && (
                <Field label="Lua Script (OnClick)" accent="primary">
                  <CodeArea value={element.code} onChange={v => updateElement(element.id, { code: v })} />
                </Field>
              )}

              {element.type === 'toggle' && (
                <>
                  <div className="flex items-center gap-2 bg-background p-2 rounded-md border border-border/50">
                    <input
                      type="checkbox"
                      checked={element.defaultState}
                      onChange={e => updateElement(element.id, { defaultState: e.target.checked })}
                      className="accent-primary w-4 h-4 rounded cursor-pointer"
                    />
                    <label className="text-xs font-medium cursor-pointer" onClick={() => updateElement(element.id, { defaultState: !element.defaultState })}>
                      Default to Enabled
                    </label>
                  </div>
                  <Field label="Script (On Enable)" accent="green">
                    <CodeArea value={element.codeOn} onChange={v => updateElement(element.id, { codeOn: v })} color="green" />
                  </Field>
                  <Field label="Script (On Disable)" accent="red">
                    <CodeArea value={element.codeOff} onChange={v => updateElement(element.id, { codeOff: v })} color="red" />
                  </Field>
                </>
              )}

              {element.type === 'slider' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Min">
                      <input type="number" value={element.min} onChange={e => updateElement(element.id, { min: Number(e.target.value) })}
                        className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs focus:border-primary focus:outline-none w-full" />
                    </Field>
                    <Field label="Max">
                      <input type="number" value={element.max} onChange={e => updateElement(element.id, { max: Number(e.target.value) })}
                        className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs focus:border-primary focus:outline-none w-full" />
                    </Field>
                    <Field label="Default">
                      <input type="number" value={element.defaultValue} onChange={e => updateElement(element.id, { defaultValue: Number(e.target.value) })}
                        className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs focus:border-primary focus:outline-none w-full" />
                    </Field>
                  </div>
                  <Field label="{value} Lua Script" accent="primary">
                    <CodeArea value={element.code} onChange={v => updateElement(element.id, { code: v })} />
                  </Field>
                </>
              )}

              {element.type === 'notification' && (
                <NotificationEditor
                  element={element as NotificationElement}
                  onUpdate={(updates) => updateElement(element.id, updates)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NotificationEditor({ element, onUpdate }: { element: NotificationElement; onUpdate: (v: Partial<NotificationElement>) => void }) {
  const notifColors: Record<string, string> = { info: '#60a5fa', success: '#4ade80', warning: '#fbbf24', error: '#f87171' };
  return (
    <>
      <Field label="Notification Title">
        <input value={element.title} onChange={e => onUpdate({ title: e.target.value })}
          className="bg-background border border-border/50 rounded-md px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none w-full" />
      </Field>
      <Field label="Notification Message">
        <textarea value={element.message} onChange={e => onUpdate({ message: e.target.value })}
          className="bg-background border border-border/50 rounded-md px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none w-full min-h-[55px] resize-none font-sans" />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Duration (s)">
          <input type="number" min={1} max={30} value={element.duration} onChange={e => onUpdate({ duration: Number(e.target.value) })}
            className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs focus:border-primary focus:outline-none w-full" />
        </Field>
        <Field label="Trigger">
          <select value={element.trigger} onChange={e => onUpdate({ trigger: e.target.value as any })}
            className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs focus:border-primary focus:outline-none w-full">
            <option value="hub-load">Hub Load</option>
            <option value="tab-load">Tab Switch</option>
          </select>
        </Field>
      </div>
      <Field label="Type">
        <div className="grid grid-cols-4 gap-1.5">
          {(['info', 'success', 'warning', 'error'] as const).map(t => (
            <button
              key={t}
              onClick={() => onUpdate({ notifType: t })}
              className={`py-1.5 rounded-md text-[10px] font-bold capitalize border transition-all ${
                element.notifType === t ? 'border-current' : 'border-transparent bg-background'
              }`}
              style={{ color: notifColors[t], backgroundColor: element.notifType === t ? notifColors[t] + '20' : undefined }}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
    </>
  );
}

function Field({ label, accent, children }: { label: string; accent?: string; children: React.ReactNode }) {
  const color = accent === 'green' ? 'text-green-400' : accent === 'red' ? 'text-red-400' : accent === 'primary' ? 'text-primary' : 'text-muted-foreground';
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[10px] font-bold tracking-widest uppercase ${color}`}>{label}</label>
      {children}
    </div>
  );
}

function CodeArea({ value, onChange, color }: { value: string; onChange: (v: string) => void; color?: string }) {
  const textColor = color === 'green' ? 'text-green-300' : color === 'red' ? 'text-red-300' : 'text-accent-foreground';
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`bg-black/50 border border-border/50 rounded-md px-3 py-2 text-xs font-mono min-h-[70px] focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all custom-scrollbar w-full ${textColor}`}
      spellCheck="false"
    />
  );
}
