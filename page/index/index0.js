import h from '../../utils/url.js'
import util from '../../utils/util.js'
// var bmap = require('../../utils/bmap-wx.js');
// var wxMarkerData = []; 
var app = getApp()
Page({
  data: {
    imgUrls: ['http://gaopin-preview.bj.bcebos.com/133208518757.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133103264709.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133208523232.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133107709454.jpg@!420'],
    loadingHidden: false,
    topTit:['销量明星','醉美目的地','当季热玩','疯狂折扣','周末出游','程品'],
    topTitIcon: ['../../image/icon/crown.png', '../../image/icon/thumb.png', '../../image/icon/hot.png', '../../image/icon/sale.png', '../../image/icon/rest.png','../../image/icon/diamond2.png'],
    recommendModule: { "left": [{ "Ftit": '玩翻今夏 嗨翻暑假', "Stit": '低至399元', 'Ttit': '领取888元红包', 'img': 'http://pic.qiantucdn.com/58pic/17/30/56/43H58PICReb_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center' }, { "Ftit": '三亚七折起', "Stit": '住豪华五星', 'Ttit': '', 'img': 'http://pic.qiantucdn.com/58pic/19/68/44/33X58PICF8A_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center' }], 'right': [{ "Ftit": '特卖汇', "Stit": '特价旅游频道', 'Ttit': '', 'img':'http://pic.qiantucdn.com/58pic/19/28/94/569471862482a_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center' }, { "Ftit": '满400立减200', "Stit": '广发携程卡专享', 'Ttit': '', 'img':'http://pic.qiantucdn.com/58pic/26/16/79/58c48af4621ef_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center' }, { "Ftit": '立减300元', "Stit": '指定龙卡信用卡专享', 'Ttit': '', 'img':'http://pic.qiantucdn.com/58pic/21/62/37/42j58PICV6s_1024.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center' }]},
    limitGoods: [{ 'img': 'http://gaopin-preview.bj.bcebos.com/133100297222.jpg@!420', 'tit':'江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游','ifHas':'席位充足','price':399},
      { 'img': 'http://gaopin-preview.bj.bcebos.com/133201652070.jpg@!420', 'tit': '江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游', 'ifHas': '席位充足', 'price': 399 },
      { 'img': 'http://gaopin-preview.bj.bcebos.com/133105685493.jpg@!420', 'tit': '江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游', 'ifHas': '席位充足', 'price': 399 },
      { 'img': 'http://gaopin-preview.bj.bcebos.com/133101652941.jpg@!420', 'tit': '江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游', 'ifHas': '席位充足', 'price': 399 },
      { 'img': 'http://gaopin-preview.bj.bcebos.com/133101654218.jpg@!420', 'tit': '江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游', 'ifHas': '席位充足', 'price': 399 },
      { 'img': 'http://gaopin-preview.bj.bcebos.com/133200529163.jpg@!420', 'tit': '江苏扬州2日半自助游江苏扬州2日半自助游江苏扬州2日半自助游', 'ifHas': '席位充足', 'price': 399 }],
    guarantees: ['透明团(仅跟团游)', '特殊原因退订保障', '自然灾害保障体系', '旅游预警机制', '应急援助体系' , '一站式旅游保险'],
    destinationKind: ['境外游', '国内游', '省内游', '周边游', '自由行', '一日游', '游轮','机+酒'],
  },
  
  onReady: function () {
    
  },


  onLoad: function (options) {
    console.log('onLoad=========')
    // 清空本地存储
    //wx.clearStorage()
    //调用应用实例的方法获取全局数据
        app.getUserInfo((userInfo)=> {
            this.setData({
                userInfo: userInfo,
                nickName:userInfo.nickName,
            })
            console.log(this.data.userInfo)
        })
        app.getLocation()
  },


  onShow: function () {
    // 获取优惠线路信息
    this.getPreferentialLine()
  },
  scroll: function () {
    console.log('滚动---')
  },
  // 跳转到商品详情
  toWareClip: function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../wareClip/calendar/index?id=' + id,
    })
  },
  // 跳转目的地
  toDestination: function (e) {
    var kind = e.currentTarget.dataset.kind
    if (kind!=7){  //7-游轮
      app.globalData.destinationKind = this.data.destinationKind[kind]
      app.globalData.gloabalCur = kind
      wx.switchTab({
        url: '../destination/index',
      })
    }else{
      
    }
  },

  getPreferentialLine: function() {
      var requestPromisified = util.wxPromisify(wx.request);
      requestPromisified({
        url: h.main + '/youhui.html',
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        console.log('优惠线路信息P backInfo---=')
        console.log(res.data)
        this.setData({
          preferentialTravel: res.data,
          loadingHidden: true
        })
      }).catch(() => {
        console.error("get failed")
      })
  }
 
})