<template>
  <div class="home">
    <el-row style="display:flex">
      <img
        style="margin:20px;flex-align:start"
        width="36"
        height="36"
        src="https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/apple-touch-icon-72x72.png"
      >

      <el-button class="logout-button">Logout
        <font-awesome-icon icon="sign-out-alt"/>
      </el-button>
    </el-row>
    <el-row :gutter="24">
      <el-col :offset="4" :span="16">
        <el-row>
          <div style="display:flex;flex-direction:column">
            <el-row :gutter="24">
              <el-col :span="20" style="text-align:left">
                <label class="balance">
                  <span style="font-size:21px">BTC</span>
                  {{this.totalBalance}}
                </label>
              </el-col>
              <el-col :span="4" style="text-align:right">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    <span style="font-size:18px;font-family:Lato">Refresh</span>
                  </div>
                  <el-button circle class="action-button">
                    <font-awesome-icon icon="sync-alt"/>
                  </el-button>
                </el-tooltip>
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    <span style="font-size:18px;font-family:Lato">Rebalance</span>
                  </div>
                  <el-button circle class="action-button purple">
                    <font-awesome-icon icon="balance-scale"/>
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
            <label class="balance-text">Total amount for all the linked exchanges</label>

            <el-menu style="margin-top:20px" default-active="1" mode="horizontal">
              <el-menu-item index="1" @click="to('/home/portfolio')">Portfolio</el-menu-item>
              <el-menu-item index="2" @click="to('/home/exchange')">Exchange</el-menu-item>
            </el-menu>
            <router-view></router-view>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";

export default {
  name: "home",
  components: {},
  methods: {
    to: function(url) {
      this.$router.push(url);
    }
  },
  computed: {
    ...mapState(["totalBalance"])
  }
};
</script>

<style>
.nav-link {
  text-decoration: none;
  color: cornflowerblue;
  letter-spacing: 1px;
}

.balance {
  font-family: "Advent Pro";
  font-size: 52px;
  font-weight: 100;
  text-align: left;
}

.balance-text {
  text-align: left;
  font-size: 14px;
  color: gray;
  font-family: "Lato";
}

.logout-button {
  position: absolute;
  right: 10px;
  top: 10px;
  color: cornflowerblue !important;
}

.action-button {
  font-size: 21px !important;
  margin-top: 20px;
  background: white;
  color: cornflowerblue !important;
  width: 64px;
  height: 64px;
  box-shadow: 1px 1px 1px 1px lightgrey;
}

.action-button.purple {
  background: #ed0083;
  border: 0px;
  color: white !important;
}

.action-button.purple:hover {
  background: #cf78a2;
  border: 0px;
  color: white !important;
}
</style>

