import React from 'react';
import { AnimatedDieR3F } from '../../dices';
import { DieInstance } from '../../model';

type DieGridProps = {
  tray: DieInstance[];
  cols: number;
  spinFlag: number;
  onInitRemove: (id: string) => void;
  onFinalizeRemove: (id: string) => void;
  setTrayValue: (id: string, v: number) => void;
};

export const DieGrid: React.FC<DieGridProps> = ({
  tray, cols, spinFlag,
  onInitRemove, onFinalizeRemove, setTrayValue
}) => (
  <>
    {tray.map((die, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = (col - (cols - 1) / 2) * 2;
      const y = -(row - (Math.ceil(tray.length / cols) - 1) / 2) * 2;
      return (
        <group key={die.id} position={[x, y, 0]}>
          <AnimatedDieR3F
            id={die.id}
            type={die.type}
            value={die.value}
            spinFlag={spinFlag}
            removing={die.removing}
            onRemoved={onFinalizeRemove}
            onSettle={v => setTrayValue(die.id, v)}
            onClick={() => onInitRemove(die.id)}
          />
        </group>
      );
    })}
  </>
);