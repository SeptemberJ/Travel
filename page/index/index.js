import h from '../../utils/url.js'
import util from '../../utils/util.js'
// var bmap = require('../../utils/bmap-wx.js');
// var wxMarkerData = []; 
var app = getApp()
Page({
  data: {
    imgUrls: ['http://gaopin-preview.bj.bcebos.com/133208518757.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133103264709.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133208523232.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133107709454.jpg@!420'],
    indicatorDots: true,
    circular: true,
    autoplay: false,
    // destinationKind: ['境外游', '国内游', '省内游', '周边游', '自由行', '一日游', '游轮', '机+酒'],
    modules:[],//类目
    loadingHidden:  false,
    city: app.globalData.city,
    guarantees: ['透明团(仅跟团游)', '特殊原因退订保障', '自然灾害保障体系', '旅游预警机制', '应急援助体系', '一站式旅游保险'],
  },
  
  onReady: function () {
    
  },


  onLoad: function (options) {
    // var _this = this
    // console.log('onLoad=========')
    // // 清空本地存储
    // wx.clearStorage()
    // //调用应用实例的方法获取全局数据
    //     app.getUserInfo((userInfo)=> {
    //         this.setData({
    //             userInfo: userInfo,
    //             nickName:userInfo.nickName,
    //         })
    //         console.log(this.data.userInfo)
    //     })
    //     app.getLocation(_this, this.getPreferentialLine)
  },


  onShow: function () {
    // 获取优惠线路信息
    this.getPreferentialLine(app.globalData.shopId)
    this.setData({
      city: app.globalData.city
    })
  },
  scroll: function () {
    console.log('滚动---')
  },
  // 跳转到商品详情
  toWareClip: function(e){
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../wareClip/calendar/index?id=' + id + '&name=' + name,
    })
  },
  // 跳转目的地
  toDestination: function (e) {
    console.log(e.currentTarget.dataset.idx+"=======")
    var kindIdx = e.currentTarget.dataset.idx
    app.globalData.destinationKind = this.data.modules[kindIdx][0].MINGCHEN
    app.globalData.gloabalCur = kindIdx
    wx.switchTab({
      url: '../destination/index',
    })
  },
  //获取优惠线路
  getPreferentialLine: function (ID) {
      let requestPromisified = util.wxPromisify(wx.request);
      requestPromisified({
        url: h.main + '/youhui.html',
        data: {
          id: ID
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        console.log('优惠线路信息P backInfo---=')
        console.log(res.data)
        // let afterConcat = res.data[0][0].concat(res.data[0][1])
        let afterConcat = res.data[0]
        let newPreferentialTravel = []
        if (afterConcat.length > 0) {
          //重组数据
          let temp = afterConcat.slice(0, afterConcat.length)
          let len = temp.length / 5
          for (let i = 0; i < len; i++) {
            let eachArray = temp.splice(0, 5)
            let obj = {
              'FID_Z': eachArray[0],
              'XLMC': eachArray[1],
              'ZWS': eachArray[2],
              'YH1': eachArray[3],
              'IMG': eachArray[4],
            }
            newPreferentialTravel.push(obj)
          }
        }
        this.setData({
          carouse: res.data[2],
          modules: res.data[1],
          preferentialTravel: newPreferentialTravel,
          loadingHidden: true
        })
        app.globalData.modules = res.data[1]
        app.globalData.base = res.data[3]
        app.globalData.destinationKind = res.data[1][0][0].MINGCHEN
        }).catch((res) => {
          console.error("get 优惠线路 failed")
        console.log(res)
      })
  },
  // changeCity
  changeCity: function(){
    wx.navigateTo({
      url: '../chooseCity/index',
    })
  }
  //getLocation
  // getLocation: function () {
  //   var _this = this
  //   var getLocationPromisified = util.wxPromisify(wx.getLocation);
  //   getLocationPromisified({
  //     type: 'wgs84',
  //   }).then((res) => {
  //     console.log('位置信息P backInfo---=')
  //     console.log(res)
  //     app.globalData.latitude = res.latitude
  //     app.globalData.longitude = res.longitude
  //     app.convertCity(res.latitude, res.longitude, _this)
  //     }).catch(() => {
  //       console.error("get failed")
  //     })
  // }
 
})