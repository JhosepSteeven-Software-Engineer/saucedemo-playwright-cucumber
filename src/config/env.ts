import 'dotenv/config';

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() !== 'false';
}

function parseTimeout(value: string | undefined, fallback: number): number {
  const timeout = Number(value ?? fallback);

  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error(`DEFAULT_TIMEOUT invalido: ${value}`);
  }

  return timeout;
}

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  headless: parseBoolean(process.env.HEADLESS, true),
  defaultTimeout: parseTimeout(process.env.DEFAULT_TIMEOUT, 15000),
};
