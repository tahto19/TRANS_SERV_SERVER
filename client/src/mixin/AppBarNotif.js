import axios from "axios";

export default {
  data() {
    return {
      items: [],
      limit: 7,
      count: null,
    };
  },
  methods: {
    async getNotification(res) {
        this.items = res.data.data;
        this.items.map((x) => {
          if (x.complianceScore != null) {
            x.custom_message =
              x.complianceScore >= 90
                ? "agent with high Compliance score"
                : x.complianceScore <= 70
                ? "agent with low Compliance score"
                : "";
          } else {
            x.custom_message =
              x.csatScore >= 90
                ? "agent with high CSAT score"
                : x.csatScore <= 70
                ? "agent with low CSAT score"
                : "";
          }

          return x;
        });
    },
  },
  created() {},
};
