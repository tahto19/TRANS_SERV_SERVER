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
      // chart(val) {
      //     this.id_name = val.id_name
      //     this.styles = val.styles
      //     setTimeout( ()=>{this.chartHorizontalBar(val)}, 200);
      // },
  
      chart: {
        deep: true,
        handler(val) {
          this.$nextTick(() => {
            this.chartHorizontalBarStack(val);
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
        chartHorizontalBarStack(val) {
        const existingChart = Chart.getChart(val.id_name);
        if (existingChart) existingChart.destroy();
        if (!val.id_name) return;
  
        new Chart(document.getElementById(val.id_name), {
        type: "bar",
        data: val.data,
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          indexAxis: "y",
          scales: {
            x: {
              stacked: true,
              grid: {
                drawOnChartArea: false,
              },
              display: false,
            },
            y: {
              stacked: true,
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            datalabels: {
              display: false,
            },
          },
        },
      });
    }
    },
    mounted() {
      this.$nextTick(() => {
        this.chartHorizontalBarStack(this.chart);
      });
    },
  };
  </script>
  <style lang=""></style>
  