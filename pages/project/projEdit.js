Page({
  data: {
    title: '',
    value: '请输入'
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      value: options.content,
      title: options.title
    })
  },
  formSubmit: function (e) {
    console.log(this.data.title)
    console.log(e.detail.value)
    if (!e.detail.value) {
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
    var that = this
    var app = getApp()
    var projId = app.globalData.projId
    if (projId) {
      wx.request({
        url: 'https://www.kingco.tech/freeman/api/updateProjInfo.php',
        data: {
          proj_id: projId,
          field: that.data.title,
          value: e.detail.value.input
        },
        success: function (res) {
          console.log('updateProjInfo success=>')
          console.log(res)
          app.globalData.projUpdated = true
          wx.hideToast()
          wx.switchTab({
            url: '/pages/project/project'
          })
        }
      })
    }
  }
})
