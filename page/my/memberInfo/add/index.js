var app = getApp()
import h from '../../../../utils/url.js'
import util from '../../../../utils/util.js'
Page({
    data: {
      preAddrIdx:0,
      memberInfo:{},
      issueDate: '请选择',
      certificateKindIdx:0,
      certificateKindArray: ['请选择','港澳台通行证','护照'],
      credentialLimitDateS:'开始日期',
      credentialLimitDateE: '结束日期',
      IDLimitDateS:'开始日期',
      IDLimitDateE:'结束日期',
      birthDate:'请选择',
      sex:'请选择',
      sexArray:['请选择','男','女'],
      sexIdx:0,
      type: '1',  //0-新建  1-编辑  2-提交订单时填写  3-填写完查看
      mk:'',      //0-儿童  1-成人
      idx:'',     //订单中出行人中第几个
      loadingHidden:true,
      canWork:false
       
           
    },
    onLoad: function (options) {
      this.setData({
        type: options.type,
        mk: options.mk,
        idx: options.idx,
      })
      switch (options.type){
        case '1':
        wx.getStorage({
          key: 'membberInfoForEdit',
          success: (res) => {
            this.formatBackInfo(res.data)
          },
        })
        break;
        case '3':
          wx.getStorage({
            key: 'membberInfoForOrder',
            success: (res) => {
              this.formatBackInfo(res.data)
            },
          })
          break;
          default:
          var emptyTemp = {
            EFName: '',
            ELName: '',
            IDCard: '',
            cjzj:'',
            IDLimitDateE: '',
            IDLimitDateS: '',
            addr: '',
            age: '',
            birthDate: '',
            birthPlace: '',
            certificateKind: '',
            certificateNum: '',
            credentialLimitDateE: '',
            credentialLimitDateS: '',
            emergencyContact: '',
            emergencyPhone: '',
            id: '',
            issueDate: '',
            issueOffice: '',
            issuePlace: '',
            name: '',
            phone: '',
            sex: '',
          }
          this.setData({
            memberInfo: emptyTemp
          })
      }
      
    },
    onShow: function () {
      this.getMemberInfoList()
    },
    //导入已有地址
    bindAddrBackIn: function(e){
      var wholePreAddr = this.data.wholePreAddr[e.detail.value]
      this.formatBackInfo(wholePreAddr)
    },
    // 修改input框信息
    changeInfo: function(e){
      var memberInfo = this.data.memberInfo
      var nodeName = e.currentTarget.dataset.type
      var nodeVal = e.detail.value
      if (nodeName =='EFName'){
        memberInfo[nodeName] = nodeVal.toUpperCase()
      }else{
        memberInfo[nodeName] = nodeVal
      }
      this.setData({
        memberInfo: memberInfo
      })
    },
    // 证件类型选择
    bindCertificateKindChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.certificateKind = e.detail.value
      this.setData({
        certificateKindIdx: e.detail.value,
        memberInfo: memberInfo
      })
    },

    // 签证有效期
    bindLimitDateSChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.credentialLimitDateS = e.detail.value
      this.setData({
        credentialLimitDateS: e.detail.value,
        memberInfo: memberInfo
      })
    },
    bindLimitDateEChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.credentialLimitDateE = e.detail.value
      this.setData({
        credentialLimitDateE: e.detail.value,
        memberInfo: memberInfo
      })
    },
    // 身份证有效期
    bindIDLimitDateSChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.IDLimitDateS = e.detail.value
      this.setData({
        IDLimitDateS: e.detail.value,
        memberInfo: memberInfo
      })
    },
    bindIDLimitDateEChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.IDLimitDateE = e.detail.value
      this.setData({
        IDLimitDateE: e.detail.value,
        memberInfo: memberInfo
      })
    },
    // 发证日期
    bindIssueDateChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.issueDate = e.detail.value
      this.setData({
        issueDate: e.detail.value,
        memberInfo: memberInfo
      })
    },
    // 出生日期
    bindBirthDateChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.birthDate = e.detail.value
      this.setData({
        birthDate: e.detail.value,
        memberInfo: memberInfo
      })
    },
    //性别
    bindSexChange: function (e) {
      var memberInfo = this.data.memberInfo
      memberInfo.sex = e.detail.value
      this.setData({
        sexIdx: e.detail.value,
        memberInfo: memberInfo
      })
    },
    
    // 保存信息
    saveMemberInfo: function(){
      // 必填字段校验
      if (!this.data.memberInfo.name || !this.data.memberInfo.IDCard || !this.data.memberInfo.age || this.data.sexIdx == 0 || !this.data.memberInfo.phone || !this.data.memberInfo.addr || !this.data.memberInfo.emergencyContact || !this.data.memberInfo.emergencyPhone) {
        wx.showModal({
          title: '提示',
          content: '带*为必填项！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
        return false
      }
      //手机号校验
      if (!(/^1[34578]\d{9}$/.test(this.data.memberInfo.phone)) || !(/^1[34578]\d{9}$/.test(this.data.memberInfo.emergencyPhone))) {
        wx.showModal({
          title: '提示',
          content: '请正确填写联系电话!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
               
            }
          }
        });
        return false  
      }
      // 新增出行人的提交id为空
      if (this.data.type == 0) {
        var temp = this.data.memberInfo
        temp.id=''
        this.setData({
          memberInfo: temp
        })
      }
      console.log('memberInfo---')
      console.log(this.data.memberInfo)
      //新增编辑时点击保存
      if (this.data.type == 0 || this.data.type == 1){
        this.setData({
          canWork: true,
          loadingHidden:false
        })
        wx.request({
          url: h.main + '/inserthz.html',
          data: {
            membberInfo: JSON.stringify(this.data.memberInfo),
            openid: app.globalData.oppenid,
            base: app.globalData.base,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }, // 设置请求的 header
          success: (res) => {
            console.log('保存出行人backInfo---=')
            console.log(res)
            this.setData({
              loadingHidden: true
            })
            if (res.data==1){
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
      }else{
        //提交订单时临时存储
        wx.getStorage({
          key: 'submitOrderInfo',
          success: (res)=> {
            if (res.data.kind =='境外'){
              //境外游证件类型和证件号码必填
              if (this.data.memberInfo.certificateKind == 0 || this.data.memberInfo.certificateNum == '' || this.data.memberInfo.cjzj == '') {
                wx.showModal({
                  title: '提示',
                  content: '您选择的是境外游,出境证件、证件类型和证件号码必须填写!',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {

                    }
                  }
                });
              }else{
                //信息填写符合
                var pages = getCurrentPages();
                if (pages.length > 1) {
                  var prePage = pages[pages.length - 2];
                  prePage.backMemberInfo(this.data.mk, this.data.idx, this.data.memberInfo)
                }
                wx.navigateBack()
              }
            }else{  // 国内游
              //信息填写符合
              var pages = getCurrentPages();
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.backMemberInfo(this.data.mk, this.data.idx, this.data.memberInfo)
              }
              wx.navigateBack()
            }
          },
        })
        

      }
    },

    //获取出行人信息列表
    getMemberInfoList: function () {
      let requestPromisified = util.wxPromisify(wx.request);
      requestPromisified({
        url: h.main + '/selecthz.html',
        data: {
          openid: app.globalData.oppenid,
          base: app.globalData.base,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }, // 设置请求的 header
      }).then((res) => {
        console.log('常用出行人列表backInfo P ---=')
        console.log(res.data)
        var simpleIDPreAddr = res.data
        simpleIDPreAddr.map(function (item, index) {
          var partOfID = item.IDCard.replace(/(\w)/g, function (a, b, c) {
            return (c < (item.IDCard.length - 3) && c >= 6) ? '*' : a
          });
          item.simpleIDCard = partOfID
          item.select = item.name + ' ' + item.simpleIDCard
        })
        this.setData({
          wholePreAddr: res.data,
          preAddr: simpleIDPreAddr
        })
      }).catch((res) => {
        console.error("get 行人信息 failed")
        console.log(res)
      })
    },
    
    //统一格式化返回信息
    formatBackInfo: function(data){
      this.setData({
        memberInfo: data,
        certificateKindIdx: data.certificateKind ? data.certificateKind:0,
        credentialLimitDateS: data.credentialLimitDateS ? data.credentialLimitDateS:'开始日期',
        credentialLimitDateE: data.credentialLimitDateE ? data.credentialLimitDateE:'结束日期',
        issueDate: data.issueDate ? data.issueDate:'请选择',
        IDLimitDateS: data.IDLimitDateS ? data.IDLimitDateS :'开始日期',
        IDLimitDateE: data.IDLimitDateE ? data.IDLimitDateE :'结束日期',
        sexIdx: data.sex ? data.sex:0,
        birthDate: data.birthDate ? data.birthDate:'请选择',
      })
    }

    

    

})