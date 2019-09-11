({
  type: 'recycle-list',
  attr: {
    append: 'tree',
    listData: [1, 2, 3, 4, 5],
    index: 'i',
    alias: 'num'
  },
  event: ['loadmore'],
  children: [{
    type: 'cell-slot',
    attr: { append: 'tree' },
    children: [{
      type: 'div',
      children: [{
        type: 'text',
        attr: {
          value: { '@binding': 'num' }
        }
      }]
    }]
  }]
})
