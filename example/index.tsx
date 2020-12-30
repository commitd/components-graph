import {
  AppBar,
  Box,
  Heading,
  Row,
  ThemeProvider,
  ThemeSwitch,
  Toolbar,
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
      <AppBar position="relative">
        <Toolbar>
          <Box flexGrow={1}>
            <Heading.h1>Components Graph</Heading.h1>
          </Box>
          <GraphToolbar
            direction="row"
            model={model}
            onModelChange={setModel}
            color="inherit"
          />
          <ThemeSwitch />
        </Toolbar>
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
