<template lang="">
  <canvas v-bind:id="id_name"></canvas>
</template>
<script>
import Chart from "chartjs-gauge";

export default {
  props: ["speedometerdata"],
  watch: {
    speedometerdata: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.id_name = val.name;
          setTimeout(() => {
            this.createSpeedometer(val);
          }, 200);
        });
      },
    },
  },
  data() {
    return {
      id_name: "",
      my_chart: null,
    };
  },
  methods: {
    async createSpeedometer(val) {
      const existingChart = this.my_chart;
      if (existingChart) existingChart.destroy();
      if (!this.id_name) return;

      var ctx = document.getElementById(this.id_name);
      this.my_chart = new Chart(ctx, {
        type: "gauge",
        data: {
          datasets: [
            {
              value: val.num,
              minValue: 0,
              data: [val.num, 100],
              backgroundColor: ["#00ccff", "#e6e6e6"],
            },
          ],
        },
        options: {
          // animation: false,
          cutoutPercentage: 70,
          needle: {
            radiusPercentage: 2,
            widthPercentage: 3.2,
            lengthPercentage: 80,
            color: "rgba(0, 0, 0, 0)",
          },
          valueLabel: {
            display: true,
            formatter: (value) => {
              return parseFloat(Number(val.num)).toFixed(2);
            },
            fontSize: "bold 65",
            color: "rgba(0,0,0, 1)",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderRadius: 5,
            padding: {
              top: 10,
              bottom: 10,
            },
            bottomMarginPercentage: 10,
          },
        },
      });
    },
    // createSpeedometer(val) {
    //   console.log("=============", this.id_name)
    //   const existingChart = this.test;
    //   if (existingChart) {
    //     existingChart.destroy();
    //   }
    //   var ctx = document.getElementById(this.id_name).getContext("2d");
    //   this.test = new Chart(ctx, {
    //     type: "gauge",
    //     data: {
    //       datasets: [
    //         {
    //           value: val.num,
    //           minValue: 0,
    //           data: [val.num, 100],
    //           backgroundColor: ["#00ccff","#e6e6e6"],
    //         },
    //       ],
    //     },
    //     options: {
    //       cutoutPercentage: 90,
    //       needle: {
    //         radiusPercentage: 2,
    //         widthPercentage: 3.2,
    //         lengthPercentage: 80,
    //         color: "rgba(0, 0, 0, 0)",
    //       },
    //       valueLabel: {
    //         // display: false
    //         display: true,
    //         formatter: (value) => {
    //           return val.num;
    //         },
    //         fontSize: 40,
    //         color: "rgba(0,0,0, 1)",
    //         backgroundColor: "rgba(0, 0, 0, 0)",
    //         borderRadius: 5,
    //         padding: {
    //           top: 10,
    //           bottom: 10,
    //         },
    //       },
    //     },
    //   });
    //   // console.log(this.test.destroy())
    // },
  },
  mounted() {
    // this.createSpeedometer(this.data)
  },
};
</script>
