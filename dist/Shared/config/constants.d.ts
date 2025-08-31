export namespace BUSINESS_RULES {
    let MAX_DRINK_COUNT: number;
    let MAX_JUICE_COUNT: number;
    let MIN_ORDER_AMOUNT: number;
    let MAX_ORDER_AMOUNT: number;
    let JAGER_MULTIPLIER: number;
    let JAGER_EXCEPTION_DRINKS: string[];
    let LOW_STOCK_THRESHOLD: number;
    let OUT_OF_STOCK_THRESHOLD: number;
    let DEFAULT_PRICE: number;
    let PRICE_PRECISION: number;
}
export namespace API_ENDPOINTS {
    let COCKTAILS: string;
    let ORDERS: string;
    let PRODUCTS: string;
    let SPIRITS: string;
    let FOOD: string;
}
export namespace CACHE_KEYS {
    let COCKTAILS_1: string;
    export { COCKTAILS_1 as COCKTAILS };
    let PRODUCTS_1: string;
    export { PRODUCTS_1 as PRODUCTS };
    export let USER_PREFS: string;
    export let ORDER_HISTORY: string;
    let SPIRITS_1: string;
    export { SPIRITS_1 as SPIRITS };
    let FOOD_1: string;
    export { FOOD_1 as FOOD };
}
export namespace CACHE_CONFIG {
    let DEFAULT_TTL: number;
    let LONG_TTL: number;
    let SHORT_TTL: number;
    let USER_PREFS_TTL: number;
    let MAX_CACHE_SIZE: number;
}
export namespace SYNC_CONFIG {
    let BACKGROUND_SYNC_INTERVAL: number;
    let IMMEDIATE_LOAD: boolean;
    let AUTO_UPDATE_ENABLED: boolean;
    let RETRY_FAILED_SYNC: boolean;
    let MAX_SYNC_RETRIES: number;
    let SYNC_RETRY_DELAY: number;
}
export namespace UI_TIMING {
    let WELCOME_DURATION: number;
    let LOGO_DURATION: number;
    let CATEGORY_DURATION: number;
    let FADE_DURATION: number;
    let MODAL_FADE_DURATION: number;
    let TOOLTIP_DELAY: number;
    let DEBOUNCE_DELAY: number;
    let LOADING_MIN_DURATION: number;
    let SUCCESS_MESSAGE_DURATION: number;
    let ERROR_MESSAGE_DURATION: number;
}
export namespace PRODUCT_CATEGORIES {
    let COCKTAILS_2: string;
    export { COCKTAILS_2 as COCKTAILS };
    export let BEVERAGES: string;
    export let LIQUORS: string;
    export let BEERS: string;
    export let PIZZAS: string;
    export let WINGS: string;
    export let SOUPS: string;
    export let SALADS: string;
    export let MEATS: string;
    export let COFFEE: string;
    export let DESSERTS: string;
    export let VODKA: string;
    export let GINEBRA: string;
    export let RON: string;
    export let TEQUILA: string;
    export let WHISKY: string;
    export let BRANDY: string;
    export let JAGERMEISTER: string;
}
export namespace DRINK_TYPES {
    let ALCOHOLIC: string;
    let NON_ALCOHOLIC: string;
    let JUICES: string[];
    let WATERS: string[];
    let SOFT_DRINKS: string[];
}
export namespace VALIDATION {
    let EMAIL_PATTERN: RegExp;
    let PHONE_PATTERN: RegExp;
    let MIN_NAME_LENGTH: number;
    let MAX_NAME_LENGTH: number;
    let MIN_PASSWORD_LENGTH: number;
    let MAX_COMMENT_LENGTH: number;
    let MAX_DESCRIPTION_LENGTH: number;
    let MIN_PRICE: number;
    let MAX_PRICE: number;
    let MIN_QUANTITY: number;
    let MAX_QUANTITY: number;
    let PRICE_PATTERN: RegExp;
    let ID_PATTERN: RegExp;
    let REQUIRED_PRODUCT_FIELDS: string[];
    let REQUIRED_ORDER_FIELDS: string[];
}
export namespace MESSAGES {
    namespace SUCCESS {
        let PRODUCT_ADDED: string;
        let ORDER_PLACED: string;
        let DATA_SAVED: string;
    }
    namespace ERRORS {
        let PRODUCT_NOT_FOUND: string;
        let INVALID_QUANTITY: string;
        let MAX_DRINKS_EXCEEDED: string;
        let MISSING_ELEMENT: string;
        let NETWORK_ERROR: string;
        let VALIDATION_FAILED: string;
    }
    namespace WARNINGS {
        let LOW_STOCK: string;
        let UNSAVED_CHANGES: string;
        let SLOW_CONNECTION: string;
    }
    namespace INFO {
        let LOADING: string;
        let PROCESSING: string;
        let PLEASE_WAIT: string;
    }
}
export namespace NETWORK {
    let DEFAULT_TIMEOUT: number;
    let RETRY_TIMEOUT: number;
    let MAX_RETRIES: number;
    let RETRY_DELAY: number;
    namespace STATUS_CODES {
        let OK: number;
        let CREATED: number;
        let BAD_REQUEST: number;
        let UNAUTHORIZED: number;
        let NOT_FOUND: number;
        let SERVER_ERROR: number;
    }
}
export namespace DEBUG {
    namespace LOG_LEVELS {
        export let ERROR: string;
        export let WARN: string;
        let INFO_1: string;
        export { INFO_1 as INFO };
        export let DEBUG: string;
    }
    let ENABLE_CONSOLE_LOGS: boolean;
    let ENABLE_PERFORMANCE_MONITORING: boolean;
    let ENABLE_ERROR_REPORTING: boolean;
    let MOCK_DATA_ENABLED: boolean;
    let SKIP_VALIDATIONS: boolean;
}
export namespace API {
    let BASE_URL: string;
    let TIMEOUT: number;
    namespace ENDPOINTS {
        let PRODUCTS_2: string;
        export { PRODUCTS_2 as PRODUCTS };
        let ORDERS_1: string;
        export { ORDERS_1 as ORDERS };
        export let CATEGORIES: string;
        export let HEALTH: string;
    }
    let DEFAULT_HEADERS: {
        'Content-Type': string;
        Accept: string;
    };
}
export namespace PERFORMANCE {
    let ENABLE_LAZY_LOADING: boolean;
    let LAZY_LOADING_THRESHOLD: number;
    let ENABLE_MEMOIZATION: boolean;
    let CACHE_SIZE: number;
    let CACHE_TTL: number;
    let ENABLE_DEBOUNCING: boolean;
    let DEFAULT_DEBOUNCE_DELAY: number;
    let ENABLE_CODE_SPLITTING: boolean;
    let CHUNK_SIZE_LIMIT: number;
}
export namespace UI {
    let DEFAULT_THEME: string;
    let AVAILABLE_THEMES: string[];
    let ENABLE_ANIMATIONS: boolean;
    let ANIMATION_DURATION: number;
    let SIDEBAR_WIDTH: number;
    let HEADER_HEIGHT: number;
    namespace BREAKPOINTS {
        let MOBILE: number;
        let TABLET: number;
        let DESKTOP: number;
    }
    let DEBUG_MODE: boolean;
    let SHOW_PERFORMANCE_METRICS: boolean;
}
export namespace TESTING {
    let ENABLE_TESTING: boolean;
    let TEST_TIMEOUT: number;
    let ENABLE_MOCK_DATA: boolean;
    let MOCK_DELAY: number;
    let E2E_TIMEOUT: number;
    let SCREENSHOT_ON_FAILURE: boolean;
    let ENABLE_COVERAGE: boolean;
    let COVERAGE_THRESHOLD: number;
}
declare namespace _default {
    export { BUSINESS_RULES };
    export { UI_TIMING };
    export { PRODUCT_CATEGORIES };
    export { DRINK_TYPES };
    export { VALIDATION };
    export { MESSAGES };
    export { NETWORK };
    export { DEBUG };
    export { API };
    export { PERFORMANCE };
    export { UI };
    export { TESTING };
}
export default _default;
//# sourceMappingURL=constants.d.ts.map