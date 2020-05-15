// 以下基本都是lib.d.ts中包含的泛型
interface Test {
    readonly a: number;
    b: string;
    c?: boolean;
    d: undefined;
    e: null;
    f: {
        a: number;
    };
}

// partial 作用是将传入的属性变为可选项
type partial<T> = {
    [k in keyof T]?: T[k]
}
const partial1: partial<Test> = {
    // 都是可选的
}

// Required
type required<T> = {
    [k in keyof T]-?: T[k]
}
const required1: required<Test> = {
    a: 1,
    b: '1',
    d: undefined,
    e: null,
    f: {
        a: 1
    },

    // 可选变必选
    c: true
}

// TODO: 原生不包含 将所有readonly 修改为 !readonly 反之亦然
type Mutable<T> = {
    -readonly [key in keyof T]: T[key]
}
const Mutable1: Mutable<Test> = {
    a: 1,
    b: '2',
    c: true,
    d: undefined,
    e: null,
    f: {
        a: 0
    }
}
Mutable1.a = 2

// 将传入的属性变为只读选项
type readOnly<T> = {
    readonly [k in keyof T]: T[k]
}
const readOnly1: readOnly<Test> = {
    a: 1,
    b: '2',
    c: true,
    d: undefined,
    e: null,
    f: {
        a: 0
    }
}

// @ts-ignore
readOnly1.a = 2

// 将 R 中所有的属性的值转化为 T 类型
type record<R, T> = {
    [k in keyof R]: T
}
const record1: record<Test, number> = {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 1
}

// 从 T 中取出 一系列 K 的属性
// 1 | 2
// 1: T[1]
// 2: T[2]
type pick<T, K extends keyof T> = {
    [k in K]: T[k]
}
const pick1: pick<Test, 'a' | 'b'> = {
    a: 1,
    b: '1'
}

// T排除U中存在的
// TODO: 这里含义有点模糊，可以理解为  T 是 U 的子类型的话，那么就会返回 X，否则返回 Y。
// TODO: 但是下面这个例子又说明是从 T 中找出 U 中没有的元素。
type exclude<T, U> = T extends U ? never : T
const exclude1: exclude<1 | 2, 2> = 1

// T取U中存在的 和上面一样拥有相同的特性
type extract<T, U> = T extends U ? T : never
const extract1: extract<1 | 2, 2> = 2

// 删除对象指定属性
type omit<T, key extends keyof T> = {
    [k in Exclude<keyof T, key>]: T[k]
}
// Pick<T, Exclude<keyof T, key>>
const omit1: omit<Test, 'a' | 'b' | 'f'> = {
    c: true,
    d: undefined,
    e: null
}

// 获取函数的返回类型
type returnType<T extends (...args: any) => any> = T extends () => infer R ? R : any
function foo (x: number, y: number) {
    return x === y ? true : x + y
}
type fn = returnType<typeof foo>
