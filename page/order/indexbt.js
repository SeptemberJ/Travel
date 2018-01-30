var app = getApp()
import h from '../../utils/url.js'
const util = require('../../utils/util.js')
Page({
    data: {
        canDo:false,
        address:false,
        receiptAddress:'',
        couponId:'',
        couponTerm:'',
        coupons:[{'id':0,'preferential_price':10,'preferential_term':300,'preferential_dateS':'2017-05-24','preferential_dateE':'2017-10-1'},{'id':1,'preferential_price':100,'preferential_term':1000,'preferential_dateS':'2017-05-24','preferential_dateE':'2017-10-1'}],
        loadingHidden:true,
        discount:0,
        deliveryWays:[true,false,false],
        deliveryWay:'快递送货',
        ifNeedReceipts:[false,true],
        ifNeedReceipt:'不要发票',
        receiptKinds:[true,false],
        receiptKind:'增值税普通发票',
        receiptAttachInfo:{
            'receipt_head':'',
            'receipt_email':'',
            'receipt_taxCode':'',
            'receipt_signAddr':'',
            'receipt_tel':'',
            'receipt_bank':'',
            'receipt_account':''
            },
        date:'',
        timeS:'09:00',
        timeE:'21:00',
        payed:0,
        storeIndex:0
        

    },
    onLoad: function(info) {
        //获取门店
      wx.request({
        url: h.main + '/selectdepname',
        data: {
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
          console.log('获取门店backInfo---=')
          console.log(res.data)
          var temp = []
          res.data.map(function(item,index){
            temp.push(item.FName)
          })
          this.setData({
            storeList: temp
          })
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
      
        // 门店自提和门店配送默认为后一天
        var preDate = new Date(new Date().getTime() + 86400000)
        this.setData({
            date:util.formatTime2(preDate)
        })
        // 获取购买商品本地存储
        wx.getStorage({
          key: 'orderInfo',
          success: (res)=>{
              var discount=0
            //coupon选择  前提coupon按满减条件升序排列
            // for(var item of this.data.coupons){
            //     if(res.data.total>=item.preferential_term){
            //         discount=item.preferential_price
            //         this.setData({
            //             couponId:item.id,
            //             couponTerm:item.preferential_term
            //         })
            //     }
            // }
              this.setData({
                  orderInfo:res.data,
                  //discount:discount
              })
            // success
          },
          fail: (res) => {
            // fail
          },
          complete: (res) => {
            // complete
          }
        })
        //获取地址列表,有无默认地址
        wx.request({
          url: h.main + '/selectaddress',
          data: {
            oppenid: app.globalData.oppenid
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }, // 设置请求的 header
          success: (res) => {
            console.log('order中地址列表backInfo---=')
            console.log(res.data)
            var _this=this
            res.data.map(function(item,index){
              if (item.status==1){
                _this.setData({
                  address:item
                })
              }

            })
          },
          fail: (res) => {
          },
          complete: (res) => {
          }
        })
    
        
    },

    //选择门店
    bindStoreChange: function (e) {
      this.setData({
        storeIndex: e.detail.value
      })
    },

    // 传递地址type=0
    chooseAddress: function(){
        wx.navigateTo({
          url: '../my/address/list/list?type=0',
        })
    },
    // 传递票据地址type=1
    chooseReceiptAddress: function(){
        wx.navigateTo({
          url: '../my/address/list/list?type=1',
        })
    },

    // 获取栈内地址
    backAddress: function(info){
        this.setData({
                address: info,
                })
    },
    // 获取栈内地址 票据
    backAddressReceipt: function(info){
        this.setData({
                receiptAddress: info,
                })
    },
    // 传递发票type=0
    goChooseReceipt: function(){
        wx.navigateTo({
          url: '../my/receipt/list/index?type=0'
        })
    },
    // 获取栈内发票
    backReceipt: function(info){
        this.setData({
                receiptInfo: info,
                })
    },

    // 留言
    leaveMsg: function(e){
        this.setData({
            msg: e.detail.value
        })
    },
    //送货方式
    chooseWay: function(e){
        var idx = parseInt(e.currentTarget.dataset.index)
        var way =e.currentTarget.dataset.way
        var ways = this.data.deliveryWays
        var that=this
        ways.map(function(item,index){
            if(index==idx){
                ways[index]=true
                that.setData({
                    deliveryWay:way
                })
            }else{
                ways[index]=false
            }
            console.log(index+'---'+item)
        })
        this.setData({
            deliveryWays:ways
        })
    },
    // 填写发票信息
    inputReceiptInfo: function(e){
        var nowCol = e.currentTarget.dataset.col
        var newReceiptAttachInfo=this.data.receiptAttachInfo
        newReceiptAttachInfo[nowCol]=e.detail.value
        this.setData({
            receiptAttachInfo:newReceiptAttachInfo
        })
    },
    //选择发票
    chooseIfNeedReceipt: function(e){
        var idx = parseInt(e.currentTarget.dataset.index)
        var ifNeed =e.currentTarget.dataset.need
        var ifNeedArray = this.data.ifNeedReceipts
        var that=this
        ifNeedArray.map(function(item,index){
            if(index==idx){
                ifNeedArray[index]=true
            }else{
                ifNeedArray[index]=false
            }
        })
        this.setData({
          ifNeedReceipt: ifNeed,
            ifNeedReceipts:ifNeedArray
        })
        // 若需要发票反写上发票信息
        if (ifNeed=='需要发票'){
          //发票抬头列表
          wx.request({
            url: h.main + '/selectreceipt',
            data: {
              oppenid: app.globalData.oppenid,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            }, // 设置请求的 header
            success: (res) => {
              console.log('发票抬头列表backInfor---')
              console.log(res.data)
              var temp = res.data
              var defaultReceipt={}
              var _this = this
              temp.map(function(item,index){
                if (item.setDefault==1){
                  console.log('默认的--')
                  console.log(item)
                  defaultReceipt.receipt_head = item.receiptName
                  defaultReceipt.receipt_email = item.receiptEmail
                  defaultReceipt.receipt_taxCode = item.receiptNumber
                  defaultReceipt.receipt_signAddr = item.receiptAddress
                  defaultReceipt.receipt_tel = item.receiptTel
                  defaultReceipt.receipt_bank = item.receiptBank
                  defaultReceipt.receipt_account = item.receiptBankCode

                }
                _this.setData({
                  receiptAttachInfo: defaultReceipt
                })

              })

              
            },
            fail: (res) => {
            },
            complete: (res) => {
            }
          })
        }

        console.log(this.data.ifNeedReceipt)

    },
    chooseReceiptKind: function(e){
        var idx = parseInt(e.currentTarget.dataset.index)
        var kind =e.currentTarget.dataset.kind
        var kinds = this.data.receiptKinds
        var that=this
        kinds.map(function(item,index){
            if(index==idx){
                kinds[index]=true
                that.setData({
                    receiptKind:kind
                    // deliveryWay:kind
                })
            }else{
                kinds[index]=false
            }
        })
        this.setData({
            receiptKinds:kinds
        })
    },
    // chooseStore
    chooseStore: function(){

    },
    // bindDateChange
    bindDateChange: function(e){
        this.setData({
            date: e.detail.value
        })

    },
    bindTimeSChange: function(e){
        this.setData({
            timeS: e.detail.value
        })
    },
    bindTimeEChange: function(e){
        this.setData({
            timeE: e.detail.value
        })
    },


    // 提交订单
    submitOrder: function(e){
      this.setData({
        canDo:true,
        loadingHidden:false
      })
      var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        var obj={}
        var time = new Date()
        var code = new Date().getTime()
        console.log(code)
        obj.takeCode = code
        obj.orderInfo = this.data.orderInfo
        obj.deliveryWay = this.data.deliveryWay
        obj.addr = this.data.address
        obj.ifNeedReceipt = this.data.ifNeedReceipt
        obj.receiptKind = this.data.receiptKind

        //快递送货
        if (this.data.deliveryWay == '快递送货') {
          obj.storeDelivery = {
            'store': '',
            'date': '',
            'time': '',
          }
        }

        //若是门店自提收货地址清空
        if(this.data.deliveryWay=='门店自提'){
          obj.addr = {}
          obj.storeDelivery = {
            'store': this.data.storeList[this.data.storeIndex],
            'date': '',
            'time': '',
          }
        }
        

        //门店配送
        if (this.data.deliveryWay == '门店配送') {
          obj.storeDelivery = {
            'store': this.data.storeList[this.data.storeIndex],
            'date': this.data.date,
            'time': this.data.timeS + '-' + this.data.timeE,
          }
        }



        // 验证发票信息
        if(obj.ifNeedReceipt=='需要发票'){
        if(this.data.receiptKind=='增值税普通发票'){ 

          if (this.data.receiptAttachInfo['receipt_head'] == '' || this.data.receiptAttachInfo['receipt_taxCode'] == '' || this.data.receiptAttachInfo['receipt_email'] == '' ){
                wx.showModal({    
                    title:'提示',    
                    content: '带*号的为必填项!',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {    
                            //console.log('用户点击确定') 
                          this.setData({
                            canDo: false,
                            loadingHidden: true
                          })   
                        }    
                    }    
                });
                return
            }
          
          if (!reg.test(this.data.receiptAttachInfo['receipt_email'])){
            wx.showModal({
              title: '提示',
              content: '邮箱格式不对!',
              showCancel: false,
              success: (res)=> {
                if (res.confirm) {
                  //console.log('用户点击确定') 
                  this.setData({
                    canDo: false,
                    loadingHidden: true
                  })    
                }
              }
            });
            return
            }
            //若为增值税普通发票，取出不需要的发票信息
          var afterClearInfo = this.data.receiptAttachInfo
          afterClearInfo.receipt_signAddr='',
          afterClearInfo.receipt_tel = '',
          afterClearInfo.receipt_bank = '',
          afterClearInfo.receipt_account = ''
          this.setData({
            receiptAttachInfo: afterClearInfo
          })
        }else{
          var regexp
          var _this=this
          var a = ['receipt_head',
            'receipt_taxCode',
            'receipt_signAddr',
            'receipt_tel',
            'receipt_bank',
            'receipt_account',
            'receipt_email']
            a.map(function(item,index){
              if (_this.data.receiptAttachInfo[item] == '' || _this.data.receiptAttachInfo[item]==null){
                wx.showModal({    
                    title:'提示',    
                    content: '带*号的为必填项!',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')  
                          this.setData({
                            canDo: false,
                            loadingHidden: true
                          })   
                        }    
                    }    
                });
                return
                }
            })
            if (!reg.test(this.data.receiptAttachInfo['receipt_email'])) {
              wx.showModal({
                title: '提示',
                content: '邮箱格式不对!',
                showCancel: false,
                success: (res)=> {
                  if (res.confirm) {
                    //console.log('用户点击确定') 
                    this.setData({
                      canDo: false,
                      loadingHidden: true
                    })    
                  }
                }
              });
              return
            }


            //手机和固定电话验证
            if (this.data.receiptAttachInfo['receipt_tel'].indexOf('-') > 0) {
              console.log('固定电话')
              regexp = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
            } else {
              console.log('手机')
              regexp = /^1[34578]\d{9}$/
            }

            if (!regexp.test(this.data.receiptAttachInfo['receipt_tel'])) {
              wx.showModal({
                title: '提示',
                content: '电话格式不对!',
                showCancel: false,
                success: (res)=> {
                  if (res.confirm) {
                    //console.log('用户点击确定')    
                    this.setData({
                      canDo: false,
                      loadingHidden: true
                    }) 
                  }
                }
              });
              return
            }

        }

        }else{
          obj.receiptKind=''
        }
        obj.receiptAttachInfo = this.data.receiptAttachInfo
        obj.receiptAddress= this.data.receiptAddress
        obj.message = this.data.msg || ''
        
        if(!obj.addr){
            wx.showModal({    
                    title:'提示',    
                    content: '请选择收货地址!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')  
                          this.setData({
                            canDo: false,
                            loadingHidden: true
                          })   
                        }    
                    }    
                }); 
                return
        }
        //提交订单
        wx.request({
          url: h.main + '/insertorder',
          data: {
            payed:this.data.payed,
            oppenid: app.globalData.oppenid,
            orderInfor: obj
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            // 'Accept': 'application/json',
          }, // 设置请求的 header
          success: (res) => {
            console.log('提交订单backInfo---=')
            console.log(res.data)
            var orderNum = res.data
            var bodyString = '柏田科技订单-' + res.data
            this.setData({
              loadingHidden: true
            })

            if (orderNum != '' && orderNum !=null){
              //微信支付
              wx.request({
                url: 'https://shkingdee-soft.com/xshopapi/JsapiPay',
                data: {
                  total_fee: Number(obj.orderInfo.total) * 100,
                  out_trade_no: orderNum,
                  body: bodyString.toString(),
                  open_id: app.globalData.oppenid
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  // 'Accept': 'application/json',
                }, // 设置请求的 header
                success: (res) => {
                  console.log('微信支付----')
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': 'MD5',
                    'paySign': res.data.paySign,
                    'success': (res)=> {
                      console.log('支付成功--')
                      console.log(res)
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 1000
                      })
                      wx.navigateBack({
                      })
                      //支付成功修改订单状态
                      wx.request({
                        url: h.main + '/updateorder',
                        data: {
                          oppenid: app.globalData.oppenid,
                          status: 1,
                          FBillNo: orderNum

                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        //     header: {
                        //         'content-type': 'application/x-www-form-urlencoded',
                        //         'Accept': 'application/json',
                        //     },
                        success: (res) => {
                          // success
                          console.log('支付成功修改订单状态backInfo----')
                          console.log(res)

                        },
                        fail: function () {
                          // fail
                        },
                        complete: function () {
                          // complete

                        }
                      })



                    },
                    'fail': (res)=> {
                      this.setData({
                        canDo: false
                      }) 
                      console.log(res)
                      //支付失败修改订单状态
                      wx.request({
                        url: h.main + '/updateorder',
                        data: {
                          oppenid: app.globalData.oppenid,
                          status: 0,
                          FBillNo: orderNum

                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        //     header: {
                        //         'content-type': 'application/x-www-form-urlencoded',
                        //         'Accept': 'application/json',
                        //     },
                        success: (res) => {
                          // success
                          console.log('支付失败修改订单状态backInfo----')
                          console.log(res)
                        },
                        fail: function () {
                          // fail
                        },
                        complete: function () {
                          // complete

                        }
                      })
                    }
                  })



                },
                fail: (res) => {
                },
                complete: (res) => {
                }
              })

            }
      

            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            
            
          },
          fail: (res) => {
          },
          complete: (res) => {
          }
        })

        console.log(obj)

    },
    sub: function(){
      wx.requestPayment({
        'timeStamp': '1499655019',
        'nonceStr': '3fHD6f9j4fEFbhZH',
        'package': 'prepay_id=wx20170710105019b23047a8f50240178102',
        'signType': 'MD5',
        'paySign': '8F888784C0E7EC6EFACAA9E49510DEC8',
        'success': function (res) {
          console.log('支付成功--')
          console.log(res)
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000
          })
        },
        'fail': function (res) {
        }
      })
    }
    

    

})