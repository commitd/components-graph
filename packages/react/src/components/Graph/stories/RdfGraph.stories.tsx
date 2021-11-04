import { Alert, AlertContent, AlertTitle, Flex } from '@committed/components'
import {
  ContentModel,
  GraphBuilder,
  GraphModel,
  ModelNode,
  Rdf,
} from '@committed/graph'
import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'
import { Graph } from '..'
import { cytoscapeRenderer } from '../../../graph'
import { GraphToolbar } from '../../GraphToolbar'
import { NodeViewer } from '../../NodeViewer'
import { Template } from './StoryUtil'

export default {
  title: 'Examples/RdfGraph',
  component: Graph,
  decorators: [
    (story) => <div style={{ height: '100h', padding: '16px' }}>{story()}</div>,
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta

export const SmallGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(
      GraphBuilder.fromRdfGraph(
        `
      :John a :Man ;
        :name "John" ;
        :hasSpouse :Mary .
      :Mary a :Woman ;
        :name "Mary" ;
        :hasSpouse :John .
      :John_jr a :Man ;
        :name "John Jr." ;
        :hasParent :John, :Mary .
      :Time_Span a owl:Class .
      :event a :Activity ;
      :has_time_span [
        a :Time_Span ;
        :at_some_time_within_date "2018-01-12"^^xsd:date
      ] .
      :u129u-klejkajo-2309124u-sajfl a :Person ;
        :name "John Doe" .
  `,
        {
          additionalPrefixes: {
            '': '',
            owl: 'http://www.w3.org/2002/07/owl#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
          },
        }
      )
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const SmallGraphWithTypes: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(
      GraphBuilder.fromRdfGraph(
        `
    :John a :Man ;
      :name "John" ;
      :hasSpouse :Mary .
    :Mary a :Woman ;
      :name "Mary" ;
      :hasSpouse :John .
    :John_jr a :Man ;
      :name "John Jr." ;
      :hasParent :John, :Mary .
    :Time_Span a owl:Class .
    :event a :Activity ;
    :has_time_span [
      a :Time_Span ;
      :at_some_time_within_date "2018-01-12"^^xsd:date
    ] .
    :u129u-klejkajo-2309124u-sajfl a :Person ;
      :name "John Doe" .
`,
        {
          type: undefined,
          additionalPrefixes: {
            '': '',
            owl: 'http://www.w3.org/2002/07/owl#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
          },
        }
      )
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

export const DecoratedGraph: React.FC = () => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(
      GraphBuilder.fromRdfGraph(`
    @prefix cd: <${Rdf.DECORATION_IRI}> .
  
    <A> a <Test> ;
        cd:label "Test" ;
        cd:size 10 ;
        cd:color '#FFBB00' ;
        cd:opacity 0.5 ;
        cd:shape 'diamond' ;
        cd:strokeColor '#000000' ;
        cd:strokeSize 1 .
  `)
    )
  )
  return <Template model={model} onModelChange={setModel} />
}

const StoryTemplate: Story<{ rdf: string }> = ({ rdf }) => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(ContentModel.createEmpty())
  )
  const [alert, setAlert] = useState<string | undefined>()

  useEffect(() => {
    try {
      setModel(
        GraphModel.createWithContent(
          GraphBuilder.fromRdfGraph(rdf, {
            literals: Rdf.LiteralOption.VALUE_ONLY,
          })
        )
      )
      setAlert(undefined)
    } catch (error: any) {
      setModel(GraphModel.createWithContent(ContentModel.createEmpty()))
      setAlert(error.message)
    }
  }, [setModel, setAlert, rdf])

  const [node, setNode] = useState<ModelNode | undefined>(undefined)

  return (
    <>
      {alert && (
        <Alert severity="error">
          <AlertTitle>RDF Error</AlertTitle>
          <AlertContent>{alert}</AlertContent>
        </Alert>
      )}
      <Flex>
        <GraphToolbar
          direction="column"
          model={model}
          onModelChange={setModel}
          layouts={cytoscapeRenderer.layouts}
        />
        <Graph
          model={model}
          onModelChange={setModel}
          renderer={cytoscapeRenderer}
          options={{ height: 600 }}
          onViewNode={setNode}
        />
        <NodeViewer
          open={node != undefined}
          node={node}
          onOpenChange={() => setNode(undefined)}
        />
      </Flex>
    </>
  )
}

export const RdfVisualizer = StoryTemplate.bind({})
RdfVisualizer.args = {
  rdf: `
  @prefix cd: <${Rdf.DECORATION_IRI}> .

  <A> a <Test> ;
      cd:label "Test" ;
      cd:size 10 ;
      cd:color '#FFBB00' ;
      cd:opacity 0.5 ;
      cd:shape 'diamond' ;
      cd:strokeColor '#000000' ;
      cd:strokeSize 1 .
`,
}
