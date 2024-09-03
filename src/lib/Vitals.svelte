<script lang="ts">
  import ObservationViewer from "./ObservationViewer.svelte";
  import PatientBanner from "./PatientBanner.svelte";
  import {
    baseUrlStore,
    tokenStore,
    patientIdStore,
  } from "../stores/tokenStore"; // Import the stores
  import { get } from "svelte/store";
  let baseUrl = "";
  let token = {};

  baseUrlStore.subscribe((value) => {
    baseUrl = value;
  });
  console.log("baseUrl: ", baseUrl);

  tokenStore.subscribe((value) => {
    token = value;
  });
  console.log("token: ", token);

  // Get the values from the stores
  $: baseUrl = get(baseUrlStore);
  // let baseUrl = $baseUrlStore;
  $: token = get(tokenStore);
  //  let token = $tokenStore;
  // console.log("baseUrl: ", baseUrl);

  // Extract the access token from the token store
  const accessToken = token?.access_token;
  const patientId = token?.patient;

  console.log("accessToken: ", accessToken);
  console.log("patientId: ", patientId);
  // Check if the required data is available
  if (!baseUrl || !accessToken || !patientId) {
    throw new Error("Missing required data to load Vitals");
  }
</script>

<PatientBanner
  {baseUrl}
  {accessToken}
  {patientId}
></PatientBanner>
<ObservationViewer
  {baseUrl}
  {accessToken}
  {patientId}
/>
