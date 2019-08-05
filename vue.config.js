module.exports = {
  lintOnSave: false,
  publicPath: "/sktl-inner-dev/meetingroom/kkangdanni",
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
        fiber: require("fibers"),
      },
    },
  },
};
