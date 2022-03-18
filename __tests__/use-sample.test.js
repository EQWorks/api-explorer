import { renderHook, act } from '@testing-library/react-hooks'

import { useSample } from '../src'


describe('useSample', () => {
  test.each([
    null,
    undefined,
    {},
    [],
    '',
    0,
    Symbol(),
    false,
  ])('sample relay: input sample=%p should be relayed to output', (sample) => {
    const { result } = renderHook(() => useSample(sample))
    expect(result.current.sample).toStrictEqual(sample)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [{ a: [1, 2, 3] }, [['a']]],
    [{ a: { b: { c: [1, 2, 3] } } }, [['a', 'b', 'c']]],
    [{ a: { b: { c: [1, 2, 3] } }, d: { e: { f: [4, 5, 6] } } }, [['a', 'b', 'c'], ['d', 'e', 'f']]],
    [[], []],
    [[1, 2, 3], []],
  ])('paths detection: input sample=%j would yield paths=%j', (sample, paths) => {
    const { result } = renderHook(() => useSample(sample))
    expect(result.current.paths).toStrictEqual(paths)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [{ a: [1, 2, 3] }, ['a']],
    [{ a: { b: { c: [1, 2, 3] } } }, ['a', 'b', 'c']],
    [{ a: { b: { c: [1, 2, 3] } }, d: { e: { f: [4, 5, 6] } } }, ['a', 'b', 'c']],
    [[], []],
    [[1, 2, 3], []],
  ])('initial path: input sample=%j would yield initial path=%j', (sample, path) => {
    const { result } = renderHook(() => useSample(sample))
    expect(result.current.path).toStrictEqual(path)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [{ a: [1, 2, 3] }, [1, 2, 3]],
    [{ a: { b: { c: [1, 2, 3] } } }, [1, 2, 3]],
    [{ a: { b: { c: [1, 2, 3] } }, d: { e: { f: [4, 5, 6] } } }, [1, 2, 3]],
    [[], []],
    [[1, 2, 3], [1, 2, 3]],
  ])('initial data: input sample=%j would yield initial data=%j', (sample, data) => {
    const { result } = renderHook(() => useSample(sample))
    expect(result.current.data).toStrictEqual(data)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [{ a: [{ x: 1, y: 2 }, { x: 3, y: 5 }] }, ['x', 'y']],
  ])('data keys detection: input=%j would yield keys=%j', (sample, keys) => {
    const { result } = renderHook(() => useSample(sample))
    expect(result.current.keys).toStrictEqual(keys)
  })

  test.each([
    [{}, {}],
    [{ a: 1 }, {}],
    [{ a: [{ x: 1, y: 2 }, { x: 3, y: 5 }] }, { number: ['x', 'y'] }],
    [{ a: [{ x: 1, y: '2', z: true, w: 3 }, { x: 3, y: '5', z: false, w: -55 }] }, { number: ['x', 'w'], string: ['y'], boolean: ['z'] }],
  ])('typed keys detection: input=%j would yield typedKyes=%j', (sample, typedKeys) => {
    const { result } = renderHook(() => useSample(sample))
    expect(result.current.typedKeys).toStrictEqual(typedKeys)
  })

  test.each([
    [{}, []],
    [{ a: 1 }, []],
    [{ a: [{ x: 1, y: 2 }, { x: 3, y: 5 }] }, [{ x: 1, y: 2 }, { x: 3, y: 5 }]],
    [{ a: [{ x: 1, y: '2', z: { w: 3 } }, { x: 3, y: '5', z: { w: -55 } }] }, [{ x: 1, y: '2', 'z.w': 3 }, { x: 3, y: '5', 'z.w': -55 }]],
    [{ a: [{ x: 1, y: '2', z: [3] }, { x: 3, y: '5', z: [-55] }] }, [{ x: 1, y: '2', 'z.0': 3 }, { x: 3, y: '5', 'z.0': -55 }]],
  ])('flatten data: input=%j would yield data=%j', (sample, data) => {
    const { result } = renderHook(() => useSample(sample))
    act(() => {
      result.current.setFlatten(true)
    })
    expect(result.current.data).toStrictEqual(data)
  })
})
