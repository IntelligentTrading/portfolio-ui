<template>
  <div class="home">
    <el-row style="display:flex">
      <img
        style="margin:20px;flex-align:start"
        width="36"
        height="36"
        src="https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/apple-touch-icon-72x72.png"
      >
      <label class="email">{{ this.user.email }}</label>
      <el-button class="logout-button" @click="logout">Logout
        <font-awesome-icon icon="sign-out-alt"/>
      </el-button>
    </el-row>
    <el-row :gutter="24">
      <el-col :offset="4" :span="16">
        <el-row>
          <div style="display:flex;flex-direction:column">
            <el-row :gutter="24">
              <el-col :span="18" style="text-align:left">
                <label class="balance">
                  <span style="font-size:21px">BTC</span>
                  <span v-show="!this.refreshingPortfolio">
                    {{
                    this.totalBalance
                    }}
                  </span>
                  <el-tag
                    style="margin-left:20px;font-family:Lato"
                    v-show="this.rebalancingStatus.status != null"
                    :type="this.rebalancingStatus.type"
                  >Rebalancing {{ this.rebalancingStatus.status }}</el-tag>
                </label>
                <loader style="margin:10px" v-show="this.refreshingPortfolio"></loader>
              </el-col>
              <el-col :span="6" class="action-buttons-container">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    <span style="font-size:18px;font-family:Lato">Refresh</span>
                  </div>
                  <el-button
                    circle
                    class="action-button"
                    @click="refresh"
                    :loading="this.refreshingPortfolio"
                  >
                    <font-awesome-icon icon="sync-alt" v-show="!this.refreshingPortfolio"/>
                  </el-button>
                </el-tooltip>

                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    <span style="font-size:18px;font-family:Lato">Rebalance</span>
                  </div>
                  <el-button
                    circle
                    class="action-button"
                    :loading="this.rebalancing"
                    @click="rebalance"
                  >
                    <font-awesome-icon icon="balance-scale" v-show="!this.rebalancing"/>
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
            <label class="balance-text">Total amount for all the linked exchanges</label>
            <el-alert
              style="margin-top:10px"
              :title="
                'Your configuration is not complete, check you exchange accounts and portfolio settings.'
              "
              v-show="
                this.user.exchanges == null || this.user.exchanges.length == 0
              "
              type="error"
              :closable="false"
            ></el-alert>
            <el-menu
              style="margin-top:20px"
              :default-active="this.currentTabIndex"
              mode="horizontal"
            >
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
import { mapState, mapMutations, mapActions } from "vuex";
import { EventBus } from "../util/eventBus.js";
import api from "../api/client";
import Loader from "../components/others/Loader";
import io from "socket.io-client";

export default {
  name: "home",
  data() {
    return {
      socket: {},
      refreshingPortfolio: false,
      error: "",
      currentTabIndex: "1",
      rebalancing: false,
      rebalancingStatus: {}
    };
  },
  components: { Loader },
  methods: {
    ...mapMutations(["setUser", "setDistribution", "cleanup"]),
    ...mapActions(["refreshPortfolio"]),
    to: function(url) {
      this.$router.push(url);
    },
    reloadUser: function() {
      return api.user(localStorage.getItem("userId")).then(user => {
        this.setUser(user.data);
        if (this.user.exchanges.length == 0) this.error = "Set an exchange!";
        else if (this.user.portfolio.packs.length == 0)
          this.error = "Set a portfolio strategy!";
        else this.error = "";
      });
    },
    rebalance: function() {
      this.rebalancing = true;
      this.rebalancingStatus = {};

      return api
        .rebalance(localStorage["userId"])
        .then(result => {
          this.rebalancingStatus = extractRebalancingStatus(result.data);
          this.rebalancing = false;
        })
        .catch(() => {
          this.rebalancingStatus = { status: "Error", type: "danger" };
          this.rebalancing = false;
        });
    },
    refresh: function() {
      this.refreshingPortfolio = true;
      this.rebalancingStatus = {};

      return this.refreshPortfolio(localStorage["userId"])
        .then(() => {
          if (this.distribution.pending.length > 0)
            this.rebalancingStatus = extractRebalancingStatus("queued");

          this.refreshingPortfolio = false;
        })
        .catch(() => {
          this.refreshingPortfolio = false;
        });
    },
    logout: function() {
      localStorage.clear();
      this.$router.push("/");
    }
  },
  mounted() {
    console.log(`Connecting socket to ${process.env.VUE_APP_SOCKET}`);
    this.socket = io(
      `${process.env.VUE_APP_SOCKET}?user_id=${localStorage["userId"]}`,
      {
        transports: ["polling", "websocket"]
      }
    );

    this.socket.on("message", payload => {
      if (payload.type == "rebalancing") {
        this.rebalancingStatus = extractRebalancingStatus(payload.data);
      }
    });

    this.socket.on("heartbeat", () => {
      console.log("♡");
    });

    // navigation guard
    EventBus.$on("hashchange", args => {
      if (args[0].path.includes("home")) {
        this.currentTabIndex = args[0].path.split("/")[2].includes("exchange")
          ? "2"
          : "1";
      }
    });
    if (!this.user.email) this.reloadUser();
    this.refresh();
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  computed: {
    ...mapState(["totalBalance", "user", "portfolio", "distribution"])
  }
};

function extractRebalancingStatus(message) {
  if (message.includes("queued")) return { status: "queued", type: "warning" };
  else if (message.includes("complete"))
    return { status: "complete", type: "success" };
  else if (message.includes("progress"))
    return { status: "progress", type: "info" };
  else return {};
}
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

.action-buttons-container {
  text-align: right;
  padding: 0px !important;
}

.el-message-box {
  font-family: Lato;
}

.email {
  right: 180px;
  position: absolute;
  top: 20px;
  font-family: Lato;
}

.el-dialog__header {
  text-align: -webkit-center;
}

.dialog-title {
  font-size: 18px;
  width: 300px;
  border-bottom: 2px solid;
  border-color: cornflowerblue;
  color: cornflowerblue;
  padding-bottom: 20px;
}
</style>
