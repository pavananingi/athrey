/*
  This middleware takes the language from the url
  
*/


const setLanguage = (req, res, next) => {
    if (req.params.hasOwnProperty('language')) {
        res.locals.lang = req.params.language;
        if (res.locals.lang !== 'en' && res.locals.lang !== 'de') {
            res.locals.lang = 'de';
        }
    } else {
        res.locals.lang = 'de';
    }
    return next();
}

module.exports = setLanguage;
