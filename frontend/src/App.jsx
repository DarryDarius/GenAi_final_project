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
        throw new Error(err.detail || res.statusText || '请求失败')
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
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="font-display text-2xl font-semibold text-stone-800">
            美妆推荐
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            上传面部照片，AI 基于 RAG 知识库为您推荐适合的妆容
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {!result ? (
          <>
            <UploadZone onUpload={handleUpload} disabled={loading} />
            {loading && (
              <div className="mt-6 flex items-center gap-3 text-stone-500">
                <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                <span>正在分析面容并检索美妆知识…</span>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
          </>
        ) : (
          <Result data={result} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-16 py-6 border-t border-stone-200 text-center text-xs text-stone-400">
        照片仅用于分析，不会长期存储。建议仅供参考，可根据个人喜好调整。
      </footer>
    </div>
  )
}

export default App
