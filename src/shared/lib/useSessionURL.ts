import { useEffect, useState } from 'react';

export const useSessionURL = (pathname: string) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pathname.includes('encounter_tracker/session')) {
      setUrl(pathname);
    }
  }, [pathname]);

  return url;
};
