const normalizeBaseUrl = (url?: string) => {
  if (!url) return ''
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const getBaseUrl = () => {
  const envUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)
  if (envUrl) {
    return envUrl
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeBaseUrl(window.location.origin)
  }

  return ''
}

export const apiFetch = (path: string, options: RequestInit = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const base = getBaseUrl()
  const url = base ? `${base}${normalizedPath}` : normalizedPath

  const mergedOptions: RequestInit = {
    credentials: 'include',
    ...options,
  }

  console.log(`API Fetch: ${url}`, mergedOptions)
  return fetch(url, mergedOptions)
}
