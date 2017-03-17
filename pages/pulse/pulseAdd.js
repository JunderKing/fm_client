Page({
  onLoad: function (options) {
    console.log('pulseAdd onLoad=>')
    console.log(options)
    this.setData({
      pulseId: options.pulseId,
      pulseNo: options.pulseNo
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
      url: 'https://www.kingco.tech/freeman/api/addPulse.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: getApp().globalData.projId,
        pulse_id: this.data.pulseId,
        pulse_no: this.data.pulseNo,
        content: content
      },
      success: function (res) {
        console.log('addPulse success=>')
        console.log(res)
        getApp().globalData.pulseUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  }
})
