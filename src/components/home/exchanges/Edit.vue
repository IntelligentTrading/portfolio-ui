<template>
  <div>
    <div class="fields-container">
      <label
        style="width:300px"
      >Here you can modify your API KEY and Secret to match with your Exchange.</label>
      <el-input
        class="credentials"
        :type="api_key_field_type"
        placeholder="API KEY"
        v-model="selectedExchange.credentials.api_key"
      >
        <i slot="suffix" @click="showPassword('api_key')" class="el-input__icon el-icon-view"></i>
      </el-input>
      <el-input
        class="credentials"
        :type="secret_field_type"
        placeholder="Secret"
        v-model="selectedExchange.credentials.secret"
      >
        <i slot="suffix" @click="showPassword('secret')" class="el-input__icon el-icon-view"></i>
      </el-input>
      <div style="display:flex;flex-direction:row;margin-top:10px">
        <el-button
          type="warning"
          icon="el-icon-warning"
          @click="this.testConnection"
          :loading="this.isTesting"
        >TEST</el-button>
        <el-button
          class="dialog-confirm-button"
          :disabled="!this.isValidExchange"
          @click="edit"
        >RESET</el-button>
      </div>
      <label
        style="margin:10px"
        :style="this.dialogMessage.success ? 'color:green': 'color:red'"
        v-show="this.dialogMessage.text != ''"
      >{{this.dialogMessage.text}}</label>
      <div class="delete-div">
        <el-button class="dialog-delete-button" @click="del">DELETE</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import api from "../../../api/client";

export default {
  props: ["exchangeData"],
  data() {
    return {
      api_key_field_type: "password",
      secret_field_type: "password",
      selectedExchange: {
        label: this.$props.exchangeData.label,
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
    isValidExchange() {
      return (
        this.selectedExchange.credentials.api_key != "" &&
        this.selectedExchange.credentials.secret != ""
      );
    }
  },
  methods: {
    ...mapMutations(["setExchanges"]),
    ...mapActions(["editExchange", "deleteExchange", "refreshPortfolio"]),
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
    edit: function() {
      return this.editExchange({
        userId: localStorage["userId"],
        exchange: this.selectedExchange
      }).then(() => {
        this.$emit("updated");
      });
    },
    del: function() {
      return this.$confirm(
        "This will unlink your exchange account with the portfolio. Do you want to proceed?",
        "Exchange account deletion",
        {
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel"
        }
      )
        .then(() => {
          this.deleteExchange({
            userId: localStorage["userId"],
            exchange: this.selectedExchange
          }).then(() => {
            this.$emit("updated");
          });
        })
        .catch(err => this.$emit("cancel"));
    }
  }
};
</script>
<style>
.delete-div {
  border-top: 1px solid;
  width: 300px;
  margin-top: 20px;
  padding-top: 20px;
}

.dialog-delete-button {
  background: rgb(238, 77, 72) !important;
  color: white !important;
  height: 45px;
  letter-spacing: 1px;
  border: none !important;
  width: 100%;
}
</style>
