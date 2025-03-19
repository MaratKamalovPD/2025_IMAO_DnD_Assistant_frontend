export const throttle = (
  func: (...args: any[]) => void,
  delay: number,
): ((...args: any[]) => void) => {
  let isCalled: boolean = false; // Флаг, указывающий, была ли функция вызвана

  return function (...args: any[]): void {
    if (isCalled) return;

    isCalled = true;

    func(...args);

    setTimeout(() => {
      isCalled = false; // Сбрасываем флаг
    }, delay);
  };
};
