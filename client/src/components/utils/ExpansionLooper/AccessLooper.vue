<template lang="">
  <div v-if="moduleArray">
    <v-expansion-panels v-for="modules in moduleArray"  :key="modules.code" multiple density="compact">
      <v-expansion-panel class="mb-1">
        <v-expansion-panel-title
          expand-icon="mdi-plus-box-outline"
          collapse-icon="mdi-minus-box-outline"
          class="py-1"
        >
        <template v-slot:default="{  }">
            <v-checkbox  @click.stop v-model="user_access_actions"  :true-value="modules.code" :value="modules.code" :label="modules.name" hide-details=""></v-checkbox>
            <div width="100%"></div>
        </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text> 
            <v-row v-if="modules.actionDetails.length > 0">
                <v-col v-for="actions in modules.actionDetails" :key="actions.SystemAction.code" cols="4">
                    <v-checkbox v-model="user_access_actions" :true-value="modules.code + '-' + actions.SystemAction.code" :value="modules.code + '-' + actions.SystemAction.code" :label="actions.SystemAction.name" hide-details=""></v-checkbox>
                </v-col>
            </v-row>
            <l-access-looper :moduleArray="modules.children" v-model="user_access_actions" @updateActions="updateMyActions" ></l-access-looper> 
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: {
    moduleArray: Array,
    modelValue: Array
  },
  emits:["updateActions"],
  data() {
    return {
        panel: [],
        user_access_actions: [],
    }
  },
  watch: {
    modelValue(val){
      this.user_access_actions = val
    },
    user_access_actions(val){
        this.$emit("updateActions", val)
    },
  },
  methods: {
    updateMyActions(val){
        this.user_access_actions = val
    }
  },
  mounted(){
    this.user_access_actions = this.modelValue
  }
};
</script>
<style>
.v-expansion-panel-title .v-input .v-input__control{
  width: fit-content;
}
</style>
