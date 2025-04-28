export const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
  let isCalled: boolean = false;

  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (isCalled) return;

    isCalled = true;

    func(...args);

    setTimeout(() => {
      isCalled = false;
    }, delay);
  };
};
