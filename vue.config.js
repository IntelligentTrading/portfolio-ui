const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          VUE_APP_PORTFOLIO_API: JSON.stringify(
            process.env.VUE_APP_PORTFOLIO_API
          ),
          VUE_APP_SOCKET: JSON.stringify(process.env.VUE_APP_ITT_SOCKET)
        }
      })
    ]
  }
};
