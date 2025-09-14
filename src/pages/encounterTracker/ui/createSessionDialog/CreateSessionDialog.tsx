import Tippy from '@tippyjs/react';
import { Icon28CopyOutline } from '@vkontakte/icons';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import { useLazyCreateSessionQuery } from 'pages/encounterTracker/api';
import { UUID } from 'shared/lib';
import { ModalOverlay, Spinner } from 'shared/ui';

import s from './CreateSessionDialog.module.scss';

type CreateSessionDialog = {
  encounterId: UUID;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const buildLink = (schemeAndDomain: string, sessionId: string) =>
  `${schemeAndDomain}/encounter_tracker/session/${sessionId}`;

export const CreateSessionDialog = ({
  encounterId,
  isModalOpen,
  setIsModalOpen,
}: CreateSessionDialog) => {
  const [trigger, { data, isLoading, isError }] = useLazyCreateSessionQuery();

  const urlObj = new URL(window.location.href);
  const schemeAndDomain = `${urlObj.protocol}//${urlObj.hostname}`;

  const handleTrigger = () => {
    void trigger({ encounterID: encounterId });
  };

  const handleCopy = () => {
    if (!data) return;

    navigator.clipboard
      .writeText(buildLink(schemeAndDomain, data.sessionID))
      .then(() => {
        toast.success(`Ссылка на сессию скопирована`);
      })
      .catch((err) => {
        console.error('Не удалось скопировать текст: ', err);
      });
  };

  return (
    <ModalOverlay title='Создать сессию' isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
      <div className={s.container}>
        {encounterId && !data && !isLoading && (
          <>
            <div className={s.text} style={{ textAlign: 'center', marginBottom: '20px' }}>
              Подтвердите создание сессии
            </div>
            <button onClick={handleTrigger} data-variant='accent'>
              Создать сессию
            </button>
          </>
        )}

        {encounterId && !data && isLoading && <Spinner size={100} />}

        {encounterId && data && !isError && (
          <>
            <div className={s.text}>
              Отправьте эту информацию тем, кого хотите пригласить. Сохраните ее, если планируете
              сессию позже.
            </div>
            <div className={s.linkContainer}>
              <input
                className={s.linkInput}
                type='text'
                value={buildLink(schemeAndDomain, data.sessionID)}
                readOnly
              />
              <Tippy content='Копировать ссылку'>
                <button onClick={handleCopy} data-variant='primary'>
                  <Icon28CopyOutline />
                </button>
              </Tippy>
            </div>
            <Link
              to={buildLink(schemeAndDomain, data.sessionID)}
              data-role='btn'
              data-variant='accent'
            >
              Перейти в сессию{' '}
            </Link>
          </>
        )}

        {isError && <div className={s.text}>Упс, что-то пошло не так :(</div>}
      </div>
    </ModalOverlay>
  );
};
