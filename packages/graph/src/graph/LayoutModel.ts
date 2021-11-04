import { CustomGraphLayout, GraphLayout, PresetGraphLayout } from './types'

export class LayoutModel {
  private readonly layout: GraphLayout
  private readonly invalidated: boolean

  static createDefault(): LayoutModel {
    return new LayoutModel('force-directed', true)
  }

  constructor(layout: GraphLayout, invalidated = true) {
    this.layout = layout
    this.invalidated = invalidated
  }

  getLayout(): GraphLayout {
    return this.layout
  }

  isDirty(): boolean {
    return this.invalidated
  }

  validate(): LayoutModel {
    if (!this.invalidated) {
      return this
    } else {
      return new LayoutModel(this.layout, false)
    }
  }

  invalidate(): LayoutModel {
    if (this.invalidated) {
      return this
    } else {
      return new LayoutModel(this.layout, true)
    }
  }

  presetLayout(layout: PresetGraphLayout): LayoutModel {
    return new LayoutModel(layout, true)
  }

  customLayout(layout: CustomGraphLayout): LayoutModel {
    return new LayoutModel(layout, true)
  }
}
