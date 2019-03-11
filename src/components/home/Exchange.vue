<template>
  <el-card style="height:150px">
    <el-row :gutter="24" style="flex-grow:1">
      <el-col :span="20" style="display:flex; flex-direction:column">
        <div class="exchange-name">
          <label style="vertical-align: super">{{this.exchangeName}}</label>
        </div>
      </el-col>
      <el-col :span="4">
        <img :src="this.exchangeIcon">
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="20">
        <div class="single-balance">BTC {{this.amount}}</div>
      </el-col>
      <el-col :span="4">
        <el-button type="text" @click="showEditDialog = true">Edit</el-button>
        <el-dialog :visible.sync="showEditDialog" width="40%">
          <div class="dialog-title" slot="title">{{'Edit '+this.exchangeName+' Account'}}</div>
          <edit :exchangeData="this.$props.exchangeData" v-on:updated="showEditDialog = false"></edit>
        </el-dialog>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { mapState } from "vuex";
import Edit from "./exchanges/Edit";
import sUtil from "../../util/stringUtil.js";

export default {
  data() {
    return {
      showEditDialog: false
    };
  },
  props: ["exchangeData"],
  computed: {
    ...mapState(["distribution", "supportedExchanges"]),
    exchangeName: function() {
      return sUtil.toTitleCase(this.$props.exchangeData.label);
    },
    amount: function() {
      const exchange = this.distribution[this.exchangeName.toLowerCase()];
      if (exchange) return exchange.value;
      return 0;
    },
    exchangeIcon: function() {
      let supportedExchange = this.supportedExchanges.find(
        se => se.label == this.exchangeName
      );
      if (supportedExchange) return supportedExchange.icon;
      return "";
    }
  },
  components: { Edit }
};
</script>
<style>
.symbol {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 20px;
}

.key-preview {
  font-family: "Lato";
  font-weight: 200;
  margin-left: 10px;
  font-size: 20px;
  text-align: left;
}

.exchange-name {
  font-size: 21px;
  text-align: left;
  font-family: lato;
}

.single-balance {
  font-family: advent pro;
  font-size: 26px;
  text-align: left;
}

.el-card__body {
  height: 80% !important;
  display: flex;
  flex-direction: column;
}
</style>