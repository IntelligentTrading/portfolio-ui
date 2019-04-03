<template>
  <div class="forgot-box">
    <label class="help-title">Forgot your password?</label>
    <label
      class="help-text"
    >Enter your registered email and we will send you a link to reset your password.</label>
    <div style="text-align:left">
      <el-input
        style="width:50%;display:inline-block;margin-right:10px"
        v-model="email"
        placeholder="Email address"
      ></el-input>
      <el-button
        id="btn-forgot-password"
        type="primary"
        class="auth-button"
        :disabled="email == ''"
        @click="send"
        :loading="isLoading"
      >Send</el-button>
    </div>
  </div>
</template>
<script>
import api from "../api/client";

export default {
  data() {
    return {
      email: "",
      isLoading: false
    };
  },
  methods: {
    send: function() {
      this.isLoading = true;
      return api
        .forgot(this.email)
        .then(() => {
          this.isLoading = false;
          this.$message.info("Email sent");
          setTimeout(() => this.$router.push("/auth"), 2000);
        })
        .catch(() => {
          this.isLoading = false;
          this.$message.info("Email sent");
        });
    }
  }
};
</script>
<style>
.forgot-box {
  width: 50%;
  position: absolute;
  top: 10%;
  left: 30%;
  flex-direction: column;
  display: flex;
  justify-content: center;
}

.help-text {
  margin: 20px 0px;
  text-align: left;
  font-family: Lato;
}

.help-title {
  color: cornflowerblue;
  font-size: 32px;
  font-family: Lato;
  text-align: left;
}

.auth-button {
  margin: 20px 0px;
}
</style>
