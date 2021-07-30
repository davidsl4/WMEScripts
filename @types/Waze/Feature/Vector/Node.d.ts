interface Waze_Feature_Vector_Node_Attributes {
    geometry: any; // TODO
    id: number;
    partial: boolean;
    permissions: number;
    rank: number;
    segIDs: number[];
}


declare class Waze_Feature_Vector_Node extends Waze_Feature_Vector<Waze_Feature_Vector_Node> {
    static readonly CLASS_NAME: string;

    attributes: Waze_Feature_Vector_Node_Attributes;
    fid: number;
    id: number;
    model: any; // TODO
    outOfScope: boolean;
    permissionFlags: any; // TODO
    persistent: boolean;
    state: any; // Unknown
    type: "node";
    geometry: any; // TODO

    allConnectionKeys(e); // TODO
    areAllConnectionsDisabled(): boolean;
    areAllConnectionsEnabled(): boolean;
    areConnectionsEditable(): boolean;
    arePropertiesEditable(): boolean;
    connectionsExists(): boolean;
    getAngleToSegment(e): number;
    getDirectionBetweenSegments(e, t); // TODO
    getSegmentIds(): number[];
    isAllowedToMoveNode(): boolean;
    isConnectedToBigJunction(): boolean;
    isConnectedToSegment(e); // TODO
    isDisconnected(): boolean;
    isPartial(): boolean;
    isTurnAllowedBySegDirections(e, t); // TODO
    isVirtual(): boolean;
}