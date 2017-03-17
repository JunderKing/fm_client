Page({
    data: {
        role: 0,
        title: '暂无群组',
        projects: [],
        myGroups: []
    },
    onShareAppMessage: function () {
        if (!parseInt(getApp().globalData.groupId) || !parseInt(getApp().globalData.role)) {
            return
        }
        var str = '点击链接，加入' + this.data.title
        return {
            title: str,
            path: '/pages/include/start?groupId=' + getApp().globalData.groupId
        }
    },
    onShow: function () {
        this.setData({
            role: parseInt(getApp().globalData.role),
            groupId: parseInt(getApp().globalData.groupId)
        })
        this.updateGroupInfo()
    },
    createGroup: function () {
        wx.navigateTo({
            url: '/pages/group/newgroup'
        })
    },
    inviteMentor: function () {
        wx.navigateTo({
            url: '/pages/include/mentorInvite'
        })
    },
    updateGroupInfo: function () {
        var app = getApp()
        app.globalData.groupUpdated = false
        var groupId = app.globalData.groupId
        if (groupId !== 0) {
            var that = this
            wx.request({
                url: 'https://www.kingco.tech/freeman/api/getGroupInfo.php',
                data: {
                    uid: app.globalData.uid,
                    group_id: groupId
                },
                success: function (res) {
                    console.log('getGroupInfo success=>')
                    var resData = JSON.parse(res.data.trim())
                    console.log(resData)
                    if (resData) {
                        that.setData({
                            title: resData.title,
                            projects: resData.projects
                        })
                    }
                }
            })
            wx.request({
                url: 'https://www.kingco.tech/freeman/api/getMyGroup.php',
                data: {
                    uid: app.globalData.uid
                },
                success: function (res) {
                    console.log('getMyGroup success=>')
                    console.log(res)
                    var resData = JSON.parse(res.data.trim())
                    if (resData) {
                        that.setData({
                            myGroups: resData
                        })
                    }
                }
            })
        }
    },
    getQrcode: function () {
        wx.showToast({
            title: '请稍候……',
            icon: 'loading',
            duration: 10000,
            mask: true
        })
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/getQrcode.php',
            data: {
                path: 'pages/group/group?groupId=' + getApp().globalData.groupId,
                width: 430
            },
            success: function (res) {
                console.log('getQrcode success=>')
                console.log(res)
                var resData = JSON.parse(res.data.trim())
                wx.hideToast()
                wx.navigateTo({
                    url: '/pages/include/qrcode?name=' + resData.name
                })
            }
        })
    },
    onGroupChange: function (e) {
        console.log(e.detail.value)
        var index = e.detail.value
        var groupId = parseInt(this.data.myGroups[index].group_id)
        console.log(groupId)
        var app = getApp()
        if (app.globalData.groupId !== groupId) {
            app.globalData.groupId = groupId
            this.updateGroupInfo()
            wx.request({
                url: 'https://www.kingco.tech/freeman/api/changeCurGroup.php',
                data: {
                    uid: getApp().globalData.uid,
                    group_id: groupId
                },
                success: function (res) {
                    console.log('changeCurGroup success=>')
                    console.log(res)
                }
            })
        }
    },
    touchStart: function(e){
        this.setData({
            startTime: e.timeStamp
        })
    },
    touchEnd: function(e){
        var touchTime = e.timeStamp - this.data.startTime
        var projId = e.currentTarget.dataset.projid
        if (touchTime < 350) {
            wx.navigateTo({
                url: "/pages/group/groupProj?projId=" + projId
            })
            return
        }
        if (!projId) {
            console.log('delete failed')
            return
        }
        var that = this
        wx.showActionSheet({
            itemList: [
                '删除',
                '取消'
            ],
            success: function(res){
                console.log(res.tapIndex)
                if (res.tapIndex===0 && that.data.role) {
                    var reqData = {
                        uid: getApp().globalData.uid,
                        group_id: that.data.groupId,
                        proj_id: parseInt(projId)
                    }
                    wx.request({
                        url: 'https://kingco.tech/freeman/api/deleteGroupProj.php',
                        data: reqData,
                        success: function(res){
                            console.log('deleteGroupProj success=>')
                            console.log(res)
                            that.updateGroupInfo()
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success'
                            })
                        }
                    })
                }
            }
        })
    }
})
