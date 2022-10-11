var PhotoModel = require('../models/photoModel.js');
var CommentModel = require('../models/commentModel.js');
const {json} = require("express");

var decay = require('decay')
    , hotScore = decay.redditHot();

setInterval(function () {
    PhotoModel.find(function (err, pics) {
        var candidates = []; // perhaps get recent posts saved in db here
        candidates = pics;
        candidates.forEach(function (c) {
            c.score = hotScore(c.upvotes, c.downvotes, c.createdAt);
            console.log(c.score);
            c.save(function (err, result) {
                if (err) {
                    console.log("Error in saving photo score!");
                }
            })
        });
    });
}, 1000 * 3); // run every 5 minutes, say


/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    popular: function (req, res) {
        console.log("calling popular function");
        PhotoModel.find({score: {$gt: 0.5}, reports: {$lt: 5}})
            .populate('postedBy')
            .exec(function (err, pics) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting popular photos',
                        error: err
                    });
                }
                return res.json(pics);
            })
    },
    /**
     * photoController.list()
     */
    list: function (req, res) {
        if(typeof req.params.name == 'undefined')
        {
            console.log("it is truly undefined");
            PhotoModel.find({reports: {$lt: 5}}).sort({'createdAt':-1})
                .populate('postedBy')
                .exec(function (err, photos) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting photo, first if.',
                            error: err
                        });
                    }
                    var data = [];
                    data.photos = photos;
                    //return res.render('photo/list', data);
                    return res.json(photos);
                });
        }
        else{
            console.log("it is: " + req.params.name);
            PhotoModel.find({tags: req.params.name}).sort({'createdAt':-1})
                .populate('postedBy')
                .exec(function (err, photos) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting photo, second if.',
                            error: err
                        });
                    }
                    var data = [];
                    data.photos = photos;
                    //return res.render('photo/list', data);
                    return res.json(photos);
                });
        }
        console.log(req.params.name);

    },

    report: function (req, res) {
        console.log("it is: " + req.params.id);
        PhotoModel.findOneAndUpdate({_id: req.params.id}, {$inc: {'reports': 1}}, {new: true}, (err, result)=>{
            if(err){
                console.log("Error when updating reports!");
            }
            return res.json(result);
        })

    },
    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        const options = { sort: [['group.name', 'asc' ]] };

        PhotoModel.findOne({_id: id})
            .populate('postedBy').populate()
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'user'
                },
                options: {sort: {'createdAt':-1}}
            })
            .exec(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo from show.',
                    error: err
                });
            }
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }
            console.log(photo.comments);
            return res.json(photo);
        });
    },


    /**
     * photoController.create()
     */
    create: function (req, res) {
        req.body.tags = req.body.tags.replace(/\s+/g, "");
        req.body.tags = req.body.tags.split(",");
        var photo = new PhotoModel({
			name : req.body.name,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
			views : 0,
			likes : 0,
            tags : req.body.tags
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    addComment: function (req, res) {
        var id = req.params.id;
        var comment = new CommentModel({
            content : req.body.comment,
            author: req.body.userID,
            authname: req.body.username
        });

        console.log("addComment called!" + req.body.comment);
        PhotoModel.findOneAndUpdate({_id: id}, {$push: {comments: comment._id}}).exec(
            function (err, photo) {
                photo.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating comment',
                            error: err
                        });
                    }
                    console.log("Photo update-comment saved!");
                })
                comment.save(function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating comment',
                            error: err
                        });
                    }
                    console.log("PRinting result: "+result);
                    return res.json(result);
                })
            }
        );
    },
    
    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        var path = req.originalUrl.split("/")[2];
        var alreadyExists = false;
        //console.log(path)

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.likedBy.forEach(user=>{
                if(user == req.body.userID){
                    console.log("user already rated this, no action");
                    alreadyExists = true;
                    return;
                }
            })

/*            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;*/

            if(path == "up" && !alreadyExists){
                photo.likes += 1;
                photo.upvotes += 1;
                photo.likedBy.push(req.body.userID);
            }
            else if(path == "down" && !alreadyExists){
                photo.likes -= 1;
                photo.downvotes += 1;
                photo.likedBy.push(req.body.userID);
            }

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function(req, res){
        return res.render('photo/publish');
    }
};
