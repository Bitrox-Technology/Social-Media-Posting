import { I18n } from "i18n";

const i18n = new I18n({
    locales: ["en", "sp"],
    defaultLocale: 'en',
    directory: "./messages",
    objectNotation: true,
    register: global
})

export default i18n