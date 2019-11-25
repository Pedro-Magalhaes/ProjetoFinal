const MongoClient = require('mongodb').MongoClient;

    module.exports = {
      getArticle: function (event, context) {
        const url = event.extensions.request.headers["x-original-uri"];
        let id = url.match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);
        if(id) {
          id = id[0];
        } else {
          event.extensions.response.statusCode = 404;
          event.extensions.response.send("Erro id nullo");
        }
        console.log(id);
        return new Promise((resolve, reject) => {

          MongoClient.connect('mongodb://mongo.forum:27017', (err, client) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const db = client.db('kubeless_blog');

              db.collection('posts')
                    .findOne({'_id': id}, (err, doc) => {
                client.close();

                if (err) {
                  console.log('id nor founcd: '+id +' ' + err);
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
                    console.log('err:' + 'id: ' + id + ' not found');
                    resolve(id + '  id not found');
                  }
                }
              });
            }
          });
        });

      }
    }