export interface Country {
  countryCode: string;
  name: string;
  flag: string;
  borders: BorderCountry[];
  population: PopulationData[];
}

export interface BorderCountry {
  countryCode: string;
  commonName: string;
}

export interface PopulationData {
  year: number;
  value: number;
}
