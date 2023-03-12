import { CustomGraphLayout, GraphLayout, PresetGraphLayout } from './types'

export class LayoutModel {
  private readonly layout: GraphLayout
  private readonly onChange: boolean
  private readonly invalidated: boolean

  static createDefault(): LayoutModel {
    return new LayoutModel('force-directed', true, true)
  }

  constructor(layout: GraphLayout, onChange = true, invalidated = true) {
    this.layout = layout
    this.onChange = onChange
    this.invalidated = invalidated
  }

  getLayout(): GraphLayout {
    return this.layout
  }

  isDirty(): boolean {
    return this.invalidated
  }

  isOnChange(): boolean {
    return this.onChange
  }

  validate(): LayoutModel {
    if (!this.invalidated) {
      return this
    } else {
      return new LayoutModel(this.layout, this.onChange, false)
    }
  }

  invalidate(): LayoutModel {
    if (this.invalidated) {
      return this
    } else {
      return new LayoutModel(this.layout, this.onChange, true)
    }
  }

  setLayout(layout: GraphLayout): LayoutModel {
    return new LayoutModel(layout, this.onChange, true)
  }

  setOnChange(onChange: boolean): LayoutModel {
    return new LayoutModel(this.layout, onChange, false)
  }

  /**
   * @deprecated use setLayout
   */
  presetLayout(layout: PresetGraphLayout): LayoutModel {
    return this.setLayout(layout)
  }

  /**
   * @deprecated use setLayout
   */
  customLayout(layout: CustomGraphLayout): LayoutModel {
    return this.setLayout(layout)
  }
}
