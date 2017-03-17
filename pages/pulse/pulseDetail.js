Page({
  data: {
    title: '标题',
    isUser: false,
    projId: 0,
    pulseId: 0,
    pulseNo: 0,
    content: ''
  },
  onLoad: function (options) {
    console.log('pulsedetail onload=>')
    console.log(options)
    var title = '标题'
    if (options.pulseId === '11') {
      title = '第' + options.pulseNo + '周周报'
    } else if (options.pulseId === '12') {
      title = '第' + options.pulseNo + '月月会'
    } else if (options.pulseId === '13') {
      title = '季结'
    }
    this.setData({
      title: title,
      isUser: parseInt(options.isUser),
      projId: options.projId,
      pulseId: options.pulseId,
      pulseNo: options.pulseNo
    })
    this.updatePulseInfo()
  },
  onShow: function () {
    this.updatePulseInfo()
  },
  updatePulseInfo: function () {
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getPulseInfo.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: this.data.projId,
        pulse_id: this.data.pulseId,
        pulse_no: this.data.pulseNo
      },
      success: function (res) {
        console.log('getPulseInfo success=>')
        console.log(res)
        var resData = JSON.parse(res.data.trim())
        that.setData(resData)
      }
    })
  },
  toComment: function () {
    console.log('commengCard')
    var projId = this.data.projId
    var pulseId = this.data.pulseId
    var pulseNo = this.data.pulseNo
    wx.navigateTo({
      url: '/pages/include/comntInput?projId=' + projId + '&field=' + pulseId + '&fieldId=' + pulseNo
    })
  }
})
