module.exports = (req, res, next) => {
    if (!req.isAuthenticated()){
        const err = new Error('Forbidden or No Permission to Access');
        err.status = 403;
        return next(err);
    }
    return next();
};