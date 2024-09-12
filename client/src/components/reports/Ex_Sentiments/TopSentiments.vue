<template lang="">
  <v-card class="mx-auto px-3 pt-1 pb-1 bt-blue" min-width="100%" elevation="4">
    <v-card-title class="d-flex justify-space-between mb-2">
      Top Sentiments
    </v-card-title>
    <v-card-text>
      <c-horizontal-bar :chart="sentiments_chart_data" />
    </v-card-text>
  </v-card>
</template>
<script>

export default {
  props: ["data"],
  watch: {
    data(val) {
      this.intentGraph();
    },
  },
  data() {
    return {
      intent_chart: null,
      sentiments_chart_data: {},
    };
  },
  methods: {
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    async intentGraph() {
      const getOnlysentiment_name = [];
      this.data.data.forEach((v) => {
        let find = getOnlysentiment_name.findIndex(
          (vv) => this.capitalizeFirstLetter(v.sentiment_name) === vv.sentiment_name
        );
        if (find === -1) {
          getOnlysentiment_name.push({
            count: v.count,
            sentiment_name: this.capitalizeFirstLetter(v.sentiment_name),
          });
        } else {
          getOnlysentiment_name[find].count += v.count;
        }
      });

      const highestScore_intent = getOnlysentiment_name.reduce(
        (maxScore, currentItem) => {
          return currentItem.count > maxScore ? currentItem.count : maxScore;
        },
        0
      );

      this.sentiments_chart_data = {
        id_name: "top-intents",
        labels: getOnlysentiment_name.map((row) => row.sentiment_name),
        datasets_data: getOnlysentiment_name.map((row) => row.count),
        max: highestScore_intent * 1.5,
        backgroundColor: this.sentiment_color,
      };
    },
  },
};
</script>
<style lang=""></style>
