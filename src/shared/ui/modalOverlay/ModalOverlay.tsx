import { Icon20Cancel } from '@vkontakte/icons';

import clsx from 'clsx';
import s from './ModalOverlay.module.scss';

type ModalOverlayProps = {
  title: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCloseable?: boolean;
  isPage?: boolean;
  children: React.ReactNode;
};

export const ModalOverlay = ({
  title,
  isModalOpen,
  setIsModalOpen,
  isCloseable = true,
  isPage = false,
  children,
}: ModalOverlayProps) => {
  return (
    <>
      {isModalOpen && (
        <div className={s.modalOverlay} onClick={() => isCloseable && setIsModalOpen(false)}>
          <div
            className={clsx(s.modalOverlay__content, {
              [s.modalOverlay__content__page]: isPage,
            })}
            onClick={(e) => e.stopPropagation()}
          >
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
