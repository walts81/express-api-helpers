export const isEnv = (env: string) => process.env.NODE_ENV === env;
export const isProd = () => isEnv('production');
export const isDev = () => isEnv('development');
