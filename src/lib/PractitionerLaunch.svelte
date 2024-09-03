<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import PatientBanner from "./PatientBanner.svelte";
  import ObservationViewer from "./ObservationViewer.svelte";
  import PatientDetails from "./PatientDetails.svelte";
  import { AccordionItem, Accordion } from "flowbite-svelte";
  import AddVitalsModal from "./AddVitalsModal.svelte";

  let clientId = "5146f1cf-d1c9-4d15-a868-50d865770081";
  let redirectUri = "http://localhost:5173";

  let baseUrl: string;

  interface TokenResponse {
    access_token: string;
    patient: string;
    scope: string;
    need_patient_banner: boolean;
    id_token: string;
    smart_style_url: string;
    expires_in: number;
  }

  let token: TokenResponse | undefined = undefined;

  const TOKEN_CACHING = false;

  const LOCALSTORAGE_TOKEN_ENDPOINT = "tokenEndpoint";
  const LOCALSTORAGE_ISS = "iss";
  const LOCALSTORAGE_TOKEN_JSON = "token";

  const constructAuthUrl = (
    authorizationEndpoint: string,
    launch: string,
    iss: string
  ) => {
    const url = new URL(authorizationEndpoint);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set(
      "scope",
      "openid fhirUser launch user/Observation.read user/Observation.write user/Patient.read"
    );
    url.searchParams.set("response_type", "code");
    url.searchParams.set("aud", iss);
    url.searchParams.set("launch", launch);

    return url.href;
  };

  const makeTokenRequest = async (code: string) => {
    const tokenEndpoint = localStorage.getItem(LOCALSTORAGE_TOKEN_ENDPOINT);
    if (!tokenEndpoint) {
      throw new Error("Token Endpoint could not be found in localstorage");
    }
    // Make the token request
    const form = new URLSearchParams();
    form.set("grant_type", "authorization_code");
    form.set("code", code);
    form.set("redirect_uri", redirectUri);
    form.set("client_id", clientId);
    const tokenResponse = await axios.post(tokenEndpoint, form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    localStorage.removeItem(LOCALSTORAGE_TOKEN_ENDPOINT);
    return tokenResponse.data;
  };

  onMount(async () => {
    const launchUrl = new URL(window.location.href);
    const issParam = launchUrl.searchParams.get("iss");
    console.log("baseUrl in P1: ", issParam);
    // setBaseUrl(baseUrl);
    const launchParam = launchUrl.searchParams.get("launch");

    const code = launchUrl.searchParams.get("code");

    const tokenJSON = localStorage.getItem(LOCALSTORAGE_TOKEN_JSON);

    const issLocalStorage = localStorage.getItem(LOCALSTORAGE_ISS);
    if (issLocalStorage) {
      baseUrl = issLocalStorage;
      console.log("baseUrl in P2: ", baseUrl);
      // setBaseUrl(baseUrl); // Update the baseUrl store
    }

    if (tokenJSON && TOKEN_CACHING) {
      token = JSON.parse(tokenJSON);
      console.log("token in P2: ", token);
      // setToken(token); // Update the token store
    }

    if (token) {
      if (token.expires_in) return;
    }

    if (code) {
      const tokenFromCerner = await makeTokenRequest(code);
      token = tokenFromCerner;
      localStorage.setItem(LOCALSTORAGE_TOKEN_JSON, JSON.stringify(token));
      // setToken(token); // Update the token store
      console.log("token in store: ", token);
      // setPatientId(token.patient); // Update the patientId store
      return;
    }

    if (!issParam || !launchParam) {
      throw new Error("iss or launch parameters not found");
    }
    const iss = issParam;
    localStorage.setItem(LOCALSTORAGE_ISS, issParam);
    // setBaseUrl(iss); // Update the baseUrl store

    const launch = launchParam;
    const smartConfigurationResponse = await axios.get(
      `${iss}/.well-known/smart-configuration`
    );
    const smartConfiguration = smartConfigurationResponse.data;
    const authorizationEndpoint =
      smartConfiguration.authorization_endpoint as string;
    const tokenEndpoint = smartConfiguration.token_endpoint as string;

    // store tokenEndpoint for future use
    localStorage.setItem(LOCALSTORAGE_TOKEN_ENDPOINT, tokenEndpoint);

    const redirectUrl = constructAuthUrl(authorizationEndpoint, launch, iss);

    window.location.href = redirectUrl;
  });
</script>

{#if !token}
  Loading...
{:else if token?.need_patient_banner}
      <PatientBanner
        {baseUrl}
        accessToken={token.access_token}
        patientId={token.patient}
      ></PatientBanner>
  {/if}
  <Accordion class="m2">
    <AccordionItem class="m2">
      <span slot="header">Patient Demographics</span>
      <PatientDetails
        {baseUrl}
        accessToken={token.access_token}
        patientId={token.patient}
      ></PatientDetails>
    </AccordionItem>
  </Accordion>

  <Accordion class="m2">
    <AccordionItem class="m2">
      <span slot="header">Vitals Observations</span>
      <ObservationViewer
        {baseUrl}
        accessToken={token.access_token}
        patientId={token.patient}
      ></ObservationViewer>
    </AccordionItem>
  </Accordion>

  <Accordion class="m2">
    <AccordionItem class="m2">
      <span slot="header">Add Vitals Observations</span>
      <AddVitalsModal
        {baseUrl}
        accessToken={token.access_token}
        patientId={token.patient}
      ></AddVitalsModal>
    </AccordionItem>
  </Accordion>