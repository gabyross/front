const RAW_API_BASE = import.meta.env.VITE_API_URL;
export const API_BASE =
  typeof RAW_API_BASE === 'string' ? RAW_API_BASE.replace(/\/+$/, '') : '';

export const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || 'ulises';
