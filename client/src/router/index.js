// Composables
import { createRouter, createWebHashHistory } from "vue-router";

let access_code_default = {
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
        children: {},
      },
      account: {
        code: "TM-YjUaucI",
      },
    },
    wb: "SM-v9zZSBK",
    ac: "SM-RrwFKy7",
    rpts: "SM-fGrTV1I",
  },
};
// let getAccessCode = Cookies.get("_aksis_code")
// let accesscodeChecker = () => {};
// let set_interval = setInterval(() => {
//   if(getAccessCode){
//     getAccessCode = Cookies.get("_aksis_code")
//      accesscodeChecker = (code) => {
//       const access_code = getAccessCode ? JSON.parse(Cookies.get("_aksis_code")) : [];
//       const checker = access_code.filter((x) => x == code);
//       return checker && checker.length > 0 ? true : false;
//     };
//     clearInterval(set_interval)
//   } 
// },1000)

// const accesscodeChecker = (code) => {
//   const checker = access_code.filter((x) => x == code);
//   return checker && checker.length > 0 ? true : false;
// };

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/views/Dashboard.vue"),
        // beforeEnter: (to, from, next) => {
        //   if (accesscodeChecker(access_code_default.wb)) {
        //     next();
        //   } else {
        //     next("/gs/pbx");
        //   }
        // },
        children: [
          {
            path: "",
            name: "defailt_dashboard",
            component: () => import("@/components/dashboard/HelloWorld.vue"),
          },
        ],
      },
      {
        path: "gs",
        name: "general_setup",
        component: () => import("@/views/GeneralSetup.vue"),
        children: [
          {
            path: "analytics",
            name: "analytics_setup",
            component: () => import("@/components/general_setup/Analytics.vue"),

          },
          {
            path: "summary",
            name: "summary_setup",
            component: () => import("@/components/general_setup/Summary.vue"),

          },
          {
            path: "groups",
            name: "gs_groups",
            component: () => import("@/components/general_setup/Group.vue"),
          },
          {
            path: "agents",
            name: "gs_agents",
            component: () => import("@/components/general_setup/Agent.vue"),
          },
          {
            path: "notification",
            name: "gs_notif",
            component: () =>
              import("@/components/general_setup/Notifications.vue"),
            },
          {
            path: "pbx",
            name: "gs_pbx_token",
            component: () => import("@/components/general_setup/PbxToken.vue"),
          },
          {
            path: "account",
            name: "gs_account",
            component: () => import("@/components/general_setup/Account.vue"),
        
          },
          {
            path: "access_control",
            name: "gs_access_control",
            component: () => import("@/components/general_setup/AccessControl.vue"),
        
          },
        ],
      },
      {
        path: "account",
        name: "account",
        component: () => import("@/views/Account.vue"),
        children: [
          {
            path: "",
            name: "default_account",
            component: () => import("@/components/account/Account.vue"),
          },
        ],
      },
      {
        path: "pbx_token",
        name: "pbx_token",
        component: () => import("@/views/PbxToken.vue"),
        children: [
          {
            path: "",
            name: "default_pbx_token",
            component: () => import("@/components/pbx_token/PbxToken.vue"),
          },
        ],
      },
      {
        path: "reports",
        name: "reports",
        component: () => import("@/views/Reports.vue"),
        children: [
          {
            path: ":id",
            name: "reports_default",
            component: () => import("@/components/reports/Reports.vue"),
          },
          {
            path: "view/:id",
            name: "view_analysis",
            // component: () => import("@/components/reports/ViewAnalysis.vue"),
            component: () => import("@/components/reports/ViewAnalysis_copy.vue"),
          },
          {
            path: "intents/:id",
            name: "view_intents",
            component: () => import("@/components/reports/Ex_Intents.vue"),
          },
          {
            path: "sentiments/:id",
            name: "view_sentiment",
            component: () => import("@/components/reports/Ex_Sentiments.vue"),
          },
          {
            path: "call_ratings/:id",
            name: "view_csat",
            // component: () => import("@/components/reports/Ex_CSAT_copy.vue"),
            component: () => import("@/components/reports/Ex_CSAT.vue"),
          },
          {
            path: "agent_chart/:id",
            name: "agent_chart",
            // component: () => import("@/components/reports/Ex_CSAT_copy.vue"),
            component: () => import("@/components/reports/Agent_Chart.vue"),
          },
          {
            path: "compliance/:id",
            name: "view_compliance",
            component: () => import("@/components/reports/Ex_Compliance.vue"),
          },
          
        ],
      },
      {
        path: "mock",
        component: () => import("@/views/Mock.vue"),
        children: [
          // {
          //   path: "",
          //   name: "mock",
          //   component: () => import("@/components/mock/MockBuild.vue"),
          // },
          // {
          //   path: "2",
          //   name: "mock2",
          //   component: () => import("@/components/mock/Mock2.vue"),
          // },
          {
            path: "manual_entry",
            name: "manual_entry",
            component: () => import("@/components/mock/MockManual.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/layouts/default/Login.vue"),
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/Login2.vue"),
      },
      {
        path: "login2",
        name: "Login2",
        component: () => import("@/views/Login2.vue"),
      },
    ],
  },
  {
    path: "/error_page",
    component: () => import("@/views/Error_page.vue")
  }
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

export default router;
