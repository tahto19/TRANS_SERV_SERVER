<template lang="">
  <canvas
    :style="chart.styles ? chart.styles : null"
    v-bind:id="chart.id_name"
  ></canvas>
</template>
<script>
import Chart from "chart.js/auto";

export default {
  props: ["chart"],
  watch: {
    chart: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.chartBarStack(val);
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
    chartBarStack(val) {
      let _x;
      const existingChart = Chart.getChart(val.id_name);
      if (existingChart) existingChart.destroy();
      if (!val.id_name) return;

      if (val.options) {
        _x = {
          stacked: true,
          grid: {
            drawOnChartArea: false,
          },
          type: val.options.scales.x.type,
        };
      } else {
        _x = {
          stacked: true,
          grid: {
            drawOnChartArea: false,
          },
        };
      }
      new Chart(document.getElementById(val.id_name), {
        type: "bar",
        data: val.data,
        options: {
          responsive: true,
          scales: {
            x: _x,
            y: {
              stacked: true,
              display: false,
            },
          },
          plugins: {
            legend: {
              position: "left", // Move legend to the left side
            },
            title: {
              position: "bottom",
              display: true,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.chartBarStack(this.chart);
    });
  },
};
</script>
<style lang=""></style>
