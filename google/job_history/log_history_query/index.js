const uuid = require('uuid/v4');
const { PubSub } = require('@google-cloud/pubsub');
const cors = require('cors')({ origin: true });

const pubsub = new PubSub();
//pubsub_topic variavel de ambiente declarada no google platform
const topic = pubsub.topic(process.env.pubsub_topic);

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.logQuery = (req, res) => {
  const query = req.query.query || req.body.query;

  // DEBUG
  // END DEBUG
  if(!query) {
    console.error('No query received. Returning 400')
    res.status(400).send('query param is mandatory');
    return;
  }

  const query_log = {
        id: uuid(),
        created: new Date(),
        query: query
  };
  
  console.log('publishing:')
  console.log(query_log);

  const dataBuffer = Buffer.from(JSON.stringify(query_log));
  topic.publish(dataBuffer)
      .then(messageId => {
          console.log(`message ${messageId} published`);
      })
      .catch(err => {
          console.error('ERROR', err);
      });
  
  // fechando a conexão antes do processamento
  res.status(200).send("Recebido");
  
};
