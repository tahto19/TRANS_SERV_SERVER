<template lang="">
  <canvas
    :style="chart.styles ? chart.styles : null"
    v-bind:id="chart.id_name"
  ></canvas>
</template>
<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default {
  props: ["chart"],
  watch: {
    chart: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.chartLine(val);
        });
      },
    },
  },
  data() {
    return {
      id_name: "",
      styles: null,
    };
  },
  methods: {
    chartLine(val) {
      let _x;
      const existingChart = Chart.getChart(val.id_name);
      if (existingChart) existingChart.destroy();
      if (!val.id_name) return;

      if (val.options) {
        _x = {
          grid: {
            drawOnChartArea: false,
          },
          type: val.options.scales.x.type,
        };
      } else {
        _x = {
          grid: {
            drawOnChartArea: false,
          },
        };
      }
      // val.datasets_data = val.datasets_data.map(x => {x = Number(x).toFixed(2); return x;})
      new Chart(document.getElementById(val.id_name), {
        type: "line",
        data: {
          labels: val.labels,
          fill: false,
          datasets: [
            {
              data: val.datasets_data.map(x => {x = Number(x).toFixed(2); return x;}),
              borderColor: "#dc3545",
              backgroundColor: "#dc3545",
              datalabels: {
                anchor: "end",
                align: "end",
                offset: 1,
              },
            },
          ],
        },
        // plugins: [ChartDataLabels],
        options: {
          responsive: true,
          scales: {
            x: _x,
            y: {
              grid: {
                drawOnChartArea: false,
              },
              max: 100,
              min: 1,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.chartLine(this.chart);
    });
  },
};
</script>
<style lang=""></style>
