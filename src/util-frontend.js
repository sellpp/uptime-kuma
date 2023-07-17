import dayjs from "dayjs";
import timezones from "timezones-list";
import { localeDirection, currentLocale } from "./i18n";

/**
 * Returns the offset from UTC in hours for the current locale.
 * @returns {number} The offset from UTC in hours.
 *
 * Generated by Trelent
 */
function getTimezoneOffset(timeZone) {
    const now = new Date();
    const tzString = now.toLocaleString("en-US", {
        timeZone,
    });
    const localString = now.toLocaleString("en-US");
    const diff = (Date.parse(localString) - Date.parse(tzString)) / 3600000;
    const offset = diff + now.getTimezoneOffset() / 60;
    return -offset;
}

/**
* Returns a list of timezones sorted by their offset from UTC.
* @param {Object[]} timezones An array of timezone objects.
* @returns {Object[]} A list of the given timezones sorted by their offset from UTC.
*
* Generated by Trelent
*/
export function timezoneList() {
    let result = [];

    for (let timezone of timezones) {
        try {
            let display = dayjs().tz(timezone.tzCode).format("Z");

            result.push({
                name: `(UTC${display}) ${timezone.tzCode}`,
                value: timezone.tzCode,
                time: getTimezoneOffset(timezone.tzCode),
            });
        } catch (e) {
            // Skipping not supported timezone.tzCode by dayjs
        }
    }

    result.sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        }

        if (b.time > a.time) {
            return -1;
        }

        return 0;
    });

    return result;
}

/** Set the locale of the HTML page */
export function setPageLocale() {
    const html = document.documentElement;
    html.setAttribute("lang", currentLocale() );
    html.setAttribute("dir", localeDirection() );
}

/**
 * Get the base URL
 * Mainly used for dev, because the backend and the frontend are in different ports.
 * @returns {string}
 */
export function getResBaseURL() {
    const env = process.env.NODE_ENV;
    if (env === "development" && isDevContainer()) {
        return location.protocol + "//" + getDevContainerServerHostname();
    } else if (env === "development" || localStorage.dev === "dev") {
        return location.protocol + "//" + location.hostname + ":3001";
    } else {
        return "";
    }
}

export function isDevContainer() {
    return (typeof DEVCONTAINER === "number" && DEVCONTAINER === 1);
}

export function getDevContainerServerHostname() {
    // replace -3000 with -3001
    return location.hostname.replace(/-3000\.preview\.app\.github\.dev/, "-3001.preview.app.github.dev");
}

/**
 *
 * @param {} mqtt wheather or not the regex should take into account the fact that it is an mqtt uri
 * @returns RegExp The requested regex
 */
export function hostNameRegexPattern(mqtt = false) {
    // mqtt, mqtts, ws and wss schemes accepted by mqtt.js (https://github.com/mqttjs/MQTT.js/#connect)
    const mqttSchemeRegexPattern = "((mqtt|ws)s?:\\/\\/)?";
    // Source: https://digitalfortress.tech/tips/top-15-commonly-used-regex/
    const ipRegexPattern = `((^${mqtt ? mqttSchemeRegexPattern : ""}((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?$))`;
    // Source: https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
    const hostNameRegexPattern = `^${mqtt ? mqttSchemeRegexPattern : ""}([a-zA-Z0-9])?(([a-zA-Z0-9_]|[a-zA-Z0-9_][a-zA-Z0-9\\-_]*[a-zA-Z0-9_])\\.)*([A-Za-z0-9_]|[A-Za-z0-9_][A-Za-z0-9\\-_]*[A-Za-z0-9_])(\\.)?$`;

    return `${ipRegexPattern}|${hostNameRegexPattern}`;
}

/**
 * Get the tag color options
 * Shared between components
 * @returns {Object[]}
 */
export function colorOptions(self) {
    return [
        { name: self.$t("Gray"),
            color: "#4B5563" },
        { name: self.$t("Red"),
            color: "#DC2626" },
        { name: self.$t("Orange"),
            color: "#D97706" },
        { name: self.$t("Green"),
            color: "#059669" },
        { name: self.$t("Blue"),
            color: "#2563EB" },
        { name: self.$t("Indigo"),
            color: "#4F46E5" },
        { name: self.$t("Purple"),
            color: "#7C3AED" },
        { name: self.$t("Pink"),
            color: "#DB2777" },
    ];
}
