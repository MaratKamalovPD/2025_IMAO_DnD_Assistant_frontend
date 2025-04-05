import { Language } from 'shared/lib';

export interface MonsterSpeedFormProps {
  initialSpeed?: number;
  initialBurrowSpeed?: number;
  initialClimbSpeed?: number;
  initialFlySpeed?: number;
  initialSwimSpeed?: number;
  initialCustomSpeed?: string;
  language?: Language;
}

export interface MonsterSpeedFormState {
  speed: number;
  burrowSpeed: number;
  climbSpeed: number;
  flySpeed: number;
  swimSpeed: number;
  customSpeed: string;
  useCustomSpeed: boolean;
  hover: boolean;
}