<script lang="ts">
    // This version outputs the following 
    //   "global_iss": "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
    //   "global_launch": "1bf5a7a1-6a70-4df7-8419-7c23a5166ff7",
    //   "global_authorizationEndpoint": "https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/personas/provider/authorize"

    import { onMount } from 'svelte';
    import axios from 'axios';
    
    let global_iss: string
    let global_launch: string
    let global_authorizationEndpoint: string
    let global_redirectUrl: string

    let clientId = '486139b1-5526-42bb-a1a7-302e3fd11d5a'
    let redirectUri = 'http://localhost:5173'

    let token: any

    const LOCAL_STORAGE_TOKEN_ENDPOINT = 'tokenEndpoint'
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

    const makeTokenRequest = async (code: string) => {
        const tokenEndpoint = localStorage.getItem(LOCAL_STORAGE_TOKEN_ENDPOINT)
        if (!tokenEndpoint) {
            throw new Error('Token endpoint not found in local storage')
        }

        //Make the tocken request
        const form = new FormData()
        form.set('grant_type', 'authorization_code')
        form.set('code', code)
        form.set('redirect_uri', redirectUri)
        form.set('client_id', clientId)   

        const tokenResponse = await axios.postForm(tokenEndpoint, form, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_ENDPOINT)
        return tokenResponse.data
    }
    
    onMount(async () => {
        const launchUrl = new URL(window.location.href)
        const issParam = launchUrl.searchParams.get('iss')
        const launchParam = launchUrl.searchParams.get('launch')

        if (!issParam || !launchParam) {
            throw new Error('Missing iss or launch parameter')
        }

        global_iss = issParam
        global_launch = launchParam

        

        // const code = launchUrl.searchParams.get('code')
        // const tokenJSON = localStorage.getItem(LOCALSTORAGE_TOKEN_JSON)
        // const issLocalStorage = localStorage.getItem(LOCALSTORAGE_ISS)

        // if (code) {
        //     console.log('Code:', code)
        //     token = await makeTokenRequest(code)
        //     return
        // }
        
        const iss = issParam
        const launch = launchParam

        const smartConfigurationResponse = await axios.get(`${iss}/.well-known/smart-configuration`)
        const smartConfiguration = smartConfigurationResponse.data
        // console.log({global_iss, global_launch, smartConfiguration})
        const authorizationEndpoint = smartConfiguration.authorization_endpoint as string
        const tokenEndpoint = smartConfiguration.token_endpoint as string

        global_authorizationEndpoint = authorizationEndpoint

        // Store tokenEndpoint in a store
        localStorage.setItem(LOCAL_STORAGE_TOKEN_ENDPOINT,tokenEndpoint)

        const redirectUrl = constructAuthUrl(authorizationEndpoint, launch, iss)

            
    });

</script>

<!-- {#if !token}
    Loading ....
{:else}
    <pre>{JSON.stringify(token, null, 2)}</pre>
{/if} -->

<pre>
    {JSON.stringify({global_iss, global_launch, global_authorizationEndpoint}, null, 2)}
</pre>