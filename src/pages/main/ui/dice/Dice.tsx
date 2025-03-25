import clsx from 'clsx';
import { useEffect } from 'react';

import s from './Dice.module.scss';

export const Dice = () => {
  useEffect(() => {
    const scrollListener = () => {
      document.body.style.setProperty(
        '--scroll',
        String(
          window.pageYOffset /
            (document.body.offsetHeight - window.innerHeight),
        ),
      );
    };

    window.addEventListener('scroll', scrollListener, false);

    return () => {
      window.removeEventListener('scroll', scrollListener, false);
    };
  }, []);

  console.log('aaaaaaaa');

  return (
    <>
      <div className={s.progress}></div>

      <div className={s.cubed6Wrap}>
        <div className={s.cube}>
          <div className={clsx(s.side, s.top)}>1</div>
          <div className={clsx(s.side, s.bottom)}>2</div>
          <div className={clsx(s.side, s.front)}>3</div>
          <div className={clsx(s.side, s.back)}>4</div>
          <div className={clsx(s.side, s.left)}>5</div>
          <div className={clsx(s.side, s.right)}>6</div>
        </div>
      </div>

      <div className={s.cubed20Wrap}>
        <div className={s.d20}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6.</div>
          <div>7</div>
          <div>8</div>
          <div>9.</div>
          <div>10</div>
          <div>11</div>
          <div>12</div>
          <div>13</div>
          <div>14</div>
          <div>15</div>
          <div>16</div>
          <div>17</div>
          <div>18</div>
          <div>19</div>
          <div>20</div>
        </div>
      </div>
    </>
  );
};
