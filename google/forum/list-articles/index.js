const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')({origin: true});

module.exports = {
   /**
   * Responds to any HTTP request.
   *
   * @param {!express:Request} req HTTP request context.
   * @param {!express:Response} res HTTP response context.
   */
  // CORS and Cloud Functions export logic
  listArticles: function (req, res) {
    cors(req, res, function() {
        _listArticles(req, res);
    });
  }  
}

_listArticles = function (req, res) {
    return new Promise((resolve, reject) => {
        const uri = 'mongodb+srv://forum_teste:' + encodeURIComponent(process.env.mongoPassword) +
        '@mymongo-zsihs.gcp.mongodb.net/test?retryWrites=true&w=majority';
        MongoClient.connect(uri, (err, client) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const db = client.db(process.env.mongoDb);

                db.collection('posts')
                    .find({})
                    .sort({ created: -1 })
                    .project({ '_id': 1, 'title': 1, 'created': 1 })
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
    })
    .then(articles => {
        res.status(200).send(articles);
    })
    .catch(err => {
        res.status(400).send(err);
    });
}