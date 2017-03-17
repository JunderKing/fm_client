Page({
  data: {
    cardId: 0
  },
  onLoad: function (options) {
    console.log('resultInput onload')
    console.log(options)
    this.setData({
      cardId: options.cardId
    })
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    var formData = e.detail.value
    if (!formData.content || !formData.status) {
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
      url: 'https://www.kingco.tech/freeman/api/updateCardInfo.php',
      data: {
        uid: getApp().globalData.uid,
        card_id: this.data.cardId,
        result: formData.content,
        status: formData.status
      },
      success: function (res) {
        console.log('updateDataInfo success=>')
        console.log(res)
        getApp().globalData.cardUpdate = true
        getApp().globalData.canvasUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  }
})
