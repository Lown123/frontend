const createQueue = require('./createQueue')

describe('createQueue', () => {
  const item1 = { hello: 'world' }
  const queue = createQueue()

  it('should enqueue an item', () => {
    queue.enqueue(item1)

    expect(queue.items.includes(item1)).toBeTruthy()
  })

  it('should return an array of items', () => {
    expect(queue.items).toEqual([item1])
  })

  it('should return size', () => {
    expect(queue.size).toBe(1)
  })

  it('should dequeue an item', () => {
    queue.enqueue('item 2')
    queue.enqueue('item 3')
    queue.enqueue('item 4')
    expect(queue.size).toBe(4)
    expect(queue.items[0] === item1).toBeTruthy()
    expect(queue.dequeue() === item1).toBeTruthy()
    expect(queue.size).toBe(3)
  })

  it('should clear the queue', () => {
    queue.clear()
    expect(queue.size).toBe(0)
    expect(queue.items).toEqual([])
  })
})
