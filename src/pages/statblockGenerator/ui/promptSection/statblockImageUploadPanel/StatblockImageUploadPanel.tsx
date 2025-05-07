// StatblockImageUploadPanel.tsx
import { FC, useRef, useState } from 'react'
import s from './StatblockImageUploadPanel.module.scss'
import { Icon24CancelCircleOutline } from '@vkontakte/icons'

interface ImageUploadPanelProps {
  onImageSelect: (file: File) => void
  onExtractClick?: () => void
  onClear?: () => void
  disabled?: boolean               // ← добавили
  t: {
    uploadImage: string
    extract: string
  }
}

export const StatblockImageUploadPanel: FC<ImageUploadPanelProps> = ({
  onImageSelect,
  onExtractClick,
  onClear,
  disabled = false,                // ← дефолт
  t
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      onImageSelect(file)
    }
  }

  const handleUploadClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    if (disabled) return
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClear?.()
  }

  const handleExtract = () => {
    if (disabled) return
    onExtractClick?.()
  }

  return (
    <div className={s.uploadContainer}>
      <button
        className={s.uploadButton}
        onClick={handleUploadClick}
        disabled={disabled}             // ← блокировка
      >
        {t.uploadImage}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className={s.hiddenInput}
        onChange={handleFileChange}
        disabled={disabled}             // ← блокировка
      />

      {previewUrl && (
        <div className={s.previewContainer}>
          <div className={s.previewWrapper}>
            <img
              src={previewUrl}
              alt="preview"
              className={s.previewImage}
            />
            <button
              className={s.removeButton}
              onClick={handleRemove}
              disabled={disabled}         // ← блокировка
            >
              <Icon24CancelCircleOutline className={s.removeIcon} />
            </button>
          </div>

          <button
            className={s.extractButton}
            onClick={handleExtract}
            disabled={disabled}           // ← блокировка
          >
            {t.extract}
          </button>
        </div>
      )}
    </div>
  )
}
