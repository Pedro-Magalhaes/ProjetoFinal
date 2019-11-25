const Pusher = require('pusher');

const pusher = new Pusher({
      appId: '906194',
      key: 'a895ae4cb8b6ebc37d7a',
      secret: 'e1dcfd00a774323ce676',
      cluster: 'us2',
      encrypted: true
});


module.exports = {
  broadcastArticle: function (event, context) {

    const article = Buffer.from(event.data, 'base64');
    
    const post = {
      "_id": article.id,
      "created": new Date(article.created),
      "title": article.title,
      "body": article.body
    };

    pusher.trigger('forum-teste', 'new-post', post);
  }
}