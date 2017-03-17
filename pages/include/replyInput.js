Page({
  onLoad: function (options) {
    console.log('cardEdit onLoad=>')
    console.log(options)
    this.setData({
      commentId: options.commentId
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
    var that = this
    var reqData = {
      uid: getApp().globalData.uid,
      comment_id: this.data.commentId,
      content: content
    }
    console.log('resData=>')
    console.log(reqData)
    wx.showToast({
      title: '提交成功,跳转中……',
      icon: 'loading',
      duration: 5000,
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/addReply.php',
      data: reqData,
      success: function (res) {
        console.log('addReply success=>')
        console.log(res)
        getApp().globalData.comntUpdated = true
        wx.hideToast()
        wx.navigateBack()
      }
    })
  }
})
