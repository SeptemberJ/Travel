// const conf = {
Page({
  data: {
    hasEmptyGrid: false,
    cur:7,
    choosed:'',
    travelDays:[
      {
        "date":1,
        "oldPrice":699,
        "nowPrice":599
      },
      {
        "date": 2,
        "oldPrice": 999,
        "nowPrice": 899
      },
      {
        "date": 3,
        "oldPrice": '',
        "nowPrice": '',
      },
      {
        "date": 4,
        "oldPrice": '',
        "nowPrice": '',
      },
      {
        "date": 5,
        "oldPrice": '',
        "nowPrice": '',
      },
      {
        "date": 6,
        "oldPrice": '',
        "nowPrice": '',
      },
      {
        "date": 7,
        "oldPrice": '',
        "nowPrice": '',
      },
      {
        "date": 8,
        "oldPrice": 1999,
        "nowPrice": 1899
      },
      {
        "date": 9,
        "oldPrice": '',
        "nowPrice": '',
      },
      {
        "date": 10,
        "oldPrice": 1999,
        "nowPrice": 1899
      },
      ]
  },
  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },
  canChoose: function (e) {
    var idx = e.currentTarget.dataset.idx
    console.log('clicked----')
    console.log(idx+1)
    this.setData({
      choosed: idx + 1
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
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {     //往前
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {                   //往后
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '小程序日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/index/index'
    }
  },

})


// Page(conf);
