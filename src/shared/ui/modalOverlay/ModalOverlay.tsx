import { Icon20Cancel } from '@vkontakte/icons';

import s from './ModalOverlay.module.scss';

type ModalOverlayProps = {
  title: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCloseable?: boolean;
  children: React.ReactNode;
};

export const ModalOverlay = ({
  title,
  isModalOpen,
  setIsModalOpen,
  isCloseable = true,
  children,
}: ModalOverlayProps) => {
  return (
    <>
      {isModalOpen && (
        <div className={s.modalOverlay} onClick={() => isCloseable && setIsModalOpen(false)}>
          <div className={s.modalOverlay__content} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalOverlay__header}>
              <div className={s.modalOverlay__title}>{title}</div>
              {isCloseable && (
                <div className={s.modalOverlay__closeBtn} onClick={() => setIsModalOpen(false)}>
                  <Icon20Cancel />
                </div>
              )}
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
