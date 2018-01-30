import h from '../../../utils/url.js'
import util from '../../../utils/util.js'
var app = getApp()
Page( {
  data: {
    // orderList: [{ 'orderNo': 'ORDER123456', 'totalPrice': 3999, 'departureDate': '2017-08-26', 'travelLine': '巴沙7日5晚自由行.[国庆早定两人减1000]直飞3+2双酒店+接机巴沙7日5晚自由行.[国庆早定两人减1000]直飞3+2双酒店+接机+巴沙7日5晚自由行.[国庆早定两人减1000]直飞', 'img': 'http://gaopin-img.bj.bcebos.com/1491889583380.jpg', 'adults': 2, 'childs': 1, 'memberList': [{ 'name': '张三', 'IDCard': '320684198808289274' }, { 'name': '李四', 'IDCard': '320684198808289860' }] }, { 'orderNo': 'ORDER123456', 'totalPrice': 2999, 'departureDate': '2017-08-26', 'travelLine': '巴沙7日5晚自由行.[国庆早定两人减1000]直飞3+2双酒店+接机巴沙7日5晚自由行.[国庆早定两人减1000]直飞3+2双酒店+接机+巴沙7日5晚自由行.[国庆早定两人减1000]直飞', 'img': 'http://www.gaopinimages.com/images/home/contributor.jpg', 'adults': 2, 'childs': 0, 'memberList': [{ 'name': '王五', 'IDCard': '320684198808289274' }, { 'name': '赵六', 'IDCard': '320684198808289860' }] }],
    nowDate:'',
    loadingHidden:false
  },
  onReady:function(){
   
  },

  onLoad: function(options) {
    console.log('onload order---')
    var date = new Date()
    this.setData({
      nowDate: Number(date.getTime())
    })
    console.log(Number(date.getTime()))
   
  },
  onShow: function(){
    this.getOrderList()
    // wx.request({
    //   url: h.main + '/selectorder4.html',
    //   data: {
    //     openid: app.globalData.oppenid
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'Accept': 'application/json',
    //   },
    //   success: (res) => {
    //     // success
    //     console.log('订单列表backInfo----')
    //     console.log(res.data)
    //     var temp = res.data[0]
    //     // 初始化点击展开数组
    //     var tempArray = []
    //     temp.map(function (outItem,outIndex){
    //       tempArray.push(false)
    //       outItem.orderlist1.map(function(inItem,inIndex){
    //         var partOfID = inItem.SFZH.replace(/(\w)/g, function (a, b, c) {
    //           return (c < (inItem.SFZH.length - 3) && c >= 3) ? '*' : a
    //         });
    //         inItem.SFZH = partOfID
    //       })
    //     })
    //     this.setData({
    //       orderList: temp,
    //       ifShowArray: tempArray,
    //       loadingHidden:true
    //     })
    //     console.log(tempArray)
    //   },
    //   fail: function () {
    //     // fail
    //   },
    //   complete: function () {
    //     // complete

    //   }
    // })
    
  },
  //获取订单列表
  getOrderList: function(){
    let requestPromisified = util.wxPromisify(wx.request)
    requestPromisified({
      url: h.main + '/selectorder4.html',
      data: {
        openid: app.globalData.oppenid,
        base: app.globalData.base,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res)=>{
      console.log('订单列表backInfo P----')
      console.log(res.data)
      let temp = res.data
      // 初始化点击展开数组
      let tempArray = []
      temp.map(function (outItem, outIndex) {
        tempArray.push(false)
        outItem.orderlist1.map(function (inItem, inIndex) {
          var partOfID = inItem.SFZH.replace(/(\w)/g, function (a, b, c) {
            return (c < (inItem.SFZH.length - 3) && c >= 3) ? '*' : a
          });
          inItem.SFZH = partOfID
        })
      })
      this.setData({
        orderList: temp.reverse(),
        ifShowArray: tempArray,
        loadingHidden: true
      })
      console.log(tempArray)
      }).catch((res) => {
        console.error("get 订单列表 failed")
        console.log(res)
      })
  },
  //出行人信息显示与隐藏
  showMember: function(e){
    let temp = this.data.ifShowArray
    temp[e.currentTarget.dataset.idx] = !temp[e.currentTarget.dataset.idx]
    this.setData({
        ifShowArray:temp
    })
  },

  
})