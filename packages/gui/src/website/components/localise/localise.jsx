import React from "react";
import { detectLocale } from "../../../lib/detect-locale";

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

export const Localise = ({ id, values = {} }) => {
    const locale = detectLocale(supportedLocales);
    const localeTranslations = translations[locale] || translations.en;
    const text = localeTranslations[id] || id;

    return <>{interpolate(text, values)}</>;
};

export const localise = (id, values = {}) => {
    const locale = detectLocale(Object.keys(translations));
    const localeTranslations = translations[locale] || translations.en;
    const text = localeTranslations[id] || id;

    // For the helper, we can optionally allow raw HTML
    // Warning: this can be unsafe if values come from untrusted sources
    const parts = interpolate(text, values);
    return parts
        .map((part, i) =>
            typeof part === "string"
                ? part
                : React.isValidElement(part)
                  ? part
                  : String(part)
        )
        .join("");
};

export const setHtmlLang = () => {
    document.documentElement.lang = detectLocale(Object.keys(translations));
};

export default Localise;
