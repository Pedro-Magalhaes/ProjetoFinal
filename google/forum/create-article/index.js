const uuid = require('uuid/v4');
const { PubSub } = require('@google-cloud/pubsub');
// olhar exemplo em: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/functions/pubsub/index.js

const pubsub = new PubSub();
//pubsub_topic variavel de ambiente declarada no google platform
const topic = pubsub.topic(pubsub_topic);

module.exports = {
    /**
   * Responds to any HTTP request.
   *
   * @param {!express:Request} req HTTP request context.
   * @param {!express:Response} res HTTP response context.
   */
    createArticle: function (req, res) {

        return new Promise((resolve, reject) => {
            if (!req.body.title) {
                reject('Missing field: title');
            } else if (!req.body.body) {
                reject('Missing field: body');
            } else {
                resolve({
                    id: uuid(),
                    created: new Date(),
                    title: req.body.title,
                    body: req.body.body
                });
            }
        }).then((article) => {
            return new Promise((resolve, reject) => {
                const dataBuffer = Buffer.from(JSON.stringify(article));
                topic.publish(dataBuffer)
                    .then(resolve(article))
                    .catch(reject('Erro'));
            });
        }).then((article) => {
            res.status(201).send(article);
        }).catch((err) => {
            res.status(400).send(err);
        });
    }
}
