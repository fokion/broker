const indexBroker = require('../index')
describe('index',()=>{
    it('should have Broker as the only field',()=>{
        expect(indexBroker).hasOwnProperty('Broker')
    })
})