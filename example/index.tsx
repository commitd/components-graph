/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  AppBar,
  AppBarActions,
  AppBarHeading,
  Row,
  ThemeProvider,
  ThemeSwitch,
} from '@committed/components'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  addRandomEdge,
  addRandomNode,
  cytoscapeRenderer,
  Graph,
  GraphModel,
  GraphToolbar,
  initializeCytoscape,
  ModelNode,
  NodeViewer,
} from '../dist/committed-components-graph.cjs.js'
import { use } from 'cytoscape'

initializeCytoscape(use)

const App: React.FC = () => {
  const [model, setModel] = React.useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )

  const [node, setNode] = React.useState<ModelNode | undefined>()
  return (
    <ThemeProvider>
      <AppBar>
        <AppBarHeading>Components Graph</AppBarHeading>
        <AppBarActions css={{ display: 'flex' }}>
          <GraphToolbar
            direction="row"
            model={model}
            onModelChange={setModel}
            iconStyle={{ color: '$brandContrast' }}
            layouts={cytoscapeRenderer.layouts}
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
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
