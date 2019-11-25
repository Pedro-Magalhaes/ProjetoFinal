const MongoClient = require('mongodb').MongoClient;

    module.exports = {
      persistArticle: function (event, context) {
        const article = event.data;
        const post = {
          "_id": article.id,
          "created": new Date(article.created),
          "title": article.title,
          "body": article.body
        };

        return new Promise((resolve, reject) => {

          MongoClient.connect("mongodb://mongo.forum:27017", (err, client) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const db = client.db('kubeless_blog');

              db.collection('posts').insert(post, (err, result) => {
                client.close();

                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(post);
                }
              });
            }
          });
        });

      }
    }