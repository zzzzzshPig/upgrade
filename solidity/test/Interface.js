const { expect } = require('chai')

describe('Test', () => {
  it('One', async () => {
    const MyContract = await ethers.deployContract('MyContract')
    await MyContract.incrementCounter()
  })
})
