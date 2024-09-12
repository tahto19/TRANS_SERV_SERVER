import axios from "axios";
import Cookies from "js-cookie";
import _ from 'lodash';

export default {
  data() {
    return {
      access_code: [],
      access_default: ["PM-4iiAyYe", "SM-LDtf5NX", "SM-v9zZSBK", "SM-RrwFKy7", "SM-fGrTV1I"],
      timeoutId: [],
      user_actions: {
        create: "MA-CR",
        update: "MA-UP",
        delete: "MA-DE",
      },
      access_code_default: {
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
          wb: "SM-v9zZSBK",
          ac: "SM-RrwFKy7",
          rpts: "SM-fGrTV1I",
        },
      }
    };
  },
  methods: {
    check_access_control(){
        const getAccessCode = Cookies.get("_aksis_code")
        this.access_code = getAccessCode ? JSON.parse(Cookies.get("_aksis_code")) : this.access_code;
        if(this.access_code.length > 0){
            clearInterval(this.timeoutId)
        }
    },
  },
  mounted() {
    this.timeoutId = setInterval(()=>{
        this.check_access_control();
    },1000)
  },
};
