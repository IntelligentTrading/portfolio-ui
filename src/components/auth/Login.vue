<template>
  <el-form
    class="login-card"
    :model="loginForm"
    validate-on-rule-change
    status-icon
    ref="loginForm"
  >
    <label class="auth-title">Login</label>
    <el-form-item
      prop="email"
      :rules="[{ required: true, message: 'Email is required' }]"
    >
      <el-input v-model="loginForm.email" placeholder="email"></el-input>
    </el-form-item>
    <el-form-item
      prop="pass"
      :rules="[{ required: true, message: 'Password is required' }]"
    >
      <el-input
        type="password"
        placeholder="password"
        v-model="loginForm.pass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item style="text-align:right">
      <label
        @click="forgotPassword"
        style="font-weight:600;color:cornflowerblue;cursor:pointer;"
        >I forgot my password</label
      >
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="auth-button"
        :disabled="!submittable"
        @click="login"
        :loading="isLoading"
        >Login</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import api from "../../api/client";
import { mapMutations,mapActions } from "vuex";

export default {
  data() {
    return {
      loginForm: {
        pass: "",
        email: ""
      },
      isLoading: false
    };
  },
  methods: {
    ...mapMutations(["setUser"]),
    ...mapActions(["refreshPortfolio"]),
    login: function() {
      this.isLoading = true;
      return api
        .login(this.loginForm.email, this.loginForm.pass)
        .then(payload => {
          this.isLoading = false;
          localStorage.setItem("token", payload.data.token);
          localStorage.setItem("pubKey", payload.data.pubKey);
          localStorage.setItem("userId", payload.data.user._id);

          this.setUser(payload.data.user);
          this.$router.push("/home");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.message.includes("401"))
            this.$message.error("Wrong username and/or password");
          else this.$message.error(err);
        });
    },
    forgotPassword: function() {
      this.$router.push("/forgot");
    }
  },
  computed: {
    submittable: function() {
      return this.loginForm.pass !== "" && this.loginForm.email !== "";
    }
  }
};
</script>
<style></style>
