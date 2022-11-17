const standardFloat = (number) => {
  if (number < 1 && number.toString().indexOf('e-') != -1) {
    var e = parseInt(number.toString().split('e-')[1]);
    number *= Math.pow(10,e-1);
    number = '0.' + (new Array(e)).join('0') + number.toString().substring(2);
    return number
  }
  return number.toString()
}

const removeHeadZero = (str) => {
  while(str.charAt(0) == '0') {
    str = str.substr(1, str.length-1)
  }
  return str;
}

export const covertDecimal = (amount, decimal, dir) => {
  var strAmount = amount.toString();
  if (dir == 'toBN') {
    strAmount = standardFloat(strAmount);
    var arr = strAmount.split(".");
    if (arr[1] && arr[1] != '') {
      if (arr[1].length >= decimal) {
        return removeHeadZero(arr[0] + arr[1].substr(0, decimal));
      }
      else {
        var len = decimal - arr[1].length;
        var decimal = '';
        while(len > 0) {
          decimal = decimal + '0';
          len --;
        }
        return removeHeadZero(arr[0] + arr[1] + decimal);
      }
    }
    else {
      var len = decimal;
      var decimal_str = '';
      while(len > 0) {
        decimal_str = decimal_str + '0';
        len --;
      }
      return removeHeadZero(strAmount + decimal_str);
    }
  }
  else {
    if (strAmount.length > decimal) {
      var top = strAmount.substr(0, strAmount.length - decimal);
      var low = strAmount.substr(strAmount.length - decimal, 2);
      return Number(top+"."+low)==NaN?0:Number(top+"."+low);
    }
    else {
      var len = decimal - strAmount.length;
      var dec = '';
      while (len > 0) {
        dec = dec + '0';
        len --;
      }
      return Number('0.'+ dec + strAmount.substr(0, 5))==NaN?0:Number('0.'+ dec + strAmount.substr(0, 5));
    }
  }
}
