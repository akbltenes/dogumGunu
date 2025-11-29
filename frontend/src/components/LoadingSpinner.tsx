interface LoadingSpinnerProps {
  message?: string
}

const LoadingSpinner = ({ message = 'Yükleniyor...' }: LoadingSpinnerProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-rose-300 border-t-rose-600"></div>
        <p className="mt-4 text-slate-600">{message}</p>
      </div>
    </main>
  )
}

export default LoadingSpinner
