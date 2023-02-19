<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, provide } from "vue";
import getStore from "./store";
export default {
  name: "App",
  setup() {
    provide("store", getStore());
    return {};
  },
};
</script>
