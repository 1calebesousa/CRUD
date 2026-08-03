function flashMiddleware(req, res, next) {
    res.flash = (type, message) => {
        const flashData = { type, message };
        res.cookie('flash_message', JSON.stringify(flashData), { path: '/' });
    };

    if (req.cookies && req.cookies.flash_message) {
        try {
            res.locals.flash = JSON.parse(req.cookies.flash_message);
        } catch (e) {
            res.locals.flash = null;
        }
        res.clearCookie('flash_message', { path: '/' });
    } else {
        res.locals.flash = null;
    }
    next();
}

module.exports = flashMiddleware;
