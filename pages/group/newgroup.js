Page({
  formSubmit: function (e) {
    var formData = e.detail.value
    formData.uid = getApp().globalData.uid
    if (!formData.title) {
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
      url: 'https://www.kingco.tech/freeman/api/createGroup.php',
      data: formData,
      success: function (res) {
        console.log('createGroup success=>')
        console.log(res)
        var groupId = JSON.parse(res.data.trim()).group_id
        getApp().globalData.groupId = groupId
        getApp().globalData.updateGroup = true
        wx.hideToast()
        wx.switchTab({
          url: '/pages/group/group'
        })
      }
    })
  }
})
