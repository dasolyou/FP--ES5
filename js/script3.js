// 컬렉션 중심 프로그래밍의 4가지 유형과 함수

// 1. 수집하기 - map, values, pluck 등
// 2. 거르기 - filter, reject, compact, without 등
// 3. 찾아내기 - find, some, every 등
// 4. 접기 - reduce, min, max, group_by, count_by

// 각 유형의 첫번째가 대표함수
// 대표함수는 가장 추상적, 다른 특화함수는 대표함수를 이용해 만들어짐

/////////////////////////////////
function _curry(fn) {
  return function(a, b) {
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); };
  }
}

function _curryr(fn) {
  return function(a, b) { 
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(b, a); };
  }
}

var _get = _curryr(function(obj, key) {
  return obj == null ? undefined : obj[key];
});

function _filter(list, predi) { 
  var new_list = [];
  _each(list, function(val) {
    if (predi(val)) { 
      new_list.push(val);
    }
  });
  return new_list; 
}

function _map(list, mappper) {
  var new_list = [];
  _each(list, function(val, key) {
    new_list.push(mappper(val, key));
  });
  return new_list;
}

function _is_object(obj) {
  return typeof obj == 'object' && !!obj;
}
function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

var _length = _get('length');

function _each(list, iter) { 
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]], keys[i]);
  }
  return list;
}  

var _map = _curryr(_map),
  _each = _curryr(_each),
  _filter = _curryr(_filter);

var _pairs = _map((val, key) => [key, val]);

var slice = Array.prototype.slice;
function _rest(list, num) {
  return slice.call(list, num || 1);
}

function _reduce(list, iter, memo) { 
  if (arguments.length == 2) { 
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function(val) {
    memo = iter(memo, val);    
  });
  return memo;
}

function _pipe() {
  var fns = arguments; 
  return function(arg) {
    return _reduce(fns, function(arg, fn) { 
      return fn(arg);
    }, arg);
  }
}

function _go(arg) { 
  var fns = _rest(arguments); 
  return _pipe.apply(null, fns)(arg);
}

var _values = _map(_identity); 

function _identity(val) {
  return  val;
}

var _pluck = _curry(function(data, key) {
  return _map(data, _get(key)); 
  // return _map(data, function(obj) { return obj[key]; })
})

function _negate(func) {
  return function(val) {
    return !func(val);
  }
}

var _reject = _curryr(function(data, predi) {
  return _filter(data, _negate(predi));
  // return _filter(data, function(val) { return !predi(val); });
})

var _compact = _filter(_identity);

var _find = _curryr(function(list, predi) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    var val = list[keys[i]];
    if (predi(val)) return val;
  } 
}); 

var _find_index = _curryr(function(list, predi) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    if (predi(list[keys[i]])) return i;
  } 
  return -1;
});

function _some(data, predi) {
  return _find_index(data, predi || _identity) != -1;
} 

function _every(data, predi) {
  return _find_index(data, _negate(predi || _identity)) == -1;
}

function _min(data) {
  return _reduce(data, function(a, b){
    return a < b ? a : b;
  });
}

function _max(data) {
  return _reduce(data, function(a, b){
    return a > b ? a : b;
  });
}

function _min_by(data, iter) {
  return _reduce(data, function(a, b){
    return iter(a) < iter(b) ? a : b;
  });
}

function _max_by(data, iter) {
  return _reduce(data, function(a, b){
    return iter(a) > iter(b) ? a : b;
  });
}

function _push(obj, key, val) {
  (obj[key] = obj[key] || []).push(val);
  return obj;
}

var _group_by = _curryr(function(data, iter) {
  return _reduce(data, function(grouped, val) {
    return _push(grouped, iter(val), val);
    // var key = iter(val);
    // (grouped[key] = grouped[key] || []).push(val);
    // return grouped;
  }, {});
});

var _inc = function(count, key) {
  count[key] ? count[key]++ : count[key] = 1;
  return count;
}

var _count_by = _curryr(function(data, iter) {
  return _reduce(data, function(count, val) {
    return _inc(count, iter(val));
    // var key = iter(val);
    // count[key] ? count[key]++ : count[key] = 1;
    // return count;
  }, {});
})

var _head = function(list) {
  return list[0];
};

//////////////////////////////////////


var users = [
  { id: 10, name: 'ID', age: 36 },
  { id: 20, name: 'BJ', age: 32 },
  { id: 30, name: 'JM', age: 32 },
  { id: 40, name: 'PJ', age: 27 },
  { id: 50, name: 'HA', age: 25 },
  { id: 60, name: 'JE', age: 26 },
  { id: 70, name: 'JI', age: 31 },
  { id: 80, name: 'MP', age: 23 },
  { id: 90, name: 'FP', age: 13 }
];

// 컬렉션 중심 프로그래밍의 유형별 함수 만들기

// 1. 수집하기 - map
_map(users, function(user) {
  return user.name;
});
//?

//   1. values
// map 함수를 이용해 values를 만듦
// key - value 형태에서 value를 꺼내는 함수

// function _values(data) {
//   return _map(data, _identity);
//   // return _map(data, function(val) { return val; });
// }
// var _values = _map(_identity); // 함수를 리턴
// function _identity(val) {
//   return  val;
// }
var a = 10;
_identity(a);

users[0];
_keys(users[0]);
// _values(users[0]);

_map(_identity)(users[0]);
//?

//   2. pluck
// function _pluck(data, key) {
//   return _map(data, _get(key)); 
//   // return _map(data, function(obj) { return obj[key]; })
// }

_pluck(users, 'age'); 
//?
_pluck(users, 'name'); 
//?
_pluck(users, 'id'); 
//?

// 2. 거르기 - filter
_filter(users, function(user) {
  return user.age > 30;
})
//? 

//   1. reject
// filter함수를 반대로 동작시킨 것
// true로 평가되는 것들을 제외시킴

// function _negate(func) {
//   return function(val) {
//     return !func(val);
//   }
// }

// function _reject(data, predi) {
//   return _filter(data, _negate(predi));
//   // return _filter(data, function(val) { return !predi(val); });
// }

_reject(users, function(user) {
  return user.age > 30;
})
//?

//   2. compact
//  긍정적인 값만 남기는 함수
// var _compact = _filter(_identity);
// _compact([1, 2, 0, false, null, {}])


// 3. 찾아내기 - find
//   1. find 만들기
// 배열 안에 있는 값 중 조건에 맞는 값을 처음 만났을 때 그 값을 리턴(값 하나만)
// var _find = _curryr(function(list, predi) {
//   var keys = _keys(list);
//   for (var i = 0, len = keys.length; i < len; i++) {
//     var val = list[keys[i]];
//     if (predi(val)) return val;
//   } 
//   //for문을 도는 동안 못 찾으면 undifined
// }); 

// var _find_index = _curryr(function(list, predi) {
//   var keys = _keys(list);
//   for (var i = 0, len = keys.length; i < len; i++) {
//     if (predi(list[keys[i]])) return i;
//   } 
//   return -1;
// });

_get(
  _find(users, function(user) {
    return user.id == 20;
  }),

  'name'
)
_go(
  _find(users, function(user) {
    return user.id == 20;
  }),
  _get('name'),
  console.log
)
_find_index(users, function(user) {
  return user.id == 20;
})
//?

//   2. find_index
// 해당하는 값을 처음 만났을 때 그 인덱스 값을 리턴
//   3. some
// 조건에 만족하는 값이 하나라도 있으면 true
// function _some(data, predi) {
//   return _find_index(data, predi || _identity) != -1;
// }

console.log(_some([1, 2, 5, 10, 20], function(val) {
  return val > 10;
})) // true
//?

//   4. every
// 모든 값이 조건을 만족해야 true
// function _every(data, predi) {
//   return _find_index(data, _negate(predi || _identity)) == -1;
// } // 하나라도 false로 평가되는 것이 없으면 true를 반환

console.log(_every([1, 2, 5, 10, 20], function(val) {
  return val > 10;
})) // flase

// some과 every는 predi를 생략해도 동작해야 함
console.log(
  _some([1, 2, 0, 10])
); //true

console.log(
  _every([null, false, 0])
); //false 

console.log(
  _some(users, function(user) {
    return user.age < 20;
  })
);

// 4. 접기 - reduce
// array 안에 있는 값이나 iterable한 객체에 있는 값들을 통해서 

//   1. min, max, min_by, max_by
// 모든 값을 확인하고 접어내는 함수
// 평가 순서와 상관없이 해당하는 결과를 만들 수 있도록 사고하는 것이 중요!!
// 단순히 for 문을 돌리는 것만으로 사고하지 말고
// 배열의 각 값의 평가 순서와 관계없이
// 단순히 a, b만 평가할래!!! 
// 라는 사고로 접근... 
// function _min(data) {
//   return _reduce(data, function(a, b){
//     return a < b ? a : b;
//   });
// }

// function _max(data) {
//   return _reduce(data, function(a, b){
//     return a > b ? a : b;
//   });
// }

_min([1, 2, 4, 10, 5, -4]);
//?
_max([1, 2, 4, 10, 5, -4]);
//?

// function _min_by(data, iter) {
//   return _reduce(data, function(a, b){
//     return iter(a) < iter(b) ? a : b;
//   });
// }

// function _max_by(data, iter) {
//   return _reduce(data, function(a, b){
//     return iter(a) > iter(b) ? a : b;
//   });
// }

var _min_by = _curryr(_min_by),
  _max_by = _curryr(_max_by);

_min_by([1, 2, 4, 10, 5, -4], Math.abs);
//?
_max_by([1, 2, 4, 10, 5, -4, -11], Math.abs);
//?
_max(_map([1, 2, 4, 10, 5, -4, -11], Math.abs))
//?
_max_by(users, function(user) {
  return user.age;
})
//?

_go(users,
  _filter(user => user.age >= 30),
  _min_by(_get('age')),
  // _min_by(users => users.age),
  console.log  
)
_go(users,
  _filter(user => user.age >= 30),
  _map(_get('age')),
  _min,
  console.log  
)
_go(users,
  _reject(user => user.age >= 30),
  _max_by(_get('age')),
  _get('name'),
  console.log  
)

//   2. group_by, push
// 특정 조건에 대해서 객체로 그룹을 지어줌
// {조건: [], 조건: [] ...}

// function _push(obj, key, val) {
//   (obj[key] = obj[key] || []).push(val);
//   return obj;
// }

// var _group_by = _curryr(function(data, iter) {
//   return _reduce(data, function(grouped, val) {
//     return _push(grouped, iter(val), val);
//     // var key = iter(val);
//     // (grouped[key] = grouped[key] || []).push(val);
//     // return grouped;
//   }, {});
// });

_go(users,
  // _group_by(function(user) { return user.age; }),
  _group_by(_get('age')),
  console.log  
);

_go(users,
  _group_by(function(user) {
    return user.age - user.age % 10;
  }),
  console.log  
);

var _head = function(list) {
  return list[0];
}

_go(users,
  _group_by(function(user) {
    return user.name[0];
  }),
  console.log  
);

_go(users,
  _group_by(_pipe(_get('name'), _head)),
  console.log  
);

//   3. count_by, inc
// 조건 key의 갯수를 세는..?

// var _inc = function(count, key) {
//   count[key] ? count[key]++ : count[key] = 1;
//   return count;
// }

// var _count_by = _curryr(function(data, iter) {
//   return _reduce(data, function(count, val) {
//     return _inc(count, iter(val));
//     // var key = iter(val);
//     // count[key] ? count[key]++ : count[key] = 1;
//     // return count;
//   }, {});
// })

_count_by(users, function(user) {
  return user.age - user.age % 10;
});
//?


// 추가 //
var _pairs = _map((val, key) => [key, val]);
_pairs(users[0]);
//?

var _docucment_write = document.write.bind(document);
_go(users,
  _count_by(function(user) {
    return user.age - user.age % 10;
  }),
  _map((count, key) => `<li>${key}대는 ${count}명 입니다.</li>`),
  list => '<ul>' + list.join('') + '</ul>',
  _docucment_write
  // function(html) { document.write(html); }
)




