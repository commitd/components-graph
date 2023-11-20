/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CustomGraphLayout,
  cytoscapeRenderer,
  DecoratedNode,
  Generator,
  Graph,
  GraphModel,
  GraphToolbar,
  initializeCytoscape,
  ModelNode,
  NodeViewer,
} from '@committed/components-graph'
import {
  AppBar,
  AppBarActions,
  AppBarHeading,
  ComponentsProvider,
  Row,
  ThemeSwitch,
} from '@committed/ds'
import { use } from 'cytoscape'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../../node_modules/@committed/ds-ss/styles.css'

initializeCytoscape(use)

const sortedLayout: CustomGraphLayout = {
  name: 'Data Structure',
  runLayout: (model: GraphModel): Record<string, cytoscape.Position> => {
    const paddingTop = 50
    const paddingLeft = 50
    const columnWidth = 250
    const rowHeight = 75
    const byLabel: Record<string, DecoratedNode[]> = model.nodes.reduce<
      Record<string, DecoratedNode[]>
    >((acc, next) => {
      acc[next.label ?? 'unknown'] = (
        acc[next.label ?? 'unknown'] ?? []
      ).concat(next)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return acc
    }, {})
    const sortedByLabel: DecoratedNode[][] = Object.keys(byLabel)
      .sort((a, b) => a.localeCompare(b))
      .map((label): DecoratedNode[] => byLabel[label])

    let column = 0
    return sortedByLabel.reduce<Record<string, cytoscape.Position>>(
      (acc, nodes) => {
        let row = 0
        nodes.forEach((n) => {
          acc[n.id] = {
            x: column * columnWidth + paddingLeft,
            y: row * rowHeight + paddingTop,
          }
          row++
        })

        column++
        return acc
      },
      {}
    )
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stopLayout: () => {},
}

const Page: React.FC = () => {
  const [model, setModel] = React.useState(Generator.randomGraph)

  const [node, setNode] = React.useState<ModelNode | undefined>()
  return (
    <>
      <AppBar>
        <AppBarHeading>Components Graph</AppBarHeading>
        <AppBarActions css={{ display: 'flex' }}>
          <GraphToolbar
            direction="row"
            model={model}
            onModelChange={setModel}
            iconStyle={{ color: '$brandContrast' }}
            layouts={[...cytoscapeRenderer.layouts, sortedLayout]}
          />
          <ThemeSwitch />
        </AppBarActions>
      </AppBar>
      <Row>
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 800 }}
          onViewNode={setNode}
        />
      </Row>
      <NodeViewer
        open={node != null}
        node={node}
        onOpenChange={() => setNode(undefined)}
      />
    </>
  )
}

const App: React.FC = () => {
  return (
    <ComponentsProvider>
      <Page />
    </ComponentsProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
