import axios from "axios";
import moment from "moment-timezone";

const api = import.meta.env.VITE_API_ENDPOINT;
const api2 = import.meta.env.VITE_MODULE_API_ENDPOINT;
const etpbx_api = import.meta.env.VITE_ETPBX_API_ENDPOINT;
const pbx_token_endpoint = import.meta.env.VITE_PBX_TOKEN_API_ENDPOINT;
const token = import.meta.env.VITE_PBX_TOKEN;

import { useAppStore } from "@/store/app.js";

export default {
  data() {
    return {
      currentDate_test: moment().format("YYYY-MM-DD"),
      previousDate_test: moment().subtract(24, "hours").format("YYYY-MM-DD"),
      test_me: 0,
      // Last 24 hours
      last24HoursStart: moment().subtract(24, "hours").format("YYYY-MM-DD"),
      last24HoursEnd: moment().format("YYYY-MM-DD"),
      // Last 7 days
      last7DaysStart: moment()
        .subtract(7, "days")
        .startOf("day")
        .format("YYYY-MM-DD"),
      last7DaysEnd: moment().endOf("day").format("YYYY-MM-DD"),
      // Last 30 days
      last30DaysStart: moment()
        .subtract(30, "days")
        .startOf("day")
        .format("YYYY-MM-DD"),
      last30DaysEnd: moment().endOf("day").format("YYYY-MM-DD"),

      token: token,
      sentiment_color: ["#dc3545", "#0064ab", "#28a745"],
      color_picker: [
        "#0064ab",
        "#28a745",
        "#dc3545",
        "#fdc02f",
        "#73c0de",
        "#cc00cc",
        "#ff3300",

        "#0086e6",
        "#46d267",
        "#e46774",
        "#fed881",
        "#add9eb",
        "#ff1aff",
        "#ff704d",

        "#1a9fff",
        "#6fdc89",
        "#ec939c",
        "#fee8b3",
        "#c1e3f0",
        "#ff4dff",
        "#ff9980",

        "#0064ab",
        "#28a745",
        "#dc3545",
        "#fdc02f",
        "#73c0de",
        "#cc00cc",
        "#ff3300",

        "#0086e6",
        "#46d267",
        "#e46774",
        "#fed881",
        "#add9eb",
        "#ff1aff",
        "#ff704d",

        "#1a9fff",
        "#6fdc89",
        "#ec939c",
        "#fee8b3",
        "#c1e3f0",
        "#ff4dff",
        "#ff9980",
      ],
      // color_picker: [
      //   "#5470c6",
      //   "#91cc75",
      //   "#fac858",
      //   "#ee6666",
      //   "#73c0de",
      //   "#5470c6",
      //   "#91cc75",
      //   "#fac858",
      //   "#ee6666",
      //   "#73c0de",
      // ]
    };
  },
  methods: {
    upperCaseFirstLetter(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    async api_call({ url, method, data, params }) {
      try {
        const config = {
          url: api + url,
          method: method,
          data: data,
          params: params,
          headers: {
            "x-auth": 123123,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        return res;
      } catch (error) {
        console.log(error.message);
        return {
          result: "error",
          error: error.message,
        };
      }
    },
    async pbx_token_api_call({ url, method, data }) {
      try {
        const config = {
          url: pbx_token_endpoint + url,
          method: method,
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        return res;
      } catch (error) {
        console.log(error.message);
        return {
          result: "error",
          error: error.message,
        };
      }
    },
    async api_call_get(url, data) {
      console.log(api + url);
      try {
        let r = await axios.get(api + url, {
          params: data,
          headers: {
            "x-auth": 123123,
            "Content-Type": "application/json",
          },
        });
        return r;
      } catch (err) {
        console.log(err.message);
        return {
          result: "error",
          error: err.message,
        };
      }
    },
    async module_api_call({ url, method, data, headers }) {
      try {
        const config = {
          url: api2 + url,
          method: method,
          data: data,
          headers: headers,
        };

        const res = await axios.request(config);
        return res;
      } catch (error) {
        console.log(error.message);
        return {
          response: false,
          error: error.message,
        };
      }
    },
    async etpbx_api_call({ url, method, data }) {
      try {
        const config = {
          url: etpbx_api + url,
          method: method,
          data: data,
          headers: {
            AuthorizationCode: "e54b652c-7cca-4f68-9b37-0f531d1cf3b4",
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        return res;
      } catch (error) {
        console.log(error.message);
        return {
          result: "error",
          error: error.message,
        };
      }
    },
    notif(data) {
      this.$emit("showNotification", data);
    },
    loadscreen(data) {
      this.$emit("loadingScreen", data);
    },
    loadscreen2(data) {
      this.$emit("loadingScreen2", data);
    },
    formatDateString(date) {
      const originalDate = new Date(date);

      const formattedDate = `${(originalDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${originalDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${originalDate.getFullYear().toString().slice(-2)}`;

      return formattedDate;
    },
    getCurrentDate() {
      const currentDate = new Date();
      return {
        startDate: this.formatDate(currentDate.toISOString().split("T")[0]),
        endDate: this.formatDate(currentDate.toISOString().split("T")[0]),
      };
    },
    getCurrentWeekDates() {
      const currentDate = new Date();

      // Calculate 1 week ago from the current date
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 6);

      return {
        startDate: this.formatDate(oneWeekAgo.toISOString().split("T")[0]),
        endDate: this.formatDate(currentDate.toISOString().split("T")[0]),
      };
    },
    getCurrentMonthDates() {
      const today = new Date();
      const previousMonth = new Date(today);
      previousMonth.setMonth(today.getMonth() - 1);

      return {
        startDate: this.formatDate(previousMonth.toISOString().split("T")[0]),
        endDate: this.formatDate(today.toISOString().split("T")[0]),
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
    formatDate2(dateString) {
      // const options = {
      //   month: "long",
      //   day: "numeric",
      //   year: "numeric",
      //   hour: "numeric",
      //   minute: "numeric",
      //   hour12: true,
      // };
      // return new Date(dateString).toLocaleDateString("en-US", options);
      // Parse the date string and specify the time zone as UTC
      // const parsedDate = moment.utc(dateString);
      const parsedDate = moment(dateString);

      // Convert the parsed date to the local time zone
      // const localDate = parsedDate.local();

      // Format the local date
      const formattedDate = parsedDate.format("MMMM D, YYYY [at] h:mm A");

      return formattedDate;
    },
    parseDate(dateString) {
      // Example of parsing date string into sortable format
      return new Date(dateString);
    },
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
    },
    pad(value) {
      return value < 10 ? '0' + value : value;
    },
  },
};
