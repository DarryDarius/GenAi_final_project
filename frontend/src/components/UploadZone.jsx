import { useRef } from 'react'

export default function UploadZone({ onUpload, disabled }) {
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    if (disabled) return
    const file = e.dataTransfer?.files?.[0]
    if (file && /^image\/(jpeg|png|webp)$/i.test(file.type)) {
      onUpload(file)
    }
  }

  const handleChange = (e) => {
    const file = e.target?.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        group relative overflow-hidden rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
        border-2 border-dashed bg-white/60 backdrop-blur-sm
        ${disabled 
          ? 'cursor-not-allowed opacity-60 border-slate-200' 
          : 'border-slate-300/80 hover:border-blush/60 hover:bg-white/90 hover:shadow-soft-lg'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blush/5 via-transparent to-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blush/20 mb-5 group-hover:bg-blush/30 transition-colors">
          <svg className="w-10 h-10 text-terracotta/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H20a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="font-medium text-slate-700 text-lg">Click or drag to upload a face photo</p>
        <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
          JPEG, PNG, WebP. Best: front-facing, good light, glasses off
        </p>
      </div>
    </div>
  )
}
