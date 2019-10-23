const MongoClient = require('mongodb').MongoClient;

    module.exports = {
      listArticles: function (event, context) {
        return new Promise((resolve, reject) => {

          MongoClient.connect('mongodb://mongo.default:27017', (err, client) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const db = client.db('kubeless_blog');

              db.collection('posts')
                    .find({})
                    .sort({created: -1})
                    .project({'_id': 1, 'title': 1, 'created': 1})
                    .toArray((err, docs) => {
                client.close();

                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(docs.map((doc) => {
                      return {
                          id: doc['_id'],
                          title: doc.title,
                          created: doc.created
                      };
                  }));
                }
              });
            }
          });
        });

      }
    }