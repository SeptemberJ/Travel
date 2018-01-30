const AV = require('../../../../utils/av-weapp.js')
import h from '../../../../utils/url.js'
var app = getApp()
Page({
    data: {
        addressList:[],
        type:'',
        loadingHidden:false,
        // addressList:[]
        // hasAddr:true,

    },
    onShow: function () {
      //获取地址列表
      wx.request({
        url: h.main + '/page/Addressdisplay.do',
        data: {
          oppen_id: app.globalData.oppenid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
          console.log('地址列表backInfo---=')
          console.log(res.data)
          this.setData({
            addressList: res.data,
            loadingHidden:true
          })
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
          
  },
    onLoad: function (options) {
        // 订单提交页面进入type--0  票据--1
        this.setData({
            type:options.type
        })


    },
    onReady: function () {

    },
    // 添加地址
    add: function () {
        wx.navigateTo({
            url: '../add/add'
        });
    },
    // 设置默认地址
    setDefault: function (e) {
		// var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 遍历所有地址对象设为非默认
		var addressObjects = this.data.addressList;
		for (let i = 0; i < addressObjects.length; i++) {
			// 判断是否为当前地址，是则传true
            if(i==index){
              addressObjects[i].status=1
            }else{
              addressObjects[i].status=0
            }
		}
        // 更新服务器上数据并更新本地实现刷新
    wx.request({
      url: h.main + '/updateaddress1',
      data: {
        fitemid: addressObjects[index].fitemid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('设置默认---')
        console.log(res.data)
        wx.showToast({
          title: '设置成功！',
          duration: 500
        });
      },
      fail: (res) => {


      },
      complete: (res) => {

      }
    })
        this.setData({
            addressList:addressObjects
        })
    },
    // 编辑地址
	edit: function (e) {
		var index = parseInt(e.currentTarget.dataset.index);
        var editAddress=this.data.addressList[index]
        wx.setStorage({
            key:"address",
            data:editAddress
        })
		wx.navigateTo({
			url: '../add/add?id='+this.data.addressList[index].id
		});
	},
    // 删除地址
	del: function (e) {
        wx.showModal({
        title: '提示',
        content: '确认删除该收货地址？', 
        success: (res)=>{
          if (res.confirm) {
            var afterDel = this.data.addressList
            var index = parseInt(e.currentTarget.dataset.index);
            wx.request({
              url: h.main + '/page/Addressdel.do',
              data: {
                id: this.data.addressList[index].id
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
              },
              success: (res) => {
                console.log(index)
                afterDel.splice(index, 1)
                this.setData({
                  addressList: afterDel,
                })
                wx.showToast({
                  title: '删除成功！',
                  duration: 500
                });
              },
              fail: (res) => {
                // fail
              },
              complete: (res) => {
                // complete
              }
            })
          }
        }
			})
        
	},
    // 订单页跳转选择地址
    chooseAddress: function(e){
        // 非订单提交选择地址点击无效返回
        if(this.data.type!=0 && this.data.type!=1){
            return
        }
        var addressIndex = e.currentTarget.dataset.index
        var pages = getCurrentPages();
        if(pages.length > 1){
            var prePage = pages[pages.length - 2];
            if(this.data.type ==0){
                prePage.backAddress(this.data.addressList[addressIndex])
            }else{
                prePage.backAddressReceipt(this.data.addressList[addressIndex])
            }
            
        }
        wx.navigateBack()
    }

})