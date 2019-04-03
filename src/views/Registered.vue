<template>
  <div>
    <label>Welcome</label>
    <el-button
      id="btn-get-started"
      type="text"
      @click="this.$router.push('/auth')"
      v-show="!this.success"
    >Click here and get started!</el-button>
  </div>
</template>
<script>
import api from "../api/client";
export default {
  props: ["signupToken"],
  data() {
    return {
      success: false
    };
  },
  mounted() {
    console.log("ok");
    return api.confirm(this.$props.signupToken).then(result => {
      this.success = result.status == 200;
    });
  }
};
</script>

