import type { NextRequest } from 'next/server';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

type LogMeta = Record<string, unknown>;

type ApiLogOptions = {
  route?: string;
  params?: Record<string, string | undefined>;
  body?: unknown;
};

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

const DEFAULT_LEVEL: LogLevel =
  process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const LOG_LEVEL =
  ((process.env.LOG_LEVEL || DEFAULT_LEVEL) as LogLevel) || DEFAULT_LEVEL;

const INCLUDE_HEADERS = process.env.LOG_INCLUDE_HEADERS === 'true';
const INCLUDE_BODY = process.env.LOG_INCLUDE_BODY === 'true';

const SENSITIVE_KEYS = [
  'authorization',
  'cookie',
  'token',
  'idtoken',
  'refreshtoken',
  'password',
  'secret',
  'apikey',
  'api_key',
  'session',
];

const SAFE_HEADERS = [
  'accept',
  'content-type',
  'user-agent',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'referer',
  'origin',
];

function shouldLog(level: LogLevel) {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
}

function isSensitiveKey(key: string) {
  const lowered = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitive => lowered.includes(sensitive));
}

function redactData(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth > 4) {
    return '[Truncated]';
  }

  if (Array.isArray(value)) {
    return value.map(item => redactData(item, depth + 1));
  }

  if (typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    Object.keys(input).forEach(key => {
      if (isSensitiveKey(key)) {
        output[key] = '[REDACTED]';
      } else {
        output[key] = redactData(input[key], depth + 1);
      }
    });
    return output;
  }

  return value;
}

function formatMeta(meta?: LogMeta) {
  if (!meta) {
    return undefined;
  }
  return redactData(meta);
}

function pickHeaders(request: NextRequest) {
  const headers: Record<string, string> = {};
  SAFE_HEADERS.forEach(header => {
    const value = request.headers.get(header);
    if (value) {
      headers[header] = value;
    }
  });
  return headers;
}

function baseRequestMeta(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const meta: LogMeta = {
    method: request.method,
    path: request.nextUrl.pathname,
    query,
  };

  if (INCLUDE_HEADERS) {
    meta.headers = pickHeaders(request);
  }

  return meta;
}

export function logDebug(message: string, meta?: LogMeta) {
  if (!shouldLog('debug')) {
    return;
  }
  console.log(`[debug] ${message}`, formatMeta(meta));
}

export function logInfo(message: string, meta?: LogMeta) {
  if (!shouldLog('info')) {
    return;
  }
  console.log(`[info] ${message}`, formatMeta(meta));
}

export function logWarn(message: string, meta?: LogMeta) {
  if (!shouldLog('warn')) {
    return;
  }
  console.warn(`[warn] ${message}`, formatMeta(meta));
}

export function logError(message: string, meta?: LogMeta) {
  if (!shouldLog('error')) {
    return;
  }
  console.error(`[error] ${message}`, formatMeta(meta));
}

export function logApiRequest(
  request: NextRequest,
  options: ApiLogOptions = {}
) {
  const meta: LogMeta = {
    ...baseRequestMeta(request),
    route: options.route,
    params: options.params,
  };

  if (INCLUDE_BODY && options.body !== undefined) {
    meta.body = options.body;
  }

  logInfo('api.request', meta);
}

export function logApiResponse(
  request: NextRequest,
  status: number,
  startedAt: number
) {
  const durationMs = Date.now() - startedAt;
  logInfo('api.response', {
    ...baseRequestMeta(request),
    status,
    durationMs,
  });
}

export function logMiddlewareRequest(meta: LogMeta) {
  logInfo('middleware.request', meta);
}

export function logServerRender(component: string) {
  logDebug('server.render', { component });
}
