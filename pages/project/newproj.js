Page({
  onLoad: function (options) {
    if (parseInt(options.groupId)) {
      this.setData({
        groupId: parseInt(options.groupId)
      })
    }
  },
  formSubmit: function (e) {
    console.log('formSubmit=>')
    console.log(e.detail.value)
    var that = this
    var app = getApp()
    var uid = app.globalData.uid
    var formData = e.detail.value
    if (!formData.title || !formData.vision || !formData.intro) {
      wx.showToast({
        title: '内容不可为空！',
        icon: 'loading'
      })
      return
    }
    formData.uid = uid
    wx.showToast({
      title: '提交成功,跳转中……',
      icon: 'loading',
      duration: 5000,
      mask: true
    })
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/createProj.php',
      data: formData,
      success: function (res) {
        console.log('createProj success=>')
        console.log(res)
        var reqData = JSON.parse(res.data.trim())
        var projId = parseInt(reqData.proj_id)
        if (!projId) {
          return
        }
        app.globalData.projId = projId
        app.globalData.projUpdated = true
        if (that.data.groupId) {
          wx.request({
            url: 'https://www.kingco.tech/freeman/api/addGroupProj.php',
            data: {
              proj_id: projId,
              group_id: that.data.groupId
            },
            success: function (res) {
              console.log('addGroupProj success=>')
              console.log(res)
              that.globalData.groupId = that.data.groupId
            }
          })
        }
        app.updateMarker()
        wx.hideToast()
        wx.switchTab({
          url: '/pages/project/project'
        })
      }
    })
  }
})
