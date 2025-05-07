import { FC } from "react";
import { OptionProps } from "react-select";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // если ещё не подключен
import { SelectOptionWithDescription } from "pages/statblockGenerator/model";

export const PromptPresetOption: FC<OptionProps<SelectOptionWithDescription, false>> = (props) => {
  const { data, innerRef, innerProps, isFocused } = props;

  return (
    <Tippy content={data.description} placement="right" delay={[300, 0]}>
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          padding: "8px 12px",
          backgroundColor: isFocused
            ? "var(--primary-bg-color)"
            : "transparent",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {data.label}
      </div>
    </Tippy>
  );
};
