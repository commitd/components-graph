import { Alert, AlertContent, AlertTitle, Flex } from '@committed/components'
import { ContentModel, cytoscapeRenderer, Graph, GraphModel, GraphToolbar, ModelNode, NodeViewer } from '@committed/components-graph'
import { Rdf, RdfUtil } from '@committed/graph-rdf'
import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'
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
      Rdf.buildGraph(
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
      Rdf.buildGraph(
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
      Rdf.buildGraph(`
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

const StoryTemplate: Story<{
  rdf: string
  rdfOptions: Partial<Rdf.RdfOptions>
}> = ({
  rdf,
  rdfOptions = {
    literals: Rdf.LiteralOption.VALUE_ONLY,
  },
}) => {
  const [model, setModel] = useState(
    GraphModel.createWithContent(ContentModel.createEmpty())
  )
  const [alert, setAlert] = useState<string | undefined>()

  useEffect(() => {
    try {
      setModel(GraphModel.createWithContent(Rdf.buildGraph(rdf, rdfOptions)))
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

export const ProcessedGraph = StoryTemplate.bind({})
ProcessedGraph.args = {
  rdf: `
        @prefix txn: <https://example.org/data/transaction/> .
      @prefix srv: <https://example.org/data/server/> .
      @prefix log: <https://example.org/ont/transaction-log/> .
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
      
      txn:123 a log:Transaction ;
        log:processedBy srv:A ;
        log:processedAt "2015-10-16T10:22:23"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:124 a log:Transaction ;
        log:processedBy srv:B ;
        log:processedAt "2015-10-16T10:22:24"^^xsd:dateTime ;
        log:statusCode 200 .
      
      txn:125 a log:Transaction ;
        log:processedBy srv:C ;
        log:processedAt "2015-10-16T10:22:24"^^xsd:dateTime ;
        log:statusCode 200 .
      
      txn:126 a log:Transaction ;
        log:processedBy srv:A ;
        log:processedAt "2015-10-16T10:22:25"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:127 a log:Transaction ;
        log:processedBy srv:B ;
        log:processedAt "2015-10-16T10:22:25"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:128 a log:Transaction ;
        log:processedBy srv:C ;
        log:processedAt "2015-10-16T10:22:26"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:129 a log:Transaction ;
        log:processedBy srv:A ;
        log:processedAt "2015-10-16T10:22:28"^^xsd:dateTime ;
        log:statusCode 500 .
        
      txn:130 a log:Transaction ;
        log:processedBy srv:B ;
        log:processedAt "2015-10-16T10:22:31"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:131 a log:Transaction ;
        log:processedBy srv:C ;
        log:processedAt "2015-10-16T10:22:31"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:132 a log:Transaction ;
        log:processedBy srv:A ;
        log:processedAt "2015-10-16T10:22:32"^^xsd:dateTime ;
        log:statusCode 500 .
        
      txn:133 a log:Transaction ;
        log:processedBy srv:B ;
        log:processedAt "2015-10-16T10:22:33"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:134 a log:Transaction ;
        log:processedBy srv:C ;
        log:processedAt "2015-10-16T10:22:33"^^xsd:dateTime ;
        log:statusCode 200 .
        
      txn:135 a log:Transaction ;
        log:processedBy srv:A ;
        log:processedAt "2015-10-16T10:22:35"^^xsd:dateTime ;
        log:statusCode 401 .
      `,
  rdfOptions: {
    nodeProcessor: RdfUtil.cleanProcessor,
    edgeProcessor: RdfUtil.cleanProcessor,
    label: undefined,
    literals: Rdf.LiteralOption.VALUE_ONLY,
  },
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
