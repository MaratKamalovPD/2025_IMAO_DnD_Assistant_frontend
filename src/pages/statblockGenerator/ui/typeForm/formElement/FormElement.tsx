import s from './FormElement.module.scss';

type FormElementProps = {
  label: string;
  children: React.ReactNode;
};

export const FormElement: React.FC<FormElementProps> = ({ label, children }) => (
  <div className={s.creaturePanel__statsElement}>
    <span className={s.creaturePanel__statsElement__text}>{label}:</span>
    {children}
  </div>
);
