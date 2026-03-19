import { useState } from 'react';
import { HubConfig, UIElement, Tab, ElementType, HubTheme, NotificationElement, generateId } from '../lib/types';
import { defaultState } from '../lib/default-state';

export function useHubBuilder() {
  const [config, setConfig] = useState<HubConfig>(defaultState);

  const updateName = (name: string) => setConfig(prev => ({ ...prev, name }));

  const updateTheme = (theme: Partial<HubTheme>) =>
    setConfig(prev => ({ ...prev, theme: { ...prev.theme, ...theme } }));

  const addTab = () => {
    const newTab: Tab = { id: generateId(), name: `Tab ${config.tabs.length + 1}`, elements: [] };
    setConfig(prev => ({ ...prev, tabs: [...prev.tabs, newTab], activeTabId: newTab.id }));
  };

  const updateTab = (id: string, name: string) => {
    setConfig(prev => ({ ...prev, tabs: prev.tabs.map(t => t.id === id ? { ...t, name } : t) }));
  };

  const deleteTab = (id: string) => {
    setConfig(prev => {
      const newTabs = prev.tabs.filter(t => t.id !== id);
      return { ...prev, tabs: newTabs, activeTabId: prev.activeTabId === id ? (newTabs[0]?.id || null) : prev.activeTabId };
    });
  };

  const setActiveTab = (id: string) => setConfig(prev => ({ ...prev, activeTabId: id }));

  const addElement = (type: ElementType) => {
    setConfig(prev => {
      if (!prev.activeTabId) return prev;
      return {
        ...prev,
        tabs: prev.tabs.map(t =>
          t.id === prev.activeTabId ? { ...t, elements: [...t.elements, createDefaultElement(type)] } : t
        )
      };
    });
  };

  const updateElement = (elementId: string, updates: Partial<UIElement>) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(t =>
        t.id === prev.activeTabId
          ? { ...t, elements: t.elements.map(el => el.id === elementId ? { ...el, ...updates } as UIElement : el) }
          : t
      )
    }));
  };

  const deleteElement = (elementId: string) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(t =>
        t.id === prev.activeTabId ? { ...t, elements: t.elements.filter(el => el.id !== elementId) } : t
      )
    }));
  };

  const duplicateElement = (elementId: string) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => {
        if (t.id !== prev.activeTabId) return t;
        const idx = t.elements.findIndex(el => el.id === elementId);
        if (idx < 0) return t;
        const original = t.elements[idx];
        const copy = { ...original, id: generateId(), label: original.label + ' (Copy)' } as UIElement;
        const newEls = [...t.elements];
        newEls.splice(idx + 1, 0, copy);
        return { ...t, elements: newEls };
      })
    }));
  };

  const moveElementUp = (elementId: string) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => {
        if (t.id !== prev.activeTabId) return t;
        const els = [...t.elements];
        const idx = els.findIndex(el => el.id === elementId);
        if (idx <= 0) return t;
        [els[idx - 1], els[idx]] = [els[idx], els[idx - 1]];
        return { ...t, elements: els };
      })
    }));
  };

  const moveElementDown = (elementId: string) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => {
        if (t.id !== prev.activeTabId) return t;
        const els = [...t.elements];
        const idx = els.findIndex(el => el.id === elementId);
        if (idx < 0 || idx >= els.length - 1) return t;
        [els[idx], els[idx + 1]] = [els[idx + 1], els[idx]];
        return { ...t, elements: els };
      })
    }));
  };

  const applyConfig = (newConfig: HubConfig) => setConfig(newConfig);

  const resetToDefault = () => setConfig(defaultState);

  const activeTab = config.tabs.find(t => t.id === config.activeTabId) || null;

  return {
    config,
    activeTab,
    updateName,
    updateTheme,
    addTab,
    updateTab,
    deleteTab,
    setActiveTab,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    moveElementUp,
    moveElementDown,
    applyConfig,
    resetToDefault,
  };
}

function createDefaultElement(type: ElementType): UIElement {
  const id = generateId();
  switch (type) {
    case 'button': return { id, type, label: 'New Action', code: 'print("Button Clicked!")' };
    case 'toggle': return { id, type, label: 'New Feature', defaultState: false, codeOn: 'print("Enabled")', codeOff: 'print("Disabled")' };
    case 'slider': return { id, type, label: 'Multiplier', min: 0, max: 100, defaultValue: 50, code: 'print(value)' };
    case 'section': return { id, type, label: 'Configuration' };
    case 'notification': return {
      id, type, label: 'Notification',
      title: 'Hub Alert', message: 'Something happened!',
      duration: 4, notifType: 'info', trigger: 'tab-load'
    };
  }
}
