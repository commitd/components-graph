import { Edge, Node } from '@committed/graph'
import { cleanProcessor } from './processors'

it('Can label by fragment id', () => {
  expect(
    cleanProcessor<Node>({
      id: 'https://example.org/data/test',
      metadata: {},
    }).label
  ).toBe('test')
  expect(
    cleanProcessor<Node>({
      id: 'https://example.org/demo#TEST',
      metadata: {},
    }).label
  ).toBe('TEST')
  expect(cleanProcessor<Node>({ id: 'test', metadata: {} }).label).toBe('test')
  expect(
    cleanProcessor<Node>({ id: 'test', label: 'label', metadata: {} }).label
  ).toBe('label')
})

it('Can clean attribute labels', () => {
  expect(
    cleanProcessor<Node>({
      id: 'https://example.org/data/test',
      metadata: { 'https://example.org/data/test': 'test' },
    }).metadata
  ).toStrictEqual({ test: 'test' })
  expect(
    cleanProcessor<Node>({
      id: 'https://example.org/demo#TEST',
      metadata: {
        'https://example.org/demo#TEST': 'TEST',
      },
    }).metadata
  ).toStrictEqual({ TEST: 'TEST' })
  expect(
    cleanProcessor<Node>({ id: 'test', metadata: { test: 'test' } }).metadata
  ).toStrictEqual({ test: 'test' })
})

it('Can process type', () => {
  expect(
    cleanProcessor<Node>({
      id: 'https://example.org/demo#TEST',
      metadata: { type: 'https://example.org/demo#TEST' },
    }).metadata
  ).toStrictEqual({ type: 'TEST' })
})

it('Can rewite label if equal id or matches edge predicate format', () => {
  expect(
    cleanProcessor<Node>({
      id: 'https://example.org/data/test',
      label: 'https://example.org/data/test',
      metadata: {},
    }).label
  ).toBe('test')
  expect(
    cleanProcessor<Edge>({
      id: 'https://example.org/demo#source|https://example.org/demo#TEST|https://example.org/demo#target',
      source: 'https://example.org/demo#source',
      target: 'https://example.org/demo#target',
      label: 'https://example.org/demo#TEST',
      metadata: {},
      directed: true,
    }).label
  ).toBe('TEST')
  expect(cleanProcessor<Node>({ id: 'test', metadata: {} }).label).toBe('test')
  expect(
    cleanProcessor<Node>({ id: 'test', label: 'label', metadata: {} }).label
  ).toBe('label')
})
