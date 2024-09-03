<script lang="ts">
  import PractitionerLaunch from "./lib/PractitionerLaunch.svelte";
  import { Router, Route } from "svelte-routing";
  import Vitals from "./lib/Vitals.svelte";
</script>

<div
  class="bg-base-layer min-h-screen w-screen flex items-center justify-center p-5"
>
  <div
    class="w-full min-h-screen max-w-screen-xl bg-main-bg shadow-lg rounded-lg overflow-hidden"
  >
    <main class="p-5">
      <PractitionerLaunch></PractitionerLaunch>
      <Router>
        <Route
          path="/patient/vitals"
          component={Vitals}
        />
      </Router>
    </main>
  </div>
</div>
