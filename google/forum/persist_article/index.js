const MongoClient = require('mongodb').MongoClient;

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.persistArticle = (event, context) => {
    const pubsubMessage = event.data;
    // console.log(Buffer.from(pubsubMessage, 'base64').toString());
    const article = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());
    
    const post = {
        "_id": article.id,
        "created": new Date(article.created),
        "title": article.title,
        "body": article.body
    };

    return new Promise((resolve, reject) => {
        const uri = 'mongodb+srv://forum_teste:' + encodeURIComponent(process.env.mongoPassword) + '@mymongo-zsihs.gcp.mongodb.net/test?retryWrites=true&w=majority'
        console.log('access uri: ',uri)
        MongoClient.connect(uri, (err, client) => {
            if(err) {
                console.log('erro ao conectar com o banco');
                reject(err);
            } else {
                const db = client.db(process.env.mongoDb);
                db.collection('posts').insert(post, (err,result) => {
                    if (err) {
                        console.log('Conectou mas não inseriu ',err);
                        reject(err);                        
                    } else {
                        resolve(post);
                    }
                });
            }
        });
    });
    
  };
  