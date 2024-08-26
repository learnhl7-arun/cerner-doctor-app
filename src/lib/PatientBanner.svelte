<script lang="ts">
    import axios from "axios";
    import type { Patient } from "fhir/r4";
    import { onMount } from "svelte";

    export let accessToken: string
    export let baseURL: string
    export let patient: string

    let patientFirstName: string | undefined
    let patientLastName: string | undefined
    let patientDOB: string | undefined    
    let patientGender: string | undefined


    let patientResource: Patient | undefined = undefined;

    onMount(async () => {
        const patientResourceResponse = await axios.get<Patient>(`${baseURL}/Patient/${patient}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        patientResource = patientResourceResponse.data

        if (patientResource.name && patientResource.name[0]) {
            if (patientResource.name[0].given && patientResource.name[0].given[0]) {
                patientFirstName = patientResource.name[0].given[0]
            }
            patientLastName = patientResource.name[0].family
            
            if (patientResource.birthDate) {
                patientDOB = patientResource.birthDate
            }

            if (patientResource.gender = 'male'){
                patientGender = 'Male'
            }

            if (patientResource.gender = 'female'){
                patientGender = 'Female'
            }

        }


    });
</script>

<pre>
    <!-- {JSON.stringify(patientResource, null, 2)} -->
    <p>Patient First Name: {patientFirstName}</p>
    <p>Patient Last Name: {patientLastName}</p>
    <p>Patient DOB: {patientDOB}</p>
    <p>Patient Gender: {patientGender}</p>
</pre>