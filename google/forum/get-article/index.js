const MongoClient = require('mongodb').MongoClient;

module.exports = {
    /**
    * Responds to any HTTP request.
    *
    * @param {!express:Request} req HTTP request context.
    * @param {!express:Response} res HTTP response context.
    */
    getArticle: function (req, res) {
        res.set('Access-Control-Allow-Origin', '*');
        const url = req.url;
        const id = url.substring(1);
        if(!id) {
            res.status(400).send('The uri should contain a article id');
        }
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
                        .findOne({ '_id': id }, (err, doc) => {
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
                                    resolve();
                                }
                            }
                        });
                }
            });
        })
            .then(article => {
                if (article) {
                    res.status(200).send(article);
                }
                res.status(404).send('article not found');
            })
            .catch(err => {
                res.status(500).send('article not found');
            });
    }
}