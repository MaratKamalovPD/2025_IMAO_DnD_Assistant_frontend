import Tippy from '@tippyjs/react';
import { Icon20DocumentPlusOutline } from '@vkontakte/icons';

import { TopPanelWithSearch } from 'shared/ui';
import s from './TopPanel.module.scss';

type TopPanelProps = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TopPanel: React.FC<TopPanelProps> = ({ setSearchValue, setIsModalOpen }) => {
  return (
    <TopPanelWithSearch title='Мои персонажи' setSearchValue={setSearchValue}>
      <Tippy content={'Добавить новый лист персонажа'}>
        <button onClick={() => setIsModalOpen(true)} data-variant='secondary' className={s.btn}>
          <Icon20DocumentPlusOutline width={19} height={19} />
          <span>Добавить персонажа</span>
        </button>
      </Tippy>
    </TopPanelWithSearch>
  );
};
