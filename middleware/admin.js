
module.exports = function admin(req, res, next){

    // Status 403 means user has a token but doesn't have administrative privilleges (!isAdmin)
    if(!req.user.isAdmin) return res.status(403).send("Access Denied")

    // if user isAdmin, pass controll to the next middleware
    next();
}