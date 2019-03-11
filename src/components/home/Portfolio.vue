<template>
  <div class="portfolio-container">
    <el-dialog :visible.sync="showPortfolios" width="70%">
      <div class="dialog-title" slot="title">Please choose your portfolio</div>
      <portfolio-choices></portfolio-choices>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="12" style="text-align:left">
        <label class="portfolio-strategy">{{this.portfolioLabel}}</label>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button type="text" icon="el-icon-setting" @click="showPortfolios = true">CHANGE</el-button>
        <el-button type="text" icon="el-icon-menu"></el-button>
        <el-button type="text" icon="el-icon-search"></el-button>
      </el-col>
    </el-row>
    <el-row id="allocations-container">
      <allocation
        v-for="item in this.mergedDistributions.allocations"
        :key="item.coin"
        :allocation="item"
      ></allocation>
    </el-row>
    <label v-show="this.distribution.length == 0">No allocations, you must
      <el-button
        type="text"
        @click="$router.push({name:'exchange', params:{startWithAdd:true}})"
      >add an exchange</el-button>.
    </label>
  </div>
</template>
<script>
import Allocation from "./Allocation";
import mhelper from "../../util/mathHelper";
import PortfolioChoices from "./PortfolioChoices";
import { mapState } from "vuex";

export default {
  data() {
    return {
      showPortfolios: false
    };
  },
  computed: {
    ...mapState(["distribution", "totalBalance", "portfolio"]),
    mergedDistributions: function() {
      if (Object.getOwnPropertyNames(this.distribution).length == 0) return [];

      let allocationsWithKey = {};
      let mergedDistro = { total: this.totalBalance, allocations: [] };
      Object.getOwnPropertyNames(this.distribution).forEach(
        exchangeDistribution => {
          const currentExchangeDistribution = this.distribution[
            exchangeDistribution
          ];

          if (currentExchangeDistribution.allocations == null) return [];

          currentExchangeDistribution.allocations.forEach(allocation => {
            allocation.portion = mhelper.down(
              (allocation.portion * currentExchangeDistribution.value) /
                this.totalBalance,
              4
            );
            if (allocationsWithKey[allocation.coin]) {
              allocationsWithKey[allocation.coin].portion += allocation.portion;
              allocationsWithKey[allocation.coin].amount += allocation.amount;
            } else {
              allocationsWithKey[allocation.coin] = allocation;
            }
          });
        }
      );

      Object.getOwnPropertyNames(allocationsWithKey).forEach(p => {
        mergedDistro.allocations.push(allocationsWithKey[p]);
      });
      mergedDistro.allocations.sort((a, b) => {
        return b.portion - a.portion;
      });
      return mergedDistro;
    },
    portfolioLabel: function() {
      const labels = ["Conservative", "Moderately Aggressive", "Aggressive"];
      const dblabels = ["conservative", "mod-aggressive", "aggressive"];
      return labels[dblabels.indexOf(this.portfolio)];
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

.search-coin {
  width: 180px;
  margin-left: 20px;
}
</style>

