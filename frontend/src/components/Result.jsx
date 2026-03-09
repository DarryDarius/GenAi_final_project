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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sage/60" />
          Generated from {rag_sources_count} RAG knowledge snippets
        </span>
        <button
          onClick={onReset}
          className="text-sm text-slate-600 hover:text-terracotta font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-blush/20"
        >
          Upload another
        </button>
      </div>

      {parsed && (
        <section className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-soft p-6">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sage/40 to-blush/40 rounded-r" />
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5 pl-1">Face Analysis</h2>
          <dl className="grid gap-4 text-sm pl-1">
            {parsed.face_shape && (
              <div className="flex justify-between gap-4 py-2 border-b border-slate-100">
                <dt className="text-slate-500 shrink-0">Face shape</dt>
                <dd className="font-medium text-slate-800 text-right">{parsed.face_shape}</dd>
              </div>
            )}
            {parsed.skin_tone && (
              <div className="flex justify-between gap-4 py-2 border-b border-slate-100">
                <dt className="text-slate-500 shrink-0">Skin tone</dt>
                <dd className="font-medium text-slate-800 text-right">{parsed.skin_tone}</dd>
              </div>
            )}
            {parsed.eye_type && (
              <div className="flex justify-between gap-4 py-2 border-b border-slate-100">
                <dt className="text-slate-500 shrink-0">Eye type</dt>
                <dd className="font-medium text-slate-800 text-right">{parsed.eye_type}</dd>
              </div>
            )}
            {parsed.other_features && (
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-slate-500 shrink-0">Other features</dt>
                <dd className="font-medium text-slate-800 text-right">{parsed.other_features}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {!parsed && (
        <section className="rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-soft p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Face Analysis</h2>
          <pre className="text-sm text-slate-600 whitespace-pre-wrap overflow-x-auto leading-relaxed">
            {face_analysis}
          </pre>
        </section>
      )}

      <section className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-soft p-6">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-terracotta/50 to-blush/50 rounded-r" />
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5 pl-1">Personalized Recommendations</h2>
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px] pl-1">
          {recommendation}
        </div>
      </section>
    </div>
  )
}
