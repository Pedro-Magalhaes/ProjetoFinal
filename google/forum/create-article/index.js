const uuid = require('uuid/v4');
const { PubSub } = require('@google-cloud/pubsub');
const cors = require('cors')({ origin: true });
// olhar exemplo em: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/functions/pubsub/index.js

const pubsub = new PubSub();
//pubsub_topic variavel de ambiente declarada no google platform
const topic = pubsub.topic(process.env.pubsub_topic);

module.exports = {
    /**
   * Responds to any HTTP request.
   *
   * @param {!express:Request} req HTTP request context.
   * @param {!express:Response} res HTTP response context.
   */
    createArticle: function (req, res) {
        cors(req, res, function () {
            _createArticle(req, res);
        });
    }
}

_createArticle = function (req, res) {

    if (!req.body.title) {
        res.status(400).send('Missing field: title');
    } else if (!req.body.body) {
        res.status(400).send('Missing field: body');
    }
    const article = {
        id: uuid(),
        created: new Date(),
        title: req.body.title,
        body: req.body.body
    };


    const dataBuffer = Buffer.from(JSON.stringify(article));
    topic.publish(dataBuffer)
        .then(messageId => {
            console.log(`message ${messageId} published`);
            res.status(201).send(article);
        })
        .catch(err => {
            console.log('ERROR', err);
            res.status(400).send(err);
        });
}
