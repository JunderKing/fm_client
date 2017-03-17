Page({
    data: {
        projId: 0,
        title: '',
        intro: '',
        vision: '',
        members: [],
        myProjects: []
    },
    onShareAppMessage: function () {
        if (!parseInt(this.data.projId)) {
            return
        }
        var str = '点击链接，加入' + this.data.title
        return {
            title: str,
            path: '/pages/include/start?projId=' + this.data.projId
        }
    },
    onShow: function () {
        console.log('project onshow')
        this.setData({
            projId: parseInt(getApp().globalData.projId)
        })
        this.updateProjInfo()
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
    },
    updateProjInfo: function () {
        console.log('updateProjInfo')
        getApp().globalData.projUpdated = false
        var that = this
        var app = getApp()
        var projId = app.globalData.projId
        console.log('projID:' + projId)
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/getProjInfo.php',
            data: {
                uid: app.globalData.uid,
                proj_id: projId
            },
            success: function (res) {
                console.log('getProjInfo success=>')
                var resData = JSON.parse(res.data.trim())
                console.log(resData)
                if (resData.vision.length > 12) {
                    resData.vision = resData.vision.substring(0, 12) + '……'
                }
                if (resData.title.length > 10) {
                    resData.title = resData.title.substring(0, 10)
                }
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
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/getMyProject.php',
            data: {
                uid: app.globalData.uid
            },
            success: function (res) {
                console.log('getMyProject Success=>')
                console.log(res)
                var resData = JSON.parse(res.data.trim())
                if (resData) {
                    that.setData({
                        myProjects: resData
                    })
                }
            }
        })
    },
    createProj: function () {
        wx.navigateTo({
            url: '/pages/project/newproj'
        })
    },
    onProjChange: function (e) {
        console.log(e.detail.value)
        var index = e.detail.value
        var projId = this.data.myProjects[index].proj_id
        var app = getApp()
        if (projId !== app.globalData.projId) {
            app.globalData.projId = projId
            this.updateProjInfo()
            wx.request({
                url: 'https://www.kingco.tech/freeman/api/changeCurProj.php',
                data: {
                    uid: app.globalData.uid,
                    proj_id: projId
                }
            })
        }
    },
    getQrcode: function () {
        var projId = getApp().globalData.projId
        if (!projId) {
            return
        }
        wx.showToast({
            title: '请稍候……',
            icon: 'loading',
            duration: 10000,
            mask: true
        })
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/getQrcode.php',
            data: {
                path: 'pages/project/project?projId=' + projId, 
                width: 250
            },
            success: function (res) {
                console.log('getQrcode success=>')
                console.log(res)
                var resData = JSON.parse(res.data.trim())
                if (!resData.name) {
                    return
                }
                wx.hideToast()
                wx.navigateTo({
                    url: '/pages/include/qrcode?name=' + resData.name
                })
            }
        })
    },
    qrScan: function () {
        getApp().qrScan()
    }
})
