export function mapDamageType(damageType: number): string {
  switch (damageType) {
    case 0:
      return 'Кислотный';
    case 1:
      return 'Дробящий';
    case 2:
      return 'Холод';
    case 3:
      return 'Огонь';
    case 4:
      return 'Силовой';
    case 5:
      return 'Молния';
    case 6:
      return 'Некротический';
    case 7:
      return 'Колющий';
    case 8:
      return 'Ядовитый';
    case 9:
      return 'Психический';
    case 10:
      return 'Светящийся';
    case 11:
      return 'Рубящий';
    case 12:
      return 'Громовой';
    default:
      return 'Неизвестный тип урона';
  }
}
