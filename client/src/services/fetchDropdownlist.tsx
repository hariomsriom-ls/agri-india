import api from "@/utils/services";
export type LocationOption = {
  _id: number;
  name: string;
};

const addressApiBaseURL = api.defaults.baseURL?.replace(/\/user\/?$/, "");

 async function fetchCountries(signal?: AbortSignal): Promise<LocationOption[]> {
  const response = await api.get<{data: { countries: LocationOption[] };}>
  ("/address/get-country", {baseURL: addressApiBaseURL,signal,});

  const options = response.data?.data?.countries;

  if (!Array.isArray(options)) {throw new Error("Invalid country list received");}

  return options;
}

 async function fetchStates(countryId: string,signal?: AbortSignal): Promise<LocationOption[]> {
  const response = await api.get<{
    data: { states: LocationOption[] };
  }>("/address/get-state", {baseURL: addressApiBaseURL, params: { countryId }, signal, });

  const options = response.data?.data?.states;

  if (!Array.isArray(options)) {throw new Error("Invalid state list received"); }

  return options;
}

 async function fetchDistricts(stateId: string,signal?: AbortSignal): Promise<LocationOption[]> {
  const response = await api.get<{
    data: { districts: LocationOption[] };
  }>("/address/get-district", {baseURL: addressApiBaseURL,params: { stateId },signal,
  });

  const options = response.data?.data?.districts;

  if (!Array.isArray(options)) {throw new Error("Invalid district list received"); }

  return options;
}

export { fetchCountries, fetchStates, fetchDistricts };
