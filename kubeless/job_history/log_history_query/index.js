const uuid = require('uuid/v4');
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({kafkaHost: 'kafka.kubeless:9092'});
const kafkaProducer = new kafka.Producer(kafkaClient);


exports.logQuery = (event, context) => {
  const query = event.data.query;

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

  return new Promise((resolve, reject) => { // enviando para o topico do kafka a nova entrada
    kafkaProducer.send([
        { topic: 'history_log', messages: JSON.stringify(query_log), partition: 0 }
    ], (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(query_log);
        }
    });
  }).then((query_log) => { // sucesso
    event.extensions.response.statusCode = 201;
    return query_log;
  }).catch((err) => { // erro
    event.extensions.response.statusCode = 400;
    return err;
  });

};
