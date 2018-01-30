var Promise = require('./blue')

// '/' 完整格式化
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// '-'格式化到年月日
function formatTime2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}
//秒数回转
function secondToFormat(second){
  var oDate = new Date(second),
  oYear = oDate.getFullYear(),
  oMonth = oDate.getMonth() + 1,
  oDay = oDate.getDate(),
  oHour = oDate.getHours(),
  oMin = oDate.getMinutes(),
  oSen = oDate.getSeconds(),
  oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);//最后拼接时间
  // oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
  return oTime;
};

// 补零
function getzf(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
};

// promise
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}


// 升降序排序
function DOAsort(itemList, sortProperty, sortWay) {
  console.log(sortWay)
    var objectList = new Array();
    function recombineObj(item) {
      var _this = this
      for (var key of Object.keys(item)) {
        _this[key] = item[key]
      }
    }
    itemList.map(function (item, index) {
      objectList.push(new recombineObj(item));
    })
    switch (sortWay){
      case '价格降序':
        console.log('降序------')
        objectList.sort(function (a, b) {
          return b[sortProperty] - a[sortProperty]
        })
        break;
      case '价格升序':
        console.log('升序------')
        objectList.sort(function (a, b) {
          return a[sortProperty] - b[sortProperty]
        })
        default:
        console.log('不排序------')
        return objectList
    }
      return objectList
};


  


module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  secondToFormat: secondToFormat,
  wxPromisify: wxPromisify,
  DOAsort: DOAsort
}
