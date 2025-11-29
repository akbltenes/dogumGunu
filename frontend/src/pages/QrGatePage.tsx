import { useMemo } from 'react'
import QRCode from 'react-qr-code'

const QrGatePage = () => {
  // Dinamik URL: her render'da mevcut origin'i kullanarak oluştur (örn. http://192.168.1.15:5174/login)
  const qrUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '/login'
    }

    const url = new URL(window.location.href)
    url.pathname = '/login'
    url.search = ''
    url.hash = ''
    return url.toString()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 px-4 py-10">
      <div className="flex items-center justify-center">
        <div className="rounded-3xl bg-white/90 p-10 shadow-2xl">
          <QRCode value={qrUrl} size={240} fgColor="#db2777" />
          
        </div>
      </div>
    </main>
  )
}

export default QrGatePage
