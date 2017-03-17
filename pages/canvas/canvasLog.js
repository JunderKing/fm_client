Page({
  onLoad: function (options) {
    console.log('canvasLog onLoad=>')
    console.log(options)
    wx.showToast({
      title: '请稍候……',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getCanvasLog.php',
      data: {
        proj_id: getApp().globalData.projId,
        canvas_id: options.canvasId
      },
      success: function (res) {
        console.log('getCanvasLog success=>')
        console.log(res)
        var resData = JSON.parse(res.data.trim())
        console.log(resData)
        that.setData({
          canvasLogs: resData
        })
        wx.hideToast()
      }
    })
  }
})
