Page({
    onLoad: function (options) {
        console.log('cardEdit onLoad=>')
        console.log(options)
        this.setData({
            projId: options.projId,
            field: options.field,
            fieldId: options.fieldId
        })
    },
    formSubmit: function (e) {
        var content = e.detail.value.content
        if (!content) {
            wx.showToast({
                title: '内容不可为空！',
                icon: 'loading'
            })
            return
        }
        var that = this
        var reqData = {
            uid: getApp().globalData.uid,
            proj_id: this.data.projId,
            field: this.data.field,
            field_id: this.data.fieldId,
            content: content
        }
        console.log('resData=>')
        console.log(reqData)
        wx.showToast({
            title: '提交成功,跳转中……',
            icon: 'loading',
            duration: 5000,
            mask: true
        })
        wx.request({
            url: 'https://www.kingco.tech/freeman/api/addComment.php',
            data: reqData,
            success: function (res) {
                console.log('addComment success=>')
                console.log(res)
                getApp().globalData.comntUpdated = true
                wx.hideToast()
                wx.navigateBack()
            }
        })
    },
})
