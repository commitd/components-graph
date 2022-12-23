import cytoscape = require('cytoscape')

declare module 'cytoscape-cose-bilkent' {
  declare const cytoscapeCoseBilkent: cytoscape.Ext

  export = cytoscapeCoseBilkent
  export as namespace cytoscapeCoseBilkent
}
