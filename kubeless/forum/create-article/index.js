const uuid = require('uuid/v4');
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({kafkaHost: 'kafka.kubeless:9092'});
const kafkaProducer = new kafka.Producer(kafkaClient);

module.exports = {
createArticle: function (event, context) {

return new Promise((resolve, reject) => {
    if (!event.data.title) {
        reject('Missing field: title');
    } else if (!event.data.body) {
        reject('Missing field: body');
    } else {
        resolve({
            id: uuid(),
            created: new Date(),
            title: event.data.title,
            body: event.data.body
        });
    }
}).then((article) => {
    return new Promise((resolve, reject) => {
        kafkaProducer.send([
            { topic: 'new-article-topic', messages: JSON.stringify(article), partition: 0 }
        ], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(article);
            }
        });
    });
}).then((article) => {
    event.extensions.response.statusCode = 201;
    return article;
}).catch((err) => {
    event.extensions.response.statusCode = 400;
    return err;
});
}
}
