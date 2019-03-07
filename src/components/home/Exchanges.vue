<template>
  <div id="exchanges-container">
    <el-dialog :visible.sync="showAddNewExchange" width="40%">
      <div class="dialog-title" slot="title">Add Exchange Account</div>
      <add></add>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="20" style="text-align:left;font-family:lato;font-size:21px">
        <label>Your exchanges</label>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="text" icon="el-icon-plus" @click="showAddNewExchange = true">ADD EXCHANGE</el-button>
      </el-col>
    </el-row>
    <el-row id="exchanges-data-container">
      <exchange v-for="item in this.linkedExchanges" :key="item._id" :exchangeData="item"></exchange>
    </el-row>
    <label
      v-show="this.user.exchanges == null || this.user.exchanges.length == 0"
    >No exchanges selected</label>
  </div>
</template>
<script>
import Exchange from "./Exchange";
import Add from "./exchanges/Add";
import { mapState } from "vuex";

export default {
  data() {
    return {
      showAddNewExchange: false
    };
  },
  components: { Exchange, Add },
  computed: {
    ...mapState(["user", "supportedExchanges"]),
    linkedExchanges: function() {
      this.showAddNewExchange = false;
      return this.user.exchanges;
    }
  }
};
</script>
<style>
#exchanges-container {
  margin-top: 20px;
}

#exchanges-data-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 10px;
  padding-top: 20px;
}

#exchanges-data-container > .el-card:first-child {
  grid-column-start: 1;
}

.credentials {
  width: 300px !important;
  margin: 10px;
}

.fields-container {
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dialog-confirm-button {
  background: cornflowerblue !important;
  color: white !important;
  width: 190px;
  height: 45px;
  letter-spacing: 1px;
  border: none !important;
}

.dialog-confirm-button:hover {
  background: rgba(91, 145, 247, 0.918) !important;
}
</style>

