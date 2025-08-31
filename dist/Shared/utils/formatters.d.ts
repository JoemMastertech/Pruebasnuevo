export function formatPrice(price: string | number, presentation?: string): string;
export function formatIngredients(ingredients: string | any[]): string;
export function formatProductName(name: string): string;
export function formatTitle(text: string): string;
export function cleanText(text: string): string;
export function formatNumber(num: number, decimals?: number): string;
export default Formatters;
declare namespace Formatters {
    export { formatPrice };
    export { formatIngredients };
    export { formatProductName };
    export { formatTitle };
    export { cleanText };
    export { formatNumber };
}
//# sourceMappingURL=formatters.d.ts.map