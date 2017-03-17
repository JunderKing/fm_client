Page({
  data: {
    title: '画布',
    canvasId: 0,
    projId: 0,
    isUser: false,
    content: '',
    cards: []
  },
  onLoad: function (options) {
    console.log('canvasDetail onload')
    var title = null
    if (options.canvasId === '1') {
      title = '细分格子'
    }
    if (options.canvasId === '2') {
      title = '痛点格子'
    }
    if (options.canvasId === '3') {
      title = '价值格子'
    }
    if (options.canvasId === '4') {
      title = '方案格子'
    }
    if (options.canvasId === '5') {
      title = '指标格子'
    }
    if (options.canvasId === '6') {
      title = '收入格子'
    }
    if (options.canvasId === '7') {
      title = '渠道格子'
    }
    if (options.canvasId === '8') {
      title = '增长格子'
    }
    console.log(title)
    this.setData({
      title: title,
      canvasId: parseInt(options.canvasId),
      projId: parseInt(options.projId),
      isUser: parseInt(options.isUser)
    })
    // this.updateCanvasInfo()
  },
  onShow: function () {
    wx.showToast({
      title: '请稍候……',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    this.updateCanvasInfo()
  },
  updateCanvasInfo: function () {
    getApp().globalData.canvasUpdated = false
    var reqData = {
      uid: getApp().globalData.uid,
      proj_id: this.data.projId,
      canvas_id: this.data.canvasId
    }
    console.log(reqData)
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getCanvasInfo.php',
      data: reqData,
      success: function (res) {
        console.log('getCanvasInfo success=>')
        console.log(res)
        var resData = JSON.parse(res.data.trim())
        var cards = resData.cards.map(function(item){
          if (item.title.length>14) {
            item.title = item.title.substring(0, 14) + '……'
          }
          return item
        })
        that.setData({
          content: resData.content,
          result: resData.result,
          assumption: resData.assumption,
          status: resData.status,
          title: resData.title,
          cards: cards,
          comments: resData.comments
        })
        wx.hideToast()
      }
    })
  },
  addCard: function () {
    wx.navigateTo({
      url: '/pages/card/newCard?canvasId=' + this.data.canvasId
    })
  },
  cardDetail: function () {
    wx.navigateTo({
      url: '/pages/card/cardDetail'
    })
  },
  showLog: function () {
    wx.navigateTo({
      url: '/pages/canvas/canvasLog?canvasId=' + this.data.canvasId
    })
  },
  toComment: function () {
    console.log('commengCard')
    var projId = this.data.projId
    var canvasId = this.data.canvasId
    wx.navigateTo({
      url: '/pages/include/comntInput?projId=' + projId + '&field=' + canvasId + '&fieldId=' + 0
    })
  },
  showMenu: function(e){
    console.log(e)
    var cardId = parseInt(e.currentTarget.dataset.cardid)
    var that = this
    wx.showActionSheet({
      itemList: [
        '删除',
        '取消'
      ],
      success: function(res){
        console.log('cardId' + cardId)
        if (res.tapIndex!==0 || !cardId) {
          return
        }
        var reqData = {
          card_id: cardId
        }
        wx.request({
          url: 'https://kingco.tech/freeman/api/deleteCard.php',
          data: reqData,
          success: function(res){
            console.log('delete card success=>')
            console.log(res)
            that.updateCanvasInfo()
          }
        })

      }
    })
  }
})
