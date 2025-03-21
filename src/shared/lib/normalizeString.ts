export const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/ь/g, '') // Убираем мягкий знак
      .replace(/[^a-zа-я0-9]/g, '');
  };