import Tippy from '@tippyjs/react';
import { Icon28NotebookAddBadgeOutline } from '@vkontakte/icons';

import { TopPanelWithSearch } from 'shared/ui';

import s from './TopPanel.module.scss';

type TopPanelProps = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TopPanel: React.FC<TopPanelProps> = ({ setSearchValue, setIsModalOpen }) => {
  return (
    <TopPanelWithSearch title='Мои cражения' setSearchValue={setSearchValue}>
      <Tippy content={'Добавить новое сражение'}>
        <button onClick={() => setIsModalOpen(true)} data-variant='secondary' className={s.btn}>
          <Icon28NotebookAddBadgeOutline width={19} height={19} />
          <span>Добавить сражение</span>
        </button>
      </Tippy>
    </TopPanelWithSearch>
  );
};
