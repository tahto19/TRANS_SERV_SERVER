<template lang="">
  <v-card
    class="mx-auto px-3 pt-1 pb-1 bt-yellow"
    max-width="100%"
    elevation="4"
  >
    <v-card-title class="d-flex justify-space-between mb-2">
      Compliance Per Period
    </v-card-title>
    <v-card-text>
      <c-line :chart="comPerPeriod_chart_data" />
      <!-- <canvas style="max-height: 215px" id="periodB"></canvas> -->
    </v-card-text>
  </v-card>
</template>
<script>
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

export default {
  props: ["data"],
  watch: {
    data(val) {
      const _t = val.data.every(str => str.formattedCreatedAt.includes("T"));
      const test = val.data.slice().sort((a, b) => this.compareTimes(b.formattedCreatedAt, a.formattedCreatedAt));
      if (val.d_range || _t) {
        // this.canvasFunction2(val.data);
        this.canvasFunction2(test);
      } else {
        this.canvasFunction(val.data);
      }
    },
  },
  data() {
    return {
      period_chart: null,
      headers: [
        {
          title: "Intent name",
          key: "Intent_Name",
          align: "center",
        },

        { title: "Count", key: "count", align: "center" },
        { title: "Average", key: "average", align: "center" },
      ],
      comPerPeriod_chart_data: {},
    };
  },
  methods: {
    compareTimes(timeA, timeB) {
      // Custom comparator function to compare time strings in descending order
      return timeA.localeCompare(timeB);
    },
    canvasFunction(array) {
      let data = this.changeFormat(array);

      this.comPerPeriod_chart_data = {
        id_name: "periodB",
        labels: data.labels,
        datasets_data: data.datasets[0].data,
        styles: {
          "max-height": "215px",
        },
      };
    },
    canvasFunction2(array) {
      let data = this.changeFormat(array);

      this.comPerPeriod_chart_data = {
        id_name: "periodB",
        labels: data.labels,
        datasets_data: data.datasets[0].data,
        styles: {
          "max-height": "215px",
        },
        options: {
          scales: {
            x: {
              type: "timeseries",
            },
          },
        },
      };
    },
    changeFormat(array) {
      console.log(array)
      let data = {
        labels: [],
        datasets: [
          {
            label: "Total",
            backgroundColor: "rgba(0, 100, 171, 255)",
            data: [],
          },
        ],
      };

      const color_picker = [
        "rgba(210,0,18,255)",
        "rgba(0,100,171,255)",
        "rgba(20,116,16,255)",
        "rgba(253,188,35,255)",
        "rgba(63,81,181,255)",
        "rgba(0,100,171,255)",
        "rgba(255,235,59,255)",
        "rgba(255,235,59,255)",
      ];
      // array.forEach((v, i) => {
      //   let findFormatedDate = data.labels.find(
      //     (x) => x === v.formattedCreatedAt
      //   );
      //   if (findFormatedDate === undefined) {
      //     data.labels.push(v.formattedCreatedAt);
      //     data.datasets[0].data.push(v.score / v.count);
      //   } else {
      //     let index = data.labels.findIndex((x) => x === v.formattedCreatedAt);
      //     let getAverage =
      //       (data.datasets[0].data[index] + v.score / v.count) / 2;
      //     data.datasets[0].data[index] = getAverage;
      //   }
      // });


      let temp_data = { labels: [], count: [] }
      array.forEach((v, i) => {
        if (v.formattedCreatedAt.includes("/")) {
          const findFormatedDate = data.labels.find(
            (x) => x === v.formattedCreatedAt
          );
          if (findFormatedDate === undefined) {
            data.labels.push(v.formattedCreatedAt);
            data.datasets[0].data.push(v.score / v.count);
          } else {
            let index = data.labels.findIndex((x) => x === v.formattedCreatedAt);
            let getAverage =
              (data.datasets[0].data[index] + v.score / v.count) / 2;
            data.datasets[0].data[index] = getAverage;
          }
        } else {
          const findFormatedDate = data.labels.find(
            (x) => x === this.format_timeseries(v.formattedCreatedAt)
          );

          if (findFormatedDate === undefined) {
            data.labels.push(this.format_timeseries(v.formattedCreatedAt));
            data.datasets[0].data.push(v.score / v.count);


            temp_data.labels.push(this.format_timeseries(v.formattedCreatedAt))
            temp_data.count.push(1)
          } else {
            let index = data.labels.findIndex((x) => x === this.format_timeseries(v.formattedCreatedAt));
            let getAverage =
              (data.datasets[0].data[index] += (v.score / v.count));
            data.datasets[0].data[index] = getAverage;

            temp_data.labels = temp_data.labels.map((x, i) => {
              if (x == this.format_timeseries(v.formattedCreatedAt)) {
                temp_data.count[i] += 1
              }
              return x;
            })
          }
        }
      });

      if(temp_data.count.length > 0){
        data.datasets = data.datasets.map(x => {
          x.data = x.data.map((z, i) => {
            z = Number(parseFloat(z / temp_data.count[i]).toFixed(2))
            return z
          })
          return x
        })
      }

      return data;
    },
    format_timeseries(date) {
      const split_date = date.split(':');
      const split2 = split_date[2].split(".")

      return split_date[0] + ":00:00." + split2[1]
    }
  },
};
</script>
<style lang=""></style>
