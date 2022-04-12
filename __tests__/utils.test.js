import {
  isPrimitive,
  getByPath,
  // pluggable utils
  findArrayPaths,
  firstRowKeys,
  buildJSTypedKeys,
  flattenAsDot,
} from '../src/utils'


describe('utils', () => {
  test.each([
    [null, false], // null is considered object in JS
    [undefined, true],
    [{}, false],
    [[], false],
    ['', true],
    [0, true],
    [Symbol(), true],
    [false, true],
  ])('isPrimitive(%j) should return %j', (input, expected) => {
    expect(isPrimitive(input)).toStrictEqual(expected)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [{ a: [1, 2, 3] }, [['a']]],
    [{ a: { b: { c: [1, 2, 3] } } }, [['a', 'b', 'c']]],
    [{ a: { b: { c: [1, 2, 3] } }, d: { e: { f: [4, 5, 6] } } }, [['a', 'b', 'c'], ['d', 'e', 'f']]],
    [[], []],
    [[1, 2, 3], [[]]],
  ])('findArrayPaths(%j) should return %j', (input, expected) => {
    expect(findArrayPaths(input)).toStrictEqual(expected)
  })

  test.each([
    [{}, [], {}],
    [{ a: 1 }, ['a'], 1],
    [{ a: [1, 2, 3] }, ['a'], [1, 2, 3]],
    [{ a: { b: { c: [1, 2, 3] } } }, ['a', 'b', 'c'], [1, 2, 3]],
    [{ a: { b: { c: [1, 2, 3] } }, d: { e: { f: [4, 5, 6] } } }, ['d', 'e', 'f'], [4, 5, 6]],
  ])('getByPath(%j, %j) should return %j', (input, path, expected) => {
    expect(getByPath(input, path)).toStrictEqual(expected)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [[{ x: 1, y: 2 }, { x: 3, y: 5 }], ['x', 'y']],
  ])('firstRowKeys(%j) should return %j', (input, expected) => {
    expect(firstRowKeys(input)).toStrictEqual(expected)
  })

  test.each([
    [[], [], {}],
    [['a'], [{ a: 1 }], { number: ['a'] }],
    [['a', 'b', 'c', 'd'], [{ a: 1, b: 2, c: 3, d: '4' }], { number: ['a', 'b', 'c'], string: ['d'] }],
    [['a', 'b', 'c', 'd'], [{ a: {}, b: 2, c: 3, d: '4' }], { number: ['b', 'c'], string: ['d'], object: ['a'] }],
  ])('buildJSTypedKeys({ %j, %j }) should return %j', (keys, data, expected) => {
    expect(buildJSTypedKeys({ keys, data })).toStrictEqual(expected)
  })

  test.each([
    [{}, {}],
    [{ a: 1 }, { a: 1 }],
    [{ a: { b: { c: { d: { e: { f: 'u' } } } } } }, { 'a.b.c.d.e.f': 'u' }],
    [{ a: [{ x: 1, y: 2 }, { x: 3, y: 5 }] }, { 'a.0.x': 1, 'a.0.y': 2, 'a.1.x': 3, 'a.1.y': 5 }],
  ])('flattenAsDot(%j) should return %j', (input, expected) => {
    expect(flattenAsDot(input)).toStrictEqual(expected)
  })
})
