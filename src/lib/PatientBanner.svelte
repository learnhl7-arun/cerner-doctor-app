<script lang="ts">
  import axios from "axios";
  import type { Patient } from "fhir/r4";
  import { onMount } from "svelte";
  import { Button } from "flowbite-svelte";
  import FemaleIcon from "../assets/whacky_female.png";
  import MaleIcon from "../assets/whacky_male.png";

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
  });
</script>

<!-- <div class="p-3 flex gap-5 bg-slate-800 text-white"> -->
<div
  class="bg-accent-red gap-5 text-white p-6 m-4 mr-5 lg:p-3 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8"
>
  {#if patientResource}
    <!-- Avatar icon -->
    <div class="flex items-center mb-2 md:mb-0">
      <Button>
        {#if patientResource?.gender === "male"}
          <img
            src={MaleIcon}
            alt="Patient"
            height="100"
            width="100"
          />
        {/if}
        {#if patientResource?.gender === "female"}
          <img
            src={FemaleIcon}
            alt="Patient"
            height="100"
            width="100"
          />
        {/if}
      </Button>
    </div>
    <div class="flex-1 mr-9">
      <h2 class="text-3xl lg:text-2xl xl:text-3xl font-bold">
        Name: {patientResource?.name?.[0]?.text}
      </h2>
    </div>
    <div class="mt-4 md:mt-0 text-left md:text-right font-bold mr-6 ml-9">
      <p>
        DoB: {patientResource?.birthDate}
      </p>
      <span class="font-semibold"> Gender: </span>
      <span class="capitalize">{patientResource?.gender}</span>
    </div>
  {:else}
    Loading patient...
  {/if}
</div>
