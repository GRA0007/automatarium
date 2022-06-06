/// <reference types="jest-extended" />

import { parseRead } from '../src'

describe('Expand literals', () => {
  test('Should pass through abc', () => {
    const expectedSymbols = 'abc'.split('')
    const symbols = parseRead('abc')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should de-dupe abb', () => {
    const expectedSymbols = 'ab'.split('')
    const symbols = parseRead('abb')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should pass through !@#$%^&*()_+-=', () => {
    const expectedSymbols = '!@#$%^&*()_+-='.split('')
    const symbols = parseRead('!@#$%^&*()_+-=')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Return empty for no length string', () => {
    expect(parseRead('')).toStrictEqual([])
  })
})

describe('Expand ranges', () => {
  test('Should expand [a-z]', () => {
      const expectedSymbols = 'abcdefghijklmnopqrstuvwxyz'.split('')
      const symbols = parseRead('[a-z]')
      expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-Z]', () => {
    const expectedSymbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[a-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-c][e-g]', () => {
    const expectedSymbols = 'abcefg'.split('')
    const symbols = parseRead('[a-c][e-g]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-c][e-g]', () => {
    const expectedSymbols = 'abcefg'.split('')
    const symbols = parseRead('[a-c][e-g]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-z][A-Z]', () => {
    const expectedSymbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[a-z][A-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-z][A-Z]', () => {
    const expectedSymbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[a-z][A-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [z-a]', () => {
    const expectedSymbols = ''.split('')
    const symbols = parseRead('[z-a]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-z][A-Z]', () => {
    const expectedSymbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[a-z][A-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [a-a]', () => {
    const expectedSymbols = 'a'.split('')
    const symbols = parseRead('[a-a]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand aa', () => {
    const expectedSymbols = 'a'.split('')
    const symbols = parseRead('aa')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand a[a-z]', () => {
    const expectedSymbols = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const symbols = parseRead('a[a-z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand a[a-z]a', () => {
    const expectedSymbols = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const symbols = parseRead('a[a-z]a')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-9]', () => {
    const expectedSymbols = '0123456789'.split('')
    const symbols = parseRead('[0-9]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-5]', () => {
    const expectedSymbols = '012345'.split('')
    const symbols = parseRead('[0-5]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-3][5-7]', () => {
    const expectedSymbols = '0123567'.split('')
    const symbols = parseRead('[0-3][5-7]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-3][0-4]', () => {
    const expectedSymbols = '01234'.split('')
    const symbols = parseRead('[0-3][0-4]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [9-0]', () => {
    const expectedSymbols = ''.split('')
    const symbols = parseRead('[9-0]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand 0[9-0]', () => {
    const expectedSymbols = '0'.split('')
    const symbols = parseRead('0[9-0]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-9][a-Z]', () => {
    const expectedSymbols = '0123456789abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[0-9][a-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-z]', () => {
    const expectedSymbols = '0123456789abcdefghijklmnopqrstuvwyxz'.split('')
    const symbols = parseRead('[0-z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-Z]', () => {
    const expectedSymbols = '0123456789abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[0-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand [0-Z]', () => {
    const expectedSymbols = '0123456789abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const symbols = parseRead('[0-Z]')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })

  test('Should expand empty string', () => {
    const expectedSymbols = ''.split('')
    const symbols = parseRead('')
    expect(symbols).toIncludeSameMembers(expectedSymbols)
  })
})
