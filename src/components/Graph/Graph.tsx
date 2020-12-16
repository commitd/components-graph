import { Box, BoxProps, makeStyles } from '@committed/components'
import React from 'react'
import { GraphModel } from '../../graph/GraphModel'
import { GraphRenderer } from '../../graph/types'

export interface GraphProps extends BoxProps {
  renderer: GraphRenderer
  model: GraphModel
  onModelChange?: (
    model: GraphModel | ((model2: GraphModel) => GraphModel)
  ) => void
}

const useStyles = makeStyles({
  container: {
    backgroundColor: '#FFF',
  },
})

export const Graph: React.FC<GraphProps> = ({
  renderer,
  model,
  onModelChange = () => {
    // do nothing by default
  },
}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>{renderer(model, onModelChange)}</Box>
  )
}
