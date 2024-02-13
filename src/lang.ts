import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import english from './lang/en.json';
import spanish from './lang/es.json';
import brazilianPortuguese from './lang/pt.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: english },
            es: { translation: spanish },
            pt: { translation: brazilianPortuguese }
        },
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false,
        },
    });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const langParam = urlParams.get('lang');

if (langParam && ['en', 'es', 'pt'].includes(langParam)) {
    i18n.changeLanguage(langParam);
}

export default i18n;