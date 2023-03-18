import { labelWithFragment, labelWithPrefix } from './labels'

it('Can label by prefixed id', () => {
  const decorator = labelWithPrefix({
    'https://example.org/data/': 'data',
    'https://example.org/demo#': 'demo',
  })

  expect(
    decorator({ id: 'https://example.org/data/test', metadata: {} }).label
  ).toBe('data:test')
  expect(
    decorator({ id: 'https://example.org/demo#TEST', metadata: {} }).label
  ).toBe('demo:TEST')
  expect(
    decorator({ id: 'https://example.org/other', metadata: {} }).label
  ).toBe('https://example.org/other')
})

it('Can label by id fragment', () => {
  const decorator = labelWithFragment()

  expect(
    decorator({ id: 'https://example.org/data/test', metadata: {} }).label
  ).toBe('test')
  expect(
    decorator({ id: 'https://example.org/demo#TEST', metadata: {} }).label
  ).toBe('TEST')
  expect(
    decorator({ id: 'https://example.org/other', metadata: {} }).label
  ).toBe('other')
})
