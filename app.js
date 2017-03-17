App({
    onLaunch: function () {
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, '')
        }
    },

    login: function (options) {
        console.log('login invoke')
        var that = this
        wx.login({
            success: function (res) {
                if (!res.code) {
                    return
                }
                var loginData = {}
                loginData.code = res.code
                wx.getUserInfo({
                    success: function (res) {
                        console.log('getUserInfo success=>')
                        console.log(res)
                        if (!res.encryptedData || !res.iv) {
                            return
                        }
                        loginData.iv = res.iv
                        loginData.raw_data = res.encryptedData
                        that.getUserInfo(loginData, options)
                    }
                })
            }
        })
    },

    getUserInfo: function (loginData, options) {
        var that = this;
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/login.php',
            data: loginData,
            success: function (res) {
                console.log('getUserId success=>')
                console.log(res)
                var resData = JSON.parse(res.data.trim())
                console.log(resData)
                if (!resData.uid ||!resData.proj_id) {
                    return
                }
                that.globalData.uid = parseInt(resData.uid)
                that.globalData.role = parseInt(resData.role)
                that.globalData.projId = parseInt(resData.proj_id)
                that.globalData.groupId = parseInt(resData.group_id)
                var quit = that.checkOption(options)
                if (quit) {
                    return
                }
                if (parseInt(resData.proj_id) !== 0) {
                    that.updateMarker()
                    wx.switchTab({
                        url: '/pages/project/project'
                    })
                } else {
                    wx.redirectTo({
                        url: '/pages/include/noproj'
                    })
                }
            }
        })
    },

    checkOption: function (options) {
        var that = this
        if (parseInt(options.role) === 1) {
            var reqData = {
                uid: this.globalData.uid,
                role: parseInt(options.role)
            }
            console.log(reqData)
            wx.request({
                url: 'https://www.kingco.tech/freeman/api/changeRole.php',
                data: reqData,
                success: function(res){
                    console.log('changeRole success=>')
                    console.log(res)
                    that.globalData.role = parseInt(options.role)
                    wx.showToast({
                        title: '成功自由人导师！',
                        icon: 'success'
                    })
                    wx.switchTab({
                        url: '/pages/group/group'
                    })
                }
            })
            return true
        }
        if (parseInt(options.projId)) {
            var reqData = {
                uid: this.globalData.uid,
                proj_id: parseInt(options.projId)
            }
            console.log(reqData)
            wx.request({
                url: 'https://www.kingco.tech/freeman/api/addProjMember.php',
                data: reqData,
                success: function (res) {
                    console.log('addProjMember success=>')
                    console.log(res)
                    wx.showToast({
                        title: '成功加入项目！',
                        icon: 'success'
                    })
                    that.globalData.projId = parseInt(options.projId)
                    wx.switchTab({
                        url: '/pages/project/project'
                    })
                }
            })
            return true
        }
        if (parseInt(options.groupId)) {
            if (this.globalData.projId) {
                var reqData = {
                    proj_id: this.globalData.projId,
                    group_id: parseInt(options.groupId)
                }
                wx.request({
                    url: 'https://www.kingco.tech/freeman/api/addGroupProj.php',
                    data: reqData,
                    success: function (res) {
                        console.log('addGroupProj success=>')
                        console.log(res)
                        wx.showToast({
                            title: '成功加入群组！',
                            icon: 'success'
                        })
                        that.globalData.groupId = parseInt(options.groupId)
                        wx.switchTab({
                            url: '/pages/group/group'
                        })
                    }
                })
            } else {
                wx.redirectTo({
                    url: '/pages/project/newproj?gruopId=' + parseInt(options.groupId)
                })
            }
            return true
        }
        return false
    },

    updateMarker: function () {
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/getMarker.php',
            data: {
                uid: this.globalData.uid,
                proj_id: this.globalData.projId
            },
            success: function (res) {
                console.log('getMark success=>')
                var resData = JSON.parse(res.data.trim())
                console.log(resData)
                that.globalData.marker = null
                that.globalData.marker = resData
            }
        })
    },

    qrScan: function () {
        var that = this
        wx.scanCode({
            success: function (res) {
                console.log('scanCode success=>')
                console.log(res)
                var resData = that.queryString(res.path)
                console.log(resData)
                if (parseInt(resData.projId)) {
                    var projId = parseInt(resData.projId)
                    wx.request({
                        url: 'https://www.kingco.tech/freeman/api/addProjMember.php',
                        data: {
                            uid: that.globalData.uid,
                            proj_id: projId
                        },
                        success: function (res) {
                            console.log('addProjMember success=>')
                            console.log(res)
                            wx.showToast({
                                title: '成功加入项目！',
                                icon: 'success'
                            })
                            var resData = JSON.parse(res.data.trim())
                            if (parseInt(resData.group_id)) {
                                that.globalData.groupId = parseInt(resData.group_id)
                            }
                            that.globalData.projId = projId
                            that.globalData.projUpdated = true
                            wx.switchTab({
                                url: '/pages/project/project'
                            })
                        }
                    })
                }
                if (parseInt(resData.groupId) && that.globalData.projId) {
                    wx.request({
                        url: 'https://www.kingco.tech/freeman/api/addGroupProj.php',
                        data: {
                            proj_id: that.globalData.projId,
                            group_id: resData.groupId
                        },
                        success: function (res) {
                            console.log('addGroupProj success=>')
                            console.log(res)
                            wx.showToast({
                                title: '成功加入群组！',
                                icon: 'success'
                            })
                            that.globalData.groupId = parseInt(resData.groupId)
                        }
                    })
                }
            }
        })
    },

    queryString: function (url) {
        var urlObject = {}
        if (/\?/.test(url)) {
            var urlString = url.substring(url.indexOf('?') + 1)
            var urlArray = urlString.split('&')
            for (var i = 0, len = urlArray.length; i < len; i++) {
                var urlItem = urlArray[i]
                var item = urlItem.split('=')
                urlObject[item[0]] = item[1]
            }
            return urlObject
        }
    },

    formToast: function(){
        wx.showToast({
            title: '提交成功,跳转中……',
            icon: 'loading',
            duration: 5000,
            mask: true
        })
    },

    loadToast: function(){
        wx.showToast({
            title: '请稍候……',
            icon: 'loading',
            duration: 5000,
            mask: true
        })
    },

    globalData: {
        uid: 0,
        projId: 0,
        groupId: 0,
        role: 0,
        projUpdated: false,
        groupUpdated: false,
        pulseUpdated: false,
        canvasUpdated: false,
        cardUpdate: false,
        comntUpdated: false,
        marker: {}
    }
})
