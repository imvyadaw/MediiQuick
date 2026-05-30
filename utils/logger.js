export const IS_DEV = ['localhost', '127.0.0.1', ''].includes(location.hostname);

export const logger = {
  info: (...args) => { if (IS_DEV) console.info('[MQ]', ...args); },
  warn: (...args) => { if (IS_DEV) console.warn('[MQ]', ...args); },
  error: (...args) => { if (IS_DEV) console.error('[MQ]', ...args); }
};
