interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-rose-600">❌ {message}</p>
      </div>
    </main>
  )
}

export default ErrorMessage
