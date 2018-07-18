var app = getApp()
import h from '../../utils/url.js'
Page({
    data: {
      info:{
        // 'traveLine':'巴沙7日5晚自由行.[国庆早定两人减1000]直飞3+2双酒店+接机巴沙7日5晚自由行.[国庆早定两人减1000]',
        // 'date':'2017-8-28',
        // 'adults':2,
        // 'childs':1
      },
      insuranceCur:0,
      insuranceId:'',
      personalInfo:{},
      canDo:false,
      loadingHidden:true
       
           
    },
    onLoad: function() {
      console.log('onload---')
      wx.getStorage({
        key: 'submitOrderInfo',
        success: (res) => {
          var adultsArray = []
          var childsArray = []
          for (var i = 0; i < res.data.adultNum; i++) {
            adultsArray.push({ 'name': '' })
          }
          for (var i = 0; i < (res.data.childNumA + res.data.childNumB); i++) {
            childsArray.push({ 'name': '' })
          }
          this.setData({
            adultsArray: adultsArray,
            childsArray: childsArray
          })
        },
      })
      

    },
    onShow: function () {
      wx.getStorage({
        key: 'submitOrderInfo',
        success: (res)=> {
          this.setData({
            submitOrderInfo:res.data
          })
          this.getInsurance()
        },
      })
    },
    // 选择或填写出行人信息
    toAddMemberInfo: function(e){
      var mk = e.currentTarget.dataset.memberkind
      var idx = e.currentTarget.dataset.idx
      if (mk==1){
        wx.setStorage({
          key: "membberInfoForOrder",
          data: this.data.adultsArray[idx]
        })
        if (this.data.adultsArray[idx].name==''){
          wx.navigateTo({
            url: '../my/memberInfo/add/index?type=2&&mk=' + mk + '&&idx=' + idx,
          })
        }else{
          wx.navigateTo({
            url: '../my/memberInfo/add/index?type=3&&mk=' + mk + '&&idx=' + idx,
          })
        }

      }else{
        wx.setStorage({
          key: "membberInfoForOrder",
          data: this.data.childsArray[idx]
        })
        if (this.data.childsArray[idx].name == '') {
          wx.navigateTo({
            url: '../my/memberInfo/add/index?type=2&&mk=' + mk + '&&idx=' + idx,
          })
        } else {
          wx.navigateTo({
            url: '../my/memberInfo/add/index?type=3&&mk=' + mk + '&&idx=' + idx,
          })
        }
      }
      
    },
    //选择保险
    chooseInsurance: function (e) {
      const InsuranceCur = e.currentTarget.dataset.idx
      const Insuranceid = e.currentTarget.dataset.insuranceid
      let temp = this.data.submitOrderInfo
      let insurancePrice = this.data.insurancePrice
      if (temp.length <= 0) {
        this.setData({
          insuranceCur: InsuranceCur
        })

      } else {
        temp.totalPrice = temp.totalPrice - insurancePrice + (this.data.insuranceList[InsuranceCur].FBX * (temp.adultNum + temp.childNumA + temp.childNumB))
        insurancePrice = this.data.insuranceList[InsuranceCur].FBX * (temp.adultNum + temp.childNumA + temp.childNumB)
        this.setData({
          insuranceCur: InsuranceCur,
          insuranceId: Insuranceid,
          submitOrderInfo: temp,
          insurancePrice: insurancePrice
        })
      }
    },
    //填写完返回修改数据
    //mk 0-儿童  1-成人
    //idx 同类中第几个
    backMemberInfo: function(mk,idx,data){
      console.log('back---')
      console.log(data)
      if(mk==1){
        var temp = this.data.adultsArray
        temp[idx] = data
        this.setData({
          adultsArray: temp
        })
      }else{
        var temp = this.data.childsArray
        temp[idx] = data
        this.setData({
          childsArray: temp
        })
      }
      
    },
    //支付
    toPay: function(){
      var _this = this
      //校验是否所有出行人的信息都已填写
      var canPayA = true
      var canPayC = true
      if (this.data.submitOrderInfo.adultNum>0){
        for (var item of this.data.adultsArray) {
          if (item.name == '') {
            canPayA = false
            break
          }
        }
      }
      if ((this.data.submitOrderInfo.childNumA + this.data.submitOrderInfo.childNumB) > 0) {
        for (var item of this.data.childsArray) {
          if (item.name == '') {
            canPayC = false
            break
          }
        }
      }
      //填写完可以去支付
      if (canPayA && canPayC){
        var obj = {}
        obj.openid = app.globalData.oppenid
        obj.id = app.globalData.shopId
        obj.orderInfo = this.data.submitOrderInfo
        obj.adultsInfo = this.data.adultsArray
        obj.childsInfo = this.data.childsArray
        obj.insurance = this.data.insuranceId
        console.log(obj)  //submitOrderInfo
        this.setData({
          canDo: true,
          loadingHidden: false
        })
        //换取订单号
        wx.request({
          url: h.main + '/insertorder.html',
          data: {
            submitOrderInfo: JSON.stringify(obj),
            base: app.globalData.base
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }, // 设置请求的 header
          success: (res) => {
            console.log('预提交订单backInfo---=')
            console.log(res.data)
            if (res.data[0]==1){
              this.weChatPay(res.data[1], obj.orderInfo.totalPrice)
              //this.updateOrderStstus(res.data[1])
            }else{
              wx.showToast({
                title: '提交订单失败!',
                image: '../../image/icon/attention.png',
                duration: 2000
              })
              this.setData({
                canDo: false,
                loadingHidden: true
              })
            }
            
          },
          fail: (res) => {
          },
          complete: (res) => {
            this.setData({
              loadingHidden: true
            })
          }
        })
      }else{
        app.showToast('请填写完所有出行人的信息!')
        this.setData({
          //canDo: false,
          loadingHidden: true
        })
      }
    },
    // 获取保险
    getInsurance: function (e) {
      wx.request({
        url: h.main + '/price.html',
        data: {
          fid_z: this.data.submitOrderInfo.id,
          xqxlmc: this.data.submitOrderInfo.travelLine,
          base: app.globalData.base
          // id: app.globalData.shopId
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
        success: (res) => {
          console.log('保险信息backInfo---=')
          console.log(res.data)
          let InsuranceList
          let noInsurance ={
            // ID:0,
            FBX:0
          }
          // InsuranceList = res.data

          if (res.data[0].FBX != 0){
            let InitArray = res.data
            InitArray.unshift(noInsurance)
            InsuranceList = InitArray
          }else{
            InsuranceList = res.data
          }
          console.log('===2')
          console.log(InsuranceList)
          
          let temp = this.data.submitOrderInfo
          let insurancePrice = InsuranceList[0].FBX * (temp.adultNum + temp.childNumA + temp.childNumB)
          temp.totalPrice = temp.totalPrice + insurancePrice
          this.setData({
            insuranceList: InsuranceList,
            insuranceId: InsuranceList[0].FBX,
            submitOrderInfo: temp,
            insurancePrice: insurancePrice
          })
          console.log('保险---')
          console.log(this.data.insuranceList)
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
    },

    // 微信支付
    weChatPay: function (orderNum, totalPrice){
      var bodyString = '旅游订单-' + orderNum
      if (orderNum != '' && orderNum != null) {
        //微信支付
        wx.request({
          url: h.main + '/JsapiPay.html',
          data: {
            total_fee: Math.round(totalPrice * 100),// * 100
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
            console.log('收到正确时间戳----')
            console.log(res)
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': 'MD5',
              'paySign': res.data.paySign,
              'success': (res) => {
                console.log('调起成功-----')
                console.log(res)
                wx.showToast({
                  title: '支付成功!',
                  icon: 'success',
                  duration: 1000
                })
                wx.navigateBack({
                })
                //支付成功修改订单状态
                wx.request({
                  url: h.main + '/updateorder.html',
                  data: {
                    status: 1,
                    FBillNo: orderNum,
                    base: app.globalData.base
                  },
                  method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'Accept': 'application/json',
                      },
                  success: (res) => {
                    // success
                    console.log('支付失败修改订单状态backInfo----')
                    console.log(res)
                    if(res.data==1){
                      wx.navigateBack();
                    }else{
                      wx.showToast({
                        title: '订单状态修改失败!',
                        image: '../../image/icon/attention.png',
                        duration: 2000
                      })
                    }
                  },
                  fail: function () {
                    // fail
                  },
                  complete: function () {
                    // complete
                  }
                })
              },
              'fail': (res) => {
                console.log('调起失败-----')
                // this.setData({
                //   canDo: false
                // })
                console.log(res)
                //支付失败修改订单状态
                wx.request({
                  url: h.main + '/updateorder.html',
                  data: {
                    status: 0,
                    FBillNo: orderNum,
                    base: app.globalData.base

                  },
                  method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'Accept': 'application/json',
                      },
                  success: (res) => {
                    // success
                    console.log('支付失败修改订单状态backInfo----')
                    console.log(res)
                    if (res.data == 1) {
                      wx.navigateBack();
                    } else {
                      wx.showToast({
                        title: '订单状态修改失败!',
                        image: '../../image/icon/attention.png',
                        duration: 2000
                      })
                      this.setData({
                        canDo: false,
                        loadingHidden: true
                      })
                    }
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
    },
    //支付成功修改订单状态
    updateOrderStstus: function (orderNum){
      wx.request({
        url: h.main + '/updateorder.html',
        data: {
          status: 0,
          FBillNo: orderNum,
          base: app.globalData.base
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        success: (res) => {
          // success
          console.log('支付失败修改订单状态backInfo----')
          console.log(res)
          if (res.data == 1) {
            wx.navigateBack();
          } else {
            wx.showToast({
              title: '订单状态修改失败!',
              image: '../../image/icon/attention.png',
              duration: 2000
            })
            this.setData({
              canDo: false,
              loadingHidden: true
            })
          }
        },
        fail: function () {
          // fail
        },
        complete: function () {
          
        }
      })
    }
    

    

})