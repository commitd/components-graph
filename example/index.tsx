import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  addRandomEdge,
  addRandomNode,
  Graph,
  GraphModel,
  GraphToolbar,
  cytoscapeRenderer,
} from '../dist'
import { Row, ThemeProvider } from '@committed/components'

const App: React.FC = () => {
  const [model, setModel] = React.useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <ThemeProvider>
      <Row>
        <GraphToolbar
          direction="column"
          model={model}
          onModelChange={setModel}
        />
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 600 }}
        />
      </Row>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
