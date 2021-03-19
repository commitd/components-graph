import { LayoutModel } from './LayoutModel'
import { CustomGraphLayout, GraphLayout } from './types'

let layoutModel: LayoutModel

const layoutAlgorithm: CustomGraphLayout = {
  name: 'Custom layout',
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

it('Layout algorithm defined when custom layout specified', () => {
  expect(layoutModel.customLayout(layoutAlgorithm).getLayout()).toBe(
    layoutAlgorithm
  )
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
