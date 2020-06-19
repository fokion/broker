const Broker = require('../../src/Broker')
const TOPIC = 'test'
const {ERROR_TOPIC , ERROR_CALLBACK} = require('../../src/Messages')
describe('Broker',()=>{
    it('should have publish',()=>{
        expect(Broker).toHaveProperty('publish')
    })
    it('should have subscribe',()=>{
        expect(Broker).toHaveProperty('subscribe')
    })
    it('should have unsubscribe',()=>{
        expect(Broker).toHaveProperty('unsubscribe')
    })
    it('should have unsubscribeAll',()=>{
        expect(Broker).toHaveProperty('unsubscribeAll')
    })
    it('should have getNumberOfSubscribers',()=>{
        expect(Broker).toHaveProperty('getNumberOfSubscribers');
    })
    it('should reject if callback is not a method',async()=>{
        await expect(Broker.subscribe('test',1)).rejects.toThrow(ERROR_CALLBACK)
    })
    it('should reject if topic is not a string',async()=>{
        await expect(Broker.subscribe(false,()=>{})).rejects.toThrow(ERROR_TOPIC)
        await expect(Broker.subscribe(()=>{},()=>{})).rejects.toThrow(ERROR_TOPIC)
        await expect(Broker.subscribe(null,()=>{})).rejects.toThrow(ERROR_TOPIC)
        await expect(Broker.subscribe(undefined,()=>{})).rejects.toThrow(ERROR_TOPIC)
        await expect(Broker.subscribe(123,()=>{})).rejects.toThrow(ERROR_TOPIC)
    })
    describe('subscribe / unsubscribe',()=> {

        beforeEach(() => {
            Broker.unsubscribeAll(TOPIC);
        })
        it('should be able to subscribe', async () => {
            const cb = () => {
            };
            await Broker.subscribe(TOPIC, cb)
            await expect(Broker.getNumberOfSubscribers(TOPIC)).resolves.toBe(1);

        })
        it('should have 0 as the number of subscribers if I dont have the topic or have a topic with no subs', async () => {
            await expect(Broker.getNumberOfSubscribers('dummy')).resolves.toBe(0);
        })
    });
    describe('subscribe/unsubscribe examples',()=>{
        it('should be able to unsubscribe',async ()=>{
            expect.assertions(2);
            await new Promise((resolve, reject) => {
                const TOPIC2 = 'HELLO'
                let timeout;
                const cleanup = {
                    clean : async () => {
                       await Broker.unsubscribe(TOPIC2, component.messageHandler);
                    }
                }
                const component = {
                    messageHandler :async (payload)=>{
                        expect(payload).toHaveProperty('message')
                        await cleanup.clean();
                        await Broker.subscribe(TOPIC2,(payload)=>{
                            clearInterval(timeout);
                            expect(payload).toHaveProperty('message');
                            Broker.unsubscribeAll(TOPIC2);
                            resolve();
                        })
                    }
                }
                Broker.subscribe(TOPIC2,component.messageHandler).then(()=>{
                    timeout = setInterval(()=>{
                        Broker.publish(TOPIC2,{message:'hello',timestamp : new Date()})
                    },10);
                })


            }).catch(err=>{console.trace(err.message)})
        })
        it('should subscribe topics and pass messages',async ()=>{
            expect.assertions(2)
            await new Promise( resolve => {

                const message = 'hello world'
                const handler = {

                    callbackHandler : async (payload) => {
                        expect(payload).toBe(message)
                        await Broker.unsubscribeAll(TOPIC)
                        await expect(Broker.getNumberOfSubscribers(TOPIC)).resolves.toBe(0);
                        resolve();
                    }
                }
                Broker.subscribe(TOPIC,handler.callbackHandler).then(()=>{
                    Broker.publish(TOPIC,message);
                })

            })


        })
    })

})