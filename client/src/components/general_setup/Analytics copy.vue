<template lang="">
  <v-container class="px-0 pt-3 pb-1">
    <h1 class="top-header">Intent Analytics Setup</h1>
    <v-card class="mx-auto my-8" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="d-flex justify-space-between mb-5">
              <v-row>
                <v-col cols="6">
                  <div class="d-flex justify-space-between">
                    <p class="mr-5 my-auto">Metrics Rating Range</p>
                    <v-select
                      hide-details="auto"
                      density="compact"
                      variant="outlined"
                      v-model="selectedItem.metricRange"
                      :items="metric_range_array"
                    ></v-select>
                  </div>
                </v-col>
              </v-row>

              <v-btn
                elevation="0"
                @click="addIntent()"
                color="rgb(0, 116, 228)"
                variant="outlined"
                class="text-overline text-none"
              >
                <v-icon>mdi-plus</v-icon>
                Add Intent
              </v-btn>
              <v-btn
                v-if="default_intent"
                elevation="0"
                color="primary"
                @click="SaveEditedData()"
                class="text-none ml-2"
              >
                Save</v-btn
              >
            </div>
            <div class="pa-5" style="background-color: #f5f8fa !important">
              <div v-if="!selectedItem.Intents.length > 0" align="center">
                No Content
              </div>
              <div class="d-flex pointer">
                <v-icon
                  v-if="selectedItem.Intents.length > 0"
                  class="mr-1 color-primary-light"
                  >{{ isShow ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon
                >
                <p
                  v-if="selectedItem.Intents.length > 0"
                  class="pb-3 text-capitalize color-primary-light undeline-hover"
                  @click="showAll"
                >
                  {{ isShow ? "Hide all" : "Show all" }}
                </p>
              </div>
              <v-row>
                <v-col cols="12">
                  <v-expansion-panels
                    v-model="panel"
                    variant="accordion"
                    multiple
                    density="compact"
                    :readonly="readonly"
                  >
                    <v-expansion-panel
                      v-for="(s, i) in selectedItem.Intents"
                      :value="i"
                      class="mb-1"
                    >
                      <v-expansion-panel-title class="py-1">
                        <div
                          style="width: 95%"
                          class="d-flex justify-space-between"
                        >
                          <p
                            style="margin: auto 0"
                            class="font-weight-bold text-medium-emphasis color-light"
                          >
                            {{ s.intent }}
                          </p>
                          <div>
                            <!-- <v-btn
                     class="text-capitalize font-weight-light"
                     color="primary"
                     density="compact"
                     @click="editIntentBtn(s)"
                     variant="text"
                     >Edit</v-btn
                   > -->
                            <!-- @click="deleteIntent(s.id)" -->

                            <v-btn
                              class="text-capitalize font-weight-light"
                              color="primary"
                              density="compact"
                              @click="modalDelete(s.id, s.intent)"
                              variant="text"
                              >Delete</v-btn
                            >
                          </div>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <br />
                        <v-row>
                          <v-col cols="12" md="12">
                            <!-- <h4 class="color-light mr-3 mb-2">Description</h4> -->
                            <v-textarea
                              label="Description"
                              variant="outlined"
                              rows="1"
                              v-model="s.desc"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" md="12" class="pt-0">
                            <!-- <h4 class="color-light mr-3 mb-2">Script</h4> -->

                            <v-textarea
                              label="Script"
                              variant="outlined"
                              rows="7"
                              v-model="s.script"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <!-- <v-data-table-virtual
                 :headers="table_header.filter((x) => x.title !== 'Action')"
                 :items="s.data"
               >
               </v-data-table-virtual> -->
                        <v-divider class="mt-2"></v-divider>
                        <v-col cols="12" class="pb-0">
                          <div class="d-flex">
                            <!-- <p class="f-14 color-light mr-5">Metrics</p> -->
                            <v-btn
                              elevation="0"
                              variant="text"
                              color="primary"
                              @click="handleAddMetrics(i)"
                              class="text-none"
                            >
                              <v-icon size="small" class="me-1">
                                mdi-plus
                              </v-icon>
                              Add metrics</v-btn
                            >
                          </div>
                          <v-table>
                            <thead>
                              <tr>
                                <template v-for="s in table_header">
                                  <th
                                    v-if="s.key == 'call_quality'"
                                    width="270"
                                    class="text-left"
                                  >
                                    {{ s.title }}
                                  </th>

                                  <th
                                    v-if="s.key == 'cust_sat_weight'"
                                    width="230"
                                    class="text-left"
                                  >
                                    {{ s.title }}
                                  </th>
                                  <th
                                    v-if="s.key == 'metric_desc'"
                                    class="text-left"
                                  >
                                    {{ s.title }}
                                  </th>

                                  <th
                                    v-if="s.key == 'actions'"
                                    width="50"
                                    class="text-left"
                                  >
                                    {{ s.title }}
                                  </th>
                                </template>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(item, q) in selectedItem.Intents[i]
                                  .data"
                                :key="q"
                              >
                                <td>
                                  <v-text-field
                                    hide-details="auto"
                                    variant="outlined"
                                    v-model="item.call_quality"
                                    class="my-3"
                                    density="compact"
                                  >
                                  </v-text-field>
                                </td>
                                <td>
                                  <v-text-field
                                    hide-details="auto"
                                    variant="outlined"
                                    v-model="item.metric_desc"
                                    class="my-3"
                                    density="compact"
                                  >
                                  </v-text-field>
                                </td>
                                <td>
                                  <v-text-field
                                    hide-details="auto"
                                    variant="outlined"
                                    v-model="item.cust_sat_weight"
                                    class="my-3"
                                    density="compact"
                                  >
                                  </v-text-field>
                                </td>
                                <td align="center">
                                  <v-icon
                                    size="small"
                                    class="me-2"
                                    @click="deleteItemMetric(i, q)"
                                    color="error"
                                  >
                                    mdi-delete
                                  </v-icon>
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                          <br />
                          <v-divider></v-divider>
                          <div class="d-flex justify-end mt-3">
                            <p class="f-14 color-light mr-5">Metrics</p>
                            <v-btn
                              v-if="!default_intent"
                              elevation="0"
                              color="primary"
                              @click="SaveEditedData(i)"
                              class="text-none"
                            >
                              Save</v-btn
                            >
                          </div>
                        </v-col>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <v-dialog v-model="dialog" scrollable persistent width="1000">
    <v-card>
      <v-toolbar dark color="white" class="sticky">
        <v-toolbar-title>Configure</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-6">
        <v-row>
          <v-col cols="3">
            <p class="f-14 color-light">Intent Name</p>
          </v-col>
          <v-col cols="9">
            <v-text-field
              hide-details="auto"
              variant="outlined"
              density="compact"
              v-model="selectedItem_temp[0].intent"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Description</p>
          </v-col>
          <v-col cols="9">
            <v-textarea
              hide-details="auto"
              variant="outlined"
              density="compact"
              rows="3"
              v-model="selectedItem_temp[0].desc"
            ></v-textarea>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Script</p>
          </v-col>
          <v-col cols="9">
            <v-textarea
              hide-details="auto"
              density="compact"
              variant="outlined"
              rows="3"
              v-model="selectedItem_temp[0].script"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-divider class="mb-7 mt-6"></v-divider>
        <v-row>
          <v-col cols="12">
            <div class="d-flex mb-5">
              <!-- <p class="f-14 color-light mr-5">Metrics</p> -->
              <v-btn
                elevation="0"
                variant="text"
                color="primary"
                @click="handleAdd()"
                class="text-none"
              >
                <v-icon size="small" class="me-1"> mdi-plus </v-icon>
                Add metrics</v-btn
              >
            </div>
            <v-table>
              <thead>
                <tr>
                  <template v-for="s in table_header">
                    <th
                      v-if="s.key == 'call_quality'"
                      width="200"
                      class="text-left"
                    >
                      {{ s.title }}
                    </th>

                    <th
                      v-if="s.key == 'cust_sat_weight'"
                      width="160"
                      class="text-left"
                    >
                      {{ s.title }}
                    </th>
                    <th
                      v-if="s.key == 'metric_desc'"
                      width="270"
                      class="text-left"
                    >
                      {{ s.title }}
                    </th>

                    <th v-if="s.key == 'actions'" width="50" class="text-left">
                      {{ s.title }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in selectedItem_temp[0].data" :key="i">
                  <td>
                    <v-text-field
                      hide-details="auto"
                      variant="outlined"
                      v-model="item.call_quality"
                      class="my-3"
                      density="compact"
                    >
                    </v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      hide-details="auto"
                      variant="outlined"
                      v-model="item.metric_desc"
                      class="my-3"
                      density="compact"
                    >
                    </v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      hide-details="auto"
                      variant="outlined"
                      v-model="item.cust_sat_weight"
                      class="my-3"
                      density="compact"
                    >
                    </v-text-field>
                  </td>
                  <td align="center">
                    <v-icon
                      size="small"
                      class="me-2"
                      @click="deleteItem(i)"
                      color="error"
                    >
                      mdi-delete
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn
          color="rgb(0, 116, 228)"
          variant="flat"
          @click="addItem"
          class="text-none"
          :disabled="add_data"
          v-if="default_intent"
        >
          <v-progress-circular
            v-if="add_data"
            indeterminate
            size="small"
            class="mr-2"
          ></v-progress-circular>
          Add Item
        </v-btn>
        <v-btn
          color="rgb(0, 116, 228)"
          variant="flat"
          class="text-none"
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="delete_dialog" width="auto" id="delete-modal">
    <v-card>
      <v-card-title>
        <v-btn
          variant="text"
          @click="delete_dialog = false"
          class="float-right"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" align="center">
            <h4>Delete Intent?</h4>
            <p>
              Are you sure you want to delete "<span>{{ delete_name }}</span
              >"?
            </p>
            <p>You can't undo this action</p>
          </v-col>
          <v-col cols="12">
            <v-alert
              color="error"
              variant="tonal"
              icon="mdi-firework"
              border="start"
              border-color="error"
            >
              <h4>Warning</h4>
              <p>
                By deleting this intent <span>Metrics</span> will also be
                deleted
              </p>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="delete_dialog = false"
        >
          Disagree
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="deleteIntent()">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useAppStore } from "@/store/app.js";
import { parse } from "date-fns";
import Cookies from "js-cookie";

export default {
  name: "Intent",
  emits: ["showNotification", "loadingScreen"],
  data() {
    return {
      delete_dialog: false,
      default_intent: false,
      add_data: false,
      panel: [],
      isShow: false,
      dialog: false,
      item_length: 0,
      metric_range_array: ["1-5", "1-10", "1-100%"],
      table_header: [
        {
          title: "Call Quality Metrics to Measure: (max 100 characters)",
          align: "start",
          key: "call_quality",
        },
        {
          title: "Metrics Description (Max 200 characters) ",
          align: "start",
          key: "metric_desc",
        },
        {
          title: "Customer Satisfaction Weight ",
          align: "center",
          key: "cust_sat_weight",
        },
        { title: "Action", align: "center", key: "actions" },
      ],
      items: ["test"],
      select: [],
      selectedItem: {
        Intents: [],
      },
      selectedItem_temp: {},
      selectedItem_temp_2: {},
      readonly: false,
      delete_id: null,
      delete_name: "",
      org_id: null,
    };
  },
  computed: {
    userData() {
      return useAppStore().userData;
    },
  },
  methods: {
    modalDelete(id, name) {
      this.delete_id = null;
      this.delete_name = "name";

      this.delete_id = id;
      this.delete_name = name;
      this.delete_dialog = true;
    },
    showAll() {
      this.panel = [];
      const length = this.selectedItem.Intents.length;
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
    preventExpand() {
      this.readonly = true;
      setTimeout(() => {
        this.readonly = false;
      }, 1000);
    },
    // editIntentBtn(data) {
    //   console.log(data)
    //   this.preventExpand()
    //   this.selectedItem_temp = [];
    //   this.selectedItem_temp.push(data);
    //   this.dialog = !this.dialog;
    //   this.item_length = this.selectedItem_temp.length - 1;
    // },
    addIntent() {
      this.selectedItem_temp = [];
      this.selectedItem_temp.push({
        // id: this.selectedItem.id,
        id: 0,
        organization_id: this.org_id,
        intent: "",
        desc: "",
        script: "",
        data: [
          {
            call_quality: "",
            metric_desc: "",
            cust_sat_weight: 0,
          },
        ],
      });
      this.dialog = !this.dialog;
      //   this.item_length = this.selectedItem_temp.length - 1;
    },
    deleteItem(i) {
      this.selectedItem_temp[this.item_length].data.splice(i, 1);
    },
    deleteChips(data) {
      const index = this.selectedItem.findIndex(
        (obj) => obj["intent"] === data.item.title
      );

      this.select.splice(data.index, 1);
      this.selectedItem.splice(index, 1);
    },
    handleAdd() {
      this.selectedItem_temp[this.item_length].data.push({
        call_quality: "",
        metric_desc: "",
        cust_sat_weight: 0,
      });
    },
    async deleteIntent(id = null) {
      this.preventExpand();
      const config = {
        url: "/config/deleteIntent",
        method: "POST",
        data: { id: this.delete_id },
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getInitials();
        this.dialog = false;
        this.notif({
          type: res.data.result,
          message: "Data deleted successfully!",
          title: "Delete alert",
        });
      }
    },
    async editIntent(data) {
      //  const config = {
      //    url: "/config/updateIntent",
      //    method: "POST",
      //    data: data,
      //  };
      //  const res = await this.api_call(config);
      //  if (res.data && res.data.result) {
      //    await this.getInitials();
      //    this.dialog = false;
      //    this.notif({
      //      type: "success",
      //      message: "Data updated successfully!",
      //      title: "Update Data",
      //    })
      //  }
      //  this.add_data = false;
      //  await this.getInitials();
    },
    async addItem() {
      this.add_data = true;
      const data = this.selectedItem_temp[0];
      let total = 0;
      if (data.data.length > 1) {
        total = data.data.reduce(
          (accumulator, currentValue) => {
            const accumulatorValue = Number(accumulator.cust_sat_weight);
            const currentValueNum = Number(currentValue.cust_sat_weight);

            return { cust_sat_weight: accumulatorValue + currentValueNum };
          },
          { cust_sat_weight: 0 }
        );
      } else {
        total = { cust_sat_weight: data.data[0].cust_sat_weight };
      }
      const call_quality = data.data.find((x) => x.call_quality.trim() == "");

      if (data.intent.trim() == "") {
        this.notif({
          type: "error",
          message: "Intent name is empty.",
          title: "Intent ",
        });
        this.add_data = false;
        return;
      }

      if (total.cust_sat_weight > 100) {
        this.notif({
          type: "error",
          message: "Weight total should not exceed to 100.",
          title: "Customer Satisfaction Weight ",
        });
        this.add_data = false;
        return;
      }

      if (call_quality) {
        this.notif({
          type: "error",
          message:
            "Call quality metric is empty. Please insert data or delete the row if not needed.",
          title: "Call Quality Metric",
        });
        this.add_data = false;
        return;
      }

      if (data.id > 0) {
        await this.editIntent(data);
        return;
      }

      console.log(data);
      this.add_data = false;
      this.selectedItem.Intents.push(data);
      console.log(this.selectedItem_temp_2);
    },
    async getAllData() {
      const config = {
        url: "/config/getconfig?organization_id=" + this.org_id,
        method: "GET",
      };

      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        if (!res.data.data) {
          this.getDefault();
        } else {
          this.selectedItem = JSON.parse(JSON.stringify(res.data.data));
          this.selectedItem_temp_2 = JSON.parse(JSON.stringify(res.data.data));
        }
      }
    },
    async getDefault() {
      const config = {
        url: "/config/defaultConfig",
        method: "GET",
      };

      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        this.selectedItem = res.data.data;
        this.selectedItem.organization_id = this.org_id;
      }
    },

    //NEW
    handleAddMetrics(i) {
      this.selectedItem.Intents[i].data.push({
        call_quality: "",
        cust_sat_weight: "",
        metric_desc: "",
      });
    },
    deleteItemMetric(i, q) {
      this.selectedItem.Intents[i].data.splice(q, 1);
    },
    async getInitials() {
      await this.getAllData();
    },

    async SaveEditedData(i) {
      const forDefault = this.selectedItem.forDefault;
      if (forDefault) {
        console.log(this.selectedItem);
        const config = {
          url: "/config/saveConfigv2",
          method: "POST",
          data: this.selectedItem,
        };

        const res = await this.api_call(config);
        this.default_intent = true;
      } else {
        console.log({ ...this.selectedItem_temp_2 }.Intents.length);
        console.log(this.selectedItem.Intents.length);

        if (
          this.selectedItem_temp_2.Intents.length ==
          this.selectedItem.Intents.length
        ) {
        } else {
          const data = JSON.parse(JSON.stringify(this.selectedItem));
          data.Intents.splice(0, this.selectedItem_temp_2.Intents.length);

          const new_data = {
            organization_id: data.organization_id,
            Intents: data.Intents,
          };

          const config = {
            url: "/config/addIntentV2",
            method: "POST",
            data: new_data,
          };

          const res = await this.api_call(config);
        }
      }

      // if (res.data && res.data.result) {
      //   this.selectedItem = res.data.data;
      //   console.log(this.selectedItem);
      // }
    },
  },
  async mounted() {
    this.loadscreen(true);
    this.org_id = Cookies.get("_org");
    await this.getInitials();
    this.loadscreen(false);
  },
};
</script>
<style>
.v-toolbar {
  border-bottom: 1px solid #e6e6e6 !important;
}

#delete-modal .v-alert span,
p span {
  font-weight: 600;
}
</style>
