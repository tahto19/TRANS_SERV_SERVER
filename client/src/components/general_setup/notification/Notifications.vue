<template lang="">
  <v-row>
    <v-col cols="6" class="text-h5"> Notification Setup </v-col>
    <v-col cols="6">
      <v-btn
        color="primary"
        class="text-none float-right"
        @click="savingController"
        :disabled="saving"
      >
        <v-progress-circular
          v-if="saving"
          indeterminate
          size="small"
          class="mr-2"
        ></v-progress-circular>
        Save
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="11" class="py-0"
      >This section allows you to configure and manage notifications to keep you
      informed about extreme conditions, ensuring timely responses to critical
      events in your system.</v-col
    >
  </v-row>
  <v-row class="mt-8">
    <v-divider></v-divider>
    <br />
    <v-col cols="12" color="rgba(0,0,0,.75)">
      <span class="text-subtitle-1 font-weight-medium"
        >Compliance and CSAT score alarm</span
      >
    </v-col>
    <v-col cols="12" md="10">
      <!-- <p>Trigger an alarm if CSAT score if equal or greater to the given number.</p>  -->
      <v-row>
        <v-col cols="2" class="d-flex align-center"
          ><span class="font-weight-bold">High score</span></v-col
        >
        <v-col cols="10">
          <v-row>
            <v-col cols="3" class="pr-1">
              <v-text-field
                hide-details="auto"
                variant="outlined"
                density="compact"
                type="number"
                v-model="config.high"
              ></v-text-field>
            </v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-alert color="primary" variant="tonal" class="py-2">
                <v-icon size="23px" color="info" class="mr-1"
                  >mdi-information</v-icon
                >
                Activate an alarm when the scores are equal to or exceed the
                specified value.
              </v-alert>
              <!-- <v-tooltip
                text="Activate an alarm when the scores are equal to or exceeds the specified value."
                max-width="330"
              >
                <template v-slot:activator="{ props }">
                  <v-icon size="23px" v-bind="props" color="info"
                    >mdi-information</v-icon
                  >
                </template>
              </v-tooltip> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2"></v-col>
    <v-col cols="12" md="10">
      <!-- <p>Trigger an alarm if CSAT score if equal or greater to the given number.</p>  -->
      <v-row>
        <v-col cols="2" class="d-flex align-center"
          ><span class="font-weight-bold">Low score</span></v-col
        >
        <v-col cols="10">
          <v-row>
            <v-col cols="3" class="pr-1">
              <v-text-field
                hide-details="auto"
                variant="outlined"
                density="compact"
                type="number"
                v-model="config.low"
              ></v-text-field>
            </v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-alert color="primary" variant="tonal" class="py-2">
                <v-icon size="23px" color="info" class="mr-1"
                  >mdi-information</v-icon
                >
                Activate an alarm when the scores are equal to or fall below the
                specified value.
              </v-alert>
              <!-- <v-tooltip
                text="Activate an alarm when the scores are equal to or falls below the specified value."
                max-width="330"
              >
                <template v-slot:activator="{ props }">
                  <v-icon size="23px" v-bind="props" color="info"
                    >mdi-information</v-icon
                  >
                </template>
              </v-tooltip> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>
<script>
export default {
  emits: ["notify"],
  props: ["org_id"],
  data() {
    return {
      saving: false,
      config: {
        id: 0,
        organization_id: null,
        low: null,
        high: null,
      },
    };
  },
  watch: {
    async org_id(val) {
      this.config.organization_id = Number(val);
      await this.getNotif(val);
    },
  },
  methods: {
    async savingController() {
      this.saving = true;
      this.config.low = Number(this.config.low);
      this.config.high = Number(this.config.high);

      if (!this.config.high || this.config.high <= 0) {
        this.$emit("notify", {
          type: "error",
          message: "High score field value is not acceptable.",
          title: "Error Data",
        });

        this.saving = false;

        return;
      }
      if (!this.config.low || this.config.low <= 0) {
        this.$emit("notify", {
          type: "error",
          message: "Low score field value is not acceptable.",
          title: "Error Data",
        });
        this.saving = false;
        return;
      }

      if (this.config.id > 0) {
        console.log(this.config.id);
        await this.updateNotif();
      } else {
        await this.saveNotif();
      }

      this.saving = false;
    },
    async updateNotif() {
      const config = {
        url: "/config-notif/",
        method: "PATCH",
        data: this.config,
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getNotif(this.org_id);

        this.$emit("notify", {
          type: "success",
          message: "Data updated successfully!",
          title: "Update Data",
        });
      }
    },
    async saveNotif() {
      const config = {
        url: "/config-notif/",
        method: "POST",
        data: this.config,
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getNotif(this.org_id);
        this.$emit("notify", {
          type: "success",
          message: "Data saved successfully!",
          title: "Save Data",
        });
      }
    },

    async getNotif(val) {
      const config = {
        url: "/config-notif?organization_id=" + val,
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        if (res.data.data.length > 0) {
          this.config = res.data.data[0];
        }
      }
    },
  },
  async mounted() {},
};
</script>
<style lang="">
/* .v-tooltip .v-overlay__content {
  
} */
</style>
