<template>
  <div class="portfolio-container">
    <el-dialog :visible.sync="showPortfolios" width="90%" class="portfolio-dialog">
      <div class="dialog-title" slot="title">Please choose your portfolio</div>
      <portfolio-choices></portfolio-choices>
    </el-dialog>
    <el-dialog :visible.sync="showCustom" width="90%">
      <div class="dialog-title" slot="title">Custom Coins Allocation</div>
      <custom-portfolio></custom-portfolio>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="12" style="text-align:left">
        <label class="portfolio-strategy">{{ this.portfolioLabel }}</label>
        <el-button
          id="btn-change-portfolio"
          type="text"
          icon="el-icon-setting"
          @click="showPortfolios = true"
        >CHANGE</el-button>
        <el-button
          id="btn-change-portfolio"
          type="text"
          icon="el-icon-edit"
          @click="showCustom = true"
        >CUSTOMIZE</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-switch
          v-model="autorebalance"
          active-color="#13ce66"
          active-text="Rebalance Automatically"
          @change="toggleAutorebalancing()"
        ></el-switch>
      </el-col>
      <!--<el-col :span="12" style="text-align:right">
        <el-button type="text" icon="el-icon-menu"></el-button>
        <el-button type="text" icon="el-icon-search"></el-button>
      </el-col>-->
    </el-row>
    <el-row id="allocations-container">
      <allocation
        v-for="item in this.mergedDistributions.allocations"
        :key="item.coin"
        :allocation="item"
      ></allocation>
    </el-row>
    <label v-show="this.distribution.length == 0">
      No allocations, you must
      <el-button
        type="text"
        @click="
          $router.push({ name: 'exchange', params: { startWithAdd: true } })
        "
      >add an exchange</el-button>.
    </label>
  </div>
</template>
<script>
import Allocation from "./Allocation";
import mhelper from "../../util/mathHelper";
import PortfolioChoices from "./PortfolioChoices";
import CustomPortfolio from "./CustomPortfolio";
import { EventBus } from "../../util/eventBus";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      showPortfolios: false,
      showCustom: false
    };
  },
  mounted() {
    EventBus.$on("customSelected", () => {
      this.showPortfolios = false;
      this.showCustom = true;
    });

    EventBus.$on("custom:set", () => {
      this.showCustom = false;
      this.$message.success(`Custom allocation set.`);
    });
  },
  computed: {
    ...mapState(["distribution", "totalBalance", "portfolio", "user"]),
    autorebalance: {
      get() {
        return this.user.portfolio ? this.user.portfolio.autorebalance : false;
      },
      set() {}
    },
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
      if (
        this.user.portfolio &&
        this.user.portfolio.custom != null &&
        this.user.portfolio.custom.length > 0
      )
        return "Custom";

      return labels[dblabels.indexOf(this.portfolio)];
    }
  },
  methods: {
    ...mapActions(["toggleAutorebalancing"])
  },
  components: { Allocation, PortfolioChoices, CustomPortfolio }
};
</script>

<style scoped>
.portfolio-container {
  margin-top: 20px;
}

.portfolio-strategy {
  font-family: Lato;
  font-size: 21px;
  margin-right: 10px;
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
