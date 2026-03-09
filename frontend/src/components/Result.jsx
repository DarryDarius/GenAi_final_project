export default function Result({ data, onReset }) {
  const { face_analysis, recommendation, rag_sources_count } = data

  let parsed = null
  try {
    const text = face_analysis.replace(/```\w*\n?/g, '').trim()
    parsed = JSON.parse(text)
  } catch {
    // Fallback: display raw if not JSON
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Generated from {rag_sources_count} RAG knowledge snippets
        </span>
        <button
          onClick={onReset}
          className="text-sm text-sage hover:text-sage/80 font-medium transition-colors"
        >
          Upload another
        </button>
      </div>

      {parsed && (
        <section className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm p-5 backdrop-blur">
          <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Face Analysis</h2>
          <dl className="grid gap-3 text-sm">
            {parsed.face_shape && (
              <>
                <dt className="text-slate-500">Face shape</dt>
                <dd className="font-medium text-slate-800">{parsed.face_shape}</dd>
              </>
            )}
            {parsed.skin_tone && (
              <>
                <dt className="text-slate-500">Skin tone</dt>
                <dd className="font-medium text-slate-800">{parsed.skin_tone}</dd>
              </>
            )}
            {parsed.eye_type && (
              <>
                <dt className="text-slate-500">Eye type</dt>
                <dd className="font-medium text-slate-800">{parsed.eye_type}</dd>
              </>
            )}
            {parsed.other_features && (
              <>
                <dt className="text-slate-500">Other features</dt>
                <dd className="font-medium text-slate-800">{parsed.other_features}</dd>
              </>
            )}
          </dl>
        </section>
      )}

      {!parsed && (
        <section className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wider">Face Analysis</h2>
          <pre className="text-sm text-slate-600 whitespace-pre-wrap overflow-x-auto">
            {face_analysis}
          </pre>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm p-6 backdrop-blur">
        <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Personalized Makeup Recommendations</h2>
        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {recommendation}
        </div>
      </section>
    </div>
  )
}
