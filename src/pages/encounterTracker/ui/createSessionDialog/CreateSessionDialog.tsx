import Tippy from '@tippyjs/react';
import { Icon28ChainOutline, Icon28CopyOutline } from '@vkontakte/icons';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { EncounterState, EncounterStore } from 'entities/encounter/model';
import { SessionContext } from 'entities/session/model';
import { useLazyCreateSessionQuery } from 'pages/encounterTracker/api';
import { ModalOverlay, Spinner } from 'shared/ui';

import s from './CreateSessionDialog.module.scss';

const buildLink = (schemeAndDomain: string, sessionId: string) =>
  `${schemeAndDomain}/encounter_tracker/session/${sessionId}`;

const CreateSessionDialog = () => {
  const isSession = useContext(SessionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { encounterId } = useSelector<EncounterStore>((state) => state.encounter) as EncounterState;

  const [trigger, { data, isLoading, isError }] = useLazyCreateSessionQuery();

  const urlObj = new URL(window.location.href);
  const schemeAndDomain = `${urlObj.protocol}//${urlObj.hostname}`;

  const handleTrigger = () => {
    trigger({ encounterID: encounterId as string });
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
    <>
      {encounterId && !isSession && (
        <Tippy content='Создать сессию' placement='right'>
          <div className={s.ButtonContainer} onClick={() => setIsModalOpen(true)}>
            <Icon28ChainOutline />
          </div>
        </Tippy>
      )}

      <ModalOverlay
        title='Создать сессию'
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
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
            </>
          )}

          {isError && <div className={s.text}>Упс, что-то пошло не так :(</div>}
        </div>
      </ModalOverlay>
    </>
  );
};

export default CreateSessionDialog;
