export type CityOption = {
  id: number;
  name: string;
};

export type CountryOption = {
  id: number;
  name: string;
  cities: CityOption[];
};

export const COUNTRIES: CountryOption[] = [
  {
    id: 1,
    name: 'United States',
    cities: [
      { id: 101, name: 'New York' },
      { id: 102, name: 'San Francisco' },
      { id: 103, name: 'Los Angeles' },
      { id: 104, name: 'Chicago' },
    ],
  },
  {
    id: 2,
    name: 'China',
    cities: [
      { id: 201, name: 'Beijing' },
      { id: 202, name: 'Shanghai' },
      { id: 203, name: 'Shenzhen' },
      { id: 204, name: 'Guangzhou' },
    ],
  },
  {
    id: 3,
    name: 'United Kingdom',
    cities: [
      { id: 301, name: 'London' },
      { id: 302, name: 'Manchester' },
      { id: 303, name: 'Edinburgh' },
      { id: 304, name: 'Birmingham' },
    ],
  },
  {
    id: 4,
    name: 'Germany',
    cities: [
      { id: 401, name: 'Berlin' },
      { id: 402, name: 'Munich' },
      { id: 403, name: 'Hamburg' },
      { id: 404, name: 'Frankfurt' },
    ],
  },
  {
    id: 5,
    name: 'Japan',
    cities: [
      { id: 501, name: 'Tokyo' },
      { id: 502, name: 'Osaka' },
      { id: 503, name: 'Kyoto' },
      { id: 504, name: 'Sapporo' },
    ],
  },
  {
    id: 6,
    name: 'Australia',
    cities: [
      { id: 601, name: 'Sydney' },
      { id: 602, name: 'Melbourne' },
      { id: 603, name: 'Brisbane' },
      { id: 604, name: 'Perth' },
    ],
  },
];

const countryNameMap = new Map<number, string>();
const cityNameMap = new Map<number, string>();

COUNTRIES.forEach((country) => {
  countryNameMap.set(country.id, country.name);
  country.cities.forEach((city) => {
    cityNameMap.set(city.id, city.name);
  });
});

export function getCitiesForCountry(countryId: number): CityOption[] {
  const country = COUNTRIES.find((entry) => entry.id === countryId);
  return country ? country.cities : [];
}

export function getCountryName(countryId: number): string {
  return countryNameMap.get(countryId) ?? `Country #${countryId}`;
}

export function getCityName(cityId: number): string {
  return cityNameMap.get(cityId) ?? `City #${cityId}`;
}
