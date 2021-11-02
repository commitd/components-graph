import { ThemeProvider } from '@committed/components'
import '@testing-library/jest-dom/extend-expect'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
  ModelNode,
  ModelEdge,
  ContentModel,
  GraphModel,
} from '@committed/graph'
import ResizeObserver from 'resize-observer-polyfill'

// Use the polyfill for the ResizeObserver.
// This is used in some components.
global.ResizeObserver = ResizeObserver

// Official way to supply missing window method https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

class DOMRectPolyfill implements DOMRect {
  static fromRect(
    rect: { x?: number; y?: number; width?: number; height?: number } = {}
  ) {
    return new this(rect.x ?? 0, rect.y ?? 0, rect.width ?? 0, rect.height ?? 0)
  }

  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0
  ) {}

  get top() {
    return this.y
  }

  get right() {
    return this.x + this.width
  }

  get bottom() {
    return this.y + this.height
  }

  get left() {
    return this.x
  }

  // But it has a toJSON that does include all the properties.
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    }
  }
}

if (typeof window !== 'undefined' && !window.DOMRect) {
  ;(window as { DOMRect: typeof DOMRect }).DOMRect = DOMRectPolyfill
}

const LightTheme: React.FC = ({ children }) => (
  <ThemeProvider choice="light">{children}</ThemeProvider>
)

const DarkTheme: React.FC = ({ children }) => (
  <ThemeProvider choice="dark">{children}</ThemeProvider>
)

export const renderPlain = render

export const renderLight = (
  ui: Readonly<React.ReactElement>,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: LightTheme, ...options })

export const renderDark = (
  ui: Readonly<React.ReactElement>,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: DarkTheme, ...options })

// re-export everything
export * from '@testing-library/react'
export { userEvent }

// TEST DATA

export const node1: ModelNode = {
  id: 'node1',
  attributes: {
    employer: 'Committed',
  },
  color: 'yellow',
  label: 'Node 1',
  size: 10,
  strokeColor: 'black',
  opacity: 1,
  shape: 'ellipse',
  strokeSize: 2,
}

export const node2: ModelNode = {
  id: 'node2',
  attributes: {
    employer: 'Government',
  },
  color: 'green',
  label: 'Node 2',
  size: 12,
  strokeColor: 'black',
  opacity: 0.9,
  shape: 'rectangle',
  strokeSize: 3,
}

export const edge1: ModelEdge = {
  id: 'edge1',
  attributes: {
    role: 'client',
  },
  source: node1.id,
  target: node2.id,
}

export const exampleGraph = GraphModel.applyContent(
  GraphModel.createEmpty(),
  ContentModel.createEmpty().addNode(node1).addNode(node2).addEdge(edge1)
)
