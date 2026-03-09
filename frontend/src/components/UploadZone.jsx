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
        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition
        ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-rose-300 hover:bg-rose-50/50'}
        border-stone-200
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-4xl mb-3">📷</div>
      <p className="font-medium text-stone-700">点击或拖拽上传面部照片</p>
      <p className="text-sm text-stone-500 mt-1">
        支持 JPEG、PNG、WebP。建议：正脸、光线充足、五官清晰（摘下眼镜分析更准确）
      </p>
    </div>
  )
}
