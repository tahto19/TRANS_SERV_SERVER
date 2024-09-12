<template lang="">
  <v-card class="mx-auto px-3 pt-1 pb-1 bt-blue" max-width="100%" elevation="4">
    <v-card-title class="d-flex justify-space-between mb-2"
      >Compliance Per Intent</v-card-title
    >
    <v-card-text>
      <!-- <v-data-table-virtual :headers="headers" :items="data"  density="compact"  height="200"> 
        <template v-slot:item.average="{ item }">
          <v-tooltip :text="item.score / item.count">
            <template v-slot:activator="{ props }"
              ><v-progress-linear
                :model-value="item.score / item.count"
                color="rgba(0,100,171,255)"
                height="25"
                v-bind="props"
              ></v-progress-linear></template
          ></v-tooltip>
        </template>
      </v-data-table-virtual> -->
      <c-horizontal-bar :chart="compliance_chart_data" />
    </v-card-text>
  </v-card>
</template>
<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
export default {
  props: ["data"],
  watch: {
    data(val) {
      this.dataItems = val;

      this.intentByPeriod(val);
    },
  },
  data() {
    return {
      dataItems: [],
      headers: [
        {
          title: "Intent name",
          key: "Intent_Name",
          align: "center",
        },

        { title: "Count", key: "count", align: "center" },
        { title: "Average", key: "average", align: "center" },
      ],
      period_chart: null,
      compliance_chart_data: {}
    };
  },
  methods: {
    intentByPeriod(array) {
      this.compliance_chart_data = {
        id_name: "period",
        labels: array.map((row) => `${row.Intent_Name}`),
        datasets_data: array.map((row) =>
          parseFloat(row.score / row.count).toFixed(2)
        ),
        styles: {
          "max-height": "250px",
          "height": "250px"
        },
        callbacks: {
          label: function (tooltipItem) {
            let getCount = array.find(
              (x) => x.Intent_Name === tooltipItem.label
            );
            return (
              getCount.count + " Count" + `${getCount.count > 1 ? "s" : ""}`
            );
          },
        },
      };
    },
  },
};
</script>
<style lang=""></style>
