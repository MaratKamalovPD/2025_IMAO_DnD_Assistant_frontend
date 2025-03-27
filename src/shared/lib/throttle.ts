export const throttle = (
  func: (...args: any[]) => void,
  delay: number,
): ((...args: any[]) => void) => {
  let isCalled: boolean = false;

  return function (...args: any[]): void {
    if (isCalled) return;

    isCalled = true;

    func(...args);

    setTimeout(() => {
      isCalled = false;
    }, delay);
  };
};
