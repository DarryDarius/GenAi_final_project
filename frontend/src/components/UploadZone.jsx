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
        relative overflow-hidden rounded-2xl p-14 text-center cursor-pointer transition-all duration-300
        border-2 border-dashed
        ${disabled 
          ? 'cursor-not-allowed opacity-60 border-slate-200 bg-slate-50/50' 
          : 'border-slate-300 hover:border-sage/50 hover:bg-blush/20 hover:shadow-lg'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-5xl mb-4 opacity-90">✨</div>
      <p className="font-medium text-slate-700 text-lg">Click or drag to upload a face photo</p>
      <p className="text-sm text-slate-500 mt-2">
        JPEG, PNG, WebP. Best results: front-facing, good lighting, clear features (remove glasses for accuracy)
      </p>
    </div>
  )
}
