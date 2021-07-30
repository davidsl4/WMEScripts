interface Waze_Feature_Vector_Segment_Attributes {
    allowNoDirection: boolean;
    createdBy: number;
    createdOn: number;
    crossroadID; // TODO
    flags: number;
    fromCrossroads: number[];
    fromNodeID: number;
    fwdDirection: boolean;
    fwdFlags: number;
    fwdLaneCount: number;
    fwdMaxSpeed: number;
    fwdMaxSpeedUnverified: number;
    fwdToll: boolean;
    fwdTurnsLocked: boolean;
    geometry; // TODO
    hasClosures: boolean;
    hasHNs: boolean;
    id: number;
    junctionID: number;
    length: number;
    level: number;
    lockRank: number;
    parkingRestrictions: any[]; // TODO
    permissions: number;
    pickupRestrictions: any[]; // TODO
    primaryStreetID: number;
    rank: number;
    restrictions: any[]; // TODO
    revDirection: boolean;
    revFlags: number;
    revLaneCount: number;
    revMaxSpeed: number;
    revMaxSpeedUnverified: number;
    revToll: boolean;
    revTurnsLocked: boolean;
    roadType: Waze_Feature_Vector_Segment_RoadType;
    routingRoadType; // TODO
    separator: boolean;
    streetIDs: number[];
    toCrossroads: number[];
    toNodeID: number;
    updatedBy: number;
    updatedOn: number;
    validated: boolean;
    virtualNodeIDs: number[];
}

declare enum Waze_Feature_Vector_Segment_RoadType {
    Street = 1,
    PrimaryStreet = 2,
    Freeway = 3,
    Ramp = 4,
    WalkingTrail = 5,
    MajorHWY = 6,
    MinorHWY = 7,
    Offroad = 8,
    PedestrianBoardwalk = 10,
    Ferry = 15,
    Stariway = 16,
    PrivateRoad = 17,
    Railroad = 18,
    Runway = 19,
    ParkingLot = 20,
    NarrowStreet = 22
}

declare class Waze_Feature_Vector_Segment extends Waze_Feature_Vector<Waze_Feature_Vector_Segment> {
    static readonly CLASS_NAME: string;

    attributes: Waze_Feature_Vector_Segment_Attributes;
    fid: number;
    id: number;
    model; // TODO
    outOfScope: boolean;
    permissionFlags: any[];
    persistent: boolean;
    selected: boolean;
    state: number;
    type: "segment";
    geometry: any;

    areTurnsLocked(e); // TODO
    canEditAvreageSpeedCamera(): boolean;
    canEditClosures(): boolean;
    canEditConnections(): boolean;
    canEditHighlightsReminder(): boolean;
    canEditHouseNumbers(): boolean;
    canEditLanes(): boolean;
    canEditRoutingRoadTypes(): boolean;
    canForceHouseNumbers(): boolean;
    canUserSetDefaultRank(): boolean;
    clone(): Waze_Feature_Vector_Segment;
    copyAttributes(e); // TODO
    createLockTurnsAction(e); // TODO
    equals(e): boolean; // TODO
    getAddress(); // TODO
    getArrowPoints(e, t, n); // TODO
    getBidiDrivingRestrictions(); // TODO
    getCenter(); // TODO
    getConnectedSegments(e); // TODO
    getConnectedSegmentsByDirection(e); // TODO
    getDirection(); // TODO
    getDrivingRestrictionCount(): number;
    getDrivingRestrictions(); // TODO
    getEndPoints(); // TODO
    getFlagAttribute(e); // TODO
    getFlagAttribtues(); // TODO
    getForwardDrivingRestrictions(); // TODO
    getFromNode(); // TODO
    getFwdHeading(); // TODO
    getFwdLanes(); // TODO
    getLaneCount(): number;
    getLockRank(): number;
    getNodeAttribute(e); // TODO
    getNodeByDirection(e); // TODO
    getOtherNode(); // TODO
    getPickupRestrictionCount(): number;
    getPickupRestrictions(); // TODO
    getPrimaryStreetID(): number;
    getRevDirection(); // TODO
    getRevHeading(); // TODO
    getRevLanes(); // TODO
    getReverseDrivingRestrictions(); // TODO
    getRoadType(): Waze_Feature_Vector_Segment_RoadType;
    getRoundabout(); // TODO
    getToNode(); // TODO
    getTurnsLockedAttribute(e); // TODO
    getVirtualNodes(); // TODO
    hasBeacons(): boolean;
    hasClosures(): boolean;
    hasFromBigJunction(): boolean;
    hasFromNode(): boolean;
    hasNonEmptyStreet(): boolean;
    hasRestrictions(): boolean;
    hasToBigJunction(): boolean;
    hasToNode(): boolean;
    isBigJunctionShort(): boolean;
    isConnectedToNode(e): boolean; // TODO
    isDrivable(): boolean;
    isFromNode(e): boolean; // TODO
    isHighway(): boolean;
    isInBigJunction(): boolean;
    isInRoundabout(): boolean;
    isLanesEnabled(): boolean;
    isLockedByHigherRank(): boolean;
    isOneWay(): boolean;
    isPoint(): boolean;
    isRoutable(): boolean;
    isToNode(e): boolean; // TODO
    isTollRoad(): boolean;
    isTurnAllowed(e, t): boolean; // TODO
    isVirtuallyConnectedToNode(e): boolean; // TODO
    isWalkingRoadType(): boolean;
    isWalkingTrail(): boolean;
    lockTurns(e); // TODO
    merge(e); // TODO
    setSelected(selected: boolean);
    setTurnsLock(e, t); // TODO
    supportsVirtualNodes(): boolean;
}