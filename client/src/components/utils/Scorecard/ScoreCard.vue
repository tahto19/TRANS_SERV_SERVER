<template lang="">
  <v-card class="mx-auto mt-7 px-3 pt-1 pb-1 bt-yellow" elevation="4">
    <v-card-title class="mb-2 border-bottom-1">
      <v-row>
        <v-col cols="6" md="2"> Agent Score Card </v-col>
        <v-col cols="6" md="3">
          <!-- <v-select
            class="my-intent-select"
            v-model="model_data"
            density="compact"
            :items="intents"
            item-title="Intent_Name"
            item-value="Intent_Name"
            variant="outlined"
            height="10"
            hide-details="auto"
          ></v-select> -->
          <v-select
            class="my-intent-select"
            v-model="model_data"
            density="compact"
            :items="intents"
            item-title="intent"
            item-value="intent"
            variant="outlined"
            height="10"
            hide-details="auto"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table-virtual :headers="headers" :items="data"
      :sort-by="[{ key: 'name', order: 'asc' }]"
      :must-sort="true"
      @click:row="rowClick"
      >
        <template
          v-for="(h, i) in total_headers"
          v-slot:[`item.${h}`]="{ item }"
        >
          <v-tooltip :text="item[h]">
            <template v-slot:activator="{ props }">
              <v-progress-linear
                :model-value="item[h]"
                :color="color_picker[i]"
                height="25"
                v-bind="props"
              ></v-progress-linear>
            </template>
          </v-tooltip>
        </template>

        <!-- =================== Old Function =================== -->
        <!-- <template
          v-for="(h, i) in total_headers"
          v-slot:[`item.${h}`]="{ item }"
        >
          <v-tooltip :text="`${_find(item.kpi, h)}`">
            <template v-slot:activator="{ props }">
              <v-progress-linear
                :model-value="_find(item.kpi, h)"
                :color="color_picker[i]"
                height="25"
                v-bind="props"
              ></v-progress-linear>
            </template>
          </v-tooltip>
        </template> -->

        <!-- <template v-slot:item.calls="{ item }">
          {{ item.kpi[0].count }}
        </template> -->
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ["data", "total_headers", "headers", "intents", "intentChange", "modelValue","update:modelValue",],
  data() {
    return {
      my_data: [],
      my_headers: [],
      my_total_headers: [],
      model_data: "",
    };
  },
  watch: {
    modelValue(val){
        this.model_data = val
    },
    model_data(event){
        this.$emit("update:modelValue",event)
    },
  },
  methods: {
    rowClick(item, row) {
      console.log('row clicked',row)
    },
    _find(data, h) {
      let x = data.find((x) => x.kpi.toLowerCase() == h);
      if (!x) {
        x = 0;
      } else {
        x = parseFloat(x.weightConverted).toFixed(2);
      }
      return x;
    },
  },
};
</script>
<style lang=""></style>
