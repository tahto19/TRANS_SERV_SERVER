<template lang="">
  <div class="notification">
    <template v-for="n in notifications">
      <v-alert v-if="n.show" :type="n.type" :title="n.title" elevation="6">
        {{ n.message }}
      </v-alert>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      notifications: [],
    };
  },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  watch: {
    modelValue(val) {
      val.show = true;
      this.notifications.push(val);
      let index = this.notifications.indexOf(val);
      setTimeout(() => {
        // this.notifications.splice(index, 1)
        this.notifications[index].show = false;
        val.show = false;
      }, 4000);
    },
  },
};
</script>
<style lang=""></style>
