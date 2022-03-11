import { renderHook } from '@testing-library/react-hooks'

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
})
