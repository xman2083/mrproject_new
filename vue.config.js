module.exports = {
    lintOnSave: false,
    publicPath: '/sktl-inner-dev/meetingroom/kkangdanni',
  
    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {
        navigateFallback: "/index.html",
        runtimeCaching: [{
          urlPattern: new RegExp('APU_URL'),
          handler: 'networkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'sktl-meeting-room',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        }]
      }
    }
  };