//app.js
import h from '/utils/url.js'
// const AV = require('./utils/av-weapp.js');
import util from './utils/util.js'

App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  },

  onShow: function () {
    console.log('App Show')
   

  },
  getUserInfo: function (cb) {
    var that = this
     wx.login({
        success: function (a) {
          var code = a.code;
          console.log(code+"*******************")
          wx.getUserInfo({
            success: function (res) {
              console.log(res.encryptedData)
              var encryptedData = encodeURIComponent(res.encryptedData);
               var iv = res.iv;
              that.globalData.userInfo = res.userInfo
              that.globalData.code = code
              that.globalData.encryptedData = encryptedData
              that.globalData.iv = res.iv
            Login(code,encryptedData,iv);
            typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
  },
  // toast
  showToast: function (ToastText) {
    wx.showModal({
      title: '提示',
      content: ToastText,
      showCancel: false
    })
  },
  //getLocation
  getLocation: function (_this,Fn){
    _this.setData({
      loadingHidden:false
    })
    var getLocationPromisified = util.wxPromisify(wx.getLocation);
    getLocationPromisified({
      type: 'wgs84',
    }).then((res) => {
      console.log('位置信息P backInfo---=')
      console.log(res)
        this.globalData.latitude = res.latitude
        this.globalData.longitude = res.longitude
        Fn(res.latitude, res.longitude, _this)
        this.convertCity(res.latitude, res.longitude, _this)
        _this.setData({
          //loadingHidden: true
        })
        
        
    }).catch(() => {
      console.error("get failed")
    })
  },
  // 经纬度转换城市
  convertCity: function (Lat, Lng, _this) {
    var requestConvertPromisified = util.wxPromisify(wx.request);
    requestConvertPromisified({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=2ojY8H4BNgtoDyzXfNKTE87OCpNNm1yH&location=' + Lat + ',' + Lng + '&output=json',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('经纬度转换城市P backInfo---=')
      console.log(res.data)
      this.globalData.city = res.data.result.addressComponent.city
      _this.setData({
        city: res.data.result.addressComponent.city
      })   
      console.log(this.globalData.city)     
    }).catch((res) => {
      console.error(res)
    })
  },
  onHide: function () {
    console.log('App Hide-------')
  },
  globalData: {
    userInfo: null,
    code: "",
    encryptedData: "",
    iv: "",
    //oppenid: 'oGm3u0FHjaAt6vFemoB3XF39RHbE',
    oppenid:'',
    destinationKind:'',
    gloabalCur:0,
    latitude:'',
    longitude:'',
    city:'',
    shop:'',
    shopId:'',
    modules:'',
    base:''

  },

})



  //是否注册判断
  // function ifSigned(){
  //   var app = getApp();
  //   wx.request({
  //     url: h.main + '/page/openid.do',
  //     data: {
  //       oppen_id: app.globalData.oppenid
  //     },
  //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'Accept': 'application/json',
  //     }, // 设置请求的 header
  //     success: (res) => {
  //       console.log('是否注册判断backInfo---=')
  //       console.log(res)
  //       // this.setData({
  //       //   realSignCode: res.data
  //       // })
  //     },
  //     fail: (res) => {
  //     },
  //     complete: (res) => {
  //     }
  //   })
  // }


//Login-----
function Login(code, encryptedData, iv) {
  console.log('开始登录----');
  var app = getApp();
  console.log(app.globalData.userInfo);
  console.log(code)
  //请求服务器
  wx.request({
    url: h.main + "/userInsert.html",
    data: {
      code: code,
      realname: app.globalData.userInfo.nickName,
      head_img: app.globalData.userInfo.avatarUrl
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }, // 设置请求的 header
    success: function (res) {
      console.log('登录信息backInfo-----');
      console.log(res);
      app.globalData.oppenid = res.data.oppen_id;

    },
    fail: function (res) {
      // fail
      console.log(res);
    },
    complete: function (res) {
      // complete
      console.log(+res);
    }
  })
}