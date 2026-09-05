/**
 * Schemes Feature Domain Public Interface
 * Exposes authoritative services, presentation components, hooks, and schemas.
 */

// Services and API
export {
    schemeService,
    getAllSchemes,
    getSchemeBySlugOrId,
    getSchemesByCategory,
    SCHEME_CATEGORIES,
    generateSlug
} from './api/schemes';

// Components
export { SchemeCard } from './components/SchemeCard';
export { SchemeFilters } from './components/SchemeFilters';
export { SchemeSearch } from './components/SchemeSearch';

// Hooks
export { useSchemes } from './hooks/useSchemes';

// Schemas & Validation
export {
    SCHEME_STATUS,
    REQUIRED_SCHEME_FIELDS,
    validateSchemeRecord
} from './schemas/scheme.schema';
