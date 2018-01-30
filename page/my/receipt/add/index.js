var app = getApp()
import h from '../../../../utils/url.js'
Page( {
  data: {
    unitOrIndividual:[true,false],
    normalOrSpecial: [true, false],
    whichKind:[true,false],
    setDefault:false,
    receiptKindUI:'',
    receiptKindNS:'增值税普通发票',
    receiptName:'',
    receiptNumber:'',
    receiptAddress:'',
    receiptTel:'',
    receiptBank:'',
    receiptBankCode:'',
    receiptEmail:'',
    canDo:false
    

  },

  onLoad: function() {
    
   
  },
   //switch
    switchChange: function (e){
        var ifSetDefault = this.data.setDefault
        this.setData({
            setDefault:!ifSetDefault
        })
    },
  // chooseKindUI: function(e){
  //       var idx = parseInt(e.currentTarget.dataset.index)
  //       var kind =e.currentTarget.dataset.kind
  //       var kinds = this.data.unitOrIndividual
  //       var that=this
  //       kinds.map(function(item,index){
  //           if(index==idx){
  //               kinds[index]=true
  //               // that.setData({
  //               //     deliveryWay:kind
  //               // })
  //           }else{
  //               kinds[index]=false
  //           }
  //       })
  //       this.setData({
  //           unitOrIndividual:kinds,
  //           receiptKindUI:kinds[0]==true?'单位':'个人'
  //       })
  //       // 为个人时多余选项清空
  //       if(this.data.receiptKindUI=='个人'){
  //           this.setData({
  //               receiptAddress:'',
  //               receiptTel:'',
  //               receiptBank:'',
  //               receiptBankCode:''
  //           })
  //       }
  // },
  chooseRceiptKind: function(e){
        var idx = parseInt(e.currentTarget.dataset.index)
        var kind =e.currentTarget.dataset.kind
        var kinds = this.data.normalOrSpecial
        var that=this
        kinds.map(function(item,index){
            if(index==idx){
                kinds[index]=true
            }else{
                kinds[index]=false
            }
        })
        this.setData({
            normalOrSpecial:kinds,
            receiptKindNS:kinds[0]==true?'增值税普通发票':'增值税专用发票'
        })
        // 为增值税普通发票时多余选项清空
        if(this.data.receiptKindNS=='增值税普通发票'){
            this.setData({
                receiptAddress:'',
                receiptTel:'',
                receiptBank:'',
                receiptBankCode:''
            })
        }
  },


  //change input value fns
  changeName: function(e){
      this.setData({
          receiptName:e.detail.value
      })
  },
  changeNumber: function(e){
      this.setData({
          receiptNumber:e.detail.value
      })
  },
  changeAddress: function(e){
      this.setData({
          receiptAddress:e.detail.value
      })
  },
  changeTel: function(e){
      this.setData({
          receiptTel:e.detail.value
      })
  },
  changeBank: function(e){
      this.setData({
          receiptBank:e.detail.value
      })
  },
  changeBankCode: function(e){
      this.setData({
          receiptBankCode:e.detail.value
      })
  },
  changeEmail: function(e){
      this.setData({
          receiptEmail:e.detail.value
      })
  },
  saveReceipt: function(){
    this.setData({
      canDo: true
    })
    // 填写验证
    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    var regexp
    //手机和固定电话验证
    if (this.data.receiptTel.indexOf('-') > 0) {
      console.log('固定电话')
      regexp = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
    } else {
      console.log('手机')
      regexp = /^1[34578]\d{9}$/
    }

      if (this.data.receiptName == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入发票抬头!',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                            this.setData({
                              canDo:false
                            })
                        }    
                    }    
                });    
			return;
		}
        if (this.data.receiptNumber == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入税号!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: (res) => {
                      if (res.confirm) {
                        //console.log('用户点击确定')    
                        this.setData({
                          canDo: false
                        })
                      }
                    }     
                });    
			return;
		}
        if (this.data.receiptEmail == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入收票邮箱!',     
                    showCancel: false,    
                    success: (res) => {
                      if (res.confirm) {
                        //console.log('用户点击确定')    
                        this.setData({
                          canDo: false
                        })
                      }
                    }    
                });    
			return;
		}
        if (!reg.test(this.data.receiptEmail)) {
          wx.showModal({
            title: '提示',
            content: '邮箱格式不对!',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                //console.log('用户点击确定')    
                this.setData({
                  canDo: false
                })
              }
            } 
          });
          return
        }
        
        if(this.data.normalOrSpecial[1]==true){
            if(this.data.receiptAddress == '' || this.data.receiptTel == '' || this.data.receiptBank == '' || this.data.receiptBankCode == '' ){
                wx.showModal({    
                    title:'提示',    
                    content: '带*的为必填项!', 
                    showCancel: false,    
                    success: (res) => {
                      if (res.confirm) {
                        //console.log('用户点击确定')    
                        this.setData({
                          canDo: false
                        })
                      }
                    }    
                });    
			return;
            }
            //手机和固定电话验证
            if (!regexp.test(this.data.receiptTel)) {
              wx.showModal({
                title: '提示',
                content: '电话格式不对!',
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                    //console.log('用户点击确定')    
                    this.setData({
                      canDo: false
                    })
                  }
                }
              });
              return
            }

        }
        //添加发票抬头
        var invoice = { 
          "oppen_id": app.globalData.oppenid,
          "fdefault": this.data.setDefault?1:0,
          "fname": this.data.receiptName,
          "ftype": this.data.receiptKindNS,
          "ftaxno": this.data.receiptNumber,
          "faddress": this.data.receiptAddress, 
          "fteleno": this.data.receiptTel, 
          "fuser": this.data.receiptBank,
          "fbankaccountno": this.data.receiptBankCode, 
          "femail": this.data.receiptEmail 
          }
        console.log('invoice-----')
        console.log(invoice)
        //  var str = JSON.stringify(invoice)
        // var invoiceJson = JSON.parse(str)

        // console.log(typeof invoiceJson)


        wx.request({
          url: h.main + '/page/headeradd.do',
          data: {
            invoice: JSON.stringify(invoice)
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }, // 设置请求的 header
          success: (res) => {
            console.log('添加发票抬头backInfor---')
            console.log(res.data)
            if (res.data =='SUCCESS'){
              wx.showToast({
                title: '保存成功!',
                duration: 500
              });
              // 等待半秒，toast消失后返回上一页
              setTimeout(function () {
                wx.navigateBack();
              }, 500);
            }
          },
          fail: (res) => {


          },
          complete: (res) => {

          }
        })
      
  },
    


})