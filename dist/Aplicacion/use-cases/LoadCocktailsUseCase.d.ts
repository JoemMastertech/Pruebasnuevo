export default LoadCocktailsUseCase;
declare class LoadCocktailsUseCase {
    constructor(cocktailRepository: any, options?: {});
    repository: any;
    cacheTime: any;
    enableCache: boolean;
    cache: {
        data: null;
        timestamp: number;
    };
    loading: boolean;
    execute(forceRefresh?: boolean): Promise<any>;
    clearCache(): void;
    _isCacheValid(now?: number): null;
}
//# sourceMappingURL=LoadCocktailsUseCase.d.ts.map