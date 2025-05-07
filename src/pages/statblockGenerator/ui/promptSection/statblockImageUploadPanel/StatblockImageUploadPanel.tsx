import { FC, useRef, useState } from 'react';
import s from './StatblockImageUploadPanel.module.scss';
import { Icon24CancelCircleOutline } from "@vkontakte/icons";

interface ImageUploadPanelProps {
  onImageSelect: (file: File) => void;
  onExtractClick?: () => void;
  onClear?: () => void;
  t: {
    uploadImage: string;
    extract: string;
  };
}

export const StatblockImageUploadPanel: FC<ImageUploadPanelProps> = ({
  onImageSelect,
  onExtractClick,
  onClear,
  t,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClear?.();
  };

  return (
    <div className={s.uploadContainer}>
      <button className={s.uploadButton} onClick={handleUploadClick}>
        {t.uploadImage}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className={s.hiddenInput}
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div className={s.previewContainer}>
          <div className={s.previewWrapper}>
            <img src={previewUrl} alt="preview" className={s.previewImage} />
            <button className={s.removeButton} onClick={handleRemove}>
                <Icon24CancelCircleOutline className={s.removeIcon} />
            </button>
          </div>

          <button className={s.extractButton} onClick={onExtractClick}>
            {t.extract}
          </button>
        </div>
      )}
    </div>
  );
};
