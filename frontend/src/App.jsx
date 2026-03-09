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
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <h1 className="font-display text-3xl font-semibold text-slate-800 tracking-tight">
            Makeup Match
          </h1>
          <p className="text-slate-500 mt-1 font-light">
            Upload a photo — AI analyzes your features and recommends makeup looks
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {!result ? (
          <>
            <UploadZone onUpload={handleUpload} disabled={loading} />
            {loading && (
              <div className="mt-8 flex items-center gap-3 text-slate-500">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                <span className="text-sm">Analyzing your face and retrieving makeup tips…</span>
              </div>
            )}
            {error && (
              <div className="mt-8 p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}
          </>
        ) : (
          <Result data={result} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-slate-200/80 text-center text-xs text-slate-400">
        Photos are used for analysis only and are not stored. Suggestions are general guidance — adjust to your preference.
      </footer>
    </div>
  )
}

export default App
