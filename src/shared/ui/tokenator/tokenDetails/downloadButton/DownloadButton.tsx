import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon28DownloadOutline } from '@vkontakte/icons';

import s from './DownloadButton.module.scss';
import { IconButtonWithTooltip } from '../iconButtonWithTooltip';

interface DownloadButtonProps {
  download: (format: 'webp' | 'png') => void;
  file?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ download, file }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [dropdownOpen, handleDocumentClick]);

  return (
    <div className={s.downloadDropdown} ref={dropdownRef}>
      <IconButtonWithTooltip
        title="Скачать изображение"
        icon={<Icon28DownloadOutline />}
        onClick={() => setDropdownOpen(true)}
        disabled={!file}
      />

      {dropdownOpen && (
        <div className={s.downloadDropdown__menu}>
          <button
            type="button"
            disabled={!file}
            onClick={() => {
              download('webp');
              setDropdownOpen(false);
            }}
          >
            WEBP
          </button>
          <button
            type="button"
            disabled={!file}
            onClick={() => {
              download('png');
              setDropdownOpen(false);
            }}
          >
            PNG
          </button>
        </div>
      )}
    </div>
  );
};
