const normalizeBaseUrl = (url?: string) => {
  if (!url) return ''
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

export const apiFetch = (path: string, options: RequestInit = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const base = API_BASE_URL || ''
  const url = `${base}${normalizedPath}`

  const mergedOptions: RequestInit = {
    credentials: 'include',
    ...options,
  }

  return fetch(url, mergedOptions)
}
