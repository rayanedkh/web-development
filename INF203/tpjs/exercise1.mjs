"use strict";

// programming with a loop
export function fiboIt(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    
    let fib0 = 0;
    let fib1 = 1;
    let result = 0;
    
    for (let i = 2; i <= n; i++) {
        result = fib0 + fib1;
        fib0 = fib1;
        fib1 = result;
    }
    return result;
}

// recursive programming
export function fiboRec(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fiboRec(n - 1) + fiboRec(n - 2);
}

// no map function
export function fibArr(t) {
    const result = [];
    for (let i = 0; i < t.length; i++) {
        result.push(fiboRec(t[i]));
    }
    return result;
}

// with map
export function fibMap(t) {
    return t.map(fiboRec);
}