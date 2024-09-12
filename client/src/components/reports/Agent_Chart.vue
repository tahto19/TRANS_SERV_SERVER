<template lang="">
        <v-chip
      :to="{ name: 'view_csat', params: { id: 'total' } }"
      variant="text"
      class="mb-3 px-0"
    >
      <v-icon color="rgb(0, 116, 228)" start icon="mdi-chevron-left"></v-icon>
      <p style="color: rgb(0, 116, 228)">Back to call ratings</p>
    </v-chip>
    <h1 class="top-header">Agent Report Chart</h1>

    <v-card class="mx-auto my-8 px-5 bt-gray" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="5" md="5">
          <div
            class="d-flex align-center"
            style="position: relative !important"
          >
            <span class="color-light mr-3">Period</span>
            <v-autocomplete
              v-model="period_type_id"
              density="compact"
              :items="period_type"
              :item-text="(item) => `${item.id}`"
              item-title="name"
              item-value="id"
              variant="outlined"
              height="10"
              hide-details="auto"
              id="menu-activator"
              :disabled="ac_disable"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  @click="ActivateMenu(item?.raw?.name)"
                ></v-list-item>
              </template>
            </v-autocomplete>
            <v-menu
              v-if="showMenu"
              v-model="showMenu"
              :close-on-content-click="false"
              activator="#menu-activator"
              location="bottom"
            >
              <v-card>
                <v-card-text class="d-flex" style="gap: 10px">
                  <v-date-picker v-model="custom_startDate"></v-date-picker>
                  <v-date-picker v-model="custom_endDate"></v-date-picker>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn variant="text" @click="showMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="selectPeriod(4, true)"
                  >
                    <v-progress-circular
                      v-if="load_process"
                      color="primary"
                      indeterminate
                    ></v-progress-circular
                    >&nbsp; Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </v-col>
        </v-row>
      </v-card-text>
    </v-card>
</template>
<script>
export default {
    data() {
        return {
            custom_startDate: new Date(),
            custom_endDate: new Date(),
            showMenu: false,
            period_type_id: 1,
            period_type: [
                {
                id: 1,
                name: "Last 24 hours",
                },
                {
                id: 2,
                name: "Last 7 days",
                },
                {
                id: 3,
                name: "Last 30 days",
                },
                {
                id: 4,
                name: "Custom",
                },
            ],
        }
    }
}
</script>
<style lang="">

</style>