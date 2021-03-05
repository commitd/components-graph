import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import { Graph } from '..'
import { GraphBuilder, GraphModel } from '../../../graph'
import { DECORATION_IRI } from '../../../graph/fromRdfGraph'
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
    @prefix cd: <${DECORATION_IRI}> .
  
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
