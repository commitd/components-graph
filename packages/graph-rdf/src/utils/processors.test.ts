import { ModelEdge, ModelNode } from '@committed/graph'
import { cleanProcessor } from './processors'

it('Can label by fragment id', () => {
  expect(
    cleanProcessor<ModelNode>({
      id: 'https://example.org/data/test',
      attributes: {},
    }).label
  ).toBe('test')
  expect(
    cleanProcessor<ModelNode>({
      id: 'https://example.org/demo#TEST',
      attributes: {},
    }).label
  ).toBe('TEST')
  expect(cleanProcessor<ModelNode>({ id: 'test', attributes: {} }).label).toBe(
    'test'
  )
  expect(
    cleanProcessor<ModelNode>({ id: 'test', label: 'label', attributes: {} })
      .label
  ).toBe('label')
})

it('Can clean attribute labels', () => {
  expect(
    cleanProcessor<ModelNode>({
      id: 'https://example.org/data/test',
      attributes: { 'https://example.org/data/test': 'test' },
    }).attributes
  ).toStrictEqual({ test: 'test' })
  expect(
    cleanProcessor<ModelNode>({
      id: 'https://example.org/demo#TEST',
      attributes: {
        'https://example.org/demo#TEST': 'TEST',
      },
    }).attributes
  ).toStrictEqual({ TEST: 'TEST' })
  expect(
    cleanProcessor<ModelNode>({ id: 'test', attributes: { test: 'test' } })
      .attributes
  ).toStrictEqual({ test: 'test' })
})

it('Can process type', () => {
  expect(
    cleanProcessor<ModelNode>({
      id: 'https://example.org/demo#TEST',
      attributes: { type: 'https://example.org/demo#TEST' },
    }).attributes
  ).toStrictEqual({ type: 'TEST' })
})

it('Can rewite label if equal id or matches edge predicate format', () => {
  expect(
    cleanProcessor<ModelNode>({
      id: 'https://example.org/data/test',
      label: 'https://example.org/data/test',
      attributes: {},
    }).label
  ).toBe('test')
  expect(
    cleanProcessor<ModelEdge>({
      id: 'https://example.org/demo#source|https://example.org/demo#TEST|https://example.org/demo#target',
      source: 'https://example.org/demo#source',
      target: 'https://example.org/demo#target',
      label: 'https://example.org/demo#TEST',
      attributes: {},
    }).label
  ).toBe('TEST')
  expect(cleanProcessor<ModelNode>({ id: 'test', attributes: {} }).label).toBe(
    'test'
  )
  expect(
    cleanProcessor<ModelNode>({ id: 'test', label: 'label', attributes: {} })
      .label
  ).toBe('label')
})
