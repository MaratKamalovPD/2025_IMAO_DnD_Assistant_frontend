import { toast } from 'react-toastify';

import type { MapFull, MapMetadata } from 'entities/maps';
import { useDeleteMapMutation, useLazyGetMapByIdQuery, useListMyMapsQuery } from 'entities/maps';
import { ModalOverlay, Spinner } from 'shared/ui';

import s from './MapEditor.module.scss';

type LoadMapDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLoadMap: (map: MapFull) => void;
};

export const LoadMapDialog = ({ isOpen, setIsOpen, onLoadMap }: LoadMapDialogProps) => {
  // Only fetch when dialog is open to avoid request on initial mount
  const {
    data: maps,
    isLoading,
    isError,
    refetch,
  } = useListMyMapsQuery(undefined, {
    skip: !isOpen,
  });
  const [getMapById, { isFetching: isLoadingMap }] = useLazyGetMapByIdQuery();
  const [deleteMap] = useDeleteMapMutation();

  const handleLoad = async (mapMeta: MapMetadata) => {
    try {
      const mapFull = await getMapById(mapMeta.id).unwrap();
      onLoadMap(mapFull);
      setIsOpen(false);
      toast.success(`Карта "${mapMeta.name}" загружена`);
    } catch {
      toast.error('Не удалось загрузить карту');
    }
  };

  const handleDelete = async (mapMeta: MapMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Удалить карту "${mapMeta.name}"?`)) return;

    try {
      await deleteMap(mapMeta.id).unwrap();
      toast.success('Карта удалена');
      void refetch();
    } catch {
      toast.error('Не удалось удалить карту');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <ModalOverlay title='Загрузить карту' isModalOpen={isOpen} setIsModalOpen={setIsOpen}>
      <div className={s.dialogContent}>
        {(isLoading || isLoadingMap) && (
          <div className={s.dialogLoadingState}>
            <Spinner size={48} />
            <p className={s.dialogLoadingText}>
              {isLoadingMap ? 'Загрузка карты...' : 'Загрузка списка карт...'}
            </p>
          </div>
        )}

        {isError && (
          <div className={s.dialogErrorState}>
            <span className={s.dialogErrorIcon}>⚠</span>
            <p className={s.dialogErrorText}>Не удалось загрузить список карт</p>
            <button type='button' className={s.dialogRetryBtn} onClick={() => void refetch()}>
              Повторить попытку
            </button>
          </div>
        )}

        {!isLoading && !isLoadingMap && !isError && maps && maps.length === 0 && (
          <div className={s.dialogEmptyState}>
            <span className={s.dialogEmptyIcon}>🗺️</span>
            <p className={s.dialogEmptyText}>Сейчас у вас ничего нет</p>
            <p className={s.dialogEmptyHint}>
              Создайте карту в редакторе и нажмите «Сохранить карту»
            </p>
          </div>
        )}

        {!isLoading && !isLoadingMap && !isError && maps && maps.length > 0 && (
          <div className={s.mapList}>
            {maps.map((map) => (
              <div key={map.id} className={s.mapListItem} onClick={() => void handleLoad(map)}>
                <div className={s.mapListItemInfo}>
                  <span className={s.mapListItemName}>{map.name}</span>
                  <span className={s.mapListItemDate}>{formatDate(map.updatedAt)}</span>
                </div>
                <button
                  type='button'
                  className={s.mapListItemDelete}
                  onClick={(e) => void handleDelete(map, e)}
                  title='Удалить'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};
