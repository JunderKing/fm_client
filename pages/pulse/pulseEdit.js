Page({
  data: {
    pulseId: 0,
    content: ''
  },
  onLoad: function (options) {
    console.log('pulseInput onload=>')
    console.log(options)
    this.setData({
      pulseId: options.pulseId,
      pulseNo: options.pulseNo,
      content: options.content
    })
  },
  formSubmit: function (e) {
    if (!e.detail.value.content) {
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
      url: 'https://www.kingco.tech/freeman/api/updatePulseInfo.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: getApp().globalData.projId,
        pulse_id: this.data.pulseId,
        pulse_no: this.data.pulseNo,
        content: e.detail.value.content
      },
      success: function (res) {
        console.log('updatePulse success=>')
        console.log(res)
        getApp().globalData.pulseUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  }
})
