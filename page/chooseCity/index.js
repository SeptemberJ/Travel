var city = require('../../utils/city.js');
import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    tHeight:0,
    bHeight:0,
    startPageY:0,   //定位开始位置
    cityList:[],
    isShowLetter:false,
    scrollTop:0,
    city:"",
    shopList:'',
    idList:'',
    shopIdx:0,
    hotCity: ['上海', '北京', '广州', '深圳', '武汉', '天津', '西安', '南京', '杭州', '成都','重庆' ],
    loadingHidden:true
  },
  onLoad: function (options) {
    console.log('onLoad=========')
    if (app.globalData.city==''){
      app.getLocation(this, this.getShopList)
    }
    
    // 清空本地存储
    wx.clearStorage()
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo,
        nickName: userInfo.nickName,
      })
      console.log(this.data.userInfo)
    })
    

    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList=city.cityList();
    console.log('cityList------');
    console.log(cityList);
    console.log(city.searchLetter);
    console.log(cityList);
    this.setData({
      // city: options.curCity
      city: app.globalData.city
    })

    var sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    var winHeight = sysInfo.windowHeight;

    //添加要匹配的字母范围值
    //根据屏幕高度设置子元素的高度
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;

      tempObj.push(temp)
    }
    
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList,
      //loadingHidden: true
    })

    console.log('cityInfo----');
    console.log(this.data.cityInfo);
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
   

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  //定位开始
  searchStart: function (e) {
    console.log('searchStart------') 
    var showLetter = e.currentTarget.dataset.letter;
    var pageY = e.touches[0].pageY;
    this.setScrollTop(this,showLetter);
     this.nowLetter(pageY,this);
      this.setData({
        showLetter: showLetter,
        startPageY: pageY,
        isShowLetter:true,
      })
  },
  //定位移动中
  searchMove: function (e) {
    console.log('searchMove------') 
    var pageY = e.touches[0].pageY;
    var startPageY=this.data.startPageY;
    var tHeight=this.data.tHeight;
    var bHeight=this.data.bHeight;
    var showLetter = 0;
    console.log(pageY);
    if(startPageY-pageY>0){ //向上移动
        if(pageY<tHeight){
          // showLetter=this.mateLetter(pageY,this);
          this.nowLetter(pageY,this);
        }
    }else{//向下移动
        if(pageY>bHeight){
            // showLetter=this.mateLetter(pageY,this);
            this.nowLetter(pageY,this);
        }
    }
  },
  //定位确定
  searchEnd: function (e) {
    console.log('searchEnd------') 
    // console.log(e);
    // var showLetter=e.currentTarget.dataset.letter;
    var that=this;
    setTimeout(function(){
      that.setData({
      isShowLetter:false
    })
    },1000)
    
  },
  nowLetter: function (pageY, that) {
    //当前选中的信息
    console.log('nowLetter-----')
    var letterData = this.data.searchLetter;  //22个字母
    var bHeight = 0;
    var tHeight = 0;
    var showLetter="";
    for (var i = 0; i < letterData.length; i++) {
      if (letterData[i].tHeight <= pageY && pageY<= letterData[i].bHeight) {
        bHeight = letterData[i].bHeight; 
        tHeight = letterData[i].tHeight;
        showLetter = letterData[i].name;
        break;
      }
    }

    this.setScrollTop(that,showLetter);
    console.log('bHeight--' + bHeight + 'tHeight--' + tHeight)
    that.setData({
      bHeight:bHeight,
      tHeight:tHeight,
      showLetter:showLetter,
      startPageY:pageY
      })
  },
  bindScroll:function(e){
    // console.log(e.detail)
  },
  // 当前字母列表定位到最上面
  setScrollTop:function(that,showLetter){
      var scrollTop=0;
      var cityList=that.data.cityList;
      var cityCount = 0;  //字母所含城市数
      var initialCount=0; //上面有几个字母
      for(var i=0;i<cityList.length;i++){
         if(showLetter==cityList[i].initial){
           scrollTop=initialCount*30+cityCount*41;
            break;
         }else{
            initialCount++;
            cityCount+=cityList[i].cityInfo.length;
         }
      }
      that.setData({
        scrollTop:scrollTop
      })
  },
  //获取门店列表
  getShopList: function (Lat, Lng,_this) {
    _this.setData({
      loadingHidden: false
    })
    let requestPromisified = util.wxPromisify(wx.request);
    requestPromisified({
      url: h.main + '/mendian.html',
      data: {
        latitude: Lat,
        longitude: Lng
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('获取门店列表P backInfo---=')
      console.log(res.data)
      let temp = res.data
      let nameList = []
      let idList = []
      // if (temp.length>0){
      //   temp.map((item, idx) => {
      //     nameList.push(item.MDNAME)
      //     idList.push(item.ID)
      //   })
      // }

      if (res.data.length>0){
        temp.map((item, idx) => {
          nameList.push(item.MDNAME)
          idList.push(item.ID)
        })
        _this.setData({
          shopList: nameList,
          idList: idList,
          loadingHidden:true
        })
        this.chooseShop()
      }else{
        console.log('没有门店跳转-------')
        wx.switchTab({
          url: '../index/index',
        })
      }
    }).catch((res) => {
      console.error("get 门店列表 failed")
      console.log(res)
    })
  },
  // 选择门店
  chooseShop: function(){
    wx.showActionSheet({
      itemList: this.data.shopList,
      success: (res)=> {
        console.log(res.tapIndex)
        this.setData({
          shopIdx: res.tapIndex
        })
        app.globalData.shop = this.data.shopList[res.tapIndex]
        app.globalData.shopId = this.data.idList[res.tapIndex]
        wx.switchTab({
          url: '../index/index',
        })
      },
      fail: (res) => {
        wx.switchTab({
          url: '../index/index',
        })
        console.log(res.errMsg)
      }
    })

  },
  // bindCity:function(e){
  //   var city=e.currentTarget.dataset.city;
  //   this.setData({
  //     city:city
  //     })
  //   wx.request({
  //     url: 'https://api.map.baidu.com/geocoder/v2/?address=' + city +'&output=json&ak=2ojY8H4BNgtoDyzXfNKTE87OCpNNm1yH',
  //     data: {},
  //     header: {
  //       'Content-Type': 'application/json'
  //     },
  //     success: (res) => {
  //       // success  
  //       console.log('切换城市中城市转经纬度----')
  //       console.log(res)
  //       app.globalData.city = city
  //       app.globalData.latitude = res.data.result.location.lat
  //       app.globalData.longitude = res.data.result.location.lng
  //     },
  //     fail: function () {
  //       // fail 
  //     },
  //     complete: function () {
  //       // complete 
  //     }
  //   })
  // },
  bindCity: function (e) {
    var city = e.currentTarget.dataset.city;
    this.setData({
      city: city
    })
    let requestPromisified = util.wxPromisify(wx.request);
    requestPromisified({
      url: 'https://api.map.baidu.com/geocoder/v2/?address=' + city + '&output=json&ak=2ojY8H4BNgtoDyzXfNKTE87OCpNNm1yH',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
    }).then((res) => {
      console.log('切换城市中城市转经纬度P backInfo---=')
      console.log(res)
      app.globalData.city = city
      let Lat = res.data.result.location.lat
      let Lng = res.data.result.location.lng
      app.globalData.latitude = Lat
      app.globalData.longitude = Lng
      this.getShopList(Lat,Lng,this)
      //wx.navigateBack()
      }).catch((res) => {
      console.error("get 城市转经纬度 failed")
      console.log(res)
    })
  },
})