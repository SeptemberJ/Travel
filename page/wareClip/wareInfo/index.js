var WxParse = require('../../wxParse/wxParse.js')
import h from '../../../utils/url.js'
import util from '../../../utils/util.js'
var app = getApp()
Page({
  data: {
    id:'',
    lineName:'',
    imgUrls: ['http://gaopin-preview.bj.bcebos.com/133106636547.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133106636545.jpg@!420','http://gaopin-preview.bj.bcebos.com/133106636695.jpg@!420'],
    indicatorDots: true,
    circular: true,
    autoplay: false,
    // hasEmptyGrid: false,
    // cur: '',
    // choosed: '',
    // adults:0,
    adultNum:0,
    childNumA:0,
    childNumB:0,
    totalPrice:0,
    attachedCostAmount:0,
    loadingHidden: false,
    city: app.globalData.city
    
  },
  onReady: function () {
    
  },


  onLoad: function (options) {
    this.setData({
      id:options.id,
      lineName: options.name
    })
    // 清空本地存储
    //wx.clearStorage()
  },
  onShow: function(){
    //  简介假数据
    // const article = "<p>路线简介路线简介内容路线简介内容路线简介内容路线简介内容路线简介内容路线简介内容路线简介内容</p>";
    // WxParse.wxParse('article', 'html', article, this, 5);
    this.setData({
      city: app.globalData.city,
      adultNum: 0,
      childNumA: 0,
      childNumB: 0,
      totalPrice: 0,
    })
    // 获取线路信息
    this.getTravelLineInfo(this.data.id, this.data.lineName)
  },
  // changeCity
  changeCity: function () {
    wx.navigateTo({
      url: '../chooseCity/index',
    })
  },
  // 图片预览
  previewImage: function (e) {
    var currentImgUrl = e.currentTarget.dataset.url
    wx.previewImage({
      current: currentImgUrl,
      urls: currentImgUrl,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 提交订单
  submitOrder: function(){
    var attachedCostList = []
    this.data.travelInfo.qita.map((item,idx)=>{
      if (item.choosed){
        attachedCostList.push(item)
      }
    })
    let submitTraveLine={
      'id': this.data.id,
      'kind': this.data.travelInfo.XLQY,
      'travelLine': this.data.travelInfo.XLMC,
      'date': this.data.travelInfo.XXRQ1,
      'adultNum' : Number(this.data.adultNum),
      'childNumA' : Number(this.data.childNumA),
      'childNumB': Number(this.data.childNumB),
      'attachedCostList': attachedCostList ,
      'attachedCostAmount': this.data.attachedCostAmount,
      'totalPrice' : this.data.totalPrice
    }
    // 出行人至少1个
    if (this.data.adultNum == 0 && this.data.childNumA == 0 && this.data.childNumB == 0) {
      app.showToast('至少添加一个出行人!')
      return false
    }
    // 席位不足
    if (this.data.travelInfo.ZWS < (this.data.adultNum + this.data.childNumA+this.data.childNumB)) {
      app.showToast('对不起,您选的出发日期所剩席位不足!')
      return false
    }
    // 满足下单条件
    wx.setStorage({
      key: 'submitOrderInfo',
      data: submitTraveLine,
      success: (res) => {
        console.log(submitTraveLine)
        wx.navigateTo({
          url: '../../order/index',
        })
      },
    })
    
  },
  //成人数量增减
  minAdults: function () {
    let num = this.data.adultNum
    if (num>=1){
      num--
    }
    let total = this.sum(this.data.totalPrice, this.data.attachedCostAmount, num, this.data.childNumA, this.data.childNumB)
    this.setData({
      adultNum: num,
      totalPrice: total
    })
  },
  addAdults: function(){
    let num = this.data.adultNum
    num++
    let total = this.sum(this.data.totalPrice, this.data.attachedCostAmount, num, this.data.childNumA, this.data.childNumB)
    this.setData({
      adultNum:num,
      totalPrice:total
    })
  },
  //儿童数量增减
  addChildsA: function () {
    let num = this.data.childNumA
    num++
    let total = this.sum(this.data.totalPrice, this.data.attachedCostAmount, this.data.adultNum, num, this.data.childNumB)
    this.setData({
      childNumA: num,
      totalPrice: total
    })
  },
  minChildsA: function () {
    let num = this.data.childNumA
    if (num >= 1) {
      num--
    }
    let total = this.sum(this.data.totalPrice, this.data.attachedCostAmount, this.data.adultNum,num, this.data.childNumB)
    this.setData({
      childNumA: num,
      totalPrice: total
    })
  },
  // B
  addChildsB: function () {
    let num = this.data.childNumB
    num++
    let total = this.sum(this.data.totalPrice, this.data.attachedCostAmount, this.data.adultNum, this.data.childNumA, num)
    this.setData({
      childNumB: num,
      totalPrice: total
    })
  },
  minChildsB: function () {
    let num = this.data.childNumB
    if (num >= 1) {
      num--
    }
    let total = this.sum(this.data.totalPrice, this.data.attachedCostAmount, this.data.adultNum, this.data.childNumA, num)
    this.setData({
      childNumB: num,
      totalPrice: total
    })
  },
  // 计算价格  按照线路信息中的价格和优惠价格
  sum: function (Total, AttachedCost, NumA, NumC1, NumC2) {
    //console.log(Total + '--' + NumA + '--' + NumC1 + '--' + NumC2)
      let countPriceCheng
      let countPriceA
      let countPriceB
      //计算价格
      if (this.data.travelInfo.YH1cheng != "0.00") {  //有优惠价按优惠价
        countPriceCheng = this.data.travelInfo.YH1cheng
        countPriceA = this.data.travelInfo.YH1ertA
        countPriceB = this.data.travelInfo.YH1ertB
      } else {   //无优惠价按价格
        countPriceCheng = this.data.travelInfo.JIAGEcheng
        countPriceA = this.data.travelInfo.JIAGEertA
        countPriceB = this.data.travelInfo.JIAGEertB
      }
      Total = countPriceCheng * NumA + countPriceA * NumC1 + countPriceB * NumC2 + AttachedCost * (NumA + NumC1 + NumC2)
      console.log(Total)
    return Total
  },

//选择其他服务
  chooseAttachedCost: function(e){
    const Idx = e.currentTarget.dataset.idx
    let temp = this.data.travelInfo
    let CostAmount = this.data.attachedCostAmount
    //服务费用计算
    if (temp.qita[Idx].choosed){  //将取消则减去金额
      CostAmount = CostAmount - temp.qita[Idx].FWXMAMOUNT
    }else{
      CostAmount = CostAmount + temp.qita[Idx].FWXMAMOUNT
    }
    temp.qita[Idx].choosed = this.data.travelInfo.qita[Idx].choosed?false:true
    let total = this.sum(this.data.totalPrice, CostAmount, this.data.adultNum, this.data.childNumA, this.data.childNumB)
    this.setData({
      travelInfo: temp,
      attachedCostAmount: CostAmount,
      totalPrice: total
    })
  },
  //获取线路信息
  getTravelLineInfo: function (ID,NAME) {
    this.setData({
      loadingHidden: false
    })
    var requestPromisified = util.wxPromisify(wx.request);
    requestPromisified({
      url: h.main + '/shijian.html',
      data: {
        fid_z: ID,
        base: app.globalData.base,
        id: app.globalData.shopId,
        xqxlmc: NAME
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
    }).then((res) => {
      console.log('单独详情backInfo---=')
      console.log(res.data)
      // var reg = /<body[^>]*>([\s\S]*)<\/body>/
      //var temp = reg.exec(res.data[0].FDA)[1];
      //var ToLowerCase = res.data[0].FDA.toLowerCase()


      var HtmlTxt = res.data[0].FDA.replace(/width:\s/, "").replace(/span\s+/g, "span ").replace(/height:\s/, "").replace(/height=\d+/g, "").replace(/height:\w+/g, "").replace(/margin-left:/g, "").replace(/margin-right:/g, "").replace(/<font-family\w+/g, "").replace(/text-indent/g, "").replace(/width:\w+/g, "").replace(/width=\w+/g, "")

//.replace(/margin-right:\.+/g, "")
        //.replace(/style=/g, " style=")
      // var AfterFDA1 = res.data[0].FDA.replace(/width:\s/, "")
      // var AfterFDA2 = AfterFDA1.replace(/span\s+/g, "span ")
      // var AfterFDA3 = AfterFDA2.replace(/height:\s/, "")

      // var AfterFDA4 = AfterFDA3.replace(/height=\d+/g, "")
      // var AfterFDA5 = AfterFDA4.replace(/height:\w+/g, "")
      // var AfterFDA6 = AfterFDA5.replace(/margin-left:\w+/g, "")
      // var AfterFDA7 = AfterFDA6.replace(/<font-family\w+/g, "")

      // var AfterFDA8 = AfterFDA7.replace(/text-indent/g, "")
      // var AfterFDA9 = AfterFDA8.replace(/width:\w+/g, "")

      // var AfterFDA10 = AfterFDA9.replace(/width=\w+/g, "")

      //console.log(HtmlTxt)
      //其他费用
      res.data[0].qita.map((item,idx)=>{
        item.choosed = false
      })

      WxParse.wxParse('article', 'html', HtmlTxt, this, 5);
      this.setData({
        travelInfo: res.data[0],
        //attachedCostList: res.data[0].qita,
        loadingHidden: true
      })
      //new
      
    }).catch((res) => {
      console.error("get 单独详情 failed")
      console.error(res)
    })
  },

})