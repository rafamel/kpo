import isUnicodeSupported from 'is-unicode-supported';

import type { LogLevel } from '../definitions';
import { type StyleColor, style } from '../utils/style';

type Badge = LogLevel.Core | 'prompt' | 'selected' | 'unselected';

interface BadgeProperties {
  symbol: [string, string];
  color?: StyleColor;
}

// Symbols: 🅧, 🆇, ⓧ, ✖, ‼, ⚠, ✔︎, ✓,
// ⓘ, ⅈ, ℹ︎, 🅳, 🅓, ⓓ, », 🆃, 🅣, ⓣ, ⊗, ⊘
const badges: Record<Badge, BadgeProperties> = {
  error: { symbol: ['🆇 ', '×'], color: 'red' },
  warn: { symbol: ['!!', '‼'], color: 'yellow' },
  success: { symbol: ['✔︎✔︎', '√'], color: 'green' },
  info: { symbol: ['ⓘ ', 'i'], color: 'blue' },
  debug: { symbol: ['🅳 ', '»'], color: 'magenta' },
  trace: { symbol: ['🆃 ', '*'], color: 'grey' },
  prompt: { symbol: ['❯❯', '>'], color: 'yellow' },
  selected: { symbol: ['◉', '(*)'] },
  unselected: { symbol: ['◯', '( )'] }
};

const unicode = isUnicodeSupported();

export function getBadge(badge: Badge): string {
  return style(getBadgeSymbol(badge), {
    bold: true,
    color: getBadgeColor(badge)
  });
}

export function getBadgeSymbol(badge: Badge): string {
  const props = badges[badge];
  return props ? props.symbol[unicode ? 0 : 1] : '';
}

export function getBadgeColor(badge: Badge): StyleColor | undefined {
  const props = badges[badge];
  return props ? props.color : undefined;
}
