const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/40 to-rose-900/30">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-rose-500"></div>
        <p className="text-lg font-medium text-white">Yükleniyor...</p>
      </div>
    </div>
  )
}

export default PageLoader
