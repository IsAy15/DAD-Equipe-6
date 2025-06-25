function addIsLikedToPost(post, userID) {
  if (!post || !post.likes) return post;
  return {
    ...post,
    isLiked: userID ? post.likes.includes(userID) : true,
  };
}

function addIsLikedToPosts(posts, userID) {
  if (Array.isArray(posts)) {
    return posts.map((post) => addIsLikedToPost(post, userID));
  }
  return addIsLikedToPost(posts, userID);
}

module.exports = function addIsLikedMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    // Si la réponse est un post ou un tableau de posts, ajoute isLiked
    if (data && (Array.isArray(data) || data.likes || data[0]?.likes)) {
      const userID = req.userId;
      data = addIsLikedToPosts(data, userID);
    }
    return originalJson.call(this, data);
  };
  next();
};