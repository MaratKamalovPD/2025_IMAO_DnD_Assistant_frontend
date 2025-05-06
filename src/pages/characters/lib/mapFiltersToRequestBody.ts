import { GetCharactersRequest } from 'pages/characters/api';

export const mapFiltersToRequestBody = (
  start: number,
  size: number,
  searchValue: string,
): GetCharactersRequest => {
  const requestBody: GetCharactersRequest = {
    start: start,
    size: size,
    search: {
      value: searchValue,
      exact: false,
    },
  };

  return requestBody;
};
