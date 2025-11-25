App({
  onLaunch: function () {
    // 填入你的云开发环境ID (在云开发控制台概览里看)
    wx.cloud.init({
      env: 'cloud1-6geakn280aaef55c', 
      traceUser: true,
    })
  }
})