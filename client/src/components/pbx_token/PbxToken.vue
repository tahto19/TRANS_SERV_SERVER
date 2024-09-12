<template lang="">
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  />
  <v-card class="mx-auto my-8 px-5" max-width="100%" elevation="4">
    <v-card-text class="pt-2">
      <form id="form_create_api" @submit.prevent="submitPbxToken">
        <div class="row mb-2">
          <div class="col-xl-4 col-lg-4">
            <h3>PBX Token</h3>
          </div>
        </div>

        <div class="row">
          <div class="col-xl-4 col-lg-4">
            <div class="form-group">
              <label class="control-label">Accountcode:</label>
              <input
                type="text"
                name="accountcode"
                class="form-control form-control-sm"
                placeholder="Please enter accountcode"
                v-model="pbx_token_details.accountcode"
              />
            </div>

            <div class="form-group">
              <label class="control-label">Description:</label>
              <input
                type="text"
                name="description"
                class="form-control form-control-sm"
                placeholder="Please enter description"
                v-model="pbx_token_details.description"
              />
            </div>

            <div class="form-group">
              <label class="control-label">Status:</label>
              <select
                name="status"
                class="form-control form-control-sm"
                v-model="pbx_token_details.status"
              >
                <option v-for="item in status_arr" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="control-label">API Type:</label>
              <select
                name="api_type"
                class="form-control form-control-sm"
                v-model="api_type_value"
              >
                <option v-for="item in api_types" :value="item.type">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>

          <div
            v-if="api_type_value == 'pami_api'"
            id="pami_api"
            class="col-xl-4 col-lg-4"
          >
            <div
              class="form-group border p-3 pl-4 pr-4 elevation-1 rounded bg-light"
            >
              <label class="control-label h4">PAMI API:</label>
              <div class="form-group">
                <label class="control-label">Server Host:</label>
                <input
                  type="text"
                  name="server_host"
                  class="form-control form-control-sm"
                  placeholder="Server host"
                  v-model="pbx_token_details.pami_account.host"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Server Port:</label>
                <input
                  type="number"
                  name="server_port"
                  class="form-control form-control-sm"
                  placeholder="Server port"
                  v-model="pbx_token_details.pami_account.port"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Server Username:</label>
                <input
                  type="text"
                  name="server_username"
                  class="form-control form-control-sm"
                  placeholder="Server username"
                  v-model="pbx_token_details.pami_account.username"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Server Password:</label>
                <input
                  type="password"
                  name="server_password"
                  class="form-control form-control-sm"
                  placeholder="Server password"
                  v-model="pbx_token_details.pami_account.password"
                />
              </div>
            </div>
          </div>

          <div v-else id="json_api" class="col-xl-4 col-lg-4">
            <div
              class="form-group border p-3 pl-4 pr-4 elevation-1 rounded bg-light"
            >
              <label class="control-label h4">JSON API:</label>
              <div class="form-group">
                <label class="control-label">Token:</label>
                <input
                  type="text"
                  name="api_token"
                  class="form-control form-control-sm"
                  readonly
                  v-model="pbx_token_details.api_token"
                />
              </div>

              <div class="form-group">
                <label class="control-label">URL:</label>
                <input type="hidden" value="{{$token}}" />
                <pre
                  class="border rounded bg-light elevation-1 pre-border"
                ><code id="text_code" class="text-green text-md text-wrap">https://insightsdev.etpbx.com/api/v1/{{$api_target}}</code>
                            <div class="d-flex align-items-center float-right mt-4">
                                <div v-if="copied_clip" id="btn_copy_alert" class="btn btn-sm btn-success" disabled>Copied!</div>
                                <button type="button" id="" class="btn btn-sm btn-primary" @click="doCopy" title="Copy"><i class="fa fa-copy"></i></button>
                            </div>
                        </pre>
              </div>

              <label class="control-label">Allowed IP:</label>
              <div
                class="row mb-2"
                id="row_ipaddress"
                v-for="(item, i) in pbx_token_details.ip_address"
              >
                <div class="col-lg-8 col-md-8 col-sm-12">
                  <input
                    v-model="pbx_token_details.ip_address[i]"
                    type="text"
                    class="form-control form-control-sm"
                    name="ip_address[]"
                    data-inputmask="'alias': 'ip'"
                    data-mask=""
                    inputmode="decimal"
                    placeholder="Please enter IP Address"
                  />
                  <!-- <input
                    type="text"
                    class="form-control form-control-sm"
                    name="ip_address[]"
                    data-inputmask="'alias': 'ip'"
                    data-mask=""
                    inputmode="decimal"
                    placeholder="Please enter IP Address"
                  /> -->
                </div>
                <div class="col-lg-4">
                  <button
                    v-if="data_details.api_type_data.allowed_ip.length > 1"
                    type="button"
                    id="btn_delete_ipaddress"
                    class="btn btn-danger btn-sm w-100"
                    title="Remove IP Address"
                    @click="removeIp(i)"
                  >
                    <i class="fa-solid fa-trash-can mr-1"></i>Remove
                  </button>
                </div>
              </div>
              <div class="row mt-4" id="row_addbtn">
                <div class="col-lg-12">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm float-right"
                    title="Add Domain"
                    @click="addIp"
                  >
                    <i class="fa-solid fa-plus mr-1"></i>Add IP Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" type="submit">Submit</button>
        <button class="btn btn-default">Cancel</button>
      </form>
    </v-card-text>
  </v-card>
  <button class="btn btn-primary" @click="TESTTEST">Submit</button>

</template>

<script>
import { useAppStore } from "@/store/app.js";

import axios from 'axios';
export default {
  emits: ["showNotification", "loadingScreen"],
  watch: {
    api_type_value(val) {
      console.log(val);
    },
  },
  data() {
    return {
      copied_clip: false,
      status_value: "Active",
      status_arr: ["Active", "Inactive"],
      api_type_value: "json_api",
      api_types: [
        {
          type: "json_api",
          name: "JSON API (Queue log, Queue member)",
        },
        {
          type: "pami_api",
          name: "PAMI API",
        },
      ],
      data_details: {
        accountcode: "",
        description: "",
        status: "",
        api_type: "",
        api_type_data: {
          token: "",
          url: "",
          allowed_ip: ["111.111.111"],
        },
      },
      pbx_token_details: {
        id: null,
        client_id: null,
        accountcode: null,
        allowed_ip: "",
        description: "",
        status: "",
        pami_account: {
          host: "",
          port: null,
          username: "",
          password: "",
        },
        api_token: "",
        erver_port: "",
        ip_address: [""]
      },
      message: "new copy!",
    };
  },
  // 003849
  methods: {
    async submitPbxToken() {
      if (this.pbx_token_details.id !== null) {
        console.log("Update")
        await this.saveData("update")
      } else {
        console.log("SAve")
        await this.saveData("create")
      }
    },
    async saveData(type) {
      let config;
      const pami_account_server = {
        server_host: this.pbx_token_details.pami_account.host,
        server_port: this.pbx_token_details.pami_account.port,
        server_username: this.pbx_token_details.pami_account.username,
        server_password: this.pbx_token_details.pami_account.password,
      }

      const new_pbx_token_details = { ...this.pbx_token_details, ...pami_account_server }
      if (type == "create") {
        config = {
          url: "/api/config/create_token/40fead5a5856c3e6f0dc59d1030aba12",
          data: new_pbx_token_details,
          method: "POST",
        };
      } else {
        config = {
          url: "/api/config/update_token/" + this.token + "/" + this.userData.organization_id,
          data: new_pbx_token_details,
          method: "POST",
        };
      }

      const res = await this.pbx_token_api_call(config)
      if (res.data != "No result") {
        await this.initialData()
      }
    },
    async TESTTEST() {
      const data = {
        "client_id": 81998,
        "accountcode": "003849",
        "description": "test2",
        "api_type": "pami_api",
        "status": "Inactive",
        "server_host": "172.31.24.24",
        "server_port": 5038,
        "server_username": "insights",
        "server_password": "40fead5a5856c3e6f0dc59d1030aba12",
        "api_token": "ed9b723685c4146226611af71d55901dbe86b96a63279a744d551bf0b1320263",
        "ip_address": []
      }
      // url: "https://insightsdev.etpbx.com/api/config/edit_token/40fead5a5856c3e6f0dc59d1030aba12/81998",

      const config = {
        url: "https://insightsdev.etpbx.com/api/config/edit_token/40fead5a5856c3e6f0dc59d1030aba12/81998",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.request(config);
      console.log(res)
    },
    addIp() {
      this.data_details.api_type_data.allowed_ip.push("");
    },
    removeIp(i) {
      this.data_details.api_type_data.allowed_ip =
        this.data_details.api_type_data.allowed_ip.filter((x, z) => z != i);
    },
    doCopy() {
      this.$copyText(this.message).then(
        (e) => {
          this.copied_clip = true;
          setInterval(() => {
            this.copied_clip = false;
          }, 3000);
        },
        (e) => {
          alert("Can not copy");
          console.log(e);
        }
      );
    },
    async getPbx() {
      if (this.userData != null) {
        const config = {
          url: "/api/config/edit_token/" + this.token + "/" + this.userData.organization_id,
          method: "POST"
        }
        const res = await this.pbx_token_api_call(config)
        if (res.data.result != "No result") {

          this.pbx_token_details = res.data.map(x => {
            if (typeof x.allowed_ip == 'string') {
              x.allowed_ip = [x.allowed_ip];
            }

            if (x.pami_account == null) {
              x.pami_account = {
                host: "",
                port: null,
                username: "",
                password: "",
              }
            }

            return x;
          })
        }
        this.pbx_token_details.api_token = this.userData.Organization.token;
        this.pbx_token_details.client_id = this.userData.organization_id;
      }
      this.loadscreen(false);
    },
    async initialData() {
      await this.getPbx()
    },
  },
  watch: {
    async userData(val) {
      await this.initialData()
    }
  },
  computed: {
    userData() {
      return useAppStore().userData;
    }
  },
  async mounted() {
    this.loadscreen(true);
    await this.initialData()
  },
};
</script>
<style lang=""></style>
