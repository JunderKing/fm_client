Page({
  data: {
    projId: 0,
    canvasId: 0,
    cardId: 0,
    comments: {
      avatar: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLnsYM6ibJ4QzKg0FaOUK4977khOcGic8kAJiaeLSNV6X5JS5SvjuQhxotadAFY9pYhqQ4UNvArB5Tuw/0',
      nick_name: 'Junder King'
    }
  },
  onLoad: function (options) {
    console.log('cardDetail onload')
    console.log(options)
    if (options.cardId) {
      this.setData({
        projId: options.projId,
        canvasId: options.canvasId,
        cardId: options.cardId,
        isUser: parseInt(options.isUser)
      })
    }
  },
  onShow: function () {
    this.updateCardInfo()
  },
  updateCardInfo: function () {
    var that = this
    getApp().globalData.cardUpdate = false
    getApp().globalData.comntUpdated = false
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getCardInfo.php',
      data: {
        uid: getApp().globalData.uid,
        card_id: this.data.cardId
      },
      success: function (res) {
        console.log('getCardInfo success=>')
        var resData = JSON.parse(res.data.trim())
        console.log(resData)
        that.setData({
          title: resData.title,
          assumption: resData.assumption,
          result: resData.result,
          status: resData.status,
          comments: resData.comments
        })
      }
    })
  },
  toComment: function () {
    console.log('commengCard')
    var projId = this.data.projId
    var canvasId = this.data.canvasId
    var cardId = this.data.cardId
    wx.navigateTo({
      url: '/pages/include/comntInput?projId=' + projId + '&field=' + canvasId + '&fieldId=' + cardId
    })
  }
})
