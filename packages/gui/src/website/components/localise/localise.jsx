import React from "react";
import { detectLocale } from "../../../lib/detect-locale";

// Load all translation JSON files dynamically from the site-translations directory.
const translationContext = require.context(
    "../../site-translations",
    false,
    /\.json$/
);

const translations = {};
translationContext.keys().forEach(key => {
    const locale = key.replace(/^\.\/(.*)\.json$/, "$1");
    translations[locale] = translationContext(key);
});

const supportedLocales = Object.keys(translations);

// Utility to handle strings/components interpolation
const interpolate = (text, values) => {
    // Split the text by all placeholders
    const parts = [text];
    Object.keys(values).forEach(key => {
        const regex = new RegExp(`{${key}}`, "g");
        let newParts = [];
        parts.forEach(part => {
            if (typeof part === "string") {
                const split = part.split(regex);
                split.forEach((chunk, i) => {
                    newParts.push(chunk);
                    if (i < split.length - 1) newParts.push(values[key]);
                });
            } else {
                newParts.push(part);
            }
        });
        parts.splice(0, parts.length, ...newParts);
    });
    return parts;
};

const getTranslation = (id, values = {}) => {
    const locale = detectLocale(supportedLocales);
    const localeTranslations = translations[locale] || translations.en;
    let translationObject = localeTranslations[id];
    if (!translationObject) {
        translationObject = translations.en[id];
    }
    const text = translationObject?.text || id;
    return interpolate(text, values);
};

export const Localise = ({ id, values = {} }) => {
    const parts = getTranslation(id, values);
    return <>{parts}</>;
};

export const localise = (id, values = {}) => {
    const parts = getTranslation(id, values);

    // For the helper, we can optionally allow raw HTML
    // Warning: this can be unsafe if values come from untrusted sources
    return parts
        .map(part =>
            typeof part === "string" || React.isValidElement(part)
                ? part
                : String(part)
        )
        .join("");
};

export const setHtmlLang = () => {
    document.documentElement.lang = detectLocale(supportedLocales);
};

export default Localise;
