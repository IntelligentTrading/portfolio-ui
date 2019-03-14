<template>
  <div>
    <div class="fields-container">
      <el-select
        class="credentials"
        v-model="selectedExchange.label"
        placeholder="Select Exchange"
      >
        <el-option
          v-for="item in this.supportedExchanges"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        ></el-option>
      </el-select>
      <label v-show="this.isAlreadyConfigured" style="color:red"
        >This exchange is already linked!</label
      >
      <el-input
        class="credentials"
        :type="api_key_field_type"
        placeholder="API KEY"
        v-model="selectedExchange.credentials.api_key"
      >
        <i
          slot="suffix"
          @click="showPassword('api_key')"
          class="el-input__icon el-icon-view"
        ></i>
      </el-input>
      <el-input
        class="credentials"
        :type="secret_field_type"
        placeholder="Secret"
        v-model="selectedExchange.credentials.secret"
      >
        <i
          slot="suffix"
          @click="showPassword('secret')"
          class="el-input__icon el-icon-view"
        ></i>
      </el-input>
      <div style="display:flex;flex-direction:row;margin-top:10px">
        <el-button
          type="warning"
          icon="el-icon-warning"
          @click="this.testConnection"
          :loading="this.isTesting"
          >TEST</el-button
        >
        <el-button
          class="dialog-confirm-button"
          :disabled="!this.isValidExchange"
          @click="add"
          >SAVE</el-button
        >
      </div>
      <label
        style="margin:10px"
        :style="this.dialogMessage.success ? 'color:green' : 'color:red'"
        v-show="this.dialogMessage.text != ''"
        >{{ this.dialogMessage.text }}</label
      >
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import api from "../../../api/client";

export default {
  data() {
    return {
      api_key_field_type: "password",
      secret_field_type: "password",
      selectedExchange: {
        label: "",
        enabled: true,
        credentials: { api_key: "", secret: "" }
      },
      isTesting: false,
      dialogMessage: {
        text: "",
        success: false
      }
    };
  },
  computed: {
    ...mapState(["user", "supportedExchanges"]),
    isAlreadyConfigured() {
      if (!this.user || !this.user.exchanges) return false;
      return this.user.exchanges.some(
        ex =>
          ex.label.toLowerCase() === this.selectedExchange.label.toLowerCase()
      );
    },
    isValidExchange() {
      return (
        !this.isAlreadyConfigured &&
        this.selectedExchange.label != "" &&
        this.selectedExchange.credentials.api_key != "" &&
        this.selectedExchange.credentials.secret != ""
      );
    }
  },
  methods: {
    ...mapMutations(["setExchanges"]),
    ...mapActions(["addExchange"]),
    showPassword: function(field) {
      this[field + "_field_type"] =
        this[field + "_field_type"] == "text" ? "password" : "text";
    },
    testConnection: function() {
      this.isTesting = true;
      return api.exchange
        .testConnection(this.selectedExchange)
        .then(testResult => {
          this.isTesting = false;
          this.dialogMessage.success = testResult.success;
          this.dialogMessage.text = testResult.message;
        });
    },
    add: function() {
      return this.addExchange({
        userId: localStorage["userId"],
        exchange: this.selectedExchange
      }).then(() => this.$emit("added"));
    }
  }
};
</script>
