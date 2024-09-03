import { writable } from "svelte/store";

// Create writable stores for token, baseUrl, and patientId
export const tokenStore = writable(undefined);
export const baseUrlStore = writable(undefined);
export const patientIdStore = writable(undefined);

// Optional: helper functions to update the stores
export function setToken(token) {
  tokenStore.set(token);
  console.log("token in store: ", token);
}

export function setBaseUrl(url) {
  baseUrlStore.set(url);
  {
    console.log("baseURl in store: ", url);
  }
}

export function setPatientId(id) {
  patientIdStore.set(id);
}
