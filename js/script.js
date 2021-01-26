/* 순수 함수 */
// 1. 동일한 인자를 주면 항상 동일한 결과 리턴
// 2. 부수효과 없음 - 외부에 미치는 영향 없음 (외부의 상태를 변경 )
function a(a, b) {
  return a + b;
}
a(10, 5)

var c = 10;
function add2(a, b) {
  return a + b + c;
}
add2(10, 2); // 22
c = 11;
add2(10, 2); // 23
// add2는 순수함수 아님

var c2 = 10;
function add3(a, b) {
  c2 = b; // 함수 외부에 있는 c2의 값을 변경함 -> 순수함수 아님
  return a +b;
}

var obj1 = { val: 10 };
function add4(obj, b) { // 순수함수 아님
  obj.val += b;
}
obj1.val
add4(obj1, 20);
obj1.val

// 함수형 프로그래밍에서는 객체를 바로 바꾸는 것이 아니라
// 복사를 한 후 변형 - 원하는 값이 변경된, 새로운 값을 리턴하는 개념

var obj2 = { val: 10 };
function add5(obj, b) { // 인자로 받은 객체를 직접 변경하는 것이 아님 -> 순수 함수
  return { val: obj.val + b }
}
add5(obj2, 20);
obj2.val;
obj2

/* 일급 함수 */
// 함수를 값으로 다룰 수 있음
// -> 함수를 변수에 담을 수 있음, 인자로 넘길 수 있음, 원하는 시점에 들고다니다가 원하는 시점에 평가할 수 있음...

// 함수를 변수에 담을 수 있음
var f1 = function(a) {
  return a * a;
};
f1
var f2 = add2;
f2

// 함수를 인자로 넘길 수 있음
function f3(f) {
  return f();
}
f3(function() { return 10; });

/* add maker */
function add_maker(a) { // 순수함수 -> a라는 값을 참조만 하고 변경하지 않음
  return function(b) { // 이 함수가 클로져
    return a + b;
  }
}

var add10 = add_maker(10);
add10(20);

var add5 = add_maker(5);
var add15 = add_maker(15);

add5(10);
add15(10);
add5(10);

function f4(f1, f2, f3) {
  return f3(f1() + f2());
}

f4(
  function() { return 2; },
  function() { return 1; },
  function(a) { return a * a; },
)

//?