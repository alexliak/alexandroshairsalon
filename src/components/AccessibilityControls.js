import React from 'react';
import {
  FontSizeOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import './AccessibilityControls.css';

const labels = {
  en: {
    region: 'Accessibility options',
    largeText: 'Larger text',
    largeTextHint: 'Increase text size for easier reading',
    highContrast: 'High contrast',
    highContrastHint: 'Boost contrast for stronger readability'
  },
  el: {
    region: 'Ρυθμίσεις προσβασιμότητας',
    largeText: 'Μεγαλύτερο κείμενο',
    largeTextHint: 'Αυξάνει το μέγεθος γραμματοσειράς για εύκολη ανάγνωση',
    highContrast: 'Υψηλή αντίθεση',
    highContrastHint: 'Ενισχύει την αντίθεση για καλύτερη ευκρίνεια'
  }
};

const AccessibilityControls = ({ language = 'en', settings, onToggle, inline = false, collapsed = false }) => {
  const copy = labels[language] || labels.en;

  const controls = [
    {
      key: 'largeText',
      icon: FontSizeOutlined,
      glyph: 'Tt',
      label: copy.largeText,
      description: copy.largeTextHint
    },
    {
      key: 'highContrast',
      icon: BgColorsOutlined,
      glyph: 'Δ',
      label: copy.highContrast,
      description: copy.highContrastHint
    }
  ];

  const classNames = [
    'accessibility-controls',
    inline ? 'inline' : '',
    collapsed ? 'collapsed' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="region" aria-label={copy.region}>
      {controls.map(({ key, icon: Icon, glyph, label, description }) => (
        <button
          key={key}
          type="button"
          className={`accessibility-control ${settings?.[key] ? 'active' : ''}`}
          onClick={() => onToggle(key)}
          aria-pressed={settings?.[key] || false}
          title={description}
          aria-label={label}
          data-glyph={glyph}
        >
          <span className={`accessibility-icon${collapsed ? ' collapsed' : ''}`} aria-hidden="true">
            <Icon />
          </span>
          {!collapsed && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
};

export default AccessibilityControls;
