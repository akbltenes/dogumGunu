import QRCode from 'react-qr-code'

const QrGatePage = () => {
  const qrUrl = import.meta.env.VITE_PUBLIC_QR_URL || 'http://localhost:5173/login'

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
