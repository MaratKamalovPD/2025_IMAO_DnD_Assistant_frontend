import React, { useRef, useState, useEffect } from 'react'
import s from './PromptSection.module.scss'
import { PromptTextarea } from './promptTextarea'
import { PresetSelect } from './promtPresetSelect'
import {
  PromptTextareaRef,
  SelectOptionWithDescription
} from 'pages/statblockGenerator/model'
import { StatblockImageUploadPanel } from './statblockImageUploadPanel'
import {
  useSubmitGenerationPromptMutation,
  useSubmitGenerationImageMutation,
  useGetGenerationStatusQuery
} from 'pages/statblockGenerator/api/llm.api'
import { CreatureFullData } from 'entities/creature/model'

interface PromptSectionProps {
  onGenerate?: (creature: CreatureFullData) => void
  onUsePreset?: () => void
  onTextChange?: (text: string) => void
  presetOptions?: SelectOptionWithDescription[]
  selectedPreset?: string
  onImageUpload?: (file: File) => void
  language?: 'en' | 'ru'
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  onGenerate,
  onUsePreset,
  onTextChange,
  presetOptions = [],
  selectedPreset = '',
  onImageUpload,
  language = 'ru'
}) => {
  const translations = {
    ru: {
      generate: 'Сгенерировать статблок',
      presets: 'Пресеты запросов:',
      select: 'Выбрать из списка',
      usePreset: 'Использовать пресет',
      uploadImage: 'Загрузить изображение',
      polling: 'Ожидаем результат…',
      done: 'Готово!'
    },
    en: {
      generate: 'Generate statblock',
      presets: 'Request presets:',
      select: 'Select from list',
      usePreset: 'Use preset',
      uploadImage: 'Upload image',
      polling: 'Waiting for result…',
      done: 'Done!'
    }
  }
  const t = translations[language]

  const textareaRef = useRef<PromptTextareaRef>(null)
  const [jobId, setJobId] = useState<string | null>(null)

  const [
    submitText,
    { isLoading: isSubmittingText, error: textError }
  ] = useSubmitGenerationPromptMutation()
  const [
    submitImage,
    { isLoading: isSubmittingImage, error: imageError }
  ] = useSubmitGenerationImageMutation()

  // Будем пропускать запрос пока нет jobId, а как только jobId появится —
  // сразу сработает первый fetch и далее каждый 1000 мс
  const {
    data: jobStatus,
    isFetching: isPolling,
    error: pollingError
  } = useGetGenerationStatusQuery(jobId ?? '', {
    skip: !jobId,
    pollingInterval: 1000
  })

  // Уведомляем родителя, как только статус станет "done"
  useEffect(() => {
    if (jobStatus?.status === 'done' && jobStatus.result) {
      onGenerate?.(jobStatus.result)
      setJobId(null)
    }
  }, [jobStatus, onGenerate])

  const handlePresetSelect = (description: string) => {
    textareaRef.current?.setValue(description)
    onTextChange?.(description)
  }

  const handleGenerateText = async () => {
    const desc = textareaRef.current?.getValue()
    if (!desc) return

    try {
      const resp = await submitText({ description: desc }).unwrap()
      setJobId(resp.job_id)  
    } catch (err) {
      console.error('❌ Ошибка при отправке генерации:', err)
    }
  }

  const handleGenerateImage = async (file: File) => {
    onImageUpload?.(file)
    const fd = new FormData()
    fd.append('image', file)

    try {
      const resp = await submitImage(fd).unwrap()
      setJobId(resp.job_id)
    } catch (err) {
      console.error('❌ Ошибка при загрузке изображения:', err)
    }
  }

  const isGenerating =
  isSubmittingText ||             
  (!!jobId && jobStatus?.status !== 'done')

  return (
    <div className={s.promptSection}>
      <PresetSelect
        className="presetSelect"
        presetOptions={presetOptions}
        selectedPreset={selectedPreset}
        onTextChange={handlePresetSelect}
        onUsePreset={onUsePreset}
        t={{
          presets: t.presets,
          select: t.select,
          usePreset: t.usePreset
        }}
      />

      <PromptTextarea
        ref={textareaRef}
        onSubmit={handleGenerateText}
        disabled={isGenerating}
        placeholder={t.generate}
      />
      {textError && <div className={s.error}>Ошибка: {String(textError)}</div>}

      <StatblockImageUploadPanel
        onImageSelect={handleGenerateImage}
        disabled={isGenerating}
        t={{
          uploadImage: t.uploadImage,
          extract: t.generate
        }}
      />
      {imageError && <div className={s.error}>Ошибка: {String(imageError)}</div>}

      {jobId && (
        <div className={s.status}>
          {isPolling && <p>{t.polling}</p>}
          {!isPolling && jobStatus?.status === 'done' && <p>{t.done}</p>}
          {pollingError && (
            <div className={s.error}>
              Ошибка получения статуса: {String(pollingError)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
