import fs from 'fs'
import path from 'path'
import { DECORATION_IRI } from '../../fromRdfGraph'

const smallFile = path.join(__dirname, './', 'small.ttl')
export const small = fs.readFileSync(smallFile, 'utf8')

const sampleFile = path.join(__dirname, './', 'sample.ttl')
export const sample = fs.readFileSync(sampleFile, 'utf8')

export const decorated = `
  @prefix cd: <${DECORATION_IRI}> .

  <A> a <Test> ;
      cd:label "Test" ;
      cd:size 10 ;
      cd:color '#FFBB00' ;
      cd:opacity 0.5 ;
      cd:shape 'diamond' ;
      cd:strokeColor '#000000' ;
      cd:strokeSize 1 .
`
