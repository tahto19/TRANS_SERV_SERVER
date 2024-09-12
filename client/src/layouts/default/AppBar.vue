<template>
  <v-app-bar color="white" prominent>
    <v-toolbar-title><v-img :width="135" aspect-ratio="16/9" cover
        src="@/assets/img/elisha-insights-logo.png"></v-img></v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn class="mr-2" variant="text" color="#A0A4A8" v-bind="props" icon>
          <v-badge v-if="items.length != 0" :content="count" color="error">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell</v-icon>
        </v-btn>
      </template>
      <v-list class="py-0" min-width="350" max-height="700">
        <v-list-item class="">
          <v-list-item-title class="d-flex align-center justify-space-between">
            <span class=" font-weight-medium">Notification</span>
            <v-btn variant="text" color="primary" class="text-body-2 pa-0 font-weight-regular" @click="seenAll">
              Mark all as seen
            </v-btn>
            <!-- <span @click="" class="cursor-pointer">Mark all as seen</span> -->
          </v-list-item-title>
          <!-- <template v-slot:append>
            <v-menu v-model="sub_menu">
              <template v-slot:activator="{ props }">
                <v-btn @click="sub_menu = !sub_menu" v-bind="props" variant="text" class="text-caption" icon="mdi-cog"></v-btn>
              </template>
              <v-list min-width="200" max-height="700">
                <v-list-item @click.stop @click="sub_menu = !sub_menu">See All</v-list-item>
              </v-list>
            </v-menu>

          </template> -->
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="seen_all_progress" class="text-center">
          <v-progress-circular indeterminate :size="20" class="mr-3"></v-progress-circular>
        </v-list-item>
        <v-list-item v-if="items.length > 0 && !seen_all_progress" class="py-2" v-for="(item, index) in items"
          :key="index" :value="index" @click="notif_redirect(item.Transcript.id)">
          <v-row>
            <v-col cols="1">
              <v-icon>mdi-face-agent</v-icon>
            </v-col>
            <v-col cols="9" class="d-flex justify-center flex-column pl-4">
              <span class="font-weight-medium">{{
      item.Transcript.Agent.fullname + " (" + item.Transcript.Agent.user_id + ")"
    }}</span>
              <span class="font-weight-light text-subtitle-2">{{
        item.custom_message
      }}</span>
            </v-col>
            <v-col cols="2" class="d-flex justify-end align-center">
              <span class="dot"></span>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item v-if="items.length <= 0" class="text-center">
          No notification
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="count > items.length" @click="limit += 5" color="red" class="text-center text-primary">
          <v-progress-circular v-if="see_more" indeterminate :size="20" class="mr-3"></v-progress-circular>See More
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn variant="text" color="#A0A4A8" icon @click="logOut">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer :width="300" @mouseover="mouseOver" @mouseleave="mouseLeave" expand-on-hover rail permanent
    color="primary" class="my_nav">
    <v-list class="mt-2" density="compact" nav>
      <br />
      <v-list-group value="Admin" v-if="checkAccess('SM-LDtf5NX')">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cog-outline" title="General Setup"></v-list-item>
        </template>

        <template v-for="[icon, title, link, code] in general_setups">
          <v-list-item :class="!drawerModel ? 'indent-padding' : ''" v-if="checkAccess(code)" :title="title"
            :prepend-icon="icon" :value="title" @click="redirectTo(link, code)"></v-list-item>
        </template>


        <v-list-group v-if="checkAccess('TM-uPFQvOY')" value="Teams">
          <template v-slot:activator="{ props }">
            <v-list-item :class="!drawerModel ? 'indent-padding' : ''" v-bind="props"
              prepend-icon="mdi-account-cog-outline" title="Team"></v-list-item>
          </template>

          <template v-for="[icon, title, link, code] in links_group">
            <v-list-item v-if="checkAccess(code)" :class="!drawerModel ? 'indent-padding' : ''" :title="title"
              :prepend-icon="icon" :value="title" @click="redirectTo(link, code)"></v-list-item>
          </template>
        </v-list-group>
        <template v-for="[icon, title, link, code] in account">
          <v-list-item :class="!drawerModel ? 'indent-padding' : ''" v-if="checkAccess(code)" :title="title"
            :prepend-icon="icon" :value="title" @click="redirectTo(link, code)"></v-list-item>
        </template>

      </v-list-group>

      <template v-for="[icon, title, link, code] in links">
        <v-list-item v-if="checkAccess(code)" :title="title" :prepend-icon="icon" @click="redirectTo(link, code)"
          :value="link"></v-list-item>
      </template>






      <v-list-group v-if="checkAccess('SM-fGrTV1I')" value="Views">
        <template v-slot:activator="{ props }">
          <v-list-item :class="!drawerModel ? 'indent-padding' : ''" v-bind="props"
            prepend-icon="mdi-file-document-multiple-outline" title="Reports"></v-list-item>
        </template>

        <v-list-item v-if="checkAccess('')" :class="!drawerModel ? 'indent-padding' : ''" title="Call Analysis"
          prepend-icon="mdi-chart-bar" value="Call Analysis" @click="redirectTo('reports/total', '')"></v-list-item>

        <v-list-item v-if="checkAccess('')" :class="!drawerModel ? 'indent-padding' : ''" title="Call Ratings"
          prepend-icon="mdi-speedometer" value="Call Ratings"
          @click="redirectTo('reports/call_ratings/total', '')"></v-list-item>

        <v-list-item v-if="checkAccess('')" :class="!drawerModel ? 'indent-padding' : ''" title="Compliance"
          prepend-icon="mdi-speedometer" value="Compliance"
          @click="redirectTo('reports/compliance/total', '')"></v-list-item>

        <v-list-item v-if="checkAccess('')" :class="!drawerModel ? 'indent-padding' : ''" title="Intents"
          prepend-icon="mdi-equalizer" value="Intents" @click="redirectTo('reports/intents/total', '')"></v-list-item>

        <v-list-item v-if="checkAccess('')" :class="!drawerModel ? 'indent-padding' : ''" title="Sentiments"
          prepend-icon="mdi-equalizer" value="Sentiments"
          @click="redirectTo('reports/sentiments/total', '')"></v-list-item>

      </v-list-group>




      <!-- <v-list-item title="Reports" v-if="checkAccess('SM-fGrTV1I')" prepend-icon="mdi-file-document-multiple-outline"
        @click="_redirect" value="reports"></v-list-item> -->
    </v-list>
  </v-navigation-drawer>
  <div include-html="https://eacomm.com/chaital/embedded-chatbot?key=i26NtevTw7YAZzWFxMI1cmDE8sqP0XVR" id="chatbot">
  </div>
</template>

<script>
import { useAppStore } from "@/store/app.js";
import Cookies from "js-cookie";
import AccessCode from '@/mixin/AccessCode'
import AppBarNotif from '@/mixin/AppBarNotif'
import { loadExternalScript, inputEmail } from "@/assets/chatbot_js/script.js";

export default {
  mixins: [AccessCode, AppBarNotif],
  data() {
    return {
      seen_all_progress: false,
      see_more: false,
      sub_menu: false,
      drawerModel: null,
      dialog: false,
      group_id: null,
      groups: [],
      org_id: null,
      unseen_num: 0,
      links: [
        ["mdi-view-dashboard-outline", "Wallboard", "", "SM-v9zZSBK"],
        // ["mdi-account-outline", "Account", "account", "SM-RrwFKy7"],
      ],
      links2: [
        ["mdi-bell", "Notification", ""],
        ["mdi-logout", "Logout", ""],
      ],
      intent_analysis_link: [
        [
          "mdi-application-cog-outline",
          "Intent Analysis Setup",
          "gs/analytics",
        ],
      ],
      general_setups: [
        [
          "mdi-application-outline",
          "Analysis",
          "gs/analytics",
          "TM-or04VPh"
        ],
        [
          "mdi-bell-outline",
          "Notification",
          "gs/notification",
          "TM-UdsJgs9"
        ],
        // [
        //   "mdi-list-box-outline",
        //   "Summary",
        //   "gs/summary",
        //   "TM-hxCBvu8"
        // ],
        ["mdi-view-dashboard-outline", "Wallboard Config", "gs/pbx", "TM-UhIkUWp"],
      ],
      view_reports: [
        ["mdi-chart-bar", "Call Analysis", "gs/agents", ""],
        ["mdi-speedometer", "Average CSAT", "gs/groups", ""],
        ["mdi-speedometer", "Average Compliance", "gs/agents", ""],
        ["mdi-chart-scatter-plot-hexbin", "Intents", "gs/groups", ""],
        ["mdi-chart-scatter-plot", "Sentiments", "gs/groups", ""],
      ],
      links_group: [
        ["mdi-account-multiple-outline", "Agents", "gs/agents", "QUAM-GtWpXpz"],
        ["mdi-account-group-outline", "Groups", "gs/groups", "QUAM-SheahQY"],
      ],
      account: [
        ["mdi-account-outline", "Account", "gs/account", "TM-YjUaucI"],
        ["mdi-shield-account-variant-outline", "Access Control", "gs/access_control", "TM-ytl8y2Y"],
      ],
      view_link_group: [
        ["mdi-layers-outline", "Intents", "gs/analytics"],
        ["mdi-hexagon-multiple-outline", "Sentiments", "gs/groups"],
        ["mdi-tag-faces", "CSAT", "gs/agents"],
        ["mdi-clipboard-text-outline", "Compliance", "gs/agents"],
      ],
    };
  },
  watch: {
    drawerModel(val) {
      // console.log(val)
    },
    items(val) {
      // console.log("updated", val.length)
    },
    limit(val) {
      if (!this.seen_all_progress) {
        this.see_more = true
        this.notification_lists(val)
      }
    }
  },
  created() {
    const userData = useAppStore().groupdID;
    const id = Number(this.$route.params.id);
    if (!userData) {
      useAppStore().updateGroupID(id ? id : null);
      // this.group_id = this.$router.params.id;
    }
  },
  methods: {
    checkAccess(code) {
      if (code == "") {
        return true
      }
      const checker = this.access_code.filter(x => x == code)
      return checker && checker.length > 0 ? true : false;
    },
    mouseOver() {
      this.drawerModel = true
    },
    mouseLeave() {
      this.drawerModel = false
    },
    redirectTo(link, code = "") {
      localStorage.setItem('_vc', code)
      this.$router.push("/" + link);
    },
    _redirect() {
      useAppStore().updateGroupID(this.group_id);
      this.$router.push("/reports/total");
      // window.location.href = 'blog';
    },
    notif_redirect(val) {
      useAppStore().viewAnalysisReload(true);
      this.$router.push({ name: "view_analysis", params: { id: val }, forceReload: true });
      // window.location.href = window.location.hash + "reports/view/" + val
    },
    openDialog() { },
    async getGroups() {
      const config = {
        // url: "/groups?organization_id=" + 2,
        url: "/groups?organization_id=" + this.org_id,

        method: "GET",
      };
      const res = await this.api_call(config);
      this.groups = res.data;
    },
    async seenAll() {
      if (!this.seen_all_progress) {
        this.seen_all_progress = true
        const config = {
          url: "/notif/seen?organization_id=" + this.org_id,
          method: "GET",
        };
        const res = await this.api_call(config);
        if (res.data.result == "success") {
          await this.notification_lists(this.limit)
        }
        this.seen_all_progress = false
      }
    },
    async notification_lists(limit) {
      const config = {
        // url: "/groups?organization_id=" + 2,
        url: "/notif",
        data: {
          id: this.org_id,
          offset: null,
          limit: limit,
        },
        method: "POST",
      };
      const res = await this.api_call(config);
      if (res.data.result == "success") {
        this.getNotification(res)
      }
      this.see_more = false;
    },
    async notification_bell() {
      const config = {
        // url: "/groups?organization_id=" + 2,
        url: "/notif?id=" + this.org_id,
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data.result == "success") {
        this.count = res.data.data.count
      }
    },
    logOut() {
      this.$cookies.remove("UID");
      this.$cookies.remove("_org");
      this.$cookies.remove("_aksis_code");
      this.$cookies.remove("_email");
      this.$cookies.remove("_un");

      localStorage.setItem('reload', true)

      sessionStorage.removeItem('User Details');
      sessionStorage.removeItem('Company Details');
      sessionStorage.removeItem('user_starting_questions');
      sessionStorage.removeItem('message_data');
      sessionStorage.removeItem('email_value');
      sessionStorage.removeItem('Timeout1');
      sessionStorage.removeItem('Timeout2');
      sessionStorage.removeItem('Insert Id');
      sessionStorage.removeItem('send_message_data_lenght');

      
      this.$router.push("/login");
    },
  },
  created() {
    const org_id = Cookies.get("_org");

    if (org_id) {
      this.org_id = Number(org_id)
    }
  },
  async mounted() {
    await this.notification_bell();
    await this.notification_lists(this.limit)
    // await this.getGroups();
    setTimeout(() => {
      this.notification_bell();
    }, 60000);

    // ** CHATBOT CONFIG ** //
    await loadExternalScript().then(() => {
      const email = Cookies.get("_email");
      const username = Cookies.get("_un");
      console.log(username)
      inputEmail(email, username);
    
    })
    .catch((error) => {
      console.error("Error loading script:", error);
    });

   
  },
};
</script>
<style>
.eacomm-message-wrap:nth-child(1) {
  display: none !important;
}

.user-message-wrap:nth-child(2) {
  display: none !important;
}

.v-list-group__items .v-list-item.indent-padding {
  padding-inline-start: 8px !important;
}

.my_nav .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.notif-circle {
  width: 8px;
  height: 8px;
  background: red;
  position: absolute;
  left: 22px;
  top: 9.5px;
  border-radius: 50%;
}

.list-header {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.list-header .v-list-item__spacer {
  display: none !important;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgb(0, 116, 228);
  border-radius: 50%;
}

/* .list-header .v-icon{
  font-size: 30px;
} */
</style>
