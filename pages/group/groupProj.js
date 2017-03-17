Page({
  data: {
    projId: 0,
    title: 'projectTitle',
    intro: 'projectIntro',
    vision: 'projectVision',
    projMembers: [{
      avatar: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLnsYM6ibJ4QzKg0FaOUK4977khOcGic8kAJiaeLSNV6X5JS5SvjuQhxotadAFY9pYhqQ4UNvArB5Tuw/0',
      nick_name: 'junk',
      role: 'ceo'
    }],
    marker: {
      week: false,
      month: false,
      season: false,
      detail: false,
      painpoint: false,
      value: false,
      scheme: false,
      indicator: false,
      income: false,
      channel: false,
      growth: false
    }
  },
  onLoad: function (options) {
    console.log(options)
    if (options.projId) {
      this.setData({
        projId: options.projId
      })
    }
  },
  onShow: function () {
    this.updateProjInfo()
    this.updateMarker()
  },
  updateProjInfo: function () {
    console.log('updateProjInfo')
    var that = this
    wx.request({
      url: 'https://www.kingco.tech/freeman/api/getProjInfo.php',
      data: {
        uid: getApp().globalData.uid,
        proj_id: this.data.projId
      },
      success: function (res) {
        console.log('getProjInfo success=>')
        var resData = JSON.parse(res.data.trim())
        console.log(resData)
        resData.members = resData.members.map(function (item) {
          if (item.nick_name.length > 3) {
            item.nick_name = item.nick_name.substring(0, 3)
          }
          return item
        })
        if (resData) {
          that.setData({
            projId: resData.proj_id,
            title: resData.title,
            intro: resData.intro,
            vision: resData.vision,
            members: resData.members
          })
        } else {
          console.log('get projInfo failed!')
        }
      }
    })
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
