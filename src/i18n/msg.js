const enLang = require('./en.json');
const deLang = require('./de.json');
const translate = (lang = 'de', key = 'unknown_key') => {
    switch (lang) {
        case 'de':
            return deLang[key];
        case 'en':
            return enLang[key];
        default:
            console.log('Unknown language');
            break;
    }

}

module.exports = translate;