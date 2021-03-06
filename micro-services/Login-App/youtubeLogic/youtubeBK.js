var axios = require('axios')

module.exports = youtubeLogic = {


        replyToComment: (commentId, chanId, parentId, commentText, accessToken, refresh_token, keys) => {

            return new Promise(resolve => {
                const google = require('googleapis')
                const youTubeDataApi = google.google.youtube('v3')

                const OAuth2 = google.google.auth.OAuth2

                const oauth2Client = new OAuth2(keys.youTube.clientID, keys.youTube.clientSecret, [])

                // put the tokens in the header
                oauth2Client.setCredentials({
                    refresh_token: refresh_token,
                    access_token: accessToken
                });

                //default set to tokens are in header
                google.google.options({ auth: oauth2Client })

                //build youtube commentResource object for request body
                let params = {
                    auth: oauth2Client,
                    part: "snippet",
                    resource: {
                        snippet: {
                            channelId: chanId,
                            topLevelComment: {
                                snippet: {
                                    textOriginal: commentText
                                }
                            },
                            videoId: parentId,
                            commentId: commentId,
                        }
                    }
                }
                youTubeDataApi.commentThreads.insert(params, (err, info) => {
                    if (err) {
                        console.log('Failure posting comment. This is how you messed up:', err.message);
                        resolve("failed posting comment");
                    } else {
                        console.log('comment posted', info.statusText);
                        resolve("posted comment");
                    }
                });
            })
        },

        addComment: (chanId, parentId, commentText, accessToken, refresh_token, keys) => {

            return new Promise(resolve => {
                const google = require('googleapis')
                const youTubeDataApi = google.google.youtube('v3')

                const OAuth2 = google.google.auth.OAuth2

                const oauth2Client = new OAuth2(keys.youTube.clientID, keys.youTube.clientSecret, [])

                // put the tokens in the header
                oauth2Client.setCredentials({
                    refresh_token: refresh_token,
                    access_token: accessToken
                });
                //default set to tokens are in header
                google.google.options({ auth: oauth2Client })

                //build youtube commentResource object for request body
                let params = {
                    auth: oauth2Client,
                    part: "snippet",
                    resource: {
                        snippet: {
                            channelId: chanId,
                            videoId: parentId,
                            topLevelComment: {
                                snippet: {
                                    textOriginal: commentText
                                }
                            }
                        }
                    }
                }
                youTubeDataApi.commentThreads.insert(params, (err, info) => {
                    if (err) {
                        console.error('Failure posting comment. This is how you messed up:', err.message);
                        resolve("failed posting comment");
                    } else {
                        console.log('comment posted', info.statusText);
                        resolve("posted comment");
                    }
                });
            })

        },
        getPlaylists: function(chanID, API_KEY) {

            return new Promise(resolve => {
                axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                    params: {
                        playlistId: chanID,
                        maxResults: '50',
                        part: 'snippet,contentDetails',
                        key: API_KEY
                    }
                }).then(playlists => {
                    let videoObjects = playlists.data.items.map(e => {
                        return {
                            channelId: e.snippet.channelId,
                            videoId: e.contentDetails.videoId,
                            title: e.snippet.title,
                            description: e.snippet.description,
                            thumbnails: e.snippet.thumbnails
                        }
                    })
                    resolve(playlists.data.items)
                }).catch(err => {
                    console.log('lists catch ran error')
                    resolve(err)
                })

            })
        },

        getUploadedVideos: function(uploadsID, API_KEY) {


            return new Promise(resolve => {
                axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                    params: {
                        playlistId: uploadsID,
                        part: 'snippet,contentDetails',
                        maxResults: '50',
                        key: API_KEY
                    }
                }).then(allVideos => {
                    let formattedVideos = allVideos.data.items.map(e => {
                        return {
                            title: e.snippet.title,
                            description: e.snippet.description,
                            thumbnails: e.snippet.thumbnails,
                            videoId: e.contentDetails.videoId,
                            date: e.contentDetails.videoPublishedAt
                        }
                    })
                    resolve(formattedVideos)
                }).catch(err => {
                    console.log('catch in get uploaded')
                    resolve(err)
                })
            })
        },
        getChannelInfo: function(id, API_KEY) {

            return new Promise(resolve => {
                axios.get('https://www.googleapis.com/youtube/v3/channels', {
                        params: {
                            id: id,
                            part: 'snippet,contentDetails,statistics',
                            maxResults: '50',
                            key: API_KEY
                        }
                    })
                    .then(deets => resolve(deets))
                    .catch(err => console.log('error in get chan infoerr', err.message))
            })
        },
        gimmeVideos: async function(chanID, API_KEY) {
            let videos = await this.getUploadedVideos(chanID, API_KEY)
            return videos
        },
        gimmeComments: async function(chanID, API_KEY) {
            let commentObjects = await this.getComments(chanID, API_KEY)
            return videos
        },
        gimmePlaylist: async function(uploadsID, API_KEY) {
            let videoObjects = await this.getPlaylists(uploadsID, API_KEY)
            return videoObjects
        },
        gimmeAll: async function(userID, API_KEY) {
            let channelInfo = await this.getChannelInfo(userID, API_KEY)
            if (channelInfo.data.items.length) {
                let uploadsID = channelInfo.data.items[0].contentDetails.relatedPlaylists.uploads;
                let channelId = channelInfo.data.items[0].id
                let commentObjects = await this.getComments(channelId, API_KEY)
                let videoObjects = await this.getPlaylists(uploadsID, API_KEY)

                let responseObject = {
                    videos: videoObjects,
                    comments: commentObjects
                }
                return responseObject
            } else {
                return {
                    videos: [],
                    comments: []
                }
            }
        },
        getComments: function(channelID, API_KEY) {

            return new Promise(resolve => {
                axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                    params: {
                        allThreadsRelatedToChannelId: channelID,
                        part: 'snippet,replies',
                        key: API_KEY
                    }
                }).then(allComments => {
                    // console.log('HERE', allComments.data.items[0].snippet.topLevelComment)
                    var objs = allComments.data.items.map(e => {
                        return {
                            commentId: e.snippet.topLevelComment.id,
                            author: e.snippet.topLevelComment.snippet.authorDisplayName,
                            authorThumbnail: e.snippet.topLevelComment.snippet.authorProfileImageUrl,
                            videoId: e.snippet.topLevelComment.snippet.videoId,
                            comment: e.snippet.topLevelComment.snippet.textDisplay,
                            likeCount: e.snippet.topLevelComment.snippet.likeCount,
                            publishedAt: e.snippet.topLevelComment.snippet.publishedAt
                        }
                    })
                    resolve(objs)
                }).catch(err => {
                    console.log('error in comments')
                    resolve('error')
                })
            })
        }
    }
    // youtubeLogic.runner('ph8tel')git add .