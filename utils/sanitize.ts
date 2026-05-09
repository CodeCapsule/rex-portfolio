/**
 * Input Sanitization Utility
 * Protects against XSS, SQL injection, shell injection, and code injection attacks.
 * Used on both client-side (before rendering) and server-side (before database operations).
 */

// ============================================================
// Dangerous patterns to detect and block
// ============================================================

const DANGEROUS_PATTERNS: { pattern: RegExp; name: string }[] = [
  // Script injection
  { pattern: /<script[\s>]/i, name: 'Script tag' },
  { pattern: /javascript\s*:/i, name: 'JavaScript protocol' },
  { pattern: /on\w+\s*=\s*["']/i, name: 'Event handler attribute' },

  // Shell injection
  { pattern: /;\s*(rm|del|format|shutdown|reboot|kill|wget|curl|bash|sh|cmd|powershell)\b/i, name: 'Shell command' },
  { pattern: /\|\s*(rm|del|format|shutdown|reboot|kill|bash|sh|cmd|powershell)\b/i, name: 'Piped shell command' },
  { pattern: /`[^`]*`/, name: 'Backtick execution' },
  { pattern: /\$\([^)]*\)/, name: 'Command substitution' },
  { pattern: /\$\{[^}]*\}/, name: 'Variable expansion' },

  // SQL injection
  { pattern: /('\s*(OR|AND)\s+')/i, name: 'SQL injection (OR/AND)' },
  { pattern: /(UNION\s+SELECT|DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET)/i, name: 'SQL injection' },
  { pattern: /--\s*$/m, name: 'SQL comment' },
  { pattern: /;\s*(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC)\b/i, name: 'SQL statement injection' },

  // Data exfiltration
  { pattern: /data\s*:\s*text\/html/i, name: 'Data URI HTML' },
  { pattern: /base64\s*,\s*[A-Za-z0-9+/=]{50,}/i, name: 'Suspicious base64 payload' },

  // PHP/Server injection
  { pattern: /<\?php/i, name: 'PHP injection' },
  { pattern: /<%[\s=]/i, name: 'Server-side template injection' },

  // Prototype pollution
  { pattern: /__proto__/i, name: 'Prototype pollution' },
  { pattern: /constructor\s*\[/i, name: 'Constructor access' },
];

// ============================================================
// Core sanitization functions
// ============================================================

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Strips all HTML tags from a string
 */
export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes SVG content - allows safe SVG tags but strips dangerous elements.
 * This is specifically for the skill icon SVG input.
 */
export function sanitizeSvg(svgString: string): string {
  // Remove script tags and event handlers from SVG
  let cleaned = svgString
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<embed[\s\S]*?<\/embed>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<use[\s\S]*?\/>/gi, '') // Remove use tags that could reference external resources
    .replace(/xlink:href\s*=\s*["'](?!#)[^"']*["']/gi, ''); // Remove external xlink:href

  return cleaned;
}

/**
 * Checks if input contains dangerous patterns.
 * Returns the name of the first matched threat, or null if clean.
 */
export function detectThreat(input: string): string | null {
  for (const { pattern, name } of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return name;
    }
  }
  return null;
}

/**
 * Sanitizes a regular text input (names, titles, descriptions).
 * Strips HTML tags and trims whitespace.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return stripHtmlTags(input).trim();
}

/**
 * Sanitizes a URL input - only allows http, https, mailto, and relative paths.
 */
export function sanitizeUrl(input: string): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();

  // Allow relative paths
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Allow safe protocols only
  const safeProtocols = ['http:', 'https:', 'mailto:'];
  try {
    const url = new URL(trimmed);
    if (safeProtocols.includes(url.protocol)) {
      return trimmed;
    }
  } catch {
    // Not a valid URL
  }

  return '';
}

/**
 * Deep sanitizes an object/array recursively.
 * Used on server-side to sanitize entire request bodies before database operations.
 */
export function sanitizeRequestBody(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    // Check for threats
    const threat = detectThreat(data);
    if (threat) {
      console.warn(`[SECURITY] Blocked malicious input (${threat}):`, data.substring(0, 100));
      return ''; // Return empty string for dangerous inputs
    }
    // Sanitize the text (but don't strip HTML from SVG-like content)
    return data.trim();
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeRequestBody(item));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        console.warn(`[SECURITY] Blocked prototype pollution attempt via key: ${key}`);
        continue;
      }

      // Special handling for SVG fields — sanitize as SVG instead of blocking
      if (key === 'icon_value' && typeof value === 'string' && value.includes('<svg')) {
        sanitized[key] = sanitizeSvg(value);
      } else {
        sanitized[key] = sanitizeRequestBody(value);
      }
    }
    return sanitized;
  }

  return data;
}

// ============================================================
// Client-side input validation helpers
// ============================================================

/**
 * Validates and sanitizes input on the client side in real-time.
 * Returns { isValid, sanitizedValue, threat } 
 */
export function validateInput(value: string, type: 'text' | 'url' | 'svg' = 'text'): {
  isValid: boolean;
  sanitizedValue: string;
  threat: string | null;
} {
  const threat = detectThreat(value);

  if (threat) {
    return { isValid: false, sanitizedValue: value, threat };
  }

  let sanitizedValue: string;

  switch (type) {
    case 'url':
      sanitizedValue = sanitizeUrl(value);
      break;
    case 'svg':
      sanitizedValue = sanitizeSvg(value);
      break;
    default:
      sanitizedValue = sanitizeText(value);
      break;
  }

  return { isValid: true, sanitizedValue, threat: null };
}

/**
 * Rate limiting tracker for login attempts (client-side).
 * Prevents brute force attacks.
 * Locks out for 15 minutes after 5 failed attempts.
 */
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_RESET_WINDOW_MS = 20 * 60 * 1000;  // Reset counter after 20 minutes of inactivity

const loginAttempts: { count: number; lastAttempt: number; lockedUntil: number } = {
  count: 0,
  lastAttempt: 0,
  lockedUntil: 0,
};

export function checkLoginRateLimit(): { allowed: boolean; waitSeconds: number; attemptsRemaining: number } {
  const now = Date.now();

  // Check if locked out
  if (now < loginAttempts.lockedUntil) {
    const waitSeconds = Math.ceil((loginAttempts.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds, attemptsRemaining: 0 };
  }

  // Reset counter if it's been more than 20 minutes since last attempt
  if (now - loginAttempts.lastAttempt > LOGIN_RESET_WINDOW_MS) {
    loginAttempts.count = 0;
    loginAttempts.lockedUntil = 0;
  }

  return { allowed: true, waitSeconds: 0, attemptsRemaining: LOGIN_MAX_ATTEMPTS - loginAttempts.count };
}

export function recordLoginAttempt(success: boolean): void {
  const now = Date.now();
  loginAttempts.lastAttempt = now;

  if (success) {
    loginAttempts.count = 0;
    loginAttempts.lockedUntil = 0;
  } else {
    loginAttempts.count++;

    // Lock out for 15 minutes after 5 failed attempts
    if (loginAttempts.count >= LOGIN_MAX_ATTEMPTS) {
      loginAttempts.lockedUntil = now + LOGIN_LOCK_DURATION_MS;
    }
  }
}

export function getLoginAttemptsCount(): number {
  return loginAttempts.count;
}
