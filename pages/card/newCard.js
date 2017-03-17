Page({
  onLoad: function (options) {
    console.log('newcard onload=>')
    console.log(options)
    this.setData({
      canvasId: options.canvasId
    })
  },
  formSubmit: function (e) {
    console.log('submit card form')
    var formData = e.detail.value
    if (!formData.title || !formData.assumption) {
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
      url: 'https://www.kingco.tech/freeman/api/addCard.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: getApp().globalData.projId,
        canvas_id: this.data.canvasId,
        title: formData.title,
        assumption: formData.assumption
      },
      success: function (res) {
        console.log('addCard success=>')
        console.log(res)
        getApp().globalData.canvasUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  },
  formReset: function () {
    console.log('formReset')
  }
})
