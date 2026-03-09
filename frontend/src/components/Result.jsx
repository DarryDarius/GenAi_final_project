export default function Result({ data, onReset }) {
  const { face_analysis, recommendation, rag_sources_count } = data

  let parsed = null
  try {
    const text = face_analysis.replace(/```\w*\n?/g, '').trim()
    parsed = JSON.parse(text)
  } catch {
    // 非 JSON 则原样显示
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-500">基于 RAG 检索 {rag_sources_count} 条知识生成</span>
        <button
          onClick={onReset}
          className="text-sm text-rose-600 hover:text-rose-700 font-medium"
        >
          重新上传
        </button>
      </div>

      {parsed && (
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-stone-600 mb-3">面部分析</h2>
          <dl className="grid gap-2 text-sm">
            {parsed.face_shape && (
              <>
                <dt className="text-stone-500">脸型</dt>
                <dd className="font-medium">{parsed.face_shape}</dd>
              </>
            )}
            {parsed.skin_tone && (
              <>
                <dt className="text-stone-500">肤色</dt>
                <dd className="font-medium">{parsed.skin_tone}</dd>
              </>
            )}
            {parsed.eye_type && (
              <>
                <dt className="text-stone-500">眼型</dt>
                <dd className="font-medium">{parsed.eye_type}</dd>
              </>
            )}
            {parsed.other_features && (
              <>
                <dt className="text-stone-500">其他特征</dt>
                <dd className="font-medium">{parsed.other_features}</dd>
              </>
            )}
          </dl>
        </section>
      )}

      {!parsed && (
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-stone-600 mb-2">面部分析</h2>
          <pre className="text-sm text-stone-600 whitespace-pre-wrap overflow-x-auto">
            {face_analysis}
          </pre>
        </section>
      )}

      <section className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-600 mb-3">个性化妆容推荐</h2>
        <div className="prose prose-sm max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap">
          {recommendation}
        </div>
      </section>
    </div>
  )
}
