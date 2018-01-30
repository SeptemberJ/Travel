
var app = getApp()
Page( {
  data: {
    userInfo: {},
  
  },

  onLoad: function() {
    this.setData({
      userInfo:app.globalData.userInfo,
    });
   
  },
  navigateToMemberInfo:function(){
    wx.navigateTo({
			url: '../memberInfo/list/index'
		});
  },
  makeCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.fmobile
    })
  }
  
  
})