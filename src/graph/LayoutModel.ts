import { GraphLayout, GraphLayoutAlgorithm, PresetGraphLayout } from './types'

export class LayoutModel {
  private readonly layout: GraphLayout
  private readonly invalidated: boolean
  private readonly algorithm?: GraphLayoutAlgorithm

  static createDefault(): LayoutModel {
    return new LayoutModel('force-directed', true)
  }

  constructor(
    layout: GraphLayout,
    invalidated = true,
    algorithm?: GraphLayoutAlgorithm
  ) {
    this.layout = layout
    this.invalidated = invalidated
    this.algorithm = algorithm
  }

  getLayout(): GraphLayout {
    return this.layout
  }

  getLayoutAlgorithm(): GraphLayoutAlgorithm | undefined {
    return this.algorithm
  }

  isDirty(): boolean {
    return this.invalidated
  }

  validate(): LayoutModel {
    if (!this.invalidated) {
      return this
    } else {
      return new LayoutModel(this.layout, false, this.algorithm)
    }
  }

  invalidate(): LayoutModel {
    if (this.invalidated) {
      return this
    } else {
      return new LayoutModel(this.layout, true, this.algorithm)
    }
  }

  presetLayout(layout: PresetGraphLayout): LayoutModel {
    return new LayoutModel(layout, true, undefined)
  }

  customLayout(algorithm: GraphLayoutAlgorithm): LayoutModel {
    return new LayoutModel('custom', true, algorithm)
  }
}
