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
  const { data: maps, isLoading, isError, refetch } = useListMyMapsQuery();
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
        {(isLoading || isLoadingMap) && <Spinner size={60} />}

        {isError && <div className={s.dialogError}>Не удалось загрузить список карт</div>}

        {!isLoading && !isLoadingMap && !isError && maps && maps.length === 0 && (
          <div className={s.dialogEmpty}>У вас пока нет сохранённых карт</div>
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
