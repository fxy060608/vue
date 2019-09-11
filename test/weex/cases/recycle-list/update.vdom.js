({
  type: 'recycle-list',
  attr: {
    append: 'tree',
    listData: [
      { name: 'A' },
      { name: 'B' }
    ],
    index: 'index',
    alias: 'item'
  },
  children: [{
    type: 'cell-slot',
    attr: { append: 'tree' },
    children: [{
      type: 'text',
      event: ['click'],
      attr: {
        value: [
          { '@binding': 'index' },
          ' ',
          { '@binding': 'item.name' }
        ]
      }
    }, {
      type: 'text',
      event: ['click'],
      attr: {
        value: [
          { '@binding': 'index' },
          ' ',
          { '@binding': 'item.name' }
        ]
      }
    }]
  }]
})
