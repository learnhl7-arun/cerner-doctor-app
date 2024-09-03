<script lang="ts">
  import axios from "axios";
  import { formatRelative, subDays } from "date-fns";
  import type {
    Bundle,
    BundleEntry,
    MedicationRequest,
    Observation,
    OperationOutcome,
  } from "fhir/r4";

  export let accessToken: string;
  export let patientId: string;
  export let baseUrl: string;
  export let title: string = "Observations";

  let temperature: number;
  let observationPosting = false;

  const getObservations = async () => {
    const labObservationResponse = await axios.get<
      Bundle<Observation | OperationOutcome>
    >(`${baseUrl}/Observation`, {
      params: {
        patient: patientId,
        sort: "-date",
        category: "vital-signs",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return labObservationResponse.data;
  };

  let observationPromise = getObservations();

  const getObservationDisplay = (observation: Observation | undefined) => {
    if (!observation) {
      return "";
    }
    const isBp = observation.code?.coding?.find((a) => a.code === "85354-9");
    if (isBp) {
      const systolicComponent = observation.component?.find((a) =>
        a.code?.coding?.find((b) => b.code === "8480-6")
      );
      const systolic = systolicComponent?.valueQuantity?.value;
      const diastolicComponent = observation.component?.find((a) =>
        a.code?.coding?.find((b) => b.code === "8462-4")
      );
      const diastolic = diastolicComponent?.valueQuantity?.value;
      return `${systolic}/${diastolic}`;
    }
    if (!observation?.valueQuantity?.unit) {
      return observation?.valueQuantity?.value;
    }
    return `${observation?.valueQuantity?.value} `;
    // ${observation?.valueQuantity?.unit}
  };
  const getObservationEntries = (
    bundle: Bundle<Observation | OperationOutcome>
  ): BundleEntry<Observation>[] => {
    if (!bundle?.entry) {
      return [];
    }
    const results = bundle.entry?.filter(
      (entry) => entry.resource?.resourceType === "Observation"
    ) as BundleEntry<Observation>[];
    const nonPanelResults = results.filter(
      (entry) => entry?.resource?.hasMember == undefined
    );
    return nonPanelResults;
  };
</script>

<div class="table-container mt-10 w-100 mx-auto">
  <h1 class="text-2xl">
    {title}
  </h1>

  {#await observationPromise}
    loading...
  {:then observations}
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="border border-gray-300 px-4 py-2">Date and Time</th>
          <th class="border border-gray-300 px-4 py-2">Vital Parameter</th>
          <th class="border border-gray-300 px-4 py-2">Value</th>
          <th class="border border-gray-300 px-4 py-2">UofM</th>
        </tr>
      </thead>
      <tbody>
        {#each getObservationEntries(observations) as observation, i}
          <tr class={i % 2 ? "bg-gray-50" : "bg-white"}>
            <td class="border border-gray-300 px-4 py-2">
              {#if observation.resource?.effectiveDateTime}
                {new Date(
                  observation.resource.effectiveDateTime
                ).toLocaleString()}
              {/if}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {#if observation.resource?.code?.text}
                {observation.resource.code.text}
              {/if}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {getObservationDisplay(observation.resource)}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {#if observation.resource?.valueQuantity?.unit}
                {observation.resource.valueQuantity.unit}
              {/if}
              {#if observation.resource?.code?.coding?.find((a) => a.code === "85354-9")}
                mm[Hg]
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/await}
</div>

<style>
  .table-container {
    max-height: 55vh; /* Adjust the height as needed */
    overflow-y: auto;
  }
  thead th {
    position: sticky;
    top: 0;
    background-color: #e8e8fd; /* Match with your design's header background color */
    z-index: 1; /* Ensure it stays above table rows */
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 12px;
    text-align: left;
  }
  th {
    font-weight: 600;
    color: #4b5563; /* Header text color */
  }

  tbody tr:hover {
    background-color: #f8f8ff; /* Row hover effect */
  }
</style>
