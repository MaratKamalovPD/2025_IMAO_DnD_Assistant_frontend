import React, { useMemo, useState, useEffect } from "react";
import Select, { components } from "react-select";
import { ExternalLink } from "lucide-react";
import clsx from "clsx";
import s from "./MonsterSelect.module.scss";
import { useDebounce } from "shared/lib";
import { CreatureClippedData } from "entities/creature/model/types";
import {
  GetCreaturesRequest,
  useGetCreaturesQuery,
} from "pages/bestiary/api";
import { mapFiltersToRequestBody } from "pages/bestiary/lib";

const DEBOUNCE_TIME = 500;
const MAX_RESULTS = 10;

export const MonsterSelect: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_TIME);

  const requestBody: GetCreaturesRequest = useMemo(() => {
    return mapFiltersToRequestBody({}, 0, MAX_RESULTS, debouncedSearch, []);
  }, [debouncedSearch]);

  const { data: creatures = [], isLoading } = useGetCreaturesQuery(requestBody);

  const options = useMemo(() => {
    return creatures
      .slice(0, MAX_RESULTS)
      .map((m: CreatureClippedData) => ({
        value: m.name?.rus ?? "Без имени",
        label: `${m.challengeRating ?? "—"} - ${m.name?.rus ?? "?"}`,
        link: m.url,
      }));
  }, [creatures]);
  

  useEffect(() => {
    console.log("creatures:", creatures);
  }, [creatures]);

  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps, isFocused } = props;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={clsx(s.option, { [s.optionFocused]: isFocused })}
      >
        <span>{data.label}</span>
        <a href={data.link} target="_blank" rel="noopener noreferrer">
          <ExternalLink className={s.icon} />
        </a>
      </div>
    );
  };

  const NoOptionsMessage = () => (
    <div className={s.noResults}>Ничего не найдено</div>
  );

  return (
    <div className={s.monsterSelect}>
      <h2 className={s.monsterSelect__title}>ПЕРСОНАЖИ МАСТЕРА</h2>
      <Select
        options={options}
        components={{
          Option: CustomOption,
          NoOptionsMessage,
        }}
        placeholder="Монстр"
        isClearable
        isSearchable
        noOptionsMessage={() => null}
        classNamePrefix="monster"
        className={s.monsterSelect__dropdown}
        inputValue={searchValue}
        onInputChange={(val, { action }) => {
        if (action !== "input-blur" && action !== "menu-close") {
            setSearchValue(val);
        }
        }}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "var(--secondary-bg-color)",
            borderRadius: 8,
            border: "none",
            padding: "6px",
            color: "white",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "var(--secondary-bg-color)",
            boxShadow: "0 0 0 2px var(--primary-btn-color)",
            maxHeight: "unset",
            overflowY: "hidden",
          }),
          singleValue: (base) => ({
            ...base,
            color: "white", 
          }),
        }}
      />
    </div>
  );
};
