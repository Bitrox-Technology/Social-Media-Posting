import { I18n } from "i18n";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const i18n = new I18n({
    locales: ["en", "sp"],
    defaultLocale: 'en',
    directory: join(__dirname, '../messages'),
    objectNotation: true,
    register: global
})

export default i18n