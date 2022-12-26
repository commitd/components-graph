import { LayoutModel } from './LayoutModel'
import { CustomGraphLayout, GraphLayout } from './types'

let layoutModel: LayoutModel

const layoutAlgorithm: CustomGraphLayout = {
  name: 'Custom layout',
  runLayout: () => ({}),
  stopLayout: () => {
    // This is intentionally left blank
  },
}

beforeEach(() => {
  layoutModel = LayoutModel.createDefault()
})

it('Gets layout', () => {
  const layout: GraphLayout = 'grid'
  expect(layoutModel.setLayout(layout).getLayout()).toBe(layout)
})

it('Layout algorithm defined when custom layout specified', () => {
  expect(layoutModel.setLayout(layoutAlgorithm).getLayout()).toBe(
    layoutAlgorithm
  )
})

it('Changing the layout invalidates the layout', () => {
  expect(layoutModel.setLayout('grid').isDirty()).toBe(true)
})

it('Validating an invalidated layout', () => {
  expect(layoutModel.setLayout('grid').validate().isDirty()).toBe(false)
})

it('Invalidating an validated layout', () => {
  const model = layoutModel.setLayout('grid').validate()
  expect(model.invalidate().isDirty()).toBe(true)
})

it('Validating an validated layout does nothing', () => {
  const model = layoutModel.setLayout('grid').validate()
  expect(model.validate()).toBe(model)
})
