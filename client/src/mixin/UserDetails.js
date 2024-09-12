import axios from "axios";
import Cookies from "js-cookie";
import { useAppStore } from "@/store/app.js";

export default {
    data(){
        return {

        }
    },
    methods: {
        async getUserDetails() {
            const id = Cookies.get("UID");
            const config = {
              url: "https://ai-insight.etpbx.com/general-info/user/get/" + id,
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            };
      
            const res = await axios.request(config);
            if (res.data.response) {
              useAppStore().updateUserData(res.data.details);
            }
          },
    },
    created() {
        this.getUserDetails()
    },
}