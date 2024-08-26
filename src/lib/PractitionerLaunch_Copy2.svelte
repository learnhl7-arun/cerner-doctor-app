<script lang="ts">
    import { onMount } from 'svelte';
    import axios from 'axios';
    // This version outputs the following 
    
    // {
    //     "access_token": "eyJraWQiOiIyMDI0LTA4LTI2VDAwOjUxOjE2LjIwOC5lYy5lczI1NiIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJwb3J0YWwiLCJ1cm46Y29tOmNlcm5lcjphdXRob3JpemF0aW9uOmNsYWltcyI6eyJ2ZXIiOiIxLjAiLCJlbmNvdW50ZXIiOiI5Nzk1MzQ4MyIsInRudCI6ImVjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZCIsImF6cyI6ImZoaXJVc2VyIGxhdW5jaCBvcGVuaWQgdXNlclwvT2JzZXJ2YXRpb24ucmVhZCB1c2VyXC9PYnNlcnZhdGlvbi53cml0ZSB1c2VyXC9QYXRpZW50LnJlYWQiLCJ1c2VyIjoiMTI3NDIwNjkiLCJwYXRpZW50IjoiMTI3MjQwNjUifSwiYXpwIjoiNDg2MTM5YjEtNTUyNi00MmJiLWExYTctMzAyZTNmZDExZDVhIiwiaXNzIjoiaHR0cHM6XC9cL2F1dGhvcml6YXRpb24uY2VybmVyLmNvbVwvIiwiZXhwIjoxNzI0NjM2NjcwLCJpYXQiOjE3MjQ2MzYwNzAsImp0aSI6ImRjOTZjYzc0LTgwYjctNDNhYS05MmVlLWE2M2EzZjQ5YjVjYSIsInVybjpjZXJuZXI6YXV0aG9yaXphdGlvbjpjbGFpbXM6dmVyc2lvbjoxIjp7InZlciI6IjEuMCIsInByb2ZpbGVzIjp7Im1pbGxlbm5pdW0tdjEiOnsicGVyc29ubmVsIjoiMTI3NDIwNjkiLCJlbmNvdW50ZXIiOiI5Nzk1MzQ4MyJ9LCJzbWFydC12MSI6eyJwYXRpZW50cyI6WyIxMjcyNDA2NSJdLCJhenMiOiJmaGlyVXNlciBsYXVuY2ggb3BlbmlkIHVzZXJcL09ic2VydmF0aW9uLnJlYWQgdXNlclwvT2JzZXJ2YXRpb24ud3JpdGUgdXNlclwvUGF0aWVudC5yZWFkIiwiZmhpclVzZXIiOiJQcmFjdGl0aW9uZXJcLzEyNzQyMDY5In19LCJjbGllbnQiOnsibmFtZSI6IlByb3ZpZGVyIFN2ZWx0ZSIsImlkIjoiNDg2MTM5YjEtNTUyNi00MmJiLWExYTctMzAyZTNmZDExZDVhIn0sInVzZXIiOnsicHJpbmNpcGFsIjoicG9ydGFsIiwicGVyc29uYSI6InByb3ZpZGVyIiwiaWRzcCI6ImVjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZCIsInNlc3Npb25JZCI6IjM2MjY3MWFiLTI2OWQtNDUxOC04MWFiLTUxZjMyYjAzYTU4NyIsInByaW5jaXBhbFR5cGUiOiJ1c2VybmFtZSIsInByaW5jaXBhbFVyaSI6Imh0dHBzOlwvXC9taWxsZW5uaWEuY2VybmVyLmNvbVwvaW5zdGFuY2VcL2VjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZFwvcHJpbmNpcGFsXC8wMDAwLjAwMDAuMDBDMi42REI1IiwiaWRzcFVyaSI6Imh0dHBzOlwvXC9taWxsZW5uaWEuY2VybmVyLmNvbVwvYWNjb3VudHNcL2MxOTQxLmNlcm5fYWJjbi5jZXJuZXJhc3AuY29tXC9lYzI0NThmMi0xZTI0LTQxYzgtYjcxYi0wZTcwMWFmNzU4M2RcL2xvZ2luIn0sInRlbmFudCI6ImVjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZCJ9fQ.Bih67lYj3s7xz7YVSw78EE4gx7mXX6mElYhuo5XypjRcy4R475tuL_zULuF5cPuwvU-G17EFqJMZFROaMbmjBw",
    //     "patient": "12724065",
    //     "scope": "fhirUser launch openid user/Observation.read user/Observation.write user/Patient.read",
    //     "need_patient_banner": true,
    //     "id_token": "eyJraWQiOiIyMDI0LTA4LTI2VDAwOjUxOjE2LjIwOC5yc2EiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJwb3J0YWwiLCJhdWQiOiI0ODYxMzliMS01NTI2LTQyYmItYTFhNy0zMDJlM2ZkMTFkNWEiLCJwcm9maWxlIjoiaHR0cHM6XC9cL2ZoaXItZWhyLWNvZGUuY2VybmVyLmNvbVwvcjRcL2VjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZFwvUHJhY3RpdGlvbmVyXC8xMjc0MjA2OSIsImlzcyI6Imh0dHBzOlwvXC9hdXRob3JpemF0aW9uLmNlcm5lci5jb21cL3RlbmFudHNcL2VjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZFwvb2lkY1wvaWRzcHNcL2VjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZFwvIiwibmFtZSI6IlBvcnRhbCwgUG9ydGFsIiwiZXhwIjoxNzI0NjM2NjcwLCJpYXQiOjE3MjQ2MzYwNzAsImZoaXJVc2VyIjoiaHR0cHM6XC9cL2ZoaXItZWhyLWNvZGUuY2VybmVyLmNvbVwvcjRcL2VjMjQ1OGYyLTFlMjQtNDFjOC1iNzFiLTBlNzAxYWY3NTgzZFwvUHJhY3RpdGlvbmVyXC8xMjc0MjA2OSIsImVtYWlsIjoicG9ydGFsLnRlc3QucG9ydGFsQHRlc3RjZXJuZXIuZGlyZWN0LmNvbSJ9.WfEepHA0CQJqYHdX38caI3GB_a1vTxDY47IVK2a54OFDZLFXfyQ-w06vPh-XmvH_AwT0hh1Ha1ouGlaf8jW_QBY6AaoYz60lz6iQtckR4xw1c4r-6iu3STo6F5azP9Pt7uj4CMMmpWLsUrm-4AuXsE0IKvEwC2XxN5k5ZxLbhYG3PkgE6Q8gpsxHxRjG46D8zUxAAjudt4kgBrMgnmBpzgHUAUqNHwgohon-kkX96FZoznijX8tjvxbaGEQ-pa15yURCdTj6iAWQdyoNEM_-_NJWpfzr5t_Ld_L3TficZqznVNDe2xn-fRK0CkmYtEQYO2EXbMWNJ_KPw53E-ydP_w",
    //     "smart_style_url": "https://smart.cerner.com/styles/smart-v1.json",
    //     "encounter": "97953483",
    //     "token_type": "Bearer",
    //     "expires_in": 570,
    //     "user": "12742069",
    //     "tenant": "ec2458f2-1e24-41c8-b71b-0e701af7583d",
    //     "username": "portal"
    // }

    
    // let global_iss: string
    // let global_launch: string
    // let global_authorizationEndpoint: string
    // let global_redirectUrl: string
    // let global_tokenEndpoint: string

    let clientId = '486139b1-5526-42bb-a1a7-302e3fd11d5a'
    let redirectUri = 'http://localhost:5173'

    let token: any

    const LOCALSTORAGE_TOKEN_ENDPOINT = 'tokenEndpoint'
    const LOCALSTORAGE_ISS = 'iss'
    const LOCALSTORAGE_TOKEN_JSON = 'token'

    const constructAuthUrl = (authorizationEndpoint: string, launch: string, iss: string) => {
        const url = new URL(authorizationEndpoint)
        url.searchParams.set('client_id', clientId)
        url.searchParams.set('redirect_uri', redirectUri)
        url.searchParams.set('scope', 'openid fhirUser launch user/Observation.read user/Observation.write user/Patient.read')
        url.searchParams.set('response_type', 'code')
        url.searchParams.set('aud', iss)
        url.searchParams.set('launch', launch)

        return url.href
      }
    
    //Function to make token request
    const makeTokenRequest = async (code: string) => {
        const tokenEndpoint = localStorage.getItem(LOCALSTORAGE_TOKEN_ENDPOINT)
        if (!tokenEndpoint) {
            throw new Error('Token endpoint not found in local storage')
        }

        //Make the token request
        const form = new URLSearchParams()
        form.set('grant_type', 'authorization_code')
        form.set('code', code)
        form.set('redirect_uri', redirectUri)
        form.set('client_id', clientId)   
        const tokenResponse = await axios.post(tokenEndpoint, form, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        localStorage.removeItem(LOCALSTORAGE_TOKEN_ENDPOINT)
        return tokenResponse.data
    }
    
    onMount(async () => {
        const launchUrl = new URL(window.location.href)
        const issParam = launchUrl.searchParams.get('iss')
        const launchParam = launchUrl.searchParams.get('launch')

        const code = launchUrl.searchParams.get('code')
        if (code) {
            token = await makeTokenRequest(code)
            return
        }
        else {
            console.log('No code found')
        }

        if (!issParam || !launchParam) {
            throw new Error('Missing iss or launch parameter')
        }

        // global_iss = issParam
        // global_launch = launchParam

        const iss = issParam
        const launch = launchParam

        const smartConfigurationResponse = await axios.get(`${iss}/.well-known/smart-configuration`)
        const smartConfiguration = smartConfigurationResponse.data

        const authorizationEndpoint = smartConfiguration.authorization_endpoint as string
        // global_authorizationEndpoint = authorizationEndpoint

        const tokenEndpoint = smartConfiguration.token_endpoint as string
        // global_tokenEndpoint = tokenEndpoint


        //Store tokenEndpoint in a store for later use
        localStorage.setItem(LOCALSTORAGE_TOKEN_ENDPOINT,tokenEndpoint)


        const redirectUrl = constructAuthUrl(authorizationEndpoint, launch, iss)
        // global_redirectUrl = redirectUrl

        window.location.href = redirectUrl
    });

</script>

{#if !token}
    Loading ....
{:else}
    <pre>
        {JSON.stringify(token, null, 2)}
    </pre>
{/if}