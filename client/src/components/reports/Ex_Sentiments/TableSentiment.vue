<template lang="">
  <v-card class="mx-auto px-3 pt-1 pb-1 bt-gray" max-width="100%" elevation="4">
    <v-card-title class="d-flex justify-space-between mb-2">
   
    </v-card-title>
    <v-card-text>   
      <c-horizontal-bar-stack :chart="agent_dataset" /> 
        <!-- <v-data-table
            :headers="header"
            :items="item"
          ></v-data-table> -->
        </v-card-text>
  </v-card>
</template>
<script>
export default {
    props: ["data"],
  data() {
    
    return {
      agent_dataset: {},
  header:[{ title: "Agent", key: "fullname", align: "start" }],
 item:[],
    };
  },
  watch: {
    data(val){
      this.chartHorizontal(val)
    }
    // data(val) {
    //     this.item =[];
    //     this.header = [{ title: "Agent", key: "fullname", align: "start" }]
    //     val.forEach((v,i)=>{
       
    //         let findIndex = this.item.findIndex((x) =>x.fullname===v.Agent.fullname)
    //         let findIndexHeader = this.header.findIndex((x) =>x.key===this.capitalizeFirstLetter(v.SentiAnylses[0].sentiment_name))
    //         if(findIndexHeader === -1){
    //             this.header.push({title: this.capitalizeFirstLetter(v.SentiAnylses[0].sentiment_name), key: this.capitalizeFirstLetter(v.SentiAnylses[0].sentiment_name), align: "start"})
    //         }
          
    //         if(findIndex === -1){
    //             let temp = {}
    //             temp['fullname'] = v.Agent.fullname
    //             temp[this.capitalizeFirstLetter(v.SentiAnylses[0].sentiment_name)] = v.count
    //             this.item.push(temp)
    //         }  
    //         else{
    //             this.item[findIndex][this.capitalizeFirstLetter(v.SentiAnylses[0].sentiment_name)] =  v.count
    //         }
        
    //     })

    // },
  },
  methods:{
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    chartHorizontal(val){
      const agents = {
        datasets: [],
        labels: [],
      }
      const labels = []
      const sentiments = []
      const datasets = []
        console.log(val)
        val.map( x => {
        const name = x.Agent.fullname;
        const _filter = labels.filter(q => q == name)
        if(_filter.length == 0){
          labels.push(name);
        }

        const sentiment = this.capitalizeFirstLetter(x.SentiAnylses[0].sentiment_name);
        const _filter2 = sentiments.filter(q => q == sentiment)
        if(_filter2.length == 0){
          sentiments.push(sentiment);
        }
      })
      
      sentiments.sort()

      sentiments.map((x, p) => {
        const d = [];
        labels.map((c, i) => {
          d.push(null);
          val.map(v => {
            if(c == v.Agent.fullname){
              const sentiment_name = this.capitalizeFirstLetter(v.SentiAnylses[0].sentiment_name)
              if(x == sentiment_name){
                d[i] = v.count
              }
            }
          })
        })
        datasets.push(
          {
            backgroundColor: this.sentiment_color[p],
            label: x,
            data: d,
            barPercentage: 0.5,
            padding: 1,
          }
        )
      })
      console.log(labels)
      console.log(sentiments)
      console.log(datasets)

      agents.labels = labels
      agents.datasets = datasets

      this.agent_dataset = {
        id_name: "agent",
        data: agents
      }
    }
  }
};
</script>
<style lang=""></style>
