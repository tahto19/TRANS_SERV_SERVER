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
          this.chartHorizontalBar(val);
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
    chartHorizontalBar(val) {
      console.log(val)
      const existingChart = Chart.getChart(val.id_name);
      if (existingChart) existingChart.destroy();
      if (!val.id_name) return;

      const _format = val.datasets_data.map(x => Number(x).toFixed(2));
      const _labels = val.labels.filter((x,i) => _format[i] != 0)
      const _background = val.backgroundColor ? val.backgroundColor : this.color_picker

      new Chart(document.getElementById(val.id_name), {
        type: "bar",
        data: {
          labels: _labels,
          datasets: [
            {
              data: _format.filter( x => x != 0),
              backgroundColor: _background,
              datalabels: {
                anchor: "end",
                align: "end",
                offset: 1,
              },
            },
          ],
        },
        plugins: [ChartDataLabels],
        options: {
          responsive: true,
          indexAxis: "y",
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
              },
              max: val.max ? val.max : null,
            },
            y: {
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              position: "bottom",
              display: true,
            },
            // tooltip: {
            //   callbacks: val.callbacks ? val.callbacks : null,
            // },
          },
        },
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.chartHorizontalBar(this.chart);
    });
  },
};
</script>
<style lang=""></style>
