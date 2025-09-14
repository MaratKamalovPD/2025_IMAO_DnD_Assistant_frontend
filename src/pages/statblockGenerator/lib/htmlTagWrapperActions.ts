export const htmlTagWrapperActions = (value: string): string => {
  if (!value.trim()) return value;

  let processed = value;

  // 1. Оборачиваем первую часть до двоеточия в <p><em>...</em>
  const colonIndex = processed.indexOf(':');
  if (colonIndex !== -1) {
    const prefix = processed.slice(0, colonIndex).trim();
    const rest = processed.slice(colonIndex + 1).trim();
    processed = `<p><em>${prefix}:</em> ${rest}`;
  }

  // 2. Заменяем +15, -2, +0 и т.п. на <dice-roller> (только после </em>)
  const attackBonusRegex = /<\/em>\s*([+-]\d{1,2})/;
  processed = processed.replace(attackBonusRegex, (_match, bonus) => {
    // TODO - fix
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const formula = `к20 ${bonus[0]} ${bonus.slice(1)}`;
    return `</em> <dice-roller label="Атака" formula="${formula}">${bonus}</dice-roller>`;
  });

  // 3. Заменяем (3к8 + 8), (3к6) и т.п. на <dice-roller label="Урон" formula="..."/>
  const damageRollRegex = /\((\d+к\d+(?:\s*[+-]\s*\d+)?)\)/g;
  processed = processed.replace(
    damageRollRegex,
    (_match, formula) => `(<dice-roller label="Урон" formula="${formula}"/>)`,
  );

  return processed;
};
