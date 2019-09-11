({
  type: 'recycle-list',
  attr: {
    append: 'tree',
    listData: [
      { type: 'A' },
      { type: 'A' }
    ],
    switch: 'type',
    alias: 'item'
  },
  children: [{
    type: 'cell-slot',
    attr: { append: 'tree', case: 'A' },
    children: [{
      type: 'div',
      attr: {
        '@isComponentRoot': true,
        '@componentProps': {}
      },
      children: [{
        type: 'text',
        attr: {
          value: 'BANNER'
        }
      }]
    }, {
      type: 'text',
      attr: {
        value: 'content'
      }
    }]
  }]
})
