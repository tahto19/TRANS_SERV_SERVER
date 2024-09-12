<template lang="">
  <!-- <v-chip
    :to="{ name: 'reports_default', params: { id: this.$route.params.id } }"
    variant="text"
    class="mb-3 px-0"
  > -->
  <v-chip
    :to="{ name: 'reports_default', params: { id: 'total' } }"
    variant="text"
    class="mb-3 px-0"
  >
    <v-icon color="rgb(0, 116, 228)" start icon="mdi-chevron-left"></v-icon>
    <p style="color: rgb(0, 116, 228)">Back to call analysis</p>
  </v-chip>
  <h1 class="top-header">Sentiments</h1>
  <MainContainer @loadingScreen="loadingScreen" />
</template>
<script>
import MainContainer from "./Ex_Sentiments/MainContainer";
export default {
  emits: ["showNotification", "loadingScreen", "loadingScreen2"],

  components: { MainContainer },
  data() {
    return {
      load: false,
      load2: false
    };
  },
  methods: {
    loadingScreen(e) {
      this.load = e;
      this.loadscreen(this.load);
    },
    loadingScreen2(e) {
      this.load2 = e
    }
  },
};
</script>
<style lang=""></style>
