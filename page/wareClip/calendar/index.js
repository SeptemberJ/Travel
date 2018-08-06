import h from '../../../utils/url.js'
import util from '../../../utils/util.js'
var app = getApp()
Page({
  data: {
    id:'',
    lineName:'',
    imgUrls: ['http://gaopin-preview.bj.bcebos.com/133106636547.jpg@!420', 'http://gaopin-preview.bj.bcebos.com/133106636545.jpg@!420','http://gaopin-preview.bj.bcebos.com/133106636695.jpg@!420'],
    hasEmptyGrid: false,
    curDay: '',
    curMonth: '',
    curYear: '',
    // choosed: '',
    // adults:0,
    // adultNum:0,
    // childNum:0,
    // totalPrice:0,
    Times:1,
    loadingHidden: false,
    
  },
  onReady: function () {
    
  },


  onLoad: function (options) {
    this.setData({
      id:options.id,
      lineName: options.name  //encodeURI(
    })
    let date = new Date();
    let nowDay = date.getDate();
    let cur_year = date.getFullYear();
    let cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch: weeks_ch,
      curDay:nowDay,
      curMonth: cur_month,
      curYear: cur_year
    })
  },
  onShow: function(){
    // 获取线路信息
    this.getTravelLineInfo(this.data.id, this.data.lineName, this.data.cur_year, this.data.cur_month)
  },
  //选择具体日期
  canChoose: function (e) {
    var FID_Z = e.currentTarget.dataset.fidz
    wx.navigateTo({
      url: '../wareInfo/index?id=' + FID_Z + '&name=' + this.data.lineName,
    })
  },
  // 这个月有几天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 第一天是周几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 计算空格
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {    //有空格
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {      //无空格
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  //计算当月天数
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days: days
    });
  },
  // 选择年月
  handleCalendarPre() {
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
      //当前月以前的看不到
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      // 计算改约天数和日期空格数
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      //重新获取数据
      this.getTravelLineInfo(this.data.id, this.data.lineName, newYear, newMonth)
  },
    // 选择年月
  handleCalendarNext(MaxYear, MaxMonth) {
    // if (this.data.cur_year <= MaxYear && this.data.cur_month <= MaxMonth) {
      const cur_year = this.data.cur_year;
      const cur_month = this.data.cur_month;
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      // 计算该月天数和日期空格数
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      //重新获取数据
      this.getTravelLineInfo(this.data.id, this.data.lineName, newYear, newMonth)
    // }
    
    
  },

  // // 选择年月
  // handleCalendar(e) {
  //   const handle = e.currentTarget.dataset.handle
  //   const cur_year = this.data.cur_year;
  //   const cur_month = this.data.cur_month;
  //   console.log('handle------')
  //   console.log(handle)
  //   if (handle === 'prev') {     //往前
  //     //当前月以前的看不到
  //     let newMonth = cur_month - 1;
  //     let newYear = cur_year;
  //     if (newMonth < 1) {
  //       newYear = cur_year - 1;
  //       newMonth = 12;
  //     }
  //     // 计算改约天数和日期空格数
  //     this.calculateDays(newYear, newMonth);
  //     this.calculateEmptyGrids(newYear, newMonth);
  //     this.setData({
  //       cur_year: newYear,
  //       cur_month: newMonth
  //     })
  //     //重新获取数据
  //     this.getTravelLineInfo(this.data.id, this.data.lineName, newYear, newMonth)
  //   } 
  //   if (handle === 'next'){                   //往后
  //     let newMonth = cur_month + 1;
  //     let newYear = cur_year;
  //     if (newMonth > 12) {
  //       newYear = cur_year + 1;
  //       newMonth = 1;
  //     }
  //     // 计算该月天数和日期空格数
  //     this.calculateDays(newYear, newMonth);
  //     this.calculateEmptyGrids(newYear, newMonth);
  //     this.setData({
  //       cur_year: newYear,
  //       cur_month: newMonth
  //     })
  //     //重新获取数据
  //     this.getTravelLineInfo(this.data.id, this.data.lineName, newYear, newMonth)
  //   }
  // },
  //获取线路信息
  getTravelLineInfo: function (id, name, Year, Month) {
    let requestPromisified = util.wxPromisify(wx.request);
    this.setData({
      loadingHidden: false
    })
    let strDate = Year + '-' + (Month >= 10 ? Month : '0' + Month)
    requestPromisified({
      url: h.main + '/rili1.html',  //shijian1.html
      data: {
        fid_z: id,
        str: strDate,
        base: app.globalData.base,
        // id: app.globalData.shopId,
        xqxlmc: name
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
    }).then((res) => {
      console.log('出发日期日历backInfo---=')
      console.log(res.data)
      if (res.data[0].length == 0 && res.data[1] == ''){
        this.setData({
          loadingHidden: true
        })
        return false
      }
      let LimitDate = res.data[1].split('-')
      let MaxYear = LimitDate[0]
      let MaxMonth = LimitDate[1]
      console.log('MaxYear--' + MaxYear + '--MaxMonth--' + MaxMonth)
      console.log(this.data.cur_year <= MaxYear || this.data.cur_month <= MaxMonth)
      if (res.data[0].length <= 0 && this.data.Times==1){
        if (this.data.cur_year <= MaxYear && this.data.cur_month <= MaxMonth){
          this.handleCalendarNext()
        }else{
          this.setData({
            loadingHidden: true
          })
        }
       // this.handleCalendarNext(MaxYear, MaxMonth)
      }else{
        this.setData({
          Times: 0
        })
        let priceArray = []
        let afterCombine = []
        let temp = res.data[0]
        if (temp.length > 0) {
          //重组数据
          let len = temp.length / 8
          for (let i = 0; i < len; i++) {
            let eachArray = temp.splice(0, 8)
            let obj = {
              'FID_Z': eachArray[0],
              'JIAGE': eachArray[4],
              'YH1': eachArray[3],
              'ZWS': eachArray[7],
              'DAY': eachArray[6],
            }
            afterCombine.push(obj)
          }
        }
        let monthDays = new Date(Year, Month, 0).getDate()
        for (let i = 1; i <= monthDays; i++) {
          let obj = {
            'date': i,
            'FID_Z': '',
            'price': 0,
            'preferentialPrice': 0,
            'ZWS': -1,
          }
          //判断该日期是否可选
          //当前日期毫秒数
          let nowMSeconds = new Date(Date.UTC(this.data.curYear, this.data.curMonth - 1, this.data.curDay)).getTime()
          //所选日期毫秒数
          let choosedMSeconds = new Date(Date.UTC(Year, Month - 1, i)).getTime()
          if (choosedMSeconds > nowMSeconds) {  //今天以后可选
            obj.ifCanChoose = true
          } else {                               //今天以前不可选
            obj.ifCanChoose = false
          }
          afterCombine.map(function (Item, Idx) {
            console.log(Number(Item.Day) == i)
            if (Number(Item.DAY) == i) {
              obj.FID_Z = Item.FID_Z
              obj.price = Item.JIAGE
              obj.preferentialPrice = Item.YH1
              obj.ZWS = Item.ZWS
            }
          })
          priceArray.push(obj)
        }
        console.log('priceArray----')
        console.log(priceArray)
        this.setData({
          priceArray: priceArray,
          loadingHidden: true
        })
      }
      
    }).catch((res) => {
      console.error("get 出发日期日历 failed")
      console.error(res)
    })
  },


  // //获取线路信息
  // getTravelLineInfo: function (id,name, Year, Month) {
  //   let requestPromisified = util.wxPromisify(wx.request);
  //   this.setData({
  //     loadingHidden: false
  //   })
  //   let strDate = Year + '-' + (Month >= 10 ? Month : '0' + Month)
  //   requestPromisified({
  //     url: h.main + '/rili1.html',  //shijian1.html
  //     data: {
  //       fid_z: id,
  //       str: strDate,
  //       base: app.globalData.base,
  //       // id: app.globalData.shopId,
  //       xqxlmc:name
  //     },
  //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'Accept': 'application/json',
  //     }, // 设置请求的 header
  //   }).then((res) => {
  //     console.log('出发日期日历backInfo---=')
  //     console.log(res.data)
  //     let priceArray = []
  //     let afterCombine = []
  //     let temp = res.data
  //     if (temp.length > 0) {
  //       //重组数据
  //       let len = temp.length / 8
  //       for (let i = 0; i < len; i++) {
  //         let eachArray = temp.splice(0, 8)
  //         let obj = {
  //           'FID_Z': eachArray[0],
  //           'JIAGE': eachArray[3],
  //           'YH1': eachArray[4],
  //           'ZWS': eachArray[7],
  //           'DAY': eachArray[6],
  //         }
  //         afterCombine.push(obj)
  //       }
  //     }
  //     let monthDays = new Date(Year, Month, 0).getDate()
  //     for (let i = 1; i <= monthDays;i++){
  //       let obj = {
  //         'date': i,
  //         'FID_Z': '',
  //         'price': 0,
  //         'preferentialPrice': 0,
  //         'ZWS': 0,
  //       }
  //       //判断该日期是否可选
  //       //当前日期毫秒数
  //       let nowMSeconds = new Date(Date.UTC(this.data.curYear, this.data.curMonth - 1, this.data.curDay)).getTime()
  //       //所选日期毫秒数
  //       let choosedMSeconds = new Date(Date.UTC(Year, Month - 1, i)).getTime()
  //       if (choosedMSeconds > nowMSeconds){  //今天以后可选
  //         obj.ifCanChoose = true
  //       }else{                               //今天以前不可选
  //         obj.ifCanChoose = false
  //       }
  //       afterCombine.map(function(Item,Idx){
  //         console.log(Number(Item.Day) == i)
  //         if (Number(Item.DAY)==i){
  //             obj.FID_Z = Item.FID_Z
  //             obj.price = Item.JIAGE
  //             obj.preferentialPrice = Item.YH1
  //             obj.ZWS = Item.ZWS
  //         }
  //       })
  //       priceArray.push(obj)
  //     }
  //     console.log('priceArray----')
  //     console.log(priceArray)
  //       this.setData({
  //         priceArray: priceArray,
  //         loadingHidden: true
  //       })
  //   }).catch((res) => {
  //     console.error("get 出发日期日历 failed")
  //     console.error(res)
  //   })
  // },



  

})