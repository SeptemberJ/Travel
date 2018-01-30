var app = getApp()
// import h from '../../utils/url.js'
Page({
    data: {
      tab: ['机票+酒店', '机票','酒店'],
      cur:0,
      ticketCur:0,
      
      loadingHidden:true
       
           
    },
    onLoad: function() {

    },
    onShow: function () {
      
    },
    changeTab: function(e){
      this.setData({
        cur:e.currentTarget.dataset.idx
      })
    },
    changeTicketTab: function (e) {
      this.setData({
        ticketCur: e.currentTarget.dataset.idx
      })
    }
    

    

})