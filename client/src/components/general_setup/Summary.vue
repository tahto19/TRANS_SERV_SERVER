<template lang="">
  <v-card class="mx-auto my-3 px-5 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <v-col cols="6" class="text-h5"> Summary Prompt Setup </v-col>
        <v-col cols="12" class="py-0">
          This section allows you to tailor prompts to your specifications for
          generating concise summaries.
        </v-col>
      </v-row>
      <v-row class="mt-8 mb-5" style="background-color: #f5f8fa !important">
        <v-divider></v-divider>
        <v-col cols="12" class="pb-0 pt-8">
          <div class="d-flex pointer">
              <v-icon
                v-if="intents.length > 0"
                class="mr-1 color-primary-light"
                >{{ isShow ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon
              >
              <p
                v-if="intents.length > 0"
                class="pb-3 text-capitalize color-primary-light undeline-hover"
                @click="showAll"
              >
                {{ isShow ? "Hide all" : "Show all" }}
              </p>
            </div>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels
            v-model="panel"
            variant="accordion"
            multiple
            density="compact"
          >
            <v-expansion-panel
              v-for="(s, i) in intents"
              :value="i"
              class="mb-1"
            >
              <v-expansion-panel-title class="py-1">
                <p
                  style="margin: auto 0"
                  class="font-weight-bold text-medium-emphasis color-light"
                >
                  {{ s.intent }}
                </p>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <br />
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="s.notesConfig.initial_prompt"
                      label="Custom Prompt"
                      variant="outlined"
                      placeholder="Insert text here..."
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                closable-chips
                chips
                multiple
                persistent-hint
                placeholder="Insert text here..."
                label="Filters"
                variant="outlined"
                v-model="s.notesConfig.filters"
                :hide-no-data="true"
              >  </v-combobox>
                  </v-col>
                </v-row>
                <div class="d-flex justify-end mt-3">
                  <v-btn v-if="CheckUserActions(user_actions.update)" elevation="0" color="primary" @click="SubmitSetup(i)"
                    class="text-none">
                    Save</v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
</v-card-text>
</v-card>
</template>
<script>
import Cookies from "js-cookie";
import AccessCode from "@/mixin/AccessCode";

export default {
  emits: ["showNotification", "loadingScreen"],
  mixins: [AccessCode],
  data() {
    return {
      progress: false,
      default_prompt: "",
      isShow: false,
      panel: [],
      intents: [],
      setup: {
        notesConfig: {
          initial_prompt: "",
          filters: [],
        },
        organization_id: 0,
      },
      org_id: null,
      view_code: "",
    };
  },
  methods: {
    showAll() {
      this.panel = [];
      const length = this.intents.length;
      if (this.isShow) {
        this.panel = [];
      } else {
        if (length > 0) {
          for (let i = 0; i < length; i++) {
            this.panel.push(i);
          }
        }
      }
      this.isShow = !this.isShow;
    },
    CheckUserActions(code) {
      const ac = this.access_code.filter(
        (x) => x === this.view_code + "-" + code
      );
      return ac.length > 0 ? true : false;
    },
    async getSetupDetails() {
      try {
        const config = {
          url: "/config/getconfig",
          params: { organization_id: this.org_id },
          method: "GET",
        };

        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          this.intents = res.data.data.Intents.map(x => {
            if (!x.notesConfig) {
              x.notesConfig = {
                initial_prompt: this.default_prompt,
                filters: []
              }
            }

            return x;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getDefaultNotesFilter() {
      try {
        const config = {
          url: "/config/getDefaultNotesFilter",
          params: { organization_id: this.org_id },
          method: "GET",
        };

        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          this.default_prompt = res.data.data.default_prompt;

        }
      } catch (error) {
        console.log(error);
      }
    },
    async SubmitSetup(index) {
      this.progress = true;

      if (this.intents[index].notesConfig.initial_prompt == "" && this.intents[index].notesConfig.length <= 0) {
        this.intents[index].notesConfig.initial_prompt = this.default_prompt
      }

      const data = {
        ...this.intents[index].notesConfig,
        intent_id: this.intents[index].id,
        organization_id: this.org_id
      }

      const config = {
        url: "/config/saveNotesConfig",
        method: "POST",
        data: data,
      };

      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.initialData();
        this.notif({
          type: "success",
          message: "Data saved successfully!",
          title: "Save Data",
        });
      }
      this.progress = false;
    },
    async SaveSetup() {
      this.progress = true;
      console.log(this.setup);

      if (this.setup.initial_prompt == "" && this.setup.filters.length <= 0) {
        this.setup.initial_prompt = this.default_filters.default_prompt;
      }

      const config = {
        url: "/config/saveNotesConfig",
        method: "POST",
        data: this.setup,
      };

      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.initialData();
        this.notif({
          type: "success",
          message: "Data updated successfully!",
          title: "Update Data",
        });
      }

      this.progress = false;
    },
    async initialData() {
      await this.getDefaultNotesFilter();
      await this.getSetupDetails();
    },
  },
  async mounted() {
    await this.initialData();
  },
  created() {
    const view_code = localStorage.getItem("_vc");
    const org_id = Cookies.get("_org");

    if (view_code) {
      this.view_code = view_code;
    }

    if (org_id) {
      this.org_id = Number(org_id);
      this.setup.organization_id = Number(org_id);
    }
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
          summary: {
            code: "TM-hxCBvu8",
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
              account: {
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
    };
    const accesscodeChecker = (code) => {
      const getAccessCode = Cookies.get("_aksis_code");
      const access_code = getAccessCode
        ? JSON.parse(Cookies.get("_aksis_code"))
        : [];
      const checker = access_code.filter((x) => x == code);
      return checker && checker.length > 0 ? true : false;
    };
    if (accesscodeChecker(access_code_default.children.gs.summary.code)) {
      next();
    } else {
      next("/error_page");
    }
  },
};
</script>
<style>
#reset-dialog span {
  font-weight: 600;
}

.cursor-pointer {
  cursor: pointer;
}

.v-combobox__selection .v-chip {
  color: green;
}
</style>
