import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page( {
  data: {
    SearchKey:'',
    resultList:['海南壮族自治区','海南农垦万嘉热带植物园'],
    menuList: ['境外游', '国内游', '省内游', '周边游', '自由行', '一日游', '游轮'],
    cur: app.globalData.gloabalCur,
    // columnList:[
    //   { 'id': 0, "img": 'http://gaopin-preview.bj.bcebos.com/133100296233.jpg@!420', "travelTit": '北京故宫、天津双卧七日游SBG_011A', 'departure': '柳州', 'duration': 3, 'price': '1999', 'preferentialP': '1899', 'hasGroup': 1 },
    //   { 'id': 1, "img": 'http://gaopin-preview.bj.bcebos.com/133201807363.jpg@!420', "travelTit": '西藏拉萨、布达拉宫、大昭寺、纳木措四飞五日WXY_A1ZD', 'departure': '柳州', 'duration': 5, 'price': '1999', 'preferentialP': '1899', 'hasGroup': 1 },
    //   { 'id': 2, "img": 'http://gaopin-preview.bj.bcebos.com/133105981030.jpg@!420', "travelTit": '海南五日豪华游【暑期特价】', 'departure': '柳州', 'duration': 10, 'price': '1999', 'preferentialP': '1899', 'hasGroup': 1 },
    //   { 'id': 3, "img": 'http://gaopin-preview.bj.bcebos.com/133105986260.jpg@!420', "travelTit": '厦门3天2夜经济亲子游', 'departure': '柳州', 'duration': 6, 'price': '1999', 'preferentialP': '1899', 'hasGroup': 0 },
    //   { 'id': 4, "img": 'http://gaopin-preview.bj.bcebos.com/133206637546.jpg@!420', "travelTit": '乐山大佛.黄龙溪.九寨沟.川剧变脸火锅', 'departure': '柳州', 'duration': 3, 'price': '1999', 'preferentialP': '1899', 'hasGroup': 1 },
    //   { 'id': 5, "img": 'http://gaopin-preview.bj.bcebos.com/133206637515.jpg@!420', "travelTit": '山东半岛+航洋牧场双飞六日游SXC_002暑假', 'departure': '柳州', 'duration': 5, 'price': '1999', 'preferentialP': '1899', 'hasGroup': 1 }
    // ],
    stillLoading:false,
    start:0,
    columnList:[],
    destinationKind:'境外游',
    departureDate:'出发日期',
    duration:'天数',
    price:'价格',
    durationArray: ['天数', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15日及以上'],
    durationIdx:0,
    priceSortArray: ['价格排序', '价格降序', '价格升序'],
    priceSortIdx:0,
    loadingHidden:false,
    city: app.globalData.city
  },

  onLoad: function() {
    
   console.log('load----')
  },
  onShow: function () {
    console.log('onshow----')
    this.setData({
      cur: app.globalData.gloabalCur,
      start: 0,
      city: app.globalData.city
    })
    //获取目的地
    this.getData(this.data.start)
  },
  // changeCity
  changeCity: function () {
    wx.navigateTo({
      url: '../chooseCity/index',
    })
  },
  // chooseSearchKey
  inputSearchKey: function(e){
    console.log(e.detail.value)
    this.setData({
      SearchKey:e.detail.value
      })
    wx.request({
      url: h.main + '/mohu1.html',
      data: {
        xlmc: this.data.SearchKey
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('模糊查询backInfo---=')
        console.log(res.data)
        let recombine = []
          //重组数据
          let temp = res.data.slice(0, res.data.length)
          let len = temp.length / 2
          for (var i = 0; i < len; i++) {
            let eachArray = temp.splice(0, 2)
            let obj = {
              'XLMC': eachArray[0],
              'FID_Z': eachArray[1]
            }
            recombine.push(obj)
          }
        this.setData({
          resultList: recombine
        })
      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    })
  },
  // clearSearchKey
  clearSearchKey: function(){
    this.setData({
      SearchKey: ''
    })
  },
  menuTabChange: function (e) {
    var idx = e.currentTarget.dataset.index
    var temp = this.data.menuList
    this.setData({
      columnList: [],
      cur: idx,
      destinationKind: temp[idx],
      start:0
    })
    app.globalData.gloabalCur = idx
    app.globalData.destinationKind = temp[idx]
    this.getData(0)

  },
  toWareClip: function(e){
    wx.navigateTo({
      url: '../wareClip/calendar/index?id='+ e.currentTarget.dataset.id,
    })
  },
  // 全部
  showAll: function () {
    this.setData({
      columnList: [],
      departureDate: '出发日期',
      durationIdx: 0,
      priceSortIdx: 0,
      start:0,
    })
    this.getData(0)
  },
  // 日期筛选
  bindDateChange: function (e) {
    this.setData({
      columnList: [],
      departureDate: e.detail.value,
      start: 0,
    })
    this.getData(0)
  },
  // 天数筛选
  bindDurationChange: function (e) {
    this.setData({
      columnList: [],
      durationIdx: e.detail.value,
      start: 0,
    })
    this.getData(0)
  },
  // 价格排序
  bindPriceChange: function (e) {
    this.setData({
      columnList: [],
      priceSortIdx: e.detail.value,
      start: 0,
    })
    this.getData(0)
  },
  getData: function(Start){
    this.setData({
      loadingHidden: false
    })
    var sendDestinationKind = app.globalData.destinationKind
    var sendDepartureDate = this.data.departureDate == '出发日期' ? '' : this.data.departureDate
    var sendDuration = this.data.durationIdx == 0 ? '' : this.data.durationArray[this.data.durationIdx].substr(0, 2)
    var sendPriceSort = this.data.priceSortIdx == 0 ? '' : this.data.priceSortArray[this.data.priceSortIdx]
    // 获取对数据
    wx.request({
      url: h.main + '/luxian.html',
      data: {
        xlqy: sendDestinationKind,
        xXRQ: sendDepartureDate,
        days: sendDuration,
        current: Start,
        lat: app.globalData.latitude,
        lng: app.globalData.longitude,
        // price: sendPriceSort
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('目的地backInfo---=')
        console.log(res.data)
        let newColumnList = this.data.columnList
        if (res.data.length>0){
          //重组数据
          let temp = res.data.slice(0, res.data.length)
          let len = temp.length / 6
          for (var i = 0; i < len; i++) {
            let eachArray = temp.splice(0, 6)
            let obj = {
              'XLMC': eachArray[0],
              'JIAGE': eachArray[1],
              'DAYS': eachArray[2],
              'YH1': eachArray[3],
              'CHENGSHI': eachArray[4],
              'FID_Z': eachArray[5],
            }
            newColumnList.push(obj)
          }
        }
        console.log(newColumnList)
        //按需排序
        var objectList = (newColumnList.length > 0) ? util.DOAsort(newColumnList, 'JIAGE', sendPriceSort) : newColumnList
        this.setData({
          columnList: objectList,
          loadingHidden: true,
          stillLoading: false
        })
      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    })
  },

  //下拉加载更多
  loadMore: function(){
    // console.log('到底了----')
    if (this.data.stillLoading) {
      return false
    } else {
      this.setData({
        stillLoading: true
      })
      var curStart = this.data.columnList.length + 1
      this.getData(curStart)
    }
  },
  onReachBottom: function () {
    this.loadMore()
    // Do something when page reach bottom.
  },
  onPullDownRefresh: function () {
    
  }


  

})