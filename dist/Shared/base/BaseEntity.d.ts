export class BaseEntity {
    constructor(data?: {});
    createdAt: string;
    entityType: string;
    validate(): void;
    getRequiredFields(): string[];
    validateSpecific(): void;
    toPlainObject(): this;
    toJSON(): string;
    clone(): any;
    equals(other: any): boolean;
    toString(): string;
}
export default BaseEntity;
//# sourceMappingURL=BaseEntity.d.ts.map