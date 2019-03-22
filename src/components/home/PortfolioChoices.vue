<template>
  <div style="height:500px">
    <el-row :gutter="24" style="height:100%;display:flex;justify-content:center">
      <el-col :span="8" class="portfolio-type-container">
        <el-row
          class="portfolio-type"
          :class="this.portfolio === 'conservative' ? 'selected-portfolio':''"
        >Conservative</el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="cons"
            :labels="['BTC', 'ETH']"
            title
            type="pie"
            :colors="['#92D18B', '#5FAE57']"
            :dataSets="[
              {
                name: 'Some Data',
                values: [50, 50]
              }
            ]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:0 0 auto">
          <el-button
            class="select-button"
            :disabled="this.portfolio === 'conservative'"
            @click="switchPortfolio('conservative')"
          >Select</el-button>
        </el-row>
      </el-col>

      <el-col :span="8" class="portfolio-type-container">
        <el-row
          class="portfolio-type"
          :class="this.portfolio === 'mod-aggressive' ? 'selected-portfolio':''"
        >Moderately Aggressive</el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="mod"
            :labels="['BTC', 'ETH', 'LTC']"
            title
            type="pie"
            :colors="['#038AB7', '#0F6C8B', '#26596A']"
            :dataSets="[
              {
                name: 'Some Data',
                values: [50, 25, 25]
              }
            ]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:0 0 auto">
          <el-button
            class="select-button"
            :disabled="this.portfolio === 'mod-aggressive'"
            @click="switchPortfolio('mod-aggressive')"
          >Select</el-button>
        </el-row>
      </el-col>
      <el-col
        :span="8"
        class="portfolio-type-container"
        :class="this.portfolio === 'aggressive' ? 'selected-portfolio':''"
      >
        <el-row class="portfolio-type">Aggressive</el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="agg"
            :labels="['BTC', 'ETH', 'LTC', 'XRP', 'EOS']"
            title
            type="pie"
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
                values: [50, 20, 10, 10, 10]
              }
            ]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:0 0 auto">
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
          confirmButtonText: "Yes",
          cancelButtonText: "No",
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
  flex: 0 0 auto;
}

.portfolio-distribution {
  font-size: 18px;
  font-family: Roboto;
  flex: 1 1 0%;
}

.portfolio-type-container {
  border: solid 1px lightgray;
  margin: 10px;
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-row {
  margin: 10px;
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

.selected-portfolio {
  color: green;
  font-weight: bold
}
</style>
