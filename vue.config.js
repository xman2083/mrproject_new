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

  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      navigateFallback: "/index.html",
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: new RegExp('/sktl-inner-dev/meetingroom/kkangdanni'),
        handler: 'networkFirst',
        options: {
          networkTimeoutSeconds: 20,
          cacheName: 'sktl-meeting-room',
          expiration: {
            maxAgeSeconds: 6,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
          broadcastUpdate: {
            channelName: 'my-update-channel',
          }
        },
      }]
    },
    appleMobileWebAppCapable: 'yes'
  }
};
