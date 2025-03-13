import { useState } from 'react';
import reactLogo from 'shared/assets/images/react.svg';
import viteLogo from '/vite.svg';

import s from './Test.module.scss';
import clsx from 'clsx';

export function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href='https://vite.dev' target='blank'>
          <img src={viteLogo} className={s.logo} alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img
            src={reactLogo}
            className={clsx(s.logo, s.react)}
            alt='React logo'
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={s.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={s['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
