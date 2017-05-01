/* globals module require */

const pageCalculator = require('../utils/page-calculator');

module.exports = (models) => {
    const Article = models.Article,
        User = models.User,
        Comment = models.Comment;

    return {
        createNewArticle(title, imageUrl, content, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn) {
            return new Promise((resolve, reject) => {
                if (createdOn == null) {
                    createdOn = new Date();
                }

                let tags = [sideA, sideB];

                let newArticle = new Article({ title, imageUrl, content, tags, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn });

                newArticle.save((error, dbArticle) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(dbArticle);
                });
            });
        },
        getNotDeletedArticlesByPage(page, pageSize) {
            pageSize = +pageSize;
            return new Promise((resolve, reject) => {
                Article.find({})
                    .where({ isDeleted: false })
                    .sort({ createdOn: -1 })
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, dbArticles) => {
                        if (error) {
                            return reject(error);
                        }

                        Article.count((error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let articles = {
                                articles: dbArticles,
                                pagesCount
                            };

                            return resolve(articles);
                        });
                    });
            });
        },
        getArticleById(id) {
            return new Promise((resolve, reject) => {
                Article.findOne({ _id: id }, (error, article) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(article);
                });
            });
        },
        commentArticle(articleId, userId, commentContent) {
            return new Promise((resolve, reject) => {
                Article.findOne({ _id: articleId }, (error, article) => {
                    if (error) {
                        return reject(error);
                    } else if (!article) {
                        return reject({ message: 'No such article found!' });
                    }

                    User.findOne({ _id: userId }, (error, user) => {
                        if (error) {
                            return reject(error);
                        } else if (!user) {
                            return reject({ message: 'You are not authorized to comment!' });
                        }

                        let createdOn = new Date();
                        let comment = new Comment({ author: { username: user.username, userId: user._id, userAvatar: user.profilePicture }, content: commentContent, createdOn });
                        article.comments.push(comment);
                        article.save((error, result) => {
                            if (error) {
                                return reject(error);
                            }

                            return resolve(result);
                        });
                    });
                });
            });
        },
        deleteArticleComment(articleId, commentId) {
            return new Promise((resolve, reject) => {
                Article.findOne({ _id: articleId }, (error, article) => {
                    if (error) {
                        return reject(error);
                    } else if (!article) {
                        return reject({ message: 'No such article found!' });
                    }

                    let comment = article.comments.find(x => x._id == commentId);
                    let index = article.comments.indexOf(comment);

                    if (index < 0) {
                        return reject({ message: 'No such comment found!' });
                    }

                    article.comments.splice(index, 1);
                    article.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        }
    };
};