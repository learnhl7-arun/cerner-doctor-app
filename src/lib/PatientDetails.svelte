<!-- <script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import type { Patient } from "fhir/r4";

  export let accessToken: string;
  export let baseUrl: string;
  export let patientId: string;

  let patientResource: Patient | undefined = undefined;

  onMount(async () => {
    const patientResourceResponse = await axios.get<Patient>(
      `${baseUrl}/Patient/${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    patientResource = patientResourceResponse.data;
    console.log("patientDetails: ", patientResourceResponse.data);
  });
</script>

{#if patientResource}
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 h-screen p-4">
    <div
      class="bg-white p-4 rounded-lg shadow-md md:col-span-2 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Demographics</h2>
      <p><strong>Name:</strong> {patientResource?.name?.[0]?.text}</p>
      <p><strong>Gender:</strong> {patientResource?.gender}</p>
      <p><strong>DOB:</strong> {patientResource?.birthDate}</p>
      <p><strong>Race:</strong> {patientResource?.extension}</p>
      <p><strong>Ethnicity:</strong> {patientResource?.ethnicity}</p>
      <p>
        <strong>Marital Status:</strong>
        {patientResource?.maritalStatus?.text}
      </p>
    </div>

    <div
      class="bg-white p-4 rounded-lg shadow-md md:col-span-2 md:row-span-2 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Medical Record Numbers</h2>
      {#each patientResource?.identifier as identifier}
        {#if identifier.type.text == "Community Medical Record Number"}
          <p>{identifier.value}</p>
        {/if}
      {/each}
    </div>

    <div
      class="bg-white p-4 rounded-lg shadow-md md:col-span-2 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Contact Details</h2>
      <p><strong>Address:</strong> {patientResource?.address[0]?.text}</p>
      <p>
        <strong>Phone:</strong>
        {patientResource.telecom?.find((t) => t.system === "phone")?.value}
      </p>
      <p>
        <strong>Email:</strong>
        {patientResource.telecom?.find((t) => t.system === "email")?.value}
      </p>
    </div>
  </div>
{:else}
  Loading patient...
{/if} -->

<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import type { Patient } from "fhir/r4";

  export let accessToken: string;
  export let baseUrl: string;
  export let patientId: string;

  let patientResource: Patient | undefined = undefined;
  let race = "";
  let ethnicity = "";

  onMount(async () => {
    const patientResourceResponse = await axios.get<Patient>(
      `${baseUrl}/Patient/${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    patientResource = patientResourceResponse.data;
    console.log("patientDetails: ", patientResource);

    // Extract Race and Ethnicity
    patientResource?.extension?.forEach((ext) => {
      if (
        ext.url ===
        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"
      ) {
        const raceExtension = ext.extension?.find(
          (e) => e.url === "ombCategory"
        );
        if (raceExtension && raceExtension.valueCoding) {
          race = raceExtension.valueCoding.display;
        }
      } else if (
        ext.url ===
        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
      ) {
        const ethnicityExtension = ext.extension?.find(
          (e) => e.url === "ombCategory"
        );
        if (ethnicityExtension && ethnicityExtension.valueCoding) {
          ethnicity = ethnicityExtension.valueCoding.display;
        }
      }
    });
  });
</script>

{#if patientResource}
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 h-screen p-4">
    <!-- Demographics Card -->
    <div
      class="bg-white p-4 rounded-lg shadow-md md:col-span-2 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Demographics</h2>
      <p><strong>Name:</strong> {patientResource?.name?.[0]?.text}</p>
      <p><strong>Gender:</strong> {patientResource?.gender}</p>
      <p><strong>DOB:</strong> {patientResource?.birthDate}</p>
      <p><strong>Race:</strong> {race}</p>
      <p><strong>Ethnicity:</strong> {ethnicity}</p>
      <p>
        <strong>Marital Status:</strong>
        {patientResource?.maritalStatus?.text}
      </p>
    </div>

    <!-- Medical Record Numbers Card -->
    <div
      class="bg-white p-4 rounded-lg shadow-md md:col-span-2 md:row-span-2 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Medical Record Numbers</h2>
      {#each patientResource?.identifier as identifier}
        {#if identifier.type?.text === "Community Medical Record Number"}
          <p>{identifier.value}</p>
        {/if}
      {/each}
    </div>

    <!-- Contact Details Card -->
    <div
      class="bg-white p-4 rounded-lg shadow-md md:col-span-2 overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Contact Details</h2>
      <p><strong>Address:</strong> {patientResource?.address?.[0]?.text}</p>
      <p>
        <strong>Phone:</strong>
        {patientResource.telecom?.find((t) => t.system === "phone")?.value}
      </p>
      <p>
        <strong>Email:</strong>
        {patientResource.telecom?.find((t) => t.system === "email")?.value}
      </p>
    </div>
  </div>
{:else}
  Loading patient...
{/if}
