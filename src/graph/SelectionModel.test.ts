import { SelectionModel } from './SelectionModel'

let selectionModel: SelectionModel

beforeEach(() => {
  selectionModel = SelectionModel.createDefault()
})

it('Deduplicates added nodes', () => {
  expect(
    Array.from(selectionModel.addNodes(['n1', 'n2', 'n2']).nodes).length
  ).toBe(2)
})

it('Deduplicates added edges', () => {
  expect(
    Array.from(selectionModel.addEdges(['e1', 'e2', 'e2']).edges).length
  ).toBe(2)
})

it('Adding no nodes does nothing', () => {
  expect(selectionModel.addNodes([])).toBe(selectionModel)
})

it('Adding no edges does nothing', () => {
  expect(selectionModel.addEdges([])).toBe(selectionModel)
})

it('Removing no nodes does nothing', () => {
  expect(selectionModel.removeNodes([])).toBe(selectionModel)
})

it('Removing no edges does nothing', () => {
  expect(selectionModel.removeEdges([])).toBe(selectionModel)
})

it('Removes nodes', () => {
  expect(
    Array.from(selectionModel.addNodes(['n1', 'n2']).removeNodes(['n1']).nodes)
      .length
  ).toBe(1)
})

it('Removes edges', () => {
  expect(
    Array.from(selectionModel.addEdges(['e1', 'e2']).removeEdges(['e1']).edges)
      .length
  ).toBe(1)
})
