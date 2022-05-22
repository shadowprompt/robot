const https = require('https');
const qs = require('querystring');

const res = qs.stringify({
  a:1,
  b: [{
    b1:1,
    b2: {
      bbb: 9
    }
  }, 999]
});

// a=1&b=&b=999

const res2 = qs.parse('a=b&a=c&bbb=90'); // {a:['b', 'c'], bbb:'90'}

console.log(res)