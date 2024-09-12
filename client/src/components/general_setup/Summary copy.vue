<template lang="">
  <v-card class="mx-auto my-3 px-5 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <v-col cols="6" class="text-h5"> Summary Prompt Setup </v-col>
        <v-col cols="6">
          <v-btn
            color="primary"
            class="text-none float-right"
            @click="SaveSetup()"
            :disabled="progress"
          >
            <v-progress-circular
              v-if="progress"
              indeterminate
              size="small"
              class="mr-2"
            ></v-progress-circular>
            Save
            <!-- <v-icon class="ml-1">mdi-plus</v-icon> -->
          </v-btn>
        </v-col>
        <v-col cols="12" class="py-0">
          This section allows you to tailor prompts to your specifications for
          generating concise summaries.
        </v-col>
      </v-row>
      <v-row class="mt-8 mb-5" style="background-color: #f5f8fa !important">
        <v-divider></v-divider>
        <br />
        <v-col cols="11" class="text-right">
          <span
            @click="resetData"
            class="pb-3 text-capitalize color-primary-light undeline-hover cursor-pointer"
            >Reset</span
          >
        </v-col>
        <v-col cols="12" class="mt-4">
          <v-row>
            <v-col cols="2" class="mr-5 font-weight-bold">
              Custom Prompt
            </v-col>
            <v-col cols="9">
              <v-textarea
                v-model="setup.initial_prompt"
                placeholder="Insert text here..."
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="2" class="mr-5 font-weight-bold"> Filter </v-col>
            <v-col cols="9">
                <v-combobox
                closable-chips
                chips
                multiple
                persistent-hint
                placeholder="Insert text here..."
                variant="outlined"
                v-model="setup.filters"
                :hide-no-data="true"
              >
              </v-combobox>
              <!-- <v-combobox
                closable-chips
                chips
                multiple
                persistent-hint
                hint="Any text entered into this box will be automatically appended to the Custom Prompt."
                placeholder="Insert text here..."
                variant="outlined"
                :items="default_filters.data"
                v-model:search="search"
                v-model="setup.filters"
                :hide-no-data="false"
                chip-class="custom-chip"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No results matching "<strong>{{ search }}</strong
                      >". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-combobox> -->
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog v-model="reset_dialog" id="reset-dialog" persistent width="450">
    <v-card>
      <v-card-title>
        <span>Message</span>
        <v-btn
          variant="text"
          @click="[(reset_dialog = false)]"
          class="float-right"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="12" align="center" class="py-10">
            <p>Are you sure you want to reset "<span>Custom Prompt</span>"?</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="[(reset_dialog = false)]">
          Close
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="resetData">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Cookies from "js-cookie";
import AccessCode from "@/mixin/AccessCode";

export default {
  emits: ["showNotification", "loadingScreen"],
  data() {
    return {
      items: ["Gaming", "Programming", "Vue", "Vuetify"],
      model: ["Vuetify"],
      search: null,
      progress: false,
      reset_dialog: false,
      notes_config: [],
      setup: {
        initial_prompt: "",
        filters: [],
        organization_id: 0,
      },
      default_filters: [],
      org_id: null,
      view_code: "",
    };
  },
  methods: {
    async getDefaultNotesFilter() {
      try {
        const config = {
          url: "/config/getDefaultNotesFilter",
          params: { organization_id: this.org_id },
          method: "GET",
        };

        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          this.default_filters = res.data.data;
          if (this.setup.initial_prompt == "" && this.setup.filters.length <= 0) {
            this.setup.initial_prompt = this.default_filters.default_prompt;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async resetData() {
      this.setup = {
        initial_prompt: this.default_filters.default_prompt,
        filters: [],
        organization_id: this.org_id,
      };
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
          if (res.data.data.notesConfig) {
            this.notesConfig = res.data.data.notesConfig;
            this.setup.filters = res.data.data.notesConfig.filters;
            this.setup.initial_prompt = res.data.data.notesConfig.initial_prompt;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async SaveSetup() {
      this.progress = true;
      console.log(this.setup)

      if(this.setup.initial_prompt == "" && this.setup.filters.length <= 0){
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
      await this.getSetupDetails();
      // await this.getDefaultNotesFilter();
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
