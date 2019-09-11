({
  type: 'recycle-list',
  attr: {
    append: 'tree',
    listData: [
      { visible: true },
      { visible: true }
    ],
    alias: 'item',
    index: 'i'
  },
  children: [{
    type: 'cell-slot',
    attr: { append: 'tree' },
    children: [{
      type: 'div',
      event: [{
        type: 'click',
        params: [{ '@binding': 'i' }]
      }],
      attr: {
        '[[match]]': 'item.visible'
      },
      children: [{
        type: 'div',
        attr: {
          '@isComponentRoot': true,
          '@componentProps': {}
        },
        children: [{
          type: 'text',
          attr: {
            value: {
              '@binding': 'number'
            }
          }
        }]
      }]
    }]
  }]
})
