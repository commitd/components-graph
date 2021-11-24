import { ContentModel, ModelEdge, ModelItem, ModelNode } from '@committed/graph'
import {
  DataFactory,
  Literal,
  NamedNode,
  Parser,
  ParserOptions,
  Term,
  Triple,
} from 'n3'
import { fromRdf } from 'rdf-literal'

// Temporary solution - extend to proper ontology
// Only node decoration supported at this time.
export const DECORATION_IRI = 'http://ont.committed.io/graph/decorator#'

export const DECORATION_ITEM_LABEL = 'label'
export const DECORATION_ITEM_SIZE = 'size'
export const DECORATION_ITEM_COLOR = 'color'
export const DECORATION_ITEM_OPACITY = 'opacity'
export const DECORATION_NODE_ICON = 'icon'
export const DECORATION_NODE_SHAPE = 'shape'
export const DECORATION_NODE_STROKE_COLOR = 'strokeColor'
export const DECORATION_NODE_STROKE_SIZE = 'strokeSize'

export const DECORATION_ITEM_LABEL_IRI = DECORATION_IRI + DECORATION_ITEM_LABEL
export const DECORATION_ITEM_SIZE_IRI = DECORATION_IRI + DECORATION_ITEM_SIZE
export const DECORATION_ITEM_COLOR_IRI = DECORATION_IRI + DECORATION_ITEM_COLOR
export const DECORATION_ITEM_OPACITY_IRI =
  DECORATION_IRI + DECORATION_ITEM_OPACITY
export const DECORATION_NODE_ICON_IRI = DECORATION_IRI + DECORATION_NODE_ICON
export const DECORATION_NODE_SHAPE_IRI = DECORATION_IRI + DECORATION_NODE_SHAPE
export const DECORATION_NODE_STROKE_COLOR_IRI =
  DECORATION_IRI + DECORATION_NODE_STROKE_COLOR
export const DECORATION_NODE_STROKE_SIZE_IRI =
  DECORATION_IRI + DECORATION_NODE_STROKE_SIZE

const DECORATORS: Record<string, keyof ModelNode> = {
  [DECORATION_ITEM_LABEL_IRI]: DECORATION_ITEM_LABEL,
  [DECORATION_ITEM_SIZE_IRI]: DECORATION_ITEM_SIZE,
  [DECORATION_ITEM_COLOR_IRI]: DECORATION_ITEM_COLOR,
  [DECORATION_ITEM_OPACITY_IRI]: DECORATION_ITEM_OPACITY,
  [DECORATION_NODE_ICON_IRI]: DECORATION_NODE_ICON,
  [DECORATION_NODE_SHAPE_IRI]: DECORATION_NODE_SHAPE,
  [DECORATION_NODE_STROKE_COLOR_IRI]: DECORATION_NODE_STROKE_COLOR,
  [DECORATION_NODE_STROKE_SIZE_IRI]: DECORATION_NODE_STROKE_SIZE,
}

const rdfType = DataFactory.namedNode(
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
)

const rdfsLabel = DataFactory.namedNode(
  'http://www.w3.org/2000/01/rdf-schema#label'
)

export interface LiteralObject {
  value: string
  /** a valid rdf:datatype */
  dataType: string
}
export enum LiteralOption {
  /** Store the value only */
  VALUE_ONLY = 'VALUE_ONLY',
  /** Store as an object with type LiteralObject */
  AS_OBJECT = 'LITERAL_OBJECT',
  /** Store as full rdf literal string e.g `"2015-10-16T10:22:24"^^xsd:dateTime`  */
  AS_STRING = 'LITERAL_STRING',
}

export enum RdfFormat {
  /** Supports a permissive superset of Turtle, TriG, N-Triple and N-Quad */
  Turtle = 'turtle',
  /** Supports N3 format */
  N3 = 'N3',
}

export interface RdfOptions {
  /** use the prefix in the node ids */
  usePrefixId: boolean
  /** Define how literals are converted to be used in the graph */
  literals: LiteralOption
  /** Declare the serialization format of the RDF */
  format: RdfFormat
  /** Transfer declarations from the http://ont.committed.io/graph/decorator namespace to decoration properties of the graph */
  decorate: boolean
  /** Declare the attribute to use as the label */
  label?: string
  /** Declare the property to use as the node type */
  type?: string
  /** Declare the base IRI of the graph */
  baseIRI?: string
  /** Declare a blank node prefix to be used */
  blankNodePrefix?: string
  /** Add additional prefixes to the used */
  additionalPrefixes?: Record<string, string>
  /** Node processor to apply to nodes after conversion */
  nodeProcessor?: (node: ModelNode) => ModelNode
  /** Edge processor to apply to edges after conversion */
  edgeProcessor?: (edge: ModelEdge) => ModelEdge
}

export const DEFAULT_RDF_OPTIONS: RdfOptions = {
  usePrefixId: false,
  literals: LiteralOption.AS_OBJECT,
  format: RdfFormat.Turtle,
  label: rdfsLabel.value,
  type: rdfType.value,
  decorate: true,
}

interface GraphBuilderOptions
  extends Pick<
    RdfOptions,
    'usePrefixId' | 'literals' | 'decorate' | 'nodeProcessor' | 'edgeProcessor'
  > {
  prefixes: Record<string, string>
  label?: NamedNode
  type?: NamedNode
}

class GraphBuilder {
  private readonly nodes: Record<string, ModelNode> = {}
  private readonly edges: Record<string, ModelEdge> = {}
  private readonly attributes: Triple[] = []

  private readonly triples: Triple[]
  private readonly options: GraphBuilderOptions

  public constructor(triples: Triple[], options: GraphBuilderOptions) {
    this.triples = triples
    this.options = options
  }

  public build(): ContentModel {
    this.triples.forEach((t) => this.addTriple(t))
    this.attributes.forEach((t) => this.addAttribute(t))

    this.processNodes()
    this.processEdges()
    return ContentModel.fromRaw({ nodes: this.nodes, edges: this.edges })
  }

  private processNodes() {
    const nodeProcessor = this.options.nodeProcessor
    if (nodeProcessor !== undefined) {
      Object.keys(this.nodes).forEach((key) => {
        this.nodes[key] = nodeProcessor(this.nodes[key])
      })
    }
  }

  private processEdges() {
    const edgeProcessor = this.options.edgeProcessor
    if (edgeProcessor !== undefined) {
      Object.keys(this.edges).forEach((key) => {
        this.edges[key] = edgeProcessor(this.edges[key])
      })
    }
  }

  private addTriple(t: Triple): void {
    if (t.object.termType === 'Literal') {
      this.attributes.push(t)
    } else {
      this.addNode(t.subject)
      if (
        this.options.type !== undefined &&
        t.predicate.equals(this.options.type)
      ) {
        this.addType(t)
      } else {
        this.addNode(t.object)
        this.addEdge(t)
      }
    }
  }

  private addNode(term: Term): void {
    const id = this.toNodeId(term)
    if (this.nodes[id] === undefined) {
      this.nodes[id] = {
        id,
        label: term.value,
        attributes: {},
      }
    }
  }

  private addEdge(t: Triple): void {
    const id = this.toEdgeId(t)
    this.edges[id] = {
      id,
      source: this.toNodeId(t.subject),
      target: this.toNodeId(t.object),
      label: this.toNodeId(t.predicate),
      attributes: {},
    }
  }

  private addType(t: Triple): void {
    const item = this.nodes[this.toNodeId(t.subject)]
    if (item !== undefined && item.attributes !== undefined) {
      item.attributes.type = this.toNodeId(t.object)
    }
  }

  private addAttribute(t: Triple): void {
    if (
      this.options.label !== undefined &&
      this.options.label.equals(t.predicate)
    ) {
      this.addLabel(t)
    }
    if (!!this.options.decorate && t.predicate.id.startsWith(DECORATION_IRI)) {
      this.addDecorator(t)
    } else {
      const item = this.nodes[this.toNodeId(t.subject)]
      if (item !== undefined && item.attributes !== undefined) {
        item.attributes[this.toNodeId(t.predicate)] = this.toLiteralAttribute(
          t.object as Literal
        )
      }
    }
  }

  private toLiteralAttribute(object: Literal): unknown {
    switch (this.options.literals) {
      case LiteralOption.AS_OBJECT:
        return {
          value: object.value,
          dataType: this.toPrefixedId(object.datatypeString),
        }
      case LiteralOption.AS_STRING: {
        return object.id
      }
      case LiteralOption.VALUE_ONLY: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return fromRdf(object)
      }
      default:
        throw new Error('Unrecognized LiteralOption')
    }
  }

  toNodeId(node: Term): string {
    // IRI for named node _:value for Blanknode
    return this.toPrefixedId(node.id)
  }

  toPrefixedId(id: string): string {
    if (this.options.usePrefixId) {
      const match = Object.keys(this.options.prefixes).find((prefix) =>
        id.startsWith(prefix)
      )
      if (match !== undefined) {
        const prefix = this.options.prefixes[match]
        return `${prefix}:${id.substr(match.length)}`
      }
    }
    return id
  }

  private toEdgeId(triple: Triple): string {
    return `${this.toNodeId(triple.subject)}|${this.toNodeId(
      triple.predicate
    )}|${this.toNodeId(triple.object)}`
  }

  private addLabel(t: Triple): void {
    const item = this.nodes[this.toNodeId(t.subject)]
    if (item !== undefined) {
      item.label = t.object.value
    } else {
      Object.entries(this.edges)
        .filter((e) => e[0].includes(t.subject.value))
        .forEach((e) => {
          e[1].label = t.object.value
        })
    }
  }

  private addDecorator(t: Triple): void {
    const item = this.nodes[this.toNodeId(t.subject)]
    if (item !== undefined) {
      const decorator = DECORATORS[t.predicate.id]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      item[decorator] = fromRdf(t.object as Literal)
    }
  }
}

export function buildGraph(
  data: string,
  options: Partial<RdfOptions> = {}
): ContentModel {
  const rdfOptions: RdfOptions = {
    ...DEFAULT_RDF_OPTIONS,
    ...options,
  }
  const {
    format,
    label,
    type,
    baseIRI,
    blankNodePrefix,
    additionalPrefixes,
    ...rest
  } = rdfOptions

  const parserOptions: ParserOptions = {
    baseIRI,
    blankNodePrefix,
  }

  if (format !== RdfFormat.Turtle) {
    parserOptions.format = format
  }

  const prefixString = Object.entries(additionalPrefixes ?? {}).reduce(
    (acc, curr) => {
      return acc + `@prefix ${curr[0]}: <${curr[1]}> .\n`
    },
    ''
  )

  const prefixes: Record<string, string> = {}

  const parser = new Parser<Triple>(parserOptions)
  const rdfData: Triple[] = parser.parse(
    prefixString + data,
    null,
    (prefix, namedNode) => (prefixes[namedNode.value] = prefix)
  )

  const builderOptions = {
    label: typeof label === 'string' ? DataFactory.namedNode(label) : undefined,
    type: type !== undefined ? DataFactory.namedNode(type) : undefined,
    prefixes,
    ...rest,
  }
  return new GraphBuilder(rdfData, builderOptions).build()
}
