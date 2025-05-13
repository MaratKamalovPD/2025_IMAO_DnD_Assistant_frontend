import { useEffect, useState } from 'react';

export const useSessionURL = (pathname: string) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (/encounter_tracker\/session/.test(pathname)) {
      setUrl(pathname);
    }
  }, [pathname]);

  return url;
};
