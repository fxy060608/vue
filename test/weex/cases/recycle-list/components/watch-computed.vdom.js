({
  type: 'recycle-list',
  attr: {
    append: 'tree',
    listData: [
      { start: 1 },
      { start: 2 },
      { start: 3 }
    ],
    alias: 'item',
    index: 'i'
  },
  children: [{
    type: 'cell-slot',
    attr: { append: 'tree' },
    children: [{
      type: 'div',
      attr: {
        '@isComponentRoot': true,
        '@componentProps': {
          start: { '@binding': 'item.start' }
        }
      },
      children: [{
        type: 'text',
        style: { fontSize: '50px', fontFamily: 'monospace', textAlign: 'center', color: '#41B883', marginTop: '50px', marginRight: '50px', marginBottom: '50px', marginLeft: '50px' },
        attr: {
          value: [
            'f(',
            { '@binding': 'x' },
            ', ',
            { '@binding': 'y' },
            ') = ',
            { '@binding': 'result' }
          ]
        }
      }, {
        type: 'div',
        style: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: '50px', borderBottomWidth: '1px', borderBottomColor: '#CCCCCC' },
        children: [{
          type: 'text',
          style: { width: '200px', paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px', paddingLeft: '10px', fontSize: '50px', textAlign: 'center', borderWidth: '2px', borderColor: '#DDDDDD', backgroundColor: '#F5F5F5', color: '#888888' },
          event: ['click'],
          attr: {
            value: 'x++'
          }
        }, {
          type: 'text',
          style: { width: '200px', paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px', paddingLeft: '10px', fontSize: '50px', textAlign: 'center', borderWidth: '2px', borderColor: '#DDDDDD', backgroundColor: '#F5F5F5', color: '#888888' },
          event: ['click'],
          attr: {
            value: 'y++'
          }
        }]
      }]
    }]
  }]
})
