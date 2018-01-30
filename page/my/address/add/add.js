 const AV = require('../../../../utils/av-weapp.js')
 import h from '../../../../utils/url.js'
 import ss from '../../../../utils/add.js'
 var app = getApp()
Page({
	isDefault: false,
	data: {
		address:{},
		objectId:-1,
		id:'',
		current: 0,
		province: [],
		city: [],
		region: [],
		town: [],
		provinceObjects: [],
		cityObjects: [],
		regionObjects: [],
		townObjects: [],
		areaSelectedStr: '请选择省市区',
		maskVisual: 'hidden',
		provinceName: '请选择'
	},
		onLoad: function (options) {
			var that = this;
			console.log(ss.add)
			var list = ss.add;
			var lista = [];
			for (var i in list) {
				lista.push(list[i].name)
			}
			this.setData({
				province: lista,
			})
			console.log(lista)
			if(options.id){
				wx.getStorage({
				key: 'address',
				success: (res)=>{
          var addr = { 'id': res.data.id, 'faddress': res.data.faddress, 'fname': res.data.fname, 'fmobile': res.data.fmobile,}
					this.setData({
            areaSelectedStr: res.data.fprovince + res.data.fcity + res.data.farea,
						address:addr,
            provinceName: res.data.fprovince,
            cityName: res.data.fcity,
            regionName: res.data.farea
					})
				}
				})
			}
			console.log('address------')
			console.log(this.data.address)
			
			
	},
	  //选择位置位置
  chooseLocation:function(e){
    console.log(e)
    wx.chooseLocation({
          success: (res)=>{
            // success
            console.log('选择的位置位置---')

            console.log(res)
            console.log(res.address)
            console.log(res.name)
			var newaddress = this.data.address
      newaddress.faddress=res.address
            this.setData({
				address:newaddress
            //   hasLocation:true,
            //   location:{
            //     longitude:res.longitude,
            //     latitude:res.latitude
            //   }
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },

	// 显示选项区域
	cascadePopup: function() {
		console.log('cascadePopup---')
		console.log(this.data.city)
		var animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease-in-out',
		});
		this.animation = animation;
		animation.translateY(-285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'show'
		});
	},
	// 隐藏选项区域
	cascadeDismiss: function () {
		this.animation.translateY(285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'hidden'
		});
	},
	// 选择province
	provinceTapped: function (e) {
		console.log('provinceTapped----')
		// 标识当前点击省份，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		console.log(index)
		// current为1，使得页面向左滑动一页至市级列表
		// provinceIndex是市区数据的标识
		this.setData({
			provinceName: this.data.province[index],
			regionName: '',
			townName: '',
			provinceIndex: index,
			cityIndex: -1,
			regionIndex: -1,
			townIndex: -1,
			region: [],
			town: []
		});
		var that = this;
		var lista=[];
		var City=ss.add[index].city
		// var lista = ss.add[index].city[0].area;
		for (var i in City) {
				lista.push(City[i].name)
			}
		
		console.log(lista)
		that.setData({
			cityName: '请选择',
			city: lista,
			current: 1
			//cityObjects: area
		});
	},
	// 选择city
	cityTapped: function (e) {
		console.log('cityTapped----')
		// 标识当前点击县级，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// current为1，使得页面向左滑动一页至市级列表
		// cityIndex是市区数据的标识
		this.setData({
			cityIndex: index,
			regionIndex: -1,
			townIndex: -1,
			cityName: this.data.city[index],
			regionName: '',
			townName: '',
			town: []
		});
		this.setData({
				regionName: '请选择',
				region: ss.add[this.data.provinceIndex].city[this.data.cityIndex].area,
				current: 2
			});
			
	},
	// 选择region
	regionTapped: function(e) {
    	// 标识当前点击镇级，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// current为1，使得页面向左滑动一页至市级列表
    	// regionIndex是县级数据的标识
    	this.setData({
    		regionIndex: index,
    		townIndex: -1,
    		regionName: this.data.region[index],
    		townName: ''
    	});
		var areaSelectedStr = this.data.provinceName + this.data.cityName+this.data.regionName;
		this.setData({
			areaSelectedStr: areaSelectedStr
		});
		this.cascadeDismiss();
    },
    currentChanged: function (e) {
    	// swiper滚动使得current值被动变化，用于高亮标记
    	var current = e.detail.current;
    	this.setData({
    		current: current
    	});
    },
    changeCurrent: function (e) {
    	// 记录点击的标题所在的区级级别
    	var current = e.currentTarget.dataset.current;
    	this.setData({
    		current: current
    	});
    },

	// 提交
		formSubmit: function(e) {
		// user 
		// var user = AV.User.current();
		// detail
		var detail = e.detail.value.detail;
		// realname
		var realname = e.detail.value.realname;
		// mobile
		var mobile = e.detail.value.mobile;
		// 表单验证
		if (this.data.areaSelectedStr == '请选择省市区') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入区域!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                });    
                // return false;
			return;
		}
		if (detail == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请填写详情地址!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}
		if (realname == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请填写收件人!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}
		if(!(/^1[34578]\d{9}$/.test(mobile))){
			wx.showModal({    
                    title:'提示',    
                    content: '请填写正确手机号码!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}

	//新增
	if(!this.data.address.id){
		console.log('新增-----')
			wx.request({
        url: h.main + '/page/Insertaddress.do',
			data: {
        fmobile: e.detail.value.mobile,
        fname: e.detail.value.realname,
        fprovince: this.data.provinceName,
        fcity: this.data.cityName,
        farea: this.data.regionName,
        faddress: e.detail.value.detail,
        oppen_id: app.globalData.oppenid

				// sblock:e.detail.value.detail,
        // province: this.data.provinceName,
        // city: this.data.cityName,
        // region: this.data.regionName,
			},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
			}, // 设置请求的 header
      success: (res) => {
        console.log('新增地址backInfo-----')
				console.log(res)
        if (res.data=='success'){
				wx.showToast({
					title: '保存成功',
					duration: 500
				});
				// 等待半秒，toast消失后返回上一页
				setTimeout(function () {
					wx.navigateBack();
				}, 500);

        }
			},
			fail: (res)=> {


			},
      complete: (res) => {

			}
		})
	}else{
		console.log('修改-----')
		wx.request({
      url: h.main + '/page/Updateaddress.do',
			data: {
        fmobile: e.detail.value.mobile,
        fname: e.detail.value.realname,
        fprovince: this.data.provinceName,
        fcity: this.data.cityName,
        farea: this.data.regionName,
        faddress: e.detail.value.detail,
        id: this.data.address.id
			},
			method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
				// 'Accept-Charset': 'GB2312,utf-8'
			}, // 设置请求的 header
			success: function (res) {
        if (res.data == 'success') {
          wx.showToast({
            title: '修改成功',
            duration: 500
          });
          // 等待半秒，toast消失后返回上一页
          setTimeout(function () {
            wx.navigateBack();
          }, 500);

        }
			},
			fail: function (res) {


			},
			complete: function (res) {

			}
		})

	}

	}
    
})
