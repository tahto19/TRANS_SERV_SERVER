<template lang="">
  <v-card class="bt-gray">
    <v-card-text>
      <v-data-table :headers="header" :items="item"
      :sort-by="[{ key: 'fullname', order: 'asc' }]"
          :must-sort="true"
      >
        <template v-slot:body="{ items, headers }">
          <template v-for="(h, key12) in items" :key="key12">
            <template v-for="(header, key) in headers" :key="key">
              <tr>
                <template v-for="(h, key1) in header" :key="key1">
                  <td v-if="h.key === 'fullname'">{{ items[key12][h.key] }}</td>
                  <td v-else>
                    <v-tooltip location="bottom" :text="`${items[key12][h.key] === undefined ? 0:Number(items[key12][h.key]).toFixed(2)}%`">
                      <template v-slot:activator="{ props }">
                        <v-progress-linear
                          :model-value="items[key12][h.key]"
                          :color="colorPicker(key1)"
                          v-bind="props"
                          height="25"
                        ></v-progress-linear>
                      </template>
                    </v-tooltip>
                  </td>
                </template>
              </tr>
            </template>
          </template>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
    props: ["data"],
    data() {
        return {
            header: [{ title: "Agent", key: "fullname", align: "start" }],
            item: [],
        };
    },
    watch: {
        data(val) {
            this.changeData(val);
        },
    },
    methods: {
        colorPicker(val) {
            let colorPicker = [
                "rgba(210,0,18,255)",
                "rgba(0,100,171,255)",
                "rgba(20,116,16,255)",
                "rgba(253,188,35,255)",
                "rgba(63,81,181,255)",
                "rgba(0,100,171,255)",
                "rgba(255,235,59,255)",
                "rgba(255,235,59,255)",
            ];
            return colorPicker[val];
        },
        changeData(val) {
            this.item = [];
            this.header = [{ title: "Agent", key: "fullname", align: "start" }];
            val.forEach((v) => {
                let findIndex = this.item.findIndex((x) => x.fullname === v.fullname);
                let findIndexHeader = this.header.findIndex(
                    (x) => x.key === v.Intent_Name
                );
                if (findIndexHeader === -1) {
                    this.header.push({
                        title: v.Intent_Name,
                        key: v.Intent_Name,
                        align: "start",
                        // value: () => return (<div></div>)
                    });
                }
                // <v-progress-linear :model-value="1" :color="red"height="25"></v-progress-linear >
                if (findIndex === -1) {
                    let temp = {};
                    temp["fullname"] = v.fullname;
                    temp[v.Intent_Name] = v.score / v.count;
                    temp[v.count] = v.count;
                    this.item.push(temp);
                } else {
                    this.item[findIndex][v.Intent_Name] = v.score / v.count;
                }
            });
        },
    },
};
</script>
<style lang=""></style>
