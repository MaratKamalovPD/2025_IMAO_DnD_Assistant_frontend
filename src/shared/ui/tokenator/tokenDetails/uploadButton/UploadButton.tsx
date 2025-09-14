import React from 'react';

type UploadButtonProps = {
  processFile: (file: File) => void;
};

export const UploadButton: React.FC<UploadButtonProps> = ({ processFile }) => {
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const fileItem = target.files?.[0];
      if (fileItem) processFile(fileItem);
    };
    input.click();
  };

  return (
    <button type='button' data-variant='secondary' onClick={handleUploadClick}>
      Загрузить картинку
    </button>
  );
};
