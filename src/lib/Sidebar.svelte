<script lang="ts">
  import { navigate } from "svelte-routing";
  import logo from "../assets/logo.png";
  import hypertension from "../assets/icons/hypertension.svg";
  import hypertension_active from "../assets/icons/hypertension_active.svg";
  let currentLocation = window.location.pathname;
  function isActive(path) {
    return currentLocation.startsWith(path);
  }
  export let accessToken: string;
  export let baseUrl: string;
  export let patientId: string;
  function goToVitals() {
    // Store the necessary parameters in local storage
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("patientId", patientId);

    // Navigate to the Vitals route
    window.location.href = "/patient/vitals";
  }
</script>

<aside class="bg-sidebar-bg w-full h-full p-4 text-gray-700 rounded-l-xl">
  <nav>
    <ul>
      <li class="my-4">
        <a
          href="/patientList"
          class="flex items-center"
        >
          <img
            src={logo}
            alt="FHIR"
            height="175"
          />
        </a>
      </li>

      <div class="my-6">
        <ul class="my-2">
          <!-- <li class="mb-4 ml-2">
            <a
              href={`/patient/vitals`}
              class="flex items-center {isActive(`/patient/vitals`)
                ? 'active-link'
                : ''}"
            >
              <img
                src={isActive(`/patient/vitals`)
                  ? hypertension_active
                  : hypertension}
                alt="Vitals"
                class="w-6 h-6"
              />
              <span class="ml-2">Vitals</span>
            </a>
          </li> -->

          <li class="mb-4 ml-2">
            <button
              on:click={goToVitals}
              class="flex items-center"
            >
              <img
                src={isActive(`/patient/vitals`)
                  ? hypertension_active
                  : hypertension}
                alt="Vitals"
                class="w-6 h-6"
              />
              <span class="ml-2">Vitals</span>
            </button>
          </li>
        </ul>
      </div>
    </ul>
  </nav>
</aside>

<style>
  .config-link:hover {
    color: #ee4d38;
    cursor: pointer;
    position: absolute;
    bottom: 30px;
  }
  .active-link {
    color: #ee4d38;
    position: relative;
  }
  .active-link::before {
    content: "";
    position: absolute;
    left: -10px;
    width: 4px;
    height: 100%;
    background-color: #ee4d38;
  }

  .config-link {
    position: absolute;
    bottom: 30px;
  }
</style>
