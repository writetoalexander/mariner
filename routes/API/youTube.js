var express = require('express');
var router = express.Router();
const DATA = require('./sampleData');
const VIDEO = require('./videoResponse');

router.get('/getCommenterImages', function(req, res, next) {
    console.log('target hit');
    //   res.render('', { title: 'Express' });
    const images = DATA.items.map(comment =>
        comment.snippet.authorChannelUrl
    )
    res.json(images)
});

router.get('/getComments', (req, res, next) => {
    const comments = DATA.items.map(comment =>
        comment.snippet.textDisplay)
    res.json(comments)
});

router.get('/getCommenterNames', (req, res, next) => {
    const names = DATA.items.map(comment =>
            comment.snippet.authorDisplayName)
        //should be reaching to youtube, have a promise on return then r
        //send youtube data out to SA API
        //send back to client
    res.json(names)
})

router.get('/getTotalLikes', (req, res, next) => {
    const likes = DATA.items.reduce((acc, comment) =>
        acc += comment.snippet.likeCount, 0)
    res.json(likes)
})

router.get('/getUserVideoTitles', (req, res, next) => {
    // use this for actual call:
    // GET https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&maxResults=50&mine=true&key={YOUR_API_KEY}
    const titles = VIDEO.

})

module.exports = router;