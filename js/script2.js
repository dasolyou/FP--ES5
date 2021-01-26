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

function _each(list, iter) {
  for (var i = 0; i < list.length; i++) {
    iter(list[i]);
  }
  return list;
}

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
var _get = _curryr(function(obj, key) {
  return obj == null ? undefined : obj[key]; // 값이 없을 때 오류나지 않고 안전하게 실행 
});
var user1 = users[0];
user1.name;
_get(user1, 'name');
// console.log(users[10].name); //error
_get(users[10], 'name'); 
//?




// 5. _reduce 만들기