const normalizeBaseUrl = (url?: string) => {
  if (!url) return ''
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_BASE_URL
  
  // Fix for Vercel env variable issue
  if (envUrl && envUrl.includes('VITE_API_BASE_URL=')) {
    envUrl = envUrl.replace('VITE_API_BASE_URL=', '')
  }
  
  envUrl = normalizeBaseUrl(envUrl)
  console.log('Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('Fixed base URL:', envUrl)
  
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

  console.log('Final API URL:', url)

  const mergedOptions: RequestInit = {
    credentials: 'include',
    ...options,
  }

  return fetch(url, mergedOptions)
}
