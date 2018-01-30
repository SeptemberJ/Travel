var app = getApp()
import h from '../../../../utils/url.js'
Page( {
  data: {
    receipts:[],
    loadingHidden:false,
    type:''

  },

  onLoad: function(options) {
    // 订单提交页面进入type--0
        this.setData({
            type:options.type
        })
  },
  onShow: function(){
    //发票抬头列表
    wx.request({
      url: h.main + '/page/headerlist.do',
      data: {
        oppen_id: app.globalData.oppenid,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('发票抬头列表backInfor---')
        console.log(res)
        this.setData({
          receipts: res.data,
          loadingHidden:true
        })
      },
      fail: (res) => {


      },
      complete: (res) => {

      }
    })
  },
  addReceipt: function(){
    wx.navigateTo({
      url: '../add/index'
    })
  },
  deleteReceipt: function(e){
    var fbillno = e.currentTarget.dataset.fbillno
    var ftype = e.currentTarget.dataset.ftype
    var idx = e.currentTarget.dataset.index
    console.log(fbillno)
			wx.showModal({    
                    title:'提示',    
                    content: '确定删除该发票信息？',     
                    showCancel: true,    
                    success: (res)=> {    
                        if (res.confirm) {    
                            console.log('用户点击确定')
                            //删除发票
                            wx.request({
                              url: h.main + '/page/headerdel.do',
                              data: {
                                fbillno: fbillno,
                                ftype: ftype
                              },
                              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                              header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json',
                              }, // 设置请求的 header
                              success: (res) => {
                                console.log('删除发票backInfor---')
                                console.log(res)
                                if (res.data =='SUCCESS'){
                                  wx.showToast({
                                    title: '删除成功！',
                                    duration: 500
                                  });
                                }
                                //页面刷新发票列表
                                var temp = this.data.receipts
                                temp.splice(idx,1)
                                this.setData({
                                  receipts: temp
                                })
                              },
                              fail: (res) => {
                              },
                              complete: (res) => {
                              }
                            })    
                        }    
                    }    
                }); 

  },
  // 订单页跳转选择发票
    chooseReceipt1: function(e){
      console.log('clicked----')
        // 非订单提交选择发票点击无效返回
        if(this.data.type!=0){
            return
        }
        var receiptIndex = e.currentTarget.dataset.index
        var pages = getCurrentPages();
        if(pages.length > 1){
            var prePage = pages[pages.length - 2];
            prePage.backReceipt(this.data.receipts[receiptIndex])
        }
        wx.navigateBack()
    }

})