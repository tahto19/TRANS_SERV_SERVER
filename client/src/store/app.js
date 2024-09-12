// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    userData: null,
    groupdID: null,
    pbx_token_details: null,
    reload_view: false,
  }),
  actions: {
    viewAnalysisReload(data){
      this.reload_view = data
    },
    updateUserData(data) {
      this.userData = data;
    },
    updateGroupID(data){
      this.groupdID = data
    },
    updatePbxToken(data){
      this.groupdID = data
    }
  },
});
