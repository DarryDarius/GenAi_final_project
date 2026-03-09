import { useState } from 'react'
import UploadZone from './components/UploadZone'
import Result from './components/Result'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    setError(null)
    setResult(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || res.statusText || 'Request failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen">
      <header className="relative border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blush to-terracotta/60 rounded-r" />
        <div className="max-w-2xl mx-auto px-6 py-7 pl-8">
          <h1 className="font-display text-3xl font-semibold text-slate-800 tracking-tight">
            Makeup Match
          </h1>
          <p className="text-slate-500 mt-1 font-light text-[15px]">
            Upload a photo — AI analyzes your features and recommends makeup looks
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {!result ? (
          <>
            <div className={loading ? 'opacity-50 pointer-events-none' : 'animate-fade-up'}>
              <UploadZone onUpload={handleUpload} disabled={loading} />
            </div>
            {loading && (
              <div className="mt-10 flex items-center justify-center gap-4 animate-fade-up-delay">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blush animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-terracotta/80 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-sage/80 animate-bounce" />
                </div>
                <span className="text-sm text-slate-500">Analyzing your face and retrieving makeup tips…</span>
              </div>
            )}
            {error && (
              <div className="mt-10 p-5 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-700 text-sm animate-fade-up shadow-soft">
                {error}
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-up">
            <Result data={result} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="mt-24 py-10 border-t border-slate-200/50 text-center">
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Photos are used for analysis only and are not stored. Suggestions are general guidance — adjust to your preference.
        </p>
      </footer>
    </div>
  )
}

export default App
