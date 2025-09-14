import { cursorStyle } from 'pages/bestiary/lib';
import { JumpTarget } from 'pages/bestiary/model';
import s from './DescriptionSection.module.scss';

type SectionElement = {
  name: string;
  value?: string | number;
  description?: string;
};

type DescriptionSectionProps = {
  sectionTitle: string;
  elements: SectionElement[];
  onJump?: (target: JumpTarget) => void;
  jumpTarget?: JumpTarget;
};

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  sectionTitle,
  elements,
  onJump,
  jumpTarget,
}) => {
  return (
    <div className={s.descrptionContainer}>
      <div
        onClick={() => onJump?.(jumpTarget ?? 'attack')}
        className={s.descrptionContainer__sectionTitle}
        style={cursorStyle(onJump != null)}
      >
        {sectionTitle}
      </div>
      <div className={s.descrptionContainer__content}>
        {Object.entries(elements).map(([_, el]) => (
          <div key={el.name} className={s.descrptionContainer__line}>
            <span className={s.descrptionContainer__title}>{el.name}</span>
            <span
              className={s.descrptionContainer__text}
              dangerouslySetInnerHTML={{ __html: el.value ?? el.description ?? '' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
