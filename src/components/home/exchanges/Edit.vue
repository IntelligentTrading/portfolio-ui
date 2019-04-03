<template>
  <div>
    <div class="fields-container">
      <label style="width:300px">
        Here you can modify your API KEY and Secret to match with your
        Exchange.
      </label>
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
      <el-button
        id="btn-reset-exchange"
        class="dialog-confirm-button"
        :disabled="!this.isValidExchange"
        :loading="this.isSaving"
        @click="edit"
      >RESET</el-button>

      <div class="delete-div">
        <el-button id="btn-remove-exchange" class="dialog-delete-button" @click="del" :loading="this.isDeleting">REMOVE</el-button>
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
      isSaving: false,
      isDeleting: false,
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
    edit: function() {
      this.isSaving = true;
      return this.editExchange({
        userId: localStorage["userId"],
        exchange: this.selectedExchange
      }).then(() => {
        this.selectedExchange.credentials.api_key = "";
        this.selectedExchange.credentials.secret = "";
        this.isSaving = false;
        this.$emit("updated");
      });
    },
    del: function() {
      return this.$confirm(
        "This will remove your exchange account from the portfolio. Do you want to proceed?",
        "Exchange Account Removal",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No"
        }
      )
        .then(() => {
          this.isDeleting = true;
          this.deleteExchange({
            userId: localStorage["userId"],
            exchange: this.selectedExchange
          }).then(() => {
            this.isDeleting = false;
            this.$emit("updated");
          });
        })
        .catch(() => this.$emit("cancel"));
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
