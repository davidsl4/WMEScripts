declare class Waze_Feature_Vector<T> { // inherits Waze.Model.Object to implement
    static readonly CLASS_NAME: string;

    type: string;

    changeID(id: number): void;
    clone(): T;
    getAttribute(name: string): any;
    getAttributes(): any;
    getCreatedBy(): number;
    getCreatedOn(): number;
    getFeatureAttributes(): any;
    getID(): number;
    getPermissions(): any;
    getUpdatedBy(): number;
    getUpdatedOn(): number;
    initiailzeAttributes(e, t, n); // TODO
    merge(e); // TODO
    setAttribute(name: string, value: any): void;
    setAttributes(e): void;
    setID(id: number): void;
    wasCreatedBy(userID: number): boolean;
}