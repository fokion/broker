class Broker {
    constructor() {
        const callbacksByTopic = {};

        this.subscribe = (topic, callback) => {
            return new Promise((resolve, reject) => {
                this.checkCallbackType(callback, reject);
                this.checkTopicType(topic, reject);
                if (!(topic in callbacksByTopic)) {
                    callbacksByTopic[topic] = [];
                }
                if (!callbacksByTopic[topic].includes(callback)) {
                    callbacksByTopic[topic].push(callback);
                }
                resolve();
            });
        }
        this.unsubscribe = (topic, callback) => {
            return new Promise((resolve, reject) => {
                this.checkCallbackType(callback, reject);
                this.checkTopicType(topic, reject);
                if (!(topic in callbacksByTopic)) {
                    reject('Missing topic');
                }
                const index = callbacksByTopic[topic].indexOf(callback);
                if (index !== -1) {
                    callbacksByTopic[topic].splice(index,1)
                    resolve();
                }
                reject('Callback is missing');
            });
        }
        this.publish = (topic, payload) => {
            if(!Broker.isString(topic)){
                return Promise.reject(Broker.ERROR_TOPIC)
            }
            const promises = callbacksByTopic[topic].map((cb) => {
                return Promise.resolve(cb.call(this,payload))
            });
            return Promise.all(promises);
        }
        this.unsubscribeAll = (topic) => {
            return new Promise((resolve, reject) => {
                this.checkTopicType(topic, reject);
                callbacksByTopic[topic] = [];
                resolve();
            });
        }
        this.getNumberOfSubscribers = (topic) => {
            return new Promise((resolve, reject) => {
                this.checkTopicType(topic, reject);
                resolve(topic in callbacksByTopic ? callbacksByTopic[topic].length : 0);
            })

        }
    }

    checkCallbackType(callback, reject) {
        if (!Broker.isFunction(callback)) {
            reject(new Error(Broker.ERROR_CALLBACK));
        }
    }

    checkTopicType(topic, reject) {
        if (!Broker.isString(topic)) {
            reject(new Error(Broker.ERROR_TOPIC));
        }
    }

    static isFunction(cb){
        return cb && (typeof cb === "function");
    }

    static isString(topic) {
        return topic !== null && topic !== undefined && (typeof topic === "string") && topic.trim() !== '';
    }

    static ERROR_CALLBACK = 'The callback needs to be a function that accepts the payload'
    static ERROR_TOPIC =  'The topic needs to be type string with a proper value';

}

module.exports = new Broker();