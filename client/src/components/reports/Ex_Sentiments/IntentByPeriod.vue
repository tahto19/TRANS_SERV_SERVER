<template lang="">
  <v-card class="mx-auto px-3 pt-1 pb-1 bt-blue" min-width="100%" elevation="4">
    <v-card-title class="d-flex justify-space-between mb-2">
      Sentiment by Period
    </v-card-title>
    <v-card-text>
      <c-bar-stack :chart="sentiPerPeriod_chart_data" />
      <!-- <canvas style="max-height: 215px" id="period"></canvas> -->
    </v-card-text>
  </v-card>
</template>
<script>
import Chart from "chart.js/auto";

// import ChartDataLabels from "chartjs-plugin-datalabels";
export default {
  props: ["data"],
  watch: {
    data(val) {
      const _t = val.data.every(str => str.formattedCreatedAt.includes("T"));
      console.log(_t)
      if (val.d_range || _t) {
        this.intentByPeriod2();
      } else {
        this.intentByPeriod();
      }
    },
  },
  data() {
    return { period_chart: null, sentiPerPeriod_chart_data: {} };
  },
  methods: {
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    async intentByPeriod() {
      this.sentiPerPeriod_chart_data = {
        id_name: "period",
        data: this.periodDatasetEdit(this.data.data),
        styles: {
          "max-height": "215px",
        },
      };
    },
    async intentByPeriod2() {
      this.sentiPerPeriod_chart_data = {
        id_name: "period",
        data: this.periodDatasetEdit(this.data.data),
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
    formatDate(inputDate) {
      const dateParts = inputDate.split("-");
      const formattedDate = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2]
      );
      return formattedDate.toLocaleDateString("en-US");
    },
    periodDatasetEdit(data_array) {
      let data = { labels: [], datasets: [] };
      let increment = 0

      // =============== original code (Do not delete) ================
      // data_array.forEach((v, i) => {
      //   let findFormatedDate = data.labels.find(
      //     (x) => x === v.formattedCreatedAt
      //   );

      //   let findlabel = data.datasets.findIndex(
      //     (x) => x.label === this.capitalizeFirstLetter(v.sentiment_name)
      //   );

      //   if (findFormatedDate == undefined) {
      //     data.labels.push(v.formattedCreatedAt);
      //   }

      //   if (findlabel == -1) {
      //     data.datasets.push({
      //       label: this.capitalizeFirstLetter(v.sentiment_name),
      //       backgroundColor: this.sentiment_color[increment],
      //       data: [],
      //     });
      //     increment++
      //   }

      //   data.datasets.map((x) => {
      //     if (
      //       this.capitalizeFirstLetter(v.sentiment_name) ==
      //       x.label
      //     ) {
      //       x.data.push(v.count);
      //     } else {
      //       x.data.push(null);
      //     }
      //   });
      // });


      data_array.forEach((v, i) => {
        let findFormatedDate = data.labels.find(
          (x) => {
            if (v.formattedCreatedAt.includes("/")) {
              return x === v.formattedCreatedAt;
            } else {
              return x === this.format_timeseries(v.formattedCreatedAt);
            }
          }
        );

        let findlabel = data.datasets.findIndex(
          (x) => x.label === this.capitalizeFirstLetter(v.sentiment_name)
        );

        if (findFormatedDate == undefined) {
          if (v.formattedCreatedAt.includes("/")) {
            data.labels.push(v.formattedCreatedAt);
          } else {
            data.labels.push(this.format_timeseries(v.formattedCreatedAt));
          }
        }

        if (findlabel == -1) {
          data.datasets.push({
            label: this.capitalizeFirstLetter(v.sentiment_name),
            backgroundColor: this.sentiment_color[increment],
            data: [],
          });
          increment++
        }
      });

      data.datasets.map((z, q) => {
        let new_data = []
        let total_per_sentiment = 0
        data.labels.map((x, m) => {

          new_data.push(null)
          data_array.forEach((v, i) => {
            if (v.formattedCreatedAt.includes("/")) {
              if (v.formattedCreatedAt == x) {
                if (z.label == this.capitalizeFirstLetter(v.sentiment_name)) {
                  new_data[m] += Number(v.count)
                  total_per_sentiment += Number(v.count)
                }
              }
            } else {
              const format = this.format_timeseries(v.formattedCreatedAt)
              // console.log(format == x)
              if (format == x) {
                if (z.label == this.capitalizeFirstLetter(v.sentiment_name)) {
                  new_data[m] += Number(v.count)
                  total_per_sentiment += Number(v.count)
                }
              }
            }
          })
          return x
        })
        z.data = new_data
        z.total_per_sentiment = total_per_sentiment
        return z
      })

      console.log(data)
      return data;
    },
    periodDatasetEdit2(data_array) {
      let data = { labels: [], datasets: [] };

      data_array.forEach((v, i) => {
        let findFormatedDate = data.labels.find(
          (x) => x === v.formattedCreatedAt
        );
        if (findFormatedDate === undefined)
          data.labels.push(v.formattedCreatedAt);

        let findlabel = data.datasets.findIndex(
          (x) => x.label === this.capitalizeFirstLetter(v.sentiment_name)
        );

        if (findlabel === -1) {
          console.log(v.sentiment_name);
          data.datasets.push({
            label: this.capitalizeFirstLetter(v.sentiment_name),
            backgroundColor: this.color_picker[i],
            data: [],
          });
        } else {
          data.datasets[findlabel].data.push(v.count);
        }
      });

      data_array.forEach((v, i) => {
        data.datasets.map((x) => {
          if (
            this.capitalizeFirstLetter(v.sentiment_name) ==
            this.capitalizeFirstLetter(x.label)
          ) {
            x.data.push(v.count);
          } else {
            x.data.push(null);
          }
        });
      });

      return data;
    },
    format_timeseries(date) {
      const split_date = date.split(':');
      const split2 = split_date[2].split(".")

      return split_date[0] + ":00:00." + split2[1]
    }
  },
  mounted() {},
};
</script>
<style lang=""></style>
