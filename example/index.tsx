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
import { Flex, ThemeProvider } from '@committed/components'

const App: React.FC = () => {
  const [model, setModel] = React.useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <ThemeProvider>
      <Flex flexDirection="row">
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
      </Flex>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
