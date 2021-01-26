function _pipe() {
  var fns = arguments; // arg로 들어오는 함수들의 모음
  return function(arg) {
    return _reduce(fns, function(arg, fn) { // 모든 함수를 돌면서(fns) n번째 함수(fn)에 인자를 적용한 결과를 리턴하면 그 결과는 다시 arg가 되고 다시 fn에 적용하고.... 반복
      return fn(arg);
    }, arg);
  }
}

function _go(arg) { // 첫번째 인자는 함수가 아닌 값
  var fns = _rest(arguments); // arguments에서 첫번째 값을 제외하고 적용이 되야 함
  return _pipe.apply(null, fns)(arg);
}

var slice = Array.prototype.slice;
function _rest(list, num) {
  return slice.call(list, num || 1);
}

function _reduce(list, iter, memo) { // 두번째 인자로 받은 함수를 연속적(재귀적)으로 호출해주면서 값을 축약해(만들어)나가는 함수
  if (arguments.length == 2) { // 인자를 두개만 받아도 정상동작하게
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function(val) {
    memo = iter(memo, val);    
  });
  return memo;
}

function _curry(fn) {
  return function(a, b) {
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); };
  }
}

function _curryr(fn) { // 오른쪽 인자부터 받음
  return function(a, b) { 
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(b, a); };
  }
}

var _get = _curryr(function(obj, key) {
  return obj == null ? undefined : obj[key]; // 값이 없을 때 오류나지 않고 안전하게 실행 
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
  _each(list, function(val) {
    new_list.push(mappper(val));
  });
  return new_list;
}

function _is_object(obj) {
  return typeof obj == 'object' && !!obj;
}
function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}

var _length = _get('length'); // get 안에 null인 경우 undifined를 리턴하는 부분이 포함됐기 때문에 에러 잡는데 사용

// function _each(list, iter) {
//   for (var i = 0, len = _length(list); i < len; i++) {
//     iter(list[i]);
//   }
//   return list;
// }
function _each(list, iter) { // array, key-value쌍 모두 잘 동작하도록
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]], keys[i]);
  }
  return list;
}  

var _map = _curryr(_map),
  _filter = _curryr(_filter);
//////////////////////////////////////////////////////

var users = [
  { id: 1, name: 'ID', age: 36 },
  { id: 2, name: 'BJ', age: 32 },
  { id: 3, name: 'JM', age: 32 },
  { id: 4, name: 'PJ', age: 27 },
  { id: 5, name: 'HA', age: 25 },
  { id: 6, name: 'JE', age: 26 },
  { id: 7, name: 'JI', age: 31 },
  { id: 8, name: 'MP', age: 23 }
];

// 1. 명령형 코드
  // 1. 30세 이상인 users를 거른다.
var temp_users = [];
for (var i = 0; i < users.length; i++) {
  if (users[i].age >= 30) {
    temp_users.push(users[i]);
  }
}
temp_users;

  // 2. 30세 이상인 users의 names를 수집한다.
var names = [];
for (var i = 0; i < temp_users.length; i++) {
  names.push(temp_users[i].name);
}
names;
  // 3. 30세 미만인 users를 거른다.
var temp_users = [];
for (var i = 0; i < users.length; i++) {
  if (users[i].age < 30) {
    temp_users.push(users[i]);
  }
}
temp_users;

  // 4. 30세 미만인 users의 ages를 수집한다.
var ages = [];
for (var i = 0; i < temp_users.length; i++) {
  ages.push(temp_users[i].age);
}
ages;
  
// 2. _filter, _map으로 리팩토링
// 데이터가 어떻게 생겼는지 알 수 없음 : 관심사 분리 -> 재활용성 높아짐 
// function _filter(list, predi) { // 응용형 함수: 함수가 함수를 인자로 받아서 원하는 시점에 해당 함수가 알고있는 인자를 적용함
//   var new_list = [];
//   for (var i = 0; i < list.length; i++) {
//     // 차이가 있는 부분을 추상화 할 때 객체가 아닌 함수를 사용함
//     if (predi(list[i])) { // 조건을 함수에 위임 
//       new_list.push(list[i]);
//     }
//   }
//   return new_list; // console.log는 부수효과 일어남
// }
// function _map(list, mappper) {
//   var new_list = [];
//   for (var i = 0; i < list.length; i++) {
//     new_list.push(mappper(list[i]));
//   }
//   return new_list;
// }

var over_30 = _filter(users, function(user) { return user.age >= 30; });
over_30;

var names = _map(over_30, function(user) {
  return user.name;
});
names;

var under_30 = _filter(users, function(user) { return user.age < 30; });

var ages = _map(under_30, function(user) {
  return user.age;
})
ages;


// _filter(users, function(user) { return user.age >= 30; });
// _filter(users, function(user) { return user.age < 30; });
// _filter([1, 2, 3, 4], function(num) { return num % 2; });
// _filter([1, 2, 3, 4], function(num) { return !(num % 2); });
// _map([1, 2, 3, 4], function(num) { return num * 2 });

// 함수형 프로그래밍에서는 대입문을 잘 사용하지 않음
// 함수를 통과해가면서 한번에 값을 새롭게 만들어감

_map(
  _filter(users, function(user) { return user.age >= 30; }),
  function(user) { return user.name; }
)

_map(
  _filter(users, function(user) { return user.age < 30; }),
  function(user) { return user.age; }
)


// 3. each 만들기
  // 1. _each로 _map, _filter 중복 제거

  // 2. 외부 다형성
    // 1. array_like, arguments, document.querySelectorAll
    // [1, 2, 3].map(function(val) { // 여기서 map, filter는 함수가 아닌 methods
    //   return val * 2;
    // });
    // data가 먼저 나오는 프로그래밍 -> 데이터가 있어야 그에 맞는 method가 생김
    
// console.log(document.querySelectorAll('*')); // not array, like array

// console.log(_map(document.querySelectorAll('*'), function(node) {
//   return node.nodeName;
// }));
    // 함수가 먼저 나오는 프로그래밍 -> 데이터가 없어도 함수는 존재 -> 평가 시점이 상대적으로 유연함

  // 3. 내부 다형성
    // 1. predi, iter, mapper
    // 무조건 callback 함수가 아니라 역할에 맞게 이름을 불러주는 것이 조아~
    // 조건, 돌리는거, 매핑하는거 ...


// 4. 커링
  // 1. _curry, _curryr
  // 함수와 인자를 다루는 기법
// function _curry(fn) {
//   return function(a) {
//     return function(b) {
//       return fn(a, b); // 미리 받아놓고 안쪽에서 평가
//     }
//   }
// }
// function _curry(fn) {
//   return function(a, b) {
//     return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); };
//   }
// }
// function _curryr(fn) { // 오른쪽 인자부터 받음
//   return function(a, b) { 
//     return arguments.length == 2 ? fn(a, b) : function(b) { return fn(b, a); };
//   }
// }

var add = function(a, b) {
  return a + b;
}

var add2 = _curry(function(a, b) {
  return a + b;
});

var add10 = add2(10);
add10(5);
add2(5)(3);
add2(3, 7);

var sub = _curryr(function(a, b) {
  return a - b;
});

sub(10, 5);
// ?
var sub10 = sub(10);
sub10(5);

//?
  // 2. _get 만들어 좀 더 간단하게 하기
  // 객체 안에 있는 값를 안전하게 참조
function _get(obj, key) {
  return obj == null ? undefined : obj[key]; // 값이 없을 때 오류나지 않고 안전하게 실행 
}
var user1 = users[0];
user1.name;
_get(user1, 'name');
// console.log(users[10].name); //error
_get(users[10], 'name'); 


// var _get = _curryr(function(obj, key) {
//   return obj == null ? undefined : obj[key]; // 값이 없을 때 오류나지 않고 안전하게 실행 
// });
_get('name')(user1);
var get_name = _get('name');
get_name(user1);

_map(
  _filter(users, function(user) { return user.age >= 30; }),
  _get('name') // obj를 넣지 않아도, key값만 있어도 됨
  // function(user) { return user.name; }
)
//?
_map(
  _filter(users, function(user) { return user.age < 30; }),
  _get('age')
  // function(user) { return user.age; }
)
//?

// 5. _reduce 만들기
// 원래 들어온 자료를 축약해서 다른 형태의 자료로 리턴할 때 사용
// function _reduce(list, iter, memo) {
//   iter(iter(iter(0, 1), 2), 3);  
// }
// _reduce([1, 2, 3], add, 0);
// memo = add(0, 1);
// memo = add(memo, 2);
// memo = add(memo, 3);
// return memo;
// add(add(add(0, 1), 2), 3);

// var slice = Array.prototype.slice;
// function _rest(list, num) {
//   return slice.call(list, num || 1);
// }

// function _reduce(list, iter, memo) { // 두번째 인자로 받은 함수를 연속적(재귀적)으로 호출해주면서 값을 축약해(만들어)나가는 함수
//   if (arguments.length == 2) { // 인자를 두개만 받아도 정상동작하게
//     memo = list[0];
//     list = _rest(list);
//   }
//   _each(list, function(val) {
//     memo = iter(memo, val);    
//   });
//   return memo;
// }

_reduce([1, 2, 3, 4], add, 0);
_reduce([1, 2, 3, 4], add);

//?

// 5. 파이프라인 만들기
  // 1. _pipe
  // 함수를 인자로 받아서 연속적으로 실행해줌
  // 함수를 리턴하는 함수
  // reduce보다 더 추상화된 버전
// function _pipe() {
//   var fns = arguments; // arg로 들어오는 함수들의 모음
//   return function(arg) {
//     return _reduce(fns, function(arg, fn) { // 모든 함수를 돌면서(fns) n번째 함수(fn)에 인자를 적용한 결과를 리턴하면 그 결과는 다시 arg가 되고 다시 fn에 적용하고.... 반복
//       return fn(arg);
//     }, arg);
//   }
// }

var f1 = _pipe(
  function(a) { return a + 1; }, // 1 + 1 
  function(a) { return a * 2; }, // 2 * 2
  function(a) { return a * a; } // 4 * 4
)
f1(1);

  // 2. _go
  // pipe의 즉시 실행 버전

// function _go(arg) { // 첫번째 인자는 함수가 아닌 값
//   var fns = _rest(arguments); // arguments에서 첫번째 값을 제외하고 적용이 되야 함
//   return _pipe.apply(null, fns)(arg);
// }
_go( 1,
  function(a) { return a + 1; }, 
  function(a) { return a * 2; }, 
  function(a) { return a * a; }, 
  console.log
)

  // 3. users에 _go 적용

// 첫번째
// _map(
//   _filter(users, function(user) { return user.age >= 30; }),
//   _get('name') 
// )
// _map(
//   _filter(users, function(user) { return user.age < 30; }),
//   _get('age')
// )

// 두번째
// _go(users,
//   function(users) {
//     return _filter(users, function(user) {
//       return user.age >= 30;
//     });
//   },  
//   function(users) {
//     return _map(users, _get('name'));
//   },
//   console.log
// )

// 세번째
_go(users,
  _filter(function(user) { // filter에 인자로 받은 함수를 적용할 예정인 새로운 함수를 리턴하게 되고 filter는 인자를 하나만 받게되는데 위에서 받음
    return user.age >= 30;
  }),_map(_get('name')),
  console.log
);

_go(users,
  _filter(user => user.age < 30),
  _map(_get('age')),
  console.log
)

_map([1, 2, 3], function(val) { return val * 2; });
_map(function(val) { return val * 2 })([1, 2, 3]);
//?

//?
  // 4. 화살표 함수 간단히
// var a = function(user) { return user.age >= 30 };
// var a = user => user.age >= 30;

// var add = function(a, b) { return a + b };
// var add = (a, b) => a + b;
// var add = (a, b) => {
//   //
//   return //
// };
// var add = (a, b) => ({val: a + b});



// 6. _each의 외부 다형성 높이기
  // 1. _each에 null 넣어도 에러 안나게
_each(null, console.log);
_go(null,
  _filter(function(v) { return v % 2; }),
  _map(function(v) { return v * v; }),
  console.log
)
// 에러가 날 때 흘려보낼 수 있도록하는 전략을 취함 -> get의 삼항연산자 null인 경우 undifined 리턴

  // 2. _keys 만들기
  // 3. _keys에서도 _is_object인지 검사하여 null 에러 안나게
// console.log( Object.keys({ name: 'ID', age: 33 }) );
// console.log( Object.keys([1, 2, 3, 4]) );
// console.log( Object.keys(10) ); // []
// console.log( Object.keys(null) ); // error

// function _is_object(obj) {
//   return typeof obj == 'object' && !!obj;
// }
// function _keys(obj) {
//   return _is_object(obj) ? Object.keys(obj) : [];
// }

console.log( _keys(10) ); // []
console.log( _keys(null) ); // []

  // 4. _each 외부 다형성 높이기
_each({
  13: 'ID',
  19: 'HD',
  29: 'YD'
}, function(name) {
  console.log(name);
});
_map({
  13: 'ID',
  19: 'HD',
  29: 'YD'
}, function(name) {
  return name.toLowerCase();
});
//?















