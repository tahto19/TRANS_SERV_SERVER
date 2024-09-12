<template lang="">
  <v-card>
    <v-card-title class="py-5"><h2>Manual Entry</h2></v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-10">
      <v-form @submit.prevent="submit">
        <v-row>
          <v-col cols="3">
            <v-text-field
              variant="solo-filled"
              label="Accound Code"
              v-model="details.account_code"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <!-- <v-text-field
              variant="solo-filled"
              :rules="rule.required"
              label="Created At"
              v-model="details.createdAt"
            ></v-text-field> -->
          </v-col>
          <v-col cols="3"> </v-col>
          <v-col cols="3"> </v-col>
          <v-col cols="3">
            <v-text-field
              variant="solo-filled"
              :rules="rule.required"
              label="User ID"
              v-model="details.user_id"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              variant="solo-filled"
              :rules="rule.required"
              label="Group ID"
              v-model="details.group_id"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-file-input
              variant="solo-filled"
              label="Agent Audio"
              v-model="agentAudio"
            ></v-file-input>
          </v-col>
          <v-col cols="3">
            <v-text-field
              variant="solo-filled"
              :rules="rule.required"
              label="Caller ID"
              v-model="details.callerid"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              variant="solo-filled"
              :rules="rule.required"
              label="Call ID"
              v-model="details.call_id"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-file-input
              variant="solo-filled"
              label="Customer Audio"
              v-model="customerAudio"
            ></v-file-input>
          </v-col>
          <v-col cols="3">
            <v-select
              variant="solo-filled"
              label="Call Type"
              :rules="rule.required"
              :items="['incoming', 'outgoing']"
              v-model="details.call_type"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field
              variant="solo-filled"
              :rules="rule.required"
              label="Queue ID"
              v-model="details.queue_id"
            ></v-text-field>
          </v-col>
         
        
          <v-col cols="6">
            <v-file-input
              variant="solo-filled"
              label="Combine Audio"
              v-model="combineAudio"
            ></v-file-input>
          </v-col>
        </v-row>
        <br />
        <div class="d-flex justify-end">
          <v-btn color="primary" type="submit" :disabled="dialog"> Submit </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog" persistent>
    <v-chip class="d-flex justify-center" variant="text" color="white">
        <v-progress-circular color="primary" indeterminate></v-progress-circular>&nbsp;&nbsp;&nbsp;<h1>Waiting response from listener...</h1>
    </v-chip>
  </v-dialog>
</template>

<script>
import Cookies from "js-cookie";
import moment from "moment-timezone";

export default {
    emits: ["showNotification"],
    data() {
        return {
            dialog: false,
            test: "",
            agentAudio: null,
            customerAudio: null,
            combineAudio: null,
            org_id: null,
            details: {
                account_code: "",
                createdAt: "",
                user_id: "",
                group_id: "",
                callerid: null,
                call_id: "",
                call_type: "",
                queue_id: null,
                file: [this.agentAudio, this.customerAudio, this.combineAudio],
            },
        };
    },
    watch: {
        agentAudio(val) {
            this.details.file = [val, this.customerAudio, this.combineAudio];
        },
        customerAudio(val) {
            this.details.file = [this.agentAudio, val, this.combineAudio];
        },
        combineAudio(val) {
            this.details.file = [this.agentAudio, this.customerAudio, val];
        },
    },
    methods: {
        getBase64(file) {
            try {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            } catch (error) {

            }
        },
        async submit() {
            this.dialog = true;
            try {
                this.details.file = await Promise.all(
                    this.details.file.map(async (x) => {
                        if (x) {
                            const base64 = await this.getBase64(x[0]);
                            console.log(base64);
                            const _split = base64.split("base64,");
                            x = _split[1];
                        }

                        return x;
                    })
                );
            } catch (error) {

            }

            this.details.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

            const config = {
                // url: "/groups?organization_id=" + 2,
                url: "/callai/fromListener",
                data: this.details,
                method: "POST",
            };
            const res = await this.api_call(config);
            console.log(res.data);
            if (res.data && res.data.result) {
                this.dialog = false;
                this.details.callerid = ''
                this.details.call_id = ''
                this.details.file = []
                this.details.queue_id = null
                this.agentAudio = null,
                this.customerAudio = null,
                this.combineAudio = null,
                
                this.notif({
                    type: "success",
                    message: "Insert success",
                    title: "Success",
                });
            }


        },
    },
    mounted() {
        this.details.account_code = Cookies.get("_a_code"); 
    },
};
</script>

<style lang=""></style>
