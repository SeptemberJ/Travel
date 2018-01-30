import h from '../../utils/url.js'
import util from '../../utils/util.js'
var app = getApp()
Page( {
  data: {
    SearchKey:'',
    resultList:[],
    // menuList: ['境外游', '国内游', '省内游', '周边游', '自由行', '一日游', '游轮'],
    menuList:'',
    cur: app.globalData.gloabalCur,
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
  },
  onShow: function () {
    this.setData({
      menuList: app.globalData.modules,
      cur: app.globalData.gloabalCur,
      start: 0,
      city: app.globalData.city,
      columnList:[]
    })
    //获取目的地列表
    this.getData(0)
  },
  // changeCity
  changeCity: function () {
    wx.navigateTo({
      url: '../chooseCity/index',
    })
  },

  // inputSearchKey
  inputSearchKey: function (e) {
    this.setData({
      SearchKey: e.detail.value,
      loadingHidden:false
    })
    let key = e.detail.value.split('').join(' ')
    console.log(key)
    let requestPromisified = util.wxPromisify(wx.request);
    requestPromisified({
      url: h.main + '/mohu1.html',
      data: {
        xlmc: e.detail.value,
        base: app.globalData.base,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
    }).then((res) => {
      console.log('模糊查询backInfo P---=')
      console.log(res.data)
      let recombine = []
      //重组数据
      let temp = res.data[0]
      // let temp = res.data[0].slice(0, res.data.length)
      let len = temp.length / 2
      for (let i = 0; i < len; i++) {
        let eachArray = temp.splice(0, 2)
        let obj = {
          'XLMC': eachArray[0],
          'FID_Z': eachArray[1]
        }
        recombine.push(obj)
      }
      console.log(recombine)
      this.setData({
        resultList: recombine,
        loadingHidden: true
      })
    }).catch((res) => {
      console.error("get 模糊查询 failed")
      console.log(res)
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
      destinationKind: temp[idx][0].MINGCHEN,
      start:0
    })
    app.globalData.gloabalCur = idx
    app.globalData.destinationKind = temp[idx][0].MINGCHEN,
    this.getData(0)
  },
  toWareClip: function(e){
    wx.navigateTo({
      url: '../wareClip/calendar/index?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.linename,
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
  
  //获取目的地列表
  getData: function (Start) {
    this.setData({
      loadingHidden: false
    })
    var sendDestinationKind = app.globalData.destinationKind
    var sendDepartureDate = this.data.departureDate == '出发日期' ? '' : this.data.departureDate
    var sendDuration = this.data.durationIdx == 0 ? '' : this.data.durationArray[this.data.durationIdx].substr(0, 2)
    var sendPriceSort = this.data.priceSortIdx == 0 ? '' : this.data.priceSortArray[this.data.priceSortIdx]
    let requestPromisified = util.wxPromisify(wx.request);
    requestPromisified({
      url: h.main + '/luxian.html',
      data: {
        xlqy: sendDestinationKind,
        xXRQ: sendDepartureDate,
        days: sendDuration,
        current: Start,
        base: app.globalData.base,
        // id: app.globalData.shopId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
    }).then((res) => {
      console.log('目的地backInfo P---=')
      console.log(res.data)
      let afterConcat = res.data 
      let oldColumnList = this.data.columnList
      let newColumnList = []
      if (afterConcat.length > 0) {
        //重组数据
        let temp = afterConcat.slice(0, afterConcat.length)
        let len = temp.length / 7
        for (var i = 0; i < len; i++) {
          let eachArray = temp.splice(0, 7)
          let obj = {
            'XLMC': eachArray[0],
            'JIAGE': eachArray[1],
            'DAYS': eachArray[2],
            'YH1': eachArray[3],
            'CHENGSHI': eachArray[4],
            'FID_Z': eachArray[5],
            'IMG': eachArray[6],
          }
          newColumnList.push(obj)
        }
      }
      return oldColumnList.concat(newColumnList)
       
    }).then((DATA)=>{
      //按需排序
      var objectList = (DATA.length > 0) ? util.DOAsort(DATA, 'JIAGE', sendPriceSort) : DATA
      this.setData({
        columnList: objectList,
        loadingHidden: true,
        stillLoading: false
      })
      console.log(this.data.columnList)
    }).catch((res) => {
      console.error("get 目的地列表 failed")
      console.log(res)
    })
  },

  //下拉加载更多
  loadMore2: function(){
    console.log('到底了----')
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

  // onReachBottom: function () {
  //   this.loadMore()
  // },
  onPullDownRefresh: function () {
    
  }

    // inputSearchKey
  // inputSearchKey: function(e){
  //   console.log(e.detail.value)
  //   this.setData({
  //     SearchKey:e.detail.value
  //     })
  //   wx.request({
  //     url: h.main + '/mohu1.html',
  //     data: {
  //       xlmc: this.data.SearchKey
  //     },
  //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'Accept': 'application/json',
  //     }, // 设置请求的 header
  //     success: (res) => {
  //       console.log('模糊查询backInfo---=')
  //       console.log(res.data)
  //       let recombine = []
  //         //重组数据
  //         let temp = res.data.slice(0, res.data.length)
  //         let len = temp.length / 2
  //         for (let i = 0; i < len; i++) {
  //           let eachArray = temp.splice(0, 2)
  //           let obj = {
  //             'XLMC': eachArray[0],
  //             'FID_Z': eachArray[1]
  //           }
  //           recombine.push(obj)
  //         }
  //       this.setData({
  //         resultList: recombine
  //       })
  //     },
  //     fail: (res) => {
  //     },
  //     complete: (res) => {
  //     }
  //   })
  // },
  // //获取目的地列表
  // getData: function(Start){
  //   this.setData({
  //     loadingHidden: false
  //   })
  //   var sendDestinationKind = app.globalData.destinationKind
  //   var sendDepartureDate = this.data.departureDate == '出发日期' ? '' : this.data.departureDate
  //   var sendDuration = this.data.durationIdx == 0 ? '' : this.data.durationArray[this.data.durationIdx].substr(0, 2)
  //   var sendPriceSort = this.data.priceSortIdx == 0 ? '' : this.data.priceSortArray[this.data.priceSortIdx]
  //   // 获取对数据
  //   wx.request({
  //     url: h.main + '/luxian.html',
  //     data: {
  //       xlqy: sendDestinationKind,
  //       xXRQ: sendDepartureDate,
  //       days: sendDuration,
  //       current: Start,
  //       lat: app.globalData.latitude,
  //       lng: app.globalData.longitude,
  //     },
  //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'Accept': 'application/json',
  //     }, // 设置请求的 header
  //     success: (res) => {
  //       console.log('目的地backInfo---=')
  //       console.log(res.data)
  //       let oldColumnList = this.data.columnList
  //       let newColumnList = []
  //       if (res.data.length>0){
  //         //重组数据
  //         let temp = res.data.slice(0, res.data.length)
  //         let len = temp.length / 6
  //         for (var i = 0; i < len; i++) {
  //           let eachArray = temp.splice(0, 6)
  //           let obj = {
  //             'XLMC': eachArray[0],
  //             'JIAGE': eachArray[1],
  //             'DAYS': eachArray[2],
  //             'YH1': eachArray[3],
  //             'CHENGSHI': eachArray[4],
  //             'FID_Z': eachArray[5],
  //           }
  //           newColumnList.push(obj)
  //         }
  //       }
  //       // console.log(newColumnList)
  //       //按需排序
  //       var objectList = (newColumnList.length > 0) ? util.DOAsort(newColumnList, 'JIAGE', sendPriceSort) : newColumnList
  //       this.setData({
  //         columnList: oldColumnList.concat(objectList),
  //         loadingHidden: true,
  //         stillLoading: false
  //       })
  //       console.log(this.data.columnList)
  //     },
  //     fail: (res) => {
  //     },
  //     complete: (res) => {
  //     }
  //   })
  // },

})