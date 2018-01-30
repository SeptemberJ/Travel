const AV = require('../../../../utils/av-weapp.js')
import h from '../../../../utils/url.js'
import util from '../../../../utils/util.js'
var app = getApp()
Page({
  data: {
    memberList:[],
    type:0,  //1-可以点击导入信息  0-常规无法点击
    loadingHidden: false,
  },
  onLoad: function (options) {
    // 订单提交页面进入type--0  票据--1
    this.setData({
      type: options.type
    })
  },
 
  onShow: function () {
    this.getMemberInfoList()
  },

  //获取出行人信息列表
  getMemberInfoList: function(){
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
    }).then((res)=>{
      console.log('常用出行人列表backInfo P ---=')
      console.log(res.data)
      //身份证隐藏部分
      var temp = res.data
      temp.map(function (item, index) {
        var partOfID = item.IDCard.replace(/(\w)/g, function (a, b, c) {
          return (c < (item.IDCard.length - 3) && c >= 6) ? '*' : a
        });
        item.simpleIDCard = partOfID
      })
      this.setData({
        memberList: temp,
        loadingHidden: true
      })
    }).catch((res)=>{
      console.error("get 行人信息 failed")
      console.log(res)
    })
  },

  // 添加出行人信息
  addMember: function () {
    console.log('cilcked---add')
    wx.navigateTo({
      url: '../add/index?type=0'
    });
  },

  // 编辑出行人信息
  edit: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var editmembberInfo = this.data.memberList[index]
    wx.setStorage({
      key: "membberInfoForEdit",
      data: editmembberInfo,
      success:()=>{
        wx.navigateTo({
          url: '../add/index?type=1&&id=' + this.data.memberList[index].id,
        });
      }
    })
    
  },
  
  // 删除出行人
  del: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认删除该出行人？',
      success: (res) => {
        if (res.confirm) {
          let afterDel = this.data.memberList
          let index = parseInt(e.currentTarget.dataset.index);
          let requestPromisified = util.wxPromisify(wx.request);
          requestPromisified({
            url: h.main + '/deletehz.html',
            data: {
              id: this.data.memberList[index].id,
              base: app.globalData.base,
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }).then((res)=>{
            if (res.data == 1) {
              console.log(index)
              afterDel.splice(index, 1)
              this.setData({
                memberList: afterDel,
              })
              wx.showToast({
                title: '删除成功！',
                duration: 500
              });
            } else {
              wx.showToast({
                title: '删除失败！',
                duration: 500
              });
            }
          }).catch((res)=>{
            console.error("get 删除出行人 failed")
            console.log(res)
          })
        }
      }
    })

  },
  // 订单页跳转选择出行人信息
  backLeadingIn: function (e) {
    var memberIdx = e.currentTarget.dataset.index
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.backLeadingIn(this.data.memberList[memberIdx])
    }
    console.log(this.data.memberList[memberIdx])
    wx.navigateBack()
  }

})