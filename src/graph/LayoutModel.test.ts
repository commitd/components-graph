import { LayoutModel } from './LayoutModel'
import { GraphLayout, GraphLayoutAlgorithm, PresetGraphLayout } from './types'

let layoutModel: LayoutModel

const layoutAlgorithm: GraphLayoutAlgorithm = {
  runLayout: () => ({}),
  stopLayout: () => {},
}

beforeEach(() => {
  layoutModel = LayoutModel.createDefault()
})

it('Gets layout', () => {
  const layout: GraphLayout = 'grid'
  expect(layoutModel.presetLayout(layout).getLayout()).toBe(layout)
})

it('Layout algorithm undefined when preset layout specified', () => {
  const layout: PresetGraphLayout = 'grid'
  expect(layoutModel.presetLayout(layout).getLayoutAlgorithm()).toBeUndefined()
})

it('Layout algorithm defined when custom layout specified', () => {
  expect(layoutModel.customLayout(layoutAlgorithm).getLayoutAlgorithm()).toBe(
    layoutAlgorithm
  )
  expect(layoutModel.customLayout(layoutAlgorithm).getLayout()).toBe('custom')
})

it('Changing the layout invalidates the layout', () => {
  expect(layoutModel.presetLayout('grid').isDirty()).toBe(true)
})

it('Validating an invalidated layout', () => {
  expect(layoutModel.presetLayout('grid').validate().isDirty()).toBe(false)
})

it('Invalidating an validated layout', () => {
  const model = layoutModel.presetLayout('grid').validate()
  expect(model.invalidate().isDirty()).toBe(true)
})

it('Validating an validated layout does nothing', () => {
  const model = layoutModel.presetLayout('grid').validate()
  expect(model.validate()).toBe(model)
})
