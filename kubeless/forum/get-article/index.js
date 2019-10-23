const MongoClient = require('mongodb').MongoClient;

    module.exports = {
      getArticle: function (event, context) {
        const url = event.extensions.request.url;
        const id = url.substring(1);

        return new Promise((resolve, reject) => {

          MongoClient.connect('mongodb://mongo.default:27017', (err, client) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const db = client.db('kubeless_blog');

              db.collection('posts')
                    .findOne({'_id': id}, (err, doc) => {
                client.close();

                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  if (doc) {
                    resolve({
                      id: doc['_id'],
                      created: doc.created,
                      title: doc.title,
                      body: doc.body
                    });
                  } else {
                    event.extensions.response.statusCode = 404;
                    resolve();
                  }
                }
              });
            }
          });
        });

      }
    }