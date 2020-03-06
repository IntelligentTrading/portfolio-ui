<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <span style="text-align:left">
        Intelligent Trading Foundation (ITF) is no longer in a position to
        continue active development of our full suite of products.
        <br />However, our products will remain online and available for our
        users as long as possible. See more information
        <a
          href="https://intelligenttrading.org/itf-community-update-sep-2019"
          style="color:white;font-weight:800"
          >here</a
        >
      </span>
    </el-drawer>
    <img
      style="position: absolute;left: 0;margin: 20px;"
      width="52"
      src="https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/apple-touch-icon-72x72.png"
    />
    <el-row :gutter="24" class="login-container">
      <el-col class="login-form" :span="24">
        <div class="login-card-div">
          <component
            v-bind:is="activeAuthComponent"
            v-bind="{ magicLinkToken: this.$props.magicLinkToken }"
          ></component>
          <label
            v-show="authComponentsIdx % 2 == 0 && !this.$props.magicLinkToken"
            @click="switchView"
          >
            Not a member?
            <span class="clickable-label" id="create-account">
              <u>Create an account.</u>
            </span>
          </label>
          <label
            v-show="authComponentsIdx % 2 == 1 && !this.$props.magicLinkToken"
            @click="switchView"
          >
            Already a member?
            <span class="clickable-label" id="already-member">
              <u>Login.</u>
            </span>
          </label>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ResetPassword from "../components/auth/ResetPassword";
import { EventBus } from "../util/eventBus";

export default {
  props: ["magicLinkToken"],
  data() {
    return {
      authComponents: [Login, Register],
      authComponentsIdx: 0,
      drawer: true,
      direction: "ttb"
    };
  },
  methods: {
    switchView: function() {
      this.authComponentsIdx++;
    }
  },
  computed: {
    activeAuthComponent: function() {
      return this.$props.magicLinkToken
        ? ResetPassword
        : this.authComponents[this.authComponentsIdx % 2];
    }
  },
  components: {
    Login,
    Register,
    ResetPassword
  },
  mounted() {
    EventBus.$on("created", () => {
      this.authComponentsIdx = 0;
    });
  }
};
</script>

<style>
.el-drawer {
  background: linear-gradient(45deg, #8578f5 0, #457cf2 100%);
  color: whitesmoke;
  height: 100px !important;
}

#el-drawer__title {
  margin: 0px;
  padding: 0px;
}

.login-card {
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 30px;
  border-radius: 10px;
  background: white;
}

.login-container {
  display: flex;
  justify-content: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%;
  justify-content: center;
}

.auth-button {
  width: 180px;
  height: 50px;
  border-radius: 50px !important;
  font-size: 16px !important;
  background: cornflowerblue !important;
}

.auth-title {
  font-family: Lato;
  font-weight: 100;
  letter-spacing: 1px;
  margin: 20px;
  font-size: 32px;
  color: cornflowerblue;
}

.clickable-label {
  cursor: pointer;
  font-weight: 600;
  color: "cornflowerblue";
}

.el-button:disabled {
  opacity: 0.6;
}

.el-input__inner {
  height: 50px !important;
}

.login-card-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  padding: 30px 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 15px 0px lightgrey;
}
</style>
