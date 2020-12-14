import { renderHook } from '@testing-library/react-hooks'
import { useExample } from '.'

test('Should provide initial output', () => {
  const { result: first } = renderHook(() => useExample())
  expect(first.current).toBeTruthy()
})
