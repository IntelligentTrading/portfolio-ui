<template>
  <div class="portfolio-container">
    <el-dialog :visible.sync="showPortfolios" width="70%">
      <div class="dialog-title" slot="title">Please choose your portfolio</div>
      <portfolio-choices></portfolio-choices>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="20" style="text-align:left">
        <label class="portfolio-strategy">Conservative Portfolio</label>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button size="mini" type="primary" @click="showPortfolios = true">Change</el-button>
      </el-col>
    </el-row>
    <el-row id="allocations-container">
      <allocation
        v-for="item in this.mergedDistributions.allocations"
        :key="item.coin"
        :allocation="item"
      ></allocation>
    </el-row>
    <label v-show="distribution.length == 0">No allocations</label>
  </div>
</template>
<script>
import api from "../../api/client";
import { mapMutations } from "vuex";
import Allocation from "./Allocation";
import mhelper from "../../util/mathHelper";
import PortfolioChoices from "./PortfolioChoices";

export default {
  data() {
    return {
      distribution: [],
      showPortfolios: false
    };
  },
  methods: {
    ...mapMutations(["setTotalBalance"]),
    loadDistribution: function() {
      return api
        .portfolio(localStorage.getItem("userId"))
        .then(distribution => {
          this.distribution = distribution.data;
        });
    }
  },
  mounted() {
    this.loadDistribution();
  },
  computed: {
    mergedDistributions: function() {
      if (this.distribution.length == 0) return [];

      let totalAmount = this.distribution.reduce((total, current) => {
        return total.data.value + current.data.value;
      });
      let mergedDistro = { total: totalAmount, allocations: [] };
      this.distribution.forEach(exchangeDistribution => {
        exchangeDistribution.data.allocations.forEach(allocation => {
          allocation.portion = mhelper.down(
            (allocation.portion * exchangeDistribution.data.value) /
              totalAmount,
            2
          );
          mergedDistro.allocations.push(allocation);
        });
      });
      this.setTotalBalance(totalAmount);
      mergedDistro.allocations.sort((a, b) => {
        return b.portion - a.portion;
      });
      return mergedDistro;
    }
  },
  components: { Allocation, PortfolioChoices }
};
</script>


<style scoped>
.portfolio-container {
  margin-top: 20px;
}

.portfolio-strategy {
  font-family: Lato;
  font-size: 21px;
}

#allocations-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 10px;
  padding-top: 20px;
}
#allocations-container > .el-card:first-child {
  grid-column-start: 1;
}

.dialog-title {
  font-size: 24px;
  color: cornflowerblue;
  font-weight: 600;
}
</style>

