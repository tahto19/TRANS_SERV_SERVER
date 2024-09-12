<template lang="">
  <!-- <h2 class="top-header">Intent Analytics Setup</h2> -->
  <v-card class="mx-auto my-3" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <v-col cols="6" class="text-h5"> Intent Analytics Setup </v-col>
        <v-col cols="6" class="text-h5 d-flex justify-end">
          <v-btn
            elevation="0"
            @click="addIntent()"
            color="primary"
            class="text-none float-right"
            v-if="CheckUserActions(user_actions.create)"
          >
            Add Intent
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="default_intent"
            elevation="0"
            color="primary"
            @click="SaveDefault()"
            class="text-none ml-2"
          >
            Save
          </v-btn>
        </v-col>
        <v-divider class="mt-1"></v-divider>
        <br />
        <v-col cols="12">
          <div class="pa-5" style="background-color: #f5f8fa !important">
            <div
              v-if="!selectedItem && !selectedItem.Intents.length > 0"
              align="center"
            >
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
                >
                  <v-expansion-panel
                    v-for="(s, i) in selectedItem.Intents"
                    :value="i"
                    class="mb-1"
                  >
                    <v-expansion-panel-title class="py-1">
                      <div
                        style="width: 95%"
                        class="d-flex justify-space-between flex-wrap"
                      >
                        <p
                          style="margin: auto 0"
                          class="font-weight-bold text-medium-emphasis color-light"
                        >
                          {{ s.intent }}
                        </p>

                        <div>
                          <div
                            class="d-flex flex-md-row flex-wrap justify-md-center align-center flex-sm-column"
                          >
                            <v-btn
                              class="text-capitalize font-weight-light pa-0 undeline-hover"
                              color="primary"
                              style="width: fit-content"
                              density="compact"
                              @click.stop
                              @click="_clickedSummary(s, i)"
                              variant="text"
                              >Summary</v-btn
                            >
                            <v-divider vertical class="pl-5 mr-5"></v-divider>

                            <v-switch
                              style=""
                              v-if="CheckUserActions(user_actions.update)"
                              @click.stop
                              @click="_clickedPIIToggle(s, i)"
                              v-model="intent_set_pii[i]"
                              color="primary"
                              hide-details
                            >
                              <template v-slot:prepend>
                                <v-btn
                                  class="text-capitalize font-weight-light pa-0 undeline-hover"
                                  color="primary"
                                  density="compact"
                                  @click.stop
                                  @click="_clickedPII(s.id)"
                                  variant="text"
                                  >PII Filter</v-btn
                                >
                              </template>
</v-switch>
<v-divider vertical class="pl-5 mr-5"></v-divider>
<v-switch style="" v-if="CheckUserActions(user_actions.update)" @click.stop @click="_clickedDefault(s)"
  v-model="intent_set_default" :value="s.id" color="primary" hide-details>
  <template v-slot:prepend>
                                <v-label class="pa-0">Set Default</v-label>
                              </template>
</v-switch>
<v-divider vertical class="pl-5 mr-5"></v-divider>
<v-btn v-if="CheckUserActions(user_actions.delete)" style="width: fit-content"
  class="undeline-hover text-capitalize font-weight-light pa-0" color="primary" density="compact" @click.stop
  @click="modalDelete(s.id, s.intent, i)" variant="text">Delete</v-btn>
</div>
</div>
</div>
</v-expansion-panel-title>
<v-expansion-panel-text>
  <br />
  <v-row>
    <v-col cols="12" md="12">
      <v-text-field label="Intent" variant="outlined" rows="1" v-model="s.intent"
        @input="_checkInput('intent_name', s.intent, i)" :readonly="!CheckUserActions(user_actions.update)">
      </v-text-field>
    </v-col>
    <v-col cols="12" md="12">
      <v-textarea label="Description" variant="outlined" rows="1" v-model="s.desc"
        @input="_checkInput('desc', s.desc, i)" :readonly="!CheckUserActions(user_actions.update)"></v-textarea>
    </v-col>
    <v-col cols="12" md="12" class="pt-0">
      <v-textarea label="Script" variant="outlined" rows="7" v-model="s.script"
        @input="_checkInput('script', s.script, i)" :readonly="!CheckUserActions(user_actions.update)"></v-textarea>
    </v-col>
  </v-row>
  <v-divider class="mt-2"></v-divider>
  <v-col cols="12" class="pb-0">
    <div class="d-flex">
      <v-btn elevation="0" variant="text" color="primary" @click="
                              [
                                handleAddMetrics(i),
                                _checkInput('metrics', 'add', i),
                              ]
                            " class="text-none" v-if="CheckUserActions(user_actions.update)">
        <v-icon size="small" class="me-1">
          mdi-plus
        </v-icon>
        Add metrics</v-btn>
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
        <tr v-for="(item, q) in selectedItem.Intents[i].data" :key="q">
          <td>
            <v-text-field hide-details="auto" variant="outlined" v-model="item.call_quality" class="my-3"
              density="compact" @input="
                                    _checkInputMetrics('name', item, i, q)
                                  " :readonly="
                                    !CheckUserActions(user_actions.update)
                                  ">
            </v-text-field>
          </td>
          <td>
            <v-text-field hide-details="auto" variant="outlined" v-model="item.metric_desc" class="my-3"
              density="compact" @input="
                                    _checkInputMetrics('desc', item, i, q)
                                  " :readonly="
                                    !CheckUserActions(user_actions.update)
                                  ">
            </v-text-field>
          </td>
          <td>
            <v-text-field hide-details="auto" variant="outlined" v-model="item.cust_sat_weight" class="my-3"
              density="compact" @input="
                                    _checkInputMetrics('weight', item, i, q)
                                  " :readonly="
                                    !CheckUserActions(user_actions.update)
                                  ">
            </v-text-field>
          </td>
          <td align="center">
            <v-icon v-if="CheckUserActions(user_actions.delete)" size="small" class="me-2" @click="
                                    [
                                      deleteItemMetric(i, q),
                                      _checkInput('metrics', 'delete', i),
                                    ]
                                  " color="error">
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <br />
    <v-row>
      <br />
      <v-divider></v-divider>
      <h4 class="mb-5">Transcript Filtering & Highlighting</h4>
      <v-col cols="12" md="12">
        <v-combobox label="Highlight" @change="_checkInput('highlight', s.highlightConfig.data, i)" @keydown.enter="_checkInput('highlight', s.highlightConfig.data, i)" closable-chips chips multiple persistent-hint
          placeholder="Insert text here..." variant="outlined" v-model="s.highlightConfig.data" :hide-no-data="true">
        </v-combobox>
      </v-col>
    </v-row>
    <br />
    <v-divider></v-divider>
    <div class="d-flex justify-end mt-3">
      <!-- <p class="f-14 color-light mr-5">Metrics</p> -->
      <v-btn v-if="CheckUserActions(user_actions.update)" elevation="0" color="primary" :disabled="save_disable"
        @click="_editingPerIntent(i)" class="text-none">
        Save</v-btn>
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
          <v-text-field hide-details="auto" variant="outlined" density="compact"
            v-model="selectedItem_temp[0].intent"></v-text-field>
        </v-col>
        <v-col cols="3">
          <p class="f-14 color-light">Description</p>
        </v-col>
        <v-col cols="9">
          <v-textarea hide-details="auto" variant="outlined" density="compact" rows="3"
            v-model="selectedItem_temp[0].desc"></v-textarea>
        </v-col>
        <v-col cols="3">
          <p class="f-14 color-light">Script</p>
        </v-col>
        <v-col cols="9">
          <v-textarea hide-details="auto" density="compact" variant="outlined" rows="3"
            v-model="selectedItem_temp[0].script"></v-textarea>
        </v-col>
      </v-row>
      <v-divider class="mb-7 mt-6"></v-divider>
      <v-row>
        <v-col cols="12">
          <div class="d-flex mb-5">
            <!-- <p class="f-14 color-light mr-5">Metrics</p> -->
            <v-btn elevation="0" variant="text" color="primary" @click="handleAdd()" class="text-none">
              <v-icon size="small" class="me-1"> mdi-plus </v-icon>
              Add metrics</v-btn>
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
                  <v-text-field hide-details="auto" variant="outlined" v-model="item.call_quality" class="my-3"
                    density="compact">
                  </v-text-field>
                </td>
                <td>
                  <v-text-field hide-details="auto" variant="outlined" v-model="item.metric_desc" class="my-3"
                    density="compact">
                  </v-text-field>
                </td>
                <td>
                  <v-text-field hide-details="auto" variant="outlined" v-model="item.cust_sat_weight" class="my-3"
                    density="compact">
                  </v-text-field>
                </td>
                <td align="center">
                  <v-icon size="small" class="me-2" @click="deleteItem(i)" color="error">
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <br />
    </v-card-text>
    <!-- <v-divider></v-divider> -->
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions">
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="dialog = false">
            <p class="text-capitalize">Cancel</p>
          </v-btn></v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary" @click="addItem"
            v-if="default_intent">
            <p class="text-capitalize">Add Item</p>
          </v-btn>
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary" @click="saveData"
            :disabled="saving_data" v-else>
            <v-progress-circular v-if="saving_data" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Save Item</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog v-model="delete_dialog" width="auto" id="delete-modal">
  <v-card>
    <v-card-title>
      <v-btn variant="text" @click="delete_dialog = false" class="float-right">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" align="center">
          <h4>Delete Intent?</h4>
          <p>
            Are you sure you want to delete "<span>{{ delete_name }}</span>"?
          </p>
          <p>You can't undo this action</p>
        </v-col>
        <v-col cols="12">
          <v-alert color="error" variant="tonal" icon="mdi-alert" border="start" border-color="error">
            <h4>Warning</h4>
            <p>
              By deleting this intent <span>Metrics</span> will also be
              deleted
            </p>
          </v-alert>
        </v-col>
      </v-row>
      <br />
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions">
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="delete_dialog = false">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary"
            @click="deleteIntent()" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Agree</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="delete_dialog = false">
          Close
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="deleteIntent()">
          Agree
        </v-btn>
      </v-card-actions> -->
  </v-card>
</v-dialog>

<v-dialog v-model="alert_pii_dialog" persistent width="450">
  <v-card>
    <v-card-title>
      <span>Message</span>
      <v-btn variant="text" @click="[(alert_pii_dialog = false)]" class="float-right">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>
        <v-col cols="12" align="center" class="py-10">
          <p>
            Are you sure you want to {{ pii_message_type }} "<span>{{
              set_pii_intent.intent
              }}</span>" PII filter?
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions">
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="[(alert_pii_dialog = false)]">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary"
            @click="savePiiActive(set_pii_intent)" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Save</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <!--      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="[(alert_pii_dialog = false)]"
        >
          Close
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="savePiiActive(set_pii_intent)">
          Agree
        </v-btn>
      </v-card-actions> -->
  </v-card>
</v-dialog>

<v-dialog v-model="alert_default_dialog" persistent width="450">
  <v-card>
    <v-card-title>
      <span>Message</span>
      <v-btn variant="text" @click="[(alert_default_dialog = false)]" class="float-right">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>
        <v-col cols="12" align="center" class="py-10">
          <p>
            Are you sure you want to set "<span>{{
              set_default_intent.intent
              }}</span>" as default?
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions">
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="[(alert_default_dialog = false)]">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary"
            @click="saveDefaultIntent()" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Agree</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="[(alert_default_dialog = false)]"
        >
          Close
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="saveDefaultIntent">
          Agree
        </v-btn>
      </v-card-actions> -->
  </v-card>
</v-dialog>

<v-dialog v-model="editingPerIntent_dialog" width="800" id="delete-modal">
  <v-card>
    <v-card-title>
      Message
      <v-btn variant="text" @click="editingPerIntent_dialog = false" class="float-right">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="py-8">
      <v-row>
        <v-col cols="12" align="center">
          <p v-if="_replace_visible()">
            The Changes you have made might create issues on previously
            analyzed data. You can archive the old data or you can replace
            without archiving.
          </p>
          <p v-else>
            The Changes you have made will create an archive of the previously
            analyzed data. Are You Sure?
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions" v-if="_replace_visible()">
        <v-col cols="4" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="green-darken-1"
            @click="SaveEditedData(edited_intent_index)" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Archive Data</p>
          </v-btn>
        </v-col>
        <v-col cols="5" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary"
            @click="_replaceData()" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Replace without archiving</p>
          </v-btn>
        </v-col>
        <v-col cols="3" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="editingPerIntent_dialog = false">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
      </v-row>
      <v-row class="ma-0 my-actions" v-else>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="green-darken-1"
            @click="SaveEditedData(edited_intent_index)" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Archive Data</p>
          </v-btn>
        </v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="editingPerIntent_dialog = false">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
      </v-row>
    </v-card-actions>
    <!-- <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          @click="SaveEditedData(edited_intent_index)"
        >
          Archive Data
        </v-btn>
        <template v-if="_replace_visible()">
          <v-btn @click="_replaceData()" color="primary">
          Replace without archiving
        </v-btn>
        </template>
        <v-btn color="error" @click="editingPerIntent_dialog = false">
          Close
        </v-btn>
      </v-card-actions> -->
  </v-card>
</v-dialog>

<v-dialog v-model="pii_dialog" persistent width="650">
  <v-card>
    <v-card-title>
      <span>PII Filter</span>
      <v-btn variant="text" @click="[(pii_dialog = false)]" class="float-right">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>
        <v-col cols="12" class="py-10">
          <v-combobox closable-chips chips multiple persistent-hint v-model="pii_details.data" :items="pii_filters"
            hint="Any text entered into this box will be used for Personal Identifiable Information (PII) filtering"
            placeholder="Insert text here..." variant="outlined" :hide-no-data="false" chip-class="custom-chip">
          </v-combobox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions">
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="[(pii_dialog = false)]">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary"
            @click="submitPII()" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Save</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="[(pii_dialog = false)]">
          Close
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="submitPII">
          Save
        </v-btn>
      </v-card-actions> -->
  </v-card>
</v-dialog>

<v-dialog v-model="summary_dialog" persistent width="950">
  <v-card>
    <v-card-title>
      <span>Summary Prompt and Filtering</span>
      <v-btn variant="text" @click="[(summary_dialog = false)]" class="float-right">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="summary_details.notesConfig.initial_prompt" label="Custom Prompt" variant="outlined"
            placeholder="Insert text here..."></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-combobox closable-chips chips multiple persistent-hint placeholder="Insert text here..." label="Filters"
            variant="outlined" v-model="summary_details.notesConfig.filters" :hide-no-data="true">
          </v-combobox>
        </v-col>
      </v-row>
      <!-- <div class="d-flex justify-end mt-3">
        <v-btn v-if="CheckUserActions(user_actions.update)" elevation="0" color="primary" @click="SubmitSetup(i)"
          class="text-none">
          Save</v-btn>
      </div> -->
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-row class="ma-0 my-actions">
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" style="position: relative" variant="flat" width="100%" height="70"
            color="rgb(217, 217, 217)" @click="[(summary_dialog = false)]">
            <p class="text-capitalize">Close</p>
          </v-btn></v-col>
        <v-col cols="6" class="pa-0">
          <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary"
            @click="SubmitSetup(i)" :disabled="progress_circle">
            <v-progress-circular v-if="progress_circle" indeterminate size="small" class="mr-2"></v-progress-circular>
            <p class="text-capitalize">Save</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import Cookies from "js-cookie";
// import NotifPage from "./notification/Notifications.vue";
import AccessCode from "@/mixin/AccessCode";

export default {
  name: "Intent",
  emits: ["showNotification", "loadingScreen"],
  mixins: [AccessCode],
  data() {
    return {
      highlight_data: [],
      highlight_data_temp: [],
      default_prompt: [],
      summary_dialog: false,
      save_disable: true,
      progress_circle: false,
      save_options: [],
      metrics_action: [],
      pii_dialog: false,
      pii_filters: [],
      pii_details: {
        active: false,
        intent_id: null,
        data: [],
      },
      alert_pii_dialog: false,
      alert_default_dialog: false,
      set_pii_intent: {
        id: 0,
        intent: "Sales",
      },
      set_default_intent: {
        id: 0,
        intent: "Sales",
      },
      editingPerIntent_dialog: false,
      delete_dialog: false,
      saving_data: false,
      pii_message_type: "",
      intent_set_pii: [],
      intent_set_pii_temp: [],
      intent_set_default: [],
      intent_set_default_temp: [],
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
          title: "Call metrics weight ",
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
      selectedItem_temp: [],
      selectedItem_temp_2: {},
      readonly: false,
      delete_id: null,
      delete_name: "",
      delete_index: null,
      org_id: null,
      default_intent: false,
      view_code: "",
    };
  },
  watch: {
    alert_pii_dialog(val) {
      if (!val) {
        this.intent_set_pii = [...this.intent_set_pii_temp];
      }
    },
    alert_default_dialog(val) {
      if (!val) {
        this.intent_set_default = this.intent_set_default_temp;
      }
    },
    intent_set_default(newData, oldData) {
      const changedIndex = newData.findIndex((x, i) => x && !oldData[i]);
      if (changedIndex !== -1) {
        this.intent_set_default = this.intent_set_default.map((value, index) =>
          index === changedIndex ? value : null
        );
      }
      // console.log(val)
      // return val.map((x, i)=> (i !== 0))
    },
  },
  methods: {
    tetete(test) {
      console.log("test")
    },
    // notify(data){
    //   this.notif(data);
    // },
    async SubmitSetup() {
      this.progress_circle = true;
      console.log(
        this.summary_details.notesConfig.initial_prompt == "" &&
        this.summary_details.notesConfig.length <= 0
      );
      console.log(this.summary_details);
      console.log(this.summary_details.notesConfig.length <= 0);
      console.log(this.summary_details.notesConfig.initial_prompt == "");
      if (
        this.summary_details.notesConfig.initial_prompt == "" &&
        this.summary_details.notesConfig.filters.length <= 0
      ) {
        this.summary_details.notesConfig.initial_prompt = this.default_prompt;
      }

      const data = {
        ...this.summary_details.notesConfig,
        intent_id: this.summary_details.id,
        organization_id: this.org_id,
      };
      const config = {
        url: "/config/saveNotesConfig",
        method: "POST",
        data: data,
      };

      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getInitials();
        this.notif({
          type: "success",
          message: "Data saved successfully!",
          title: "Save Data",
        });
      }
      this.summary_dialog = false;
      this.progress_circle = false;
    },
    _clickedSummary(data, index) {
      this.summary_dialog = true;
      this.summary_details = data;
    },
    _replace_visible() {
      const index = this.edited_intent_index;
      const add = this.metrics_action[index].add;
      const remove = this.metrics_action[index].remove;
      const archive = this.save_options[index].archive;
      if (add || remove || archive) {
        return false;
      } else {
        return true;
      }
    },
    _save_disable(index) {
      const intent_name = this.save_options[index].replace.intent_name;
      const desc = this.save_options[index].replace.desc;
      const script = this.save_options[index].replace.script;
      const metrics = this.save_options[index].replace.metrics;
      const archive = this.save_options[index].archive;
      const highlight = this.save_options[index].replace.highlight;
      const add = this.metrics_action[index].add;
      const remove = this.metrics_action[index].remove;

      if (
        !intent_name &&
        !desc &&
        !script &&
        !metrics &&
        !archive &&
        !add &&
        !remove &&
        !highlight
      ) {
        this.save_disable = true;
      } else {
        this.save_disable = false;
      }
    },
    _checkReplacebtn(index) {
      this.metrics_action[index].add;
      if (this.metrics_action[index].add || this.metrics_action[index].remove) {
        this.replace_visible = false;
      } else {
        this.replace_visible = true;
      }
    },
    async savePiiActive(x) {
      this.progress_circle = true;
      try {
        let value = false;
        if (!x.piifilter || !x.piifilter.active) {
          value = true;
        } else {
          value = false;
        }

        const data = {
          intent_id: x.id,
          active: value,
          organization_id: this.org_id,
        };

        const config = {
          url: "/config/piiFilterToggle",
          method: "POST",
          data: data,
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          await this.getInitials();
          this.alert_pii_dialog = false;
          this.notif({
            type: "success",
            message: "Data PII updated successfully!",
            title: "Update Data",
          });
        }
        this.progress_circle = false;
      } catch (error) {
        this.progress_circle = false;
        console.error(error);
      }
    },
    _checkInputMetrics(type, data, p_index, c_index) {
      const adding = this.metrics_action[p_index].add;
      const remove = this.metrics_action[p_index].remove;

      if (adding || remove) {
        this.save_options[p_index].archive = true;
        return;
      }
      const check_me = () => {
        const arr = [];
        this.selectedItem_temp_2.Intents[p_index].data.map((x, i) => {
          const evaluate =
            x.call_quality ===
            this.selectedItem.Intents[p_index].data[i].call_quality;
          const evaluate2 =
            x.metric_desc ===
            this.selectedItem.Intents[p_index].data[i].metric_desc;
          arr.push(evaluate);
          arr.push(evaluate2);
        });
        const final = arr.filter((x) => x === false);
        return final && final.length > 0 ? false : true;
      };

      const check_weight =
        this.selectedItem_temp_2.Intents[p_index].data[c_index]
          .cust_sat_weight === data.cust_sat_weight;
      switch (type) {
        case "name":
          if (!check_weight) {
            this.save_options[p_index].archive = true;
          }

          // const checking = this.selectedItem_temp_2.Intents[p_index].data[c_index].call_quality === data.call_quality

          // if (!checking) {
          if (!check_me()) {
            this.save_options[p_index].replace.metrics = true;
          } else {
            this.save_options[p_index].replace.metrics = false;
          }
          this._save_disable(p_index);
          break;
        case "desc":
          if (!check_weight) {
            this.save_options[p_index].archive = true;
          }

          // const checking1 = this.selectedItem_temp_2.Intents[p_index].data[c_index].metric_desc === data.metric_desc

          // if (!checking1) {
          if (!check_me()) {
            this.save_options[p_index].replace.metrics = true;
          } else {
            this.save_options[p_index].replace.metrics = false;
          }
          this._save_disable(p_index);
          break;
        case "weight":
          const checking2 =
            this.selectedItem_temp_2.Intents[p_index].data[c_index]
              .cust_sat_weight === data.cust_sat_weight;
          if (!checking2) {
            this.save_options[p_index].archive = true;
          } else {
            this.save_options[p_index].archive = false;
          }
          this._save_disable(p_index);
          break;
      }
    },
    _checkInput(type, data, index) {
      switch (type) {
        case "intent_name":
          const find = this.selectedItem_temp_2.Intents.find(
            (x) => x.intent === data
          );

          if (!find || find.length == 0) {
            this.save_options[index].replace.intent_name = true;
          } else {
            this.save_options[index].replace.intent_name = false;
          }
          this._save_disable(index);
          break;

        case "desc":
          const find1 = this.selectedItem_temp_2.Intents.find(
            (x) => x.desc === data
          );

          if (!find1 || find1.length == 0) {
            this.save_options[index].replace.desc = true;
          } else {
            this.save_options[index].replace.desc = false;
          }
          this._save_disable(index);
          break;
        case "highlight":

          setTimeout(() => {
            if (this.selectedItem_temp_2.Intents[index].highlightConfig.data.length !== data.length) {
              // automatic na agad na mag replace
            }
            console.log(data)
            const arr = []
            data.map(x => {
              const _filter = this.selectedItem_temp_2.Intents[index].highlightConfig.data.filter(z => z === x)
              if (_filter && _filter.length === 0) {
                arr.push(true);
              } else {
                arr.push(false);
              }
            })

            const _filter2 = arr.filter(x => x === 'true')

            if (_filter2 && _filter2.length == 0) {
              this.save_options[index].replace.highlight = true;
            } else {
              this.save_options[index].replace.highlight = false;
            }
            this._save_disable(index);
          }, 100)


          // let arr = []
          // console.log(this.highlight_data)
          // this.highlight_data.map( x => {
          //   const _filter = this.highlight_data_temp.filter(z => z === x) 
          //   if (!_filter || _filter.length == 0) {
          //     arr.push(false)
          //   } else {
          //     arr.push(true)
          //   }
          // })
          // console.log(arr)
          // const _filter2 = arr.filter( x => x === false);
          // const check = _filter2.length == 0 ? true : false;

          // if (check) {
          //   this.save_options[index].replace.highlight = true;
          // } else {
          //   this.save_options[index].replace.highlight = false;
          // }
          // this._save_disable(index);
          break;

        case "script":
          const find2 =
            this.selectedItem_temp_2.Intents[index].script.replace(
              /\s+/g,
              ""
            ) === data.replace(/\s+/g, "");

          if (!find2 || find2.length == 0) {
            this.save_options[index].replace.script = true;
          } else {
            this.save_options[index].replace.script = false;
          }
          this._save_disable(index);
          break;
        case "metrics":
          if (data == "add") {
            this.metrics_action[index].add = true;
          } else {
            this.metrics_action[index].remove = true;
          }
          // this._checkReplacebtn(index)
          this._save_disable(index);
          break;

        default:
          break;
      }
    },

    async _replaceData() {
      const data = this.selectedItem.Intents[this.edited_intent_index];
      this.selectedItem_temp = [];
      this.selectedItem_temp.push(data);
      await this.SaveReplaceData();
    },
    async SaveReplaceData() {
      let data = this.selectedItem_temp[0];
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
        this.saving_data = false;
        return;
      }

      if (total.cust_sat_weight > 100) {
        this.notif({
          type: "error",
          message: "Weight total should not exceed to 100.",
          title: "Customer Satisfaction Weight ",
        });
        this.saving_data = false;
        return;
      }

      if (call_quality) {
        this.notif({
          type: "error",
          message:
            "Call quality metric is empty. Please insert data or delete the row if not needed.",
          title: "Call Quality Metric",
        });
        this.saving_data = false;
        return;
      }

      // data = {
      //   id: data.id,
      //   data: data.data,
      //   desc: data.desc,
      //   intent : data.intent ,
      //   script: data.script,
      // }
      // data.intent_id = data.id
      try {
        this.progress_circle = true;
        const config = {
          url: "/config/updateIntentWithoutArchive",
          method: "POST",
          data: data,
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          await this.SaveHighlight();
          await this.getInitials();
          this.dialog = false;

          this.notif({
            type: "success",
            message: "Data updated successfully!",
            title: "Update Data",
          });
        }
      } catch (error) {
        console.error(error);
      }
      this.progress_circle = false;
      this.editingPerIntent_dialog = false;
    },
    async SaveHighlight(){
      try {
        this.progress_circle = true;
        const config = {
          url: "/config/updateHighlightConfig",
          method: "POST",
          data: {
            organization_id: this.org_id,
            intent_id: this.selectedItem.Intents[this.edited_intent_index].id,
            data: this.selectedItem.Intents[this.edited_intent_index].highlightConfig.data
          },
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
         
        }
      } catch (error) {
        console.error(error);
      }

    },
    _editingPerIntent(i) {
      this.edited_intent_index = i;
      this.editingPerIntent_dialog = !this.editingPerIntent_dialog;
    },
    _clickedPIIToggle(data, index) {
      if (!data.piifilter || !data.piifilter.active) {
        this.pii_message_type = "enable";
      } else {
        this.pii_message_type = "disable";
      }

      this.alert_pii_dialog = !this.alert_pii_dialog;
      this.set_pii_intent = data;
    },
    _clickedDefault(data) {
      if (!data.default) {
        this.alert_default_dialog = !this.alert_default_dialog;
        this.set_default_intent = data;
      }
    },
    _clickedPII(intent_id) {
      const filters = this.selectedItem.Intents.filter(
        (x) => x.id == intent_id
      );
      this.pii_dialog = true;
      this.pii_details.data =
        filters[0].piifilter && filters[0].piifilter.data
          ? filters[0].piifilter.data
          : [];
      this.pii_details.active =
        filters[0].piifilter && filters[0].piifilter.active
          ? filters[0].piifilter.active
          : false;
      this.pii_details.intent_id = intent_id;
    },
    async defaultPiiFilter() {
      const config = {
        url: "/config/defaultPiiFilter",
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        this.pii_filters = res.data.data.data;
      }
    },
    modalDelete(id, name, index) {
      this.delete_id = null;
      this.delete_name = "name";

      this.delete_id = id;
      this.delete_name = name;
      this.delete_index = index;
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
      }, 500);
    },
    addIntent() {
      this.selectedItem_temp = [];
      this.selectedItem_temp.push({
        id: 0,
        config_id: this.selectedItem.id,
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
    handleAdd() {
      this.selectedItem_temp[this.item_length].data.push({
        call_quality: "",
        metric_desc: "",
        cust_sat_weight: 0,
      });
    },
    async submitPII() {
      this.progress_circle = true;
      try {
        const config = {
          url: "/config/updatePiiFilter",
          method: "POST",
          data: { organization_id: this.org_id, ...this.pii_details },
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          await this.getInitials();
          this.pii_dialog = false;
          this.notif({
            type: res.data.result,
            message: "PII Filters saved successfully!",
            title: "Success",
          });
        }
        this.progress_circle = false;
      } catch (error) {
        this.progress_circle = false;
        console.error(error);
      }
    },
    async saveDefaultIntent() {
      this.progress_circle = true;
      try {
        const config = {
          url: "/config/setDefaultIntent",
          method: "POST",
          data: { id: this.org_id, intent: this.set_default_intent.id },
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          await this.getInitials();
          this.alert_default_dialog = false;
          this.notif({
            type: res.data.result,
            message: "Intent set as default successfully!",
            title: "Success",
          });
        }
        this.progress_circle = false;
      } catch (error) {
        this.progress_circle = false;
        console.error(error);
      }
    },
    async deleteIntent(id = null) {
      this.preventExpand();
      this.progress_circle = true;

      if (this.default_intent) {
        this.selectedItem.Intents.splice(this.delete_index, 1);
        this.delete_dialog = false;
      } else {
        try {
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
          this.delete_dialog = false;
          this.progress_circle = false;
        } catch (error) {
          this.delete_dialog = false;
          this.progress_circle = false;
          console.error(error);
        }
      }
    },
    async editIntent(data) {
      this.progress_circle = true;
      data = {
        ...data,
        organization_id: this.org_id
      }
      try {
        const config = {
          url: "/config/updateIntentv2",
          method: "POST",
          data: data,
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          this.panel = [];
          await this.getInitials();
          this.dialog = false;
          this.notif({
            type: "success",
            message: "Data updated successfully!",
            title: "Update Data",
          });
        }

        this.saving_data = false;
        await this.getInitials();
      } catch (error) {
        console.error(error);
      }
      this.progress_circle = false;
    },
    addItem() {
      this.dialog = !this.dialog;
      const data = this.selectedItem_temp[0];
      this.selectedItem.Intents.push(data);
    },
    async SaveDefault() {
      const config = {
        url: "/config/saveConfigv2",
        method: "POST",
        data: this.selectedItem,
      };

      let res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getInitials();
        this.default_intent = true;
        this.notif({
          type: "success",
          message: "Data saved successfully!",
          title: "Save Data",
        });
      }
    },
    async saveData() {
      this.saving_data = true;
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
        this.saving_data = false;
        return;
      }

      if (total.cust_sat_weight > 100) {
        this.notif({
          type: "error",
          message: "Weight total should not exceed to 100.",
          title: "Customer Satisfaction Weight ",
        });
        this.saving_data = false;
        return;
      }

      if (call_quality) {
        this.notif({
          type: "error",
          message:
            "Call quality metric is empty. Please insert data or delete the row if not needed.",
          title: "Call Quality Metric",
        });
        this.saving_data = false;
        return;
      }

      if (data.id > 0) {
        await this.editIntent(data);
        return;
      }

      try {
        this.progress_circle = true;
        const config = {
          url: "/config/addIntentV2",
          method: "POST",
          data: data,
        };
        const res = await this.api_call(config);
        if (res.data && res.data.result) {
          await this.getInitials();
          this.dialog = false;

          this.notif({
            type: "success",
            message: "Data saved successfully!",
            title: "Save Data",
          });
        }
      } catch (error) {
        console.error(error);
      }
      this.progress_circle = false;
      this.saving_data = false;
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
          this.intent_set_pii = [];
          this.intent_set_pii_temp = [];
          res.data.data.Intents = res.data.data.Intents.map((x) => {
            if (x.IntentsMetrics.length > 0) {
              x.data = x.IntentsMetrics;
            }

            if (!x.notesConfig) {
              x.notesConfig = {
                initial_prompt: this.default_prompt,
                filters: [],
              };
            }

            x.highlightConfig = x.highlightConfig ? x.highlightConfig : {data: []}

            return x;
          });
          this.selectedItem = JSON.parse(JSON.stringify(res.data.data));
          this.selectedItem_temp_2 = JSON.parse(JSON.stringify(res.data.data));
          this.selectedItem.Intents.map((x) => {
            if (x.default) {
              this.intent_set_default = [x.id];
              this.intent_set_default_temp = [x.id];
            }

            if (x.piifilter) {
              this.intent_set_pii.push(x.piifilter.active);
              this.intent_set_pii_temp.push(x.piifilter.active);
            } else {
              this.intent_set_pii.push(false);
              this.intent_set_pii_temp.push(false);
            }
            this.save_options.push({
              id: x.id,
              replace: {
                intent_name: false,
                desc: false,
                script: false,
                metrics: false,
                highlight: false,
              },
              archive: false,
            });

            this.metrics_action.push({
              // checking for metrics action, if added metrics or deleted metrics
              id: x.id,
              add: false,
              remove: false,
            });
          });
        }

        console.log(this.selectedItem)
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
      this.default_intent = true;
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
      await this.getDefaultNotesFilter();
      await this.getAllData();
      await this.defaultPiiFilter();
    },

    async SaveEditedData(i) {
      const data = this.selectedItem.Intents[i];
      this.selectedItem_temp = [];
      this.selectedItem_temp.push(data);
      await this.saveData();
    },

    CheckUserActions(code) {
      const ac = this.access_code.filter(
        (x) => x === this.view_code + "-" + code
      );
      return ac.length > 0 ? true : false;
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
  },
  created() {
    const view_code = localStorage.getItem("_vc");
    const org_id = Cookies.get("_org");

    if (view_code) {
      this.view_code = view_code;
    }

    if (org_id) {
      this.org_id = org_id;
    }
  },
  async mounted() {
    this.loadscreen(true);
    await this.getInitials();
    this.loadscreen(false);
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
    if (accesscodeChecker(access_code_default.children.gs.analysis.code)) {
      next();
    } else {
      next("/error_page");
    }
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

.v-chip {
  color: green;
}

.v-overlay__content .v-input__control .v-selection-control {
  display: flex !important;
  justify-content: end;
}
</style>
