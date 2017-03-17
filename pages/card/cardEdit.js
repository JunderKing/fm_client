Page({
  onLoad: function (options) {
    console.log('cardEdit onLoad=>')
    console.log(options)
    this.setData(options)
  },
  formSubmit: function (e) {
    var formData = e.detail.value
    if (!formData.content) {
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
        [this.data.field]: formData.content
      },
      success: function (res) {
        console.log('updateCardInfo success=>')
        console.log(res)
        getApp().globalData.cardUpdate = true
        getApp().globalData.canvasUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  }
})
