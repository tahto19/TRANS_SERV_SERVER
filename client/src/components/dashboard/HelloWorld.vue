<template>
  <!-- <iframe v-if="pbx_data.accountcode"
    :src="'https://insightsdev.etpbx.com/api/widget/queue_metrics/40fead5a5856c3e6f0dc59d0030aba10/' + pbx_data.accountcode"
    frameborder="0"></iframe> -->
    <iframe
    :src="'https://insightsdev.etpbx.com/api/widget/queue_metrics/40fead5a5856c3e6f0dc59d0030aba10/' + account_code"
    frameborder="0"></iframe>
</template>

<script>
//
import AccessCode from '@/mixin/AccessCode'
import { useAppStore } from "@/store/app.js";
import Cookies from "js-cookie";

export default {
  emits: ['showNotification', 'loadingScreen'],
  mixins: [AccessCode],
  data() {
    return {
      account_code: null,
      pbx_data: {
        accountcode: null,
      },
    }
  },
  methods: {
    async getPbx() {
      if (!this.userData) return
      const config = {
        url: "/api/config/edit_token/" + this.token + "/" + this.userData.organization_id,
        method: "POST"
      }
      const res = await this.pbx_token_api_call(config)
      if (res.data != "No result") {
        this.pbx_data = res.data
        console.log(this.pbx_data)
      }
      this.loadscreen(false);
    },
    async checkUserdata() {
      await this.getPbx()
      this.loadscreen(false);

    },
  },
  watch: {
    async userData(val) {
      this.checkUserdata()
    },
  },
  computed: {
    userData() {
      return useAppStore().userData
    }
  },
  created() {
    const _a_code = Cookies.get("_a_code");

    if (_a_code) {
      this.account_code = _a_code
    }
  },
  async mounted() {
    this.loadscreen(true);
    this.checkUserdata()
  },
  beforeRouteEnter(to, from, next) {
    const access_code_default = {
        gs: "SM-LDtf5NX",
        wb: "SM-v9zZSBK",
        ac: "SM-RrwFKy7",
        rpts: "SM-fGrTV1I",
        children: {
          gs: {
            analysis: {
              code: "TM-or04VPh",
            },
            notification: {
              code: "TM-UdsJgs9",
            },
            wb_config: {
              code: "TM-UhIkUWp",
            },
            team: {
              code: "TM-uPFQvOY",
              children: {
                agent: {
                    code: "QUAM-GtWpXpz",
                },
                group: {
                    code: "QUAM-SheahQY",
                },
              },
            },
            account: {
              code: "TM-YjUaucI",
            },
            access: {
                code: "TM-ytl8y2Y",
              },
          },
        },
      }
    const accesscodeChecker = (code) => {
        const getAccessCode = Cookies.get("_aksis_code")
        const access_code = getAccessCode ? JSON.parse(Cookies.get("_aksis_code")) : [];
        const checker = access_code.filter((x) => x == code);
        return checker && checker.length > 0 ? true : false;
    }
    if (accesscodeChecker(access_code_default.wb)) {
      next();
    } else {
      next("/error_page");
    }
  },
}
</script>
<style>
iframe {
  position: absolute;
  top: 65px;
  left: 57px;
  height: 91%;
  width: 97.4%;
}
</style>
