<script lang="ts">
  import { onMount } from "svelte";
  import { v4 as uuidv4 } from "uuid"; // Importing the UUID function
  import { Toast, Button } from "flowbite-svelte"; // Import Flowbite Toast component
  import axios from "axios";
  export let accessToken: string;
  export let patientId: string;
  export let baseUrl: string;

  let guid;
  let recordedDateTime;
  let vitals = {
    temperature: "",
    pulseRate: "",
    systolicBP: "",
    diastolicBP: "",
  };

  const vitalsInfo = {
    temperature: {
      displayName: "Oral temperature",
      code: "8331-1",
      unit: "degC",
      valCode: "Cel",
      text: "Oral temperature",
    },
    pulseRate: {
      displayName: "Heart rate --sitting",
      code: "69000-8",
      unit: "beats/min",
      valCode: "{beats}/min",
      text: "Heart rate --sitting",
    },
  };

  onMount(() => {
    guid = uuidv4(); // Generate a new GUID
    recordedDateTime = new Date().toISOString(); // Get the current timestamp
  });

  function handleInputChange(e, field) {
    const value = e.target.value;
    if (isValidNumber(value)) {
      vitals[field] = value;
    }
  }

  function isValidNumber(value) {
    const regex = /^\d*\.?\d*$/;
    return regex.test(value) || value === ""; // Allow empty string for initial state
  }

  const saveVitals = async () => {
    if (
      (vitals.systolicBP && !vitals.diastolicBP) ||
      (!vitals.systolicBP && vitals.diastolicBP)
    ) {
      alert(
        "Please fill both Systolic and Diastolic Blood Pressure or leave them both empty."
      );
      return;
    }

    const patientReference = `Patient/${patientId}`;
    const requests = [];

    for (const [key, info] of Object.entries(vitalsInfo)) {
      if (vitals[key]) {
        const payload = {
          resourceType: "Observation",
          status: "final",
          subject: {
            reference: patientReference,
          },

          category: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "vital-signs",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: info.code,
                display: info.displayName,
              },
            ],
            text: info.text,
          },
          effectiveDateTime: recordedDateTime,
          valueQuantity: {
            value: parseFloat(vitals[key]),
            unit: info.unit,
            system: "http://unitsofmeasure.org",
            code: info.valCode,
          },
        };

        requests.push(sendRequest(payload));
      }
    }

    if (vitals.systolicBP && vitals.diastolicBP) {
      const bpPayload = {
        resourceType: "Observation",
        status: "final",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/observation-category",
                code: "vital-signs",
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "85354-9",
              display: "Blood pressure panel with all children optional",
            },
          ],
        },
        subject: {
          reference: patientReference,
        },
        effectiveDateTime: recordedDateTime,
        component: [
          {
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "8480-6",
                  display: "Systolic blood pressure",
                },
              ],
              text: "Systolic Blood Pressure",
            },
            valueQuantity: {
              value: parseFloat(vitals.systolicBP),
              unit: "mmHg",
              system: "http://unitsofmeasure.org",
              code: "mm[Hg]",
            },
          },
          {
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "8462-4",
                  display: "Diastolic blood pressure",
                },
              ],
              text: "Diastolic Blood Pressure",
            },
            valueQuantity: {
              value: parseFloat(vitals.diastolicBP),
              unit: "mmHg",
              system: "http://unitsofmeasure.org",
              code: "mm[Hg]",
            },
          },
        ],
      };
      requests.push(sendRequest(bpPayload));
    }
  };

  async function sendRequest(payload) {
    const response = await axios.post(`${baseUrl}/Observation`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response: ", response);
  }
</script>

<!-- Card Layout -->
<div class="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
  <h2 class="text-3xl font-bold mb-8">Add Vitals</h2>

  <div class="mb-8">
    <label class="block font-semibold mb-2">Document Identifier</label>
    <input
      type="text"
      class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-100"
      value={guid}
      readonly
    />

    <label class="block font-semibold mb-2">Recorded DateTime</label>
    <input
      type="text"
      class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
      value={recordedDateTime}
      readonly
    />
  </div>

  <div class="mb-8">
    <h3 class="text-xl font-semibold mb-4">Vitals</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each Object.keys(vitalsInfo) as key}
        <div>
          <label class="block font-semibold mb-2"
            >{vitalsInfo[key].displayName} ({vitalsInfo[key].unit})</label
          >
          <input
            type="text"
            step="any"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            bind:value={vitals[key]}
            on:input={(e) => handleInputChange(e, key)}
            pattern="[0-9]*\.?[0-9]*"
          />
        </div>
      {/each}
    </div>
  </div>

  <div class="mb-8">
    <h3 class="text-xl font-semibold mb-4">Blood Pressure</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block font-semibold mb-2">Systolic (mmHg)</label>
        <input
          type="number"
          step="any"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          bind:value={vitals.systolicBP}
          on:input={(e) => handleInputChange(e, "systolicBP")}
        />
      </div>
      <div>
        <label class="block font-semibold mb-2">Diastolic (mmHg)</label>
        <input
          type="number"
          step="any"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          bind:value={vitals.diastolicBP}
          on:input={(e) => handleInputChange(e, "diastolicBP")}
        />
      </div>
    </div>
  </div>

  <div class="flex justify-end space-x-4">
    <Button
      outline
      color="red"
      class="mx-4"
      on:click={saveVitals}>Save</Button
    >
  </div>
</div>

<style>
  input:invalid {
    border-color: red;
  }
</style>
