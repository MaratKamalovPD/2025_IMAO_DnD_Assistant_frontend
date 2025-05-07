import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import clsx from "clsx";
import s from "./PromptTextarea.module.scss";
import { PromptTextareaRef } from "pages/statblockGenerator/model";

const MAX_LENGTH = 300;

interface PromptTextareaProps {
  onSubmit?: (value: string) => void;
}

export const PromptTextarea = forwardRef<PromptTextareaRef, PromptTextareaProps>(
  ({ onSubmit }, ref) => {
    const [value, setValue] = useState<string>("");
    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [isValid, setIsValid] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      setValue: (text: string) => setValue(text),
      getValue: () => value,
    }));

    useEffect(() => {
      const matches = value.match(/{{\s*[\w\d_]+\s*}}/g) || [];
      setPlaceholders(matches);
      setIsValid(matches.length === 0 && value.length <= MAX_LENGTH);
    }, [value]);

    return (
      <div className={s.promptContainer}>
        <TextareaAutosize
          className={s.textarea}
          placeholder="Введите описание существа для генерации"
          minRows={4}
          maxRows={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={MAX_LENGTH}
        />

        <div className={s.statusBar}>
          <span className={s.placeholders}>
            {placeholders.length > 0
              ? `Заполните плейсхолдеры: ${placeholders.join(", ")}`
              : "Всё в порядке ✅"}
          </span>
          <span className={s.counter}>
            {value.length} / {MAX_LENGTH}
          </span>
        </div>

        <div className={s.promptSection__buttonContainer}>
          <button
            className={clsx(s.promptSection__button, {
              [s.disabled]: !isValid,
            })}
            onClick={() => onSubmit?.(value)}
            disabled={!isValid}
          >
            Сгенерировать существо
          </button>
        </div>
      </div>
    );
  }
);
