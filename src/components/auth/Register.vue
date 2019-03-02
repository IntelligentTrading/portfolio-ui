<template>
  <el-form
    class="login-card"
    :model="registerForm"
    status-icon
    ref="registerForm"
  >
    <label class="auth-title">Create Account</label>
    <el-form-item
      prop="email"
      :rules="[{ required: true, message: 'Email is required' }]"
    >
      <el-input v-model="registerForm.email" placeholder="email"></el-input>
    </el-form-item>
    <el-form-item
      prop="pass"
      :rules="[
        { required: true, message: 'Password is required' },
        { validator: passwordsMatch, message: 'Passwords don\'t match' }
      ]"
    >
      <el-input
        type="password"
        placeholder="password"
        v-model="registerForm.pass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="checkPass"
      :rules="[
        { required: true, message: 'Password is required' },
        { validator: passwordsMatch, message: 'Passwords don\'t match' }
      ]"
    >
      <el-input
        type="password"
        placeholder="repeat password"
        v-model="registerForm.checkPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item style="text-align:left">
      <el-checkbox v-model="registerForm.termsAcceptance"
        >I've read and accept the terms and conditions.</el-checkbox
      >
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="auth-button"
        @click="register"
        :disabled="!completed"
        :loading="isLoading"
        >Sign Up</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import api from "../../api/client";

export default {
  data() {
    return {
      registerForm: {
        pass: "",
        checkPass: "",
        email: "",
        termsAcceptance: false
      },
      isLoading: false
    };
  },
  methods: {
    register() {
      this.isLoading = true;
      return api
        .register(this.registerForm.email, this.registerForm.pass)
        .then(() => {
          this.isLoading = false;
          this.$message.success(`User ${this.registerForm.email} created.`);
          setTimeout(() => {
            this.$router.push("/auth");
          }, 1000);
        })
        .catch(() => {
          this.$message.error("Something went wrong!");
          this.isLoading = false;
        });
    },
    passwordsMatch: function(rule, value, cb) {
      if (value === "") {
        cb(new Error("Please input the password again"));
      } else if (this.registerForm.checkPass !== this.registerForm.pass) {
        cb(new Error("Two inputs don't match!"));
      } else {
        if (rule.field === "checkPass")
          this.$refs.registerForm.validateField("pass");

        cb();
      }
    }
  },
  computed: {
    completed: function() {
      return (
        this.registerForm.checkPass === this.registerForm.pass &&
        this.registerForm.checkPass !== "" &&
        this.registerForm.email !== "" &&
        this.registerForm.termsAcceptance
      );
    }
  }
};
</script>
<style></style>
