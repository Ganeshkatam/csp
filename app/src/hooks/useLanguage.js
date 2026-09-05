import { useAppContext } from '../app/providers';

export function useLanguage() {
    const { lang, setLang, toggleLang, t } = useAppContext();
    return { lang, setLang, toggleLang, t };
}

export default useLanguage;
