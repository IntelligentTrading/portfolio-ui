<template>
  <div style="height:500px">
    <el-row :gutter="24" style="height:100%;display:flex;justify-content:center">
      <el-col :span="7" class="portfolio-type-container">
        <el-row class="portfolio-type">Conservative
          <font-awesome-icon
            icon="check"
            style="color:green"
            v-show="this.portfolio === 'conservative'"
          />
        </el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="cons"
            :labels="['BTC', 'ETH']"
            title
            type="pie"
            :height="350"
            :colors="['#92D18B', '#5FAE57']"
            :dataSets="[
              {
                name: 'Some Data',
                chartType: 'bar',
                values: [50, 50]
              }
            ]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:1">
          <el-button
            class="select-button"
            :disabled="this.portfolio === 'conservative'"
            @click="switchPortfolio('conservative')"
          >Select</el-button>
        </el-row>
      </el-col>

      <el-col :span="7" class="portfolio-type-container">
        <el-row class="portfolio-type">Moderately Aggressive
          <font-awesome-icon
            icon="check"
            style="color:green"
            v-show="this.portfolio === 'mod-aggressive'"
          />
        </el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="mod"
            :labels="['BTC', 'ETH', 'LTC']"
            title
            type="pie"
            :height="350"
            :colors="['#038AB7', '#0F6C8B', '#26596A']"
            :dataSets="[
              {
                name: 'Some Data',
                values: [50, 25, 25]
              }
            ]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:1">
          <el-button
            class="select-button"
            :disabled="this.portfolio === 'mod-aggressive'"
            @click="switchPortfolio('mod-aggressive')"
          >Select</el-button>
        </el-row>
      </el-col>
      <el-col :span="7" class="portfolio-type-container">
        <el-row class="portfolio-type">Aggressive
          <font-awesome-icon
            icon="check"
            style="color:green"
            v-show="this.portfolio === 'aggressive'"
          />
        </el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="agg"
            :labels="['BTC', 'ETH', 'LTC', 'XRP', 'EOS', 'ADA']"
            title
            type="pie"
            :height="350"
            :colors="[
              '#9B2E00',
              '#C53B00',
              '#D33F00',
              '#7B2A00',
              '#FF9263',
              '#FD7439',
              '#FF4C00'
            ]"
            :dataSets="[
              {
                name: 'Some Data',
                values: [50, 10, 10, 10, 10, 10]
              }
            ]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:1">
          <el-button
            class="select-button"
            :disabled="this.portfolio === 'aggressive'"
            @click="switchPortfolio('aggressive')"
          >Select</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "../../api/client";
import { mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["portfolio"])
  },
  methods: {
    ...mapMutations(["setPortfolio"]),
    switchPortfolio: function(packLabel) {
      this.$confirm(
        `This will automatically change your holdings to the selected portfolio. Continue?`,
        "Portfolio selection",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      ).then(() => {
        return api
          .changePack(localStorage["userId"], packLabel)
          .then(result => {
            this.setPortfolio(packLabel);
            this.$message.success(result.data);
          });
      });
    }
  }
};
</script>

<style scoped>
.portfolio-type {
  font-size: 18px;
  font-family: Lato;
}

.portfolio-distribution {
  font-size: 18px;
  font-family: Roboto;
}

.portfolio-type-container {
  border: solid 1px lightgray;
  margin: 10px;
  border-radius: 20px;
  height: 100%;
}

.el-row {
  margin: 20px;
}

.select-button {
  width: 200px;
  background: cornflowerblue;
  color: white;
  border: 0px;
}
.frappe-chart .chart-legend {
  display: none;
}
</style>
