Page({
    data: {
        uid: 0,
        projId: 0,
        canvasCards: []
    },
    onLoad: function(){
        getApp().loadToast()
    },
    onShow: function () {
        var app = getApp()
        this.setData({
            uid: app.globalData.uid,
            projId: app.globalData.projId
        })
        this.updateList()
    },
    updateList: function(){
        var app = getApp()
        var reqData = {
            uid: app.globalData.uid,
            proj_id: app.globalData.projId
        }
        console.log(reqData)
        var that = this
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/getProjCard.php',
            data: reqData,
            success: function (res) {
                console.log('getProjCard success=>')
                var resData = JSON.parse(res.data.trim())
                console.log(resData)
                var resData = resData.map(function(item){
                    if (item.title.length > 14 ) {
                        item.title = item.title.substring(0, 14) + '……'
                    }
                    return item
                })
                that.setData({
                    canvasCards: resData
                })
                wx.hideToast()
            }
        })
    },
    cardDetail: function () {
        wx.navigateTo({
            url: '/pages/card/cardDetail'
        })
    },
    touchStart: function(e){
        console.log(e.timeStamp)
        this.setData({
            startTime: e.timeStamp
        })
    },
    touchEnd: function(e){
        var endTime = e.timeStamp
        var touchTime = endTime - this.data.startTime
        var cardId = parseInt(e.currentTarget.dataset.cardid)
        var canvasId = parseInt(e.currentTarget.dataset.canvasid)
        if (touchTime<350) {
            wx.navigateTo({
                url: "/pages/card/cardDetail?projId="
                + this.data.projId
                + "&canvasId="
                + canvasId
                + "&cardId="
                + cardId 
                + "&isUser=1"
            })
            return
        }
        var that = this
        wx.showActionSheet({
            itemList: [
                '置顶',
                '向上移动',
                '删除'
            ],
            success: function(res){
                console.log('cardId' + cardId)
                console.log(res.tapIndex)
                if (res.tapIndex===2) {
                    var reqData = {
                        card_id: cardId
                    }
                    wx.request({
                        url: 'https://www.kingco.tech/freeman/api/deleteCard.php',
                        data: reqData,
                        success: function(res){
                            console.log('delete card success=>')
                            console.log(res)
                            that.updateList()
                        }
                    })
                    return
                }
                if (res.tapIndex===0) {
                    console.log('totop')
                    var reqData = {
                        proj_id: that.data.projId,
                        card_id: cardId
                    }
                    wx.request({
                        url: 'https://www.kingco.tech/freeman/api/changeCardOrder.php',
                        data: reqData,
                        success: function(res){
                            console.log('changeCardOrder success=>')
                            console.log(res)
                            that.updateList()
                        }
                    })
                }
                if (res.tapIndex===1) {
                    console.log('upward')
                    var reqData = {
                        proj_id: that.data.projId,
                        card_id: cardId
                    }
                    wx.request({
                        url: "https://www.kingco.tech/freeman/api/upwardCard.php",
                        data: reqData,
                        success: function(res){
                            console.log('upwardCard success=>')
                            console.log(res)
                            that.updateList()
                        }
                    })
                }
            }
        })
    }
})
