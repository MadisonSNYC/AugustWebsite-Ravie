import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4">404</h1>
        <p className="text-2xl text-white/60 mb-8">Page not found</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#00D4FF] text-black font-medium rounded hover:bg-[#00D4FF]/80 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage