Page({
  onLoad: function (options) {
    this.setData({
      canvasId: options.canvasId,
      field: options.field,
      content: options.content
    })
  },
  formSubmit: function (e) {
    var content = e.detail.value.content
    if (!content) {
      wx.showToast({
        title: '内容不可为空！',
        icon: 'loading'
      })
      return
    }
    wx.showToast({
      title: '提交成功,跳转中……',
      icon: 'loading',
      duration: 5000,
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/updateCanvasInfo.php',
      data: {
        uid: getApp().globalData.uid,
        canvas_id: this.data.canvasId,
        proj_id: getApp().globalData.projId,
        content: content
      },
      success: function (res) {
        console.log('updateCanvasInfo success=>')
        console.log(res)
        getApp().globalData.canvasUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  }
})
