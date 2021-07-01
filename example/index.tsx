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
} from '../dist'

const App: React.FC = () => {
  const [model, setModel] = React.useState(
    addRandomEdge(addRandomNode(GraphModel.createEmpty(), 20), 15)
  )
  return (
    <ThemeProvider>
      <AppBar css={{ position: 'relative' }}>
        <AppBarHeading>Components Graph</AppBarHeading>
        <AppBarActions>
          <GraphToolbar
            flexDirection="row"
            model={model}
            onModelChange={setModel}
            color="inherit"
          />
          <ThemeSwitch />
        </AppBarActions>
      </AppBar>
      <Row>
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
