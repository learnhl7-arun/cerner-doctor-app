<script lang="ts">
    import { onMount } from 'svelte';
    import axios from 'axios';
    import PatientBanner from './PatientBanner.svelte';
    
    let baseURL: string

    let clientId = '486139b1-5526-42bb-a1a7-302e3fd11d5a'
    let redirectUri = 'http://localhost:5173'

    interface TokenResponse {
        "access_token": string,
        "patient": string,
        "scope": string,
        "need_patient_banner": boolean,
        "id_token": string,
        "smart_style_url": string,
        "expires_in": number
    }

    let token: TokenResponse | undefined

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

        const tokenJSON = localStorage.getItem(LOCALSTORAGE_TOKEN_JSON)

        const issLocaStorage = localStorage.getItem(LOCALSTORAGE_ISS) as string
        if (issLocaStorage) {
            baseURL = issLocaStorage
        }
        

        if (tokenJSON) {
            token = JSON.parse(tokenJSON)
            return
        }

        if (token) {
            // To DO: validate token expiry
            return
        }
        if (code) {
            token = await makeTokenRequest(code)
            localStorage.setItem(LOCALSTORAGE_TOKEN_JSON, JSON.stringify(token))
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
        localStorage.setItem(LOCALSTORAGE_ISS, issParam)
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

	{#if token.need_patient_banner}
		<PatientBanner
			accessToken={token.access_token}
			baseURL={"https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d"}
			patient={token.patient}
		/>
	{/if}
{/if}