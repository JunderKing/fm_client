Page({
  data: {
    title: '脉搏',
    isUser: 0,
    projId: 0,
    field: 0,
    pulseArray: []
  },
  onLoad: function (options) {
    console.log('pulseList onload=>')
    console.log(options)
    var title = '脉搏'
    if (options.pulseId === '11') {
      title = '周报'
    } else if (options.pulseId === '12') {
      title = '月会'
    }
    this.setData({
      title: title,
      isUser: parseInt(options.isUser),
      projId: options.projId,
      pulseId: options.pulseId
    })
  },
  onShow: function () {
    wx.showToast({
      title: '请稍候……',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    this.refreshData()
  },
  refreshData: function () {
    var that = this
    getApp().globalData.pulseUpdated = false
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getPulseList.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: this.data.projId,
        pulse_id: this.data.pulseId
      },
      success: function (res) {
        console.log('getPulseList success=>')
        var resData = JSON.parse(res.data.trim())
        console.log(resData)
        resData = resData.map(function (item) {
          if (item.content.length > 50) {
            item.content = item.content.substring(0, 50) + '……'
            return item
          }
          return item
        })
        that.setData({
          pulseArray: resData
        })
        wx.hideToast()
      }
    })
  },
  addPulse: function () {
    var pulseId = this.data.pulseId
    var pulseNo = this.data.pulseArray.length + 1
    wx.navigateTo({
      url: '/pages/pulse/pulseAdd?pulseId=' + pulseId + '&pulseNo=' + pulseNo
    })
  }
})
