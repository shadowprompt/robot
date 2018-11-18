module.exports = {
  recurseCb: function getInfo(cb){
    return function(item, name, alias ){
      const type = Object.prototype.toString.call(item);
      switch(type){
        case '[object String]':
          cb(`${item}: ${name}`);
          break;
        case '[object Number]':
          cb(name.repeat(6));
          // cb(`${' '.repeat(item)}${item} ---`);
          break;
        case '[object Object]':
          if(Object.prototype.toString.call(item[name]) === '[object Array]'){
            cb(`${alias || name}: ${item[name][0]}`);
          }else{
            cb(`${alias || name}: ${item[name]}`);
          }
          break;
        case '[object Array]':
          item.forEach((it => getInfo(cb)(it, name, alias)));
          break;
        default:
          break
      }
    } 
  }
};