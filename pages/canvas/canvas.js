Page({
  onShow: function () {
    this.setData({
      projId: getApp().globalData.projId
    })
    this.updateMarker()
  },
  updateMarker: function () {
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getMarker.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: this.data.projId
      },
      success: function (res) {
        console.log('getMark success=>')
        var resData = JSON.parse(res.data.trim())
        console.log(resData)
        that.setData({
          marker: resData
        })
      }
    })
  }
})
