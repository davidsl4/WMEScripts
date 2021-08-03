const Vertex = () => require("Waze/Model/Graph/Vertex");

export enum CanCloneJunctionBoxResult {
    Yes = 0,
    Locked = 1,
    SegmentsLocked = 2,
    TurnFeatureLocked = 3,
    PropertiesCopied = 4,
}

export function getJunctionBoxEntrances(jb): Waze.SegmentFeature[] {
    return jb.attributes.segIDs.map(id => {
        let seg = W.model.segments.getObjectById(id);
        let isForward = seg.attributes.toCrossroads.includes(jb.attributes.id);
        let node = isForward ? seg.getToNode() : seg.getFromNode();
        return node.attributes.segIDs.filter(id => {
            let seg = W.model.segments.getObjectById(id);
            let containsTo = seg.attributes.toCrossroads.includes(jb.attributes.id);
            let containsFrom = seg.attributes.fromCrossroads.includes(jb.attributes.id);

            let drivableForward = seg.attributes.fwdDirection;
            let drivableBackward = seg.attributes.revDirection;

            // return only if the segment is connected to and drivable forward, or connected from and drivable backwards, but not both
            let notBothConnected = (containsTo && !containsFrom) || (!containsTo && containsFrom);
            return (drivableForward && containsTo) || (drivableBackward && containsFrom) && notBothConnected;
        });
    }).flatMap((id: number) => W.model.segments.getObjectById(id)) as Waze.SegmentFeature[];
}

export function getJunctionBoxExits(jb): Waze.SegmentFeature[] {
    return jb.attributes.segIDs.map(id => {
        let seg = W.model.segments.getObjectById(id);
        let isForward = seg.attributes.toCrossroads.includes(jb.attributes.id);
        let node = isForward ? seg.getToNode() : seg.getFromNode();
        return node.attributes.segIDs.filter(id => {
            let seg = W.model.segments.getObjectById(id);
            let containsTo = seg.attributes.toCrossroads.includes(jb.attributes.id);
            let containsFrom = seg.attributes.fromCrossroads.includes(jb.attributes.id);

            let drivableForward = seg.attributes.fwdDirection;
            let drivableBackward = seg.attributes.revDirection;

            // return only if the segment is connected to and drivable backwards (reverse), or connected from and drivable forwards, but not both
            let notBothConnected = (containsTo && !containsFrom) || (!containsTo && containsFrom);
            return (drivableBackward && containsTo) || (drivableForward && containsFrom) && notBothConnected;
        });
    }).flatMap((id: number) => W.model.segments.getObjectById(id)) as Waze.SegmentFeature[];
}

export function getJunctionBoxConnectedSegments(jb, olderJbId: number): { entrances: Waze.SegmentFeature[], exits: Waze.SegmentFeature[] } {
    function getAllLinkedSegments() {
        // loop over all the segments connected to the junction box
        // and map them to flatten segments from both to and from nodes
        let segIDs = jb.attributes.segIDs;
        let segs = segIDs.map(id => {
            let seg = W.model.segments.getObjectById(id) as Waze.SegmentFeature;
            return [ seg.getToNode().attributes.segIDs, seg.getFromNode().attributes.segIDs ].flat();
        });
        // flat the segments from both to and from nodes
        segs = segs.flat();
        // distinct the duplicate entries
        segs = segs.filter((id, pos, self) => self.indexOf(id) === pos);
        return segs;
    }

    let segments = { entrances: [], exits: [] };

    function checkBySegmentId(id: number) {
        let seg = W.model.segments.getObjectById(id);
        let containsTo = seg.attributes.toCrossroads.includes(jb.attributes.id) || seg.attributes.toCrossroads.includes(olderJbId) || seg.attributes.crossroadID === jb.attributes.id;
        let containsFrom = seg.attributes.fromCrossroads.includes(jb.attributes.id) || seg.attributes.fromCrossroads.includes(olderJbId) || seg.attributes.crossroadID === jb.attributes.id;

        let drivableForward = seg.attributes.fwdDirection;
        let drivableBackward = seg.attributes.revDirection;

        let notBothConnected = (containsTo && !containsFrom) || (!containsTo && containsFrom);

        // only if not both connected
        // if "to" node is connected and drivable backwards, or "from" node is connected and drivable forwards, then add it to the exit list
        // if "to" node is connected and drivable forwards, or "from" node is connected and drivable backwards, then add it to the entrance list

        if (notBothConnected) {
            if (containsFrom) {
                if (drivableBackward)
                    segments.entrances.push(seg);
                if (drivableForward)
                    segments.exits.push(seg);
            }
            if (containsTo) {
                if (drivableForward)
                    segments.entrances.push(seg);
                if (drivableBackward)
                    segments.exits.push(seg);
            }
        }
    }

    /*jb.attributes.segIDs.forEach(id => {
        function checkNode(node) {
            node.attributes.segIDs.forEach(id => {
                let seg = W.model.segments.getObjectById(id);
                let containsTo = seg.attributes.toCrossroads.includes(jb.attributes.id);
                let containsFrom = seg.attributes.fromCrossroads.includes(jb.attributes.id);

                let drivableForward = seg.attributes.fwdDirection;
                let drivableBackward = seg.attributes.revDirection;

                let notBothConnected = (containsTo && !containsFrom) || (!containsTo && containsFrom);

                // only if not both connected
                // if "to" node is connected and drivable backwards, or "from" node is connected and drivable forwards, then add it to the exit list
                // if "to" node is connected and drivable forwards, or "from" node is connected and drivable backwards, then add it to the entrance list

                if (notBothConnected) {
                    if (containsFrom) {
                        if (drivableBackward)
                            segments.entrances.push(seg);
                        if (drivableForward)
                            segments.exits.push(seg);
                    }
                    if (containsTo) {
                        if (drivableForward)
                            segments.entrances.push(seg);
                        if (drivableBackward)
                            segments.exits.push(seg);
                    }

                    // if ((containsTo && drivableBackward) || (containsFrom && drivableForward)) {
                    //     segments.exits.push(seg);
                    // }
                    // else if ((containsTo && drivableForward) || (containsFrom && drivableBackward)) {
                    //     segments.entrances.push(seg);
                    // }
                }
            });
        }

        let seg = W.model.segments.getObjectById(id);
        
        checkNode(seg.getToNode());
        checkNode(seg.getFromNode());
    });*/

    getAllLinkedSegments().forEach(checkBySegmentId);

    segments.entrances = segments.entrances.filter((seg, pos) => {
        for (let i = 0; i < segments.entrances.length; i++) {
            if (segments.entrances[i].attributes.id === seg.attributes.id) return i === pos;
        }
        return true;
    });

    segments.exits = segments.exits.filter((seg, pos) => {
        for (let i = 0; i < segments.exits.length; i++) {
            if (segments.exits[i].attributes.id === seg.attributes.id) return i === pos;
        }
        return true;
    });

    return segments;
}

export function getJunctionBoxTurnsFrom(jb, segment: Waze.SegmentFeature): any[] {
    let isForward = segment.attributes.toCrossroads.includes(jb.attributes.id);
    return jb.getTurnsFrom(isForward ? Vertex().forwardOf(segment.attributes.id) : Vertex().reverseOf(segment.attributes.id));
}

export function getAllJunctionBoxTurns(jb, entrances: Waze.SegmentFeature[]): any[] {
    return entrances.flatMap(seg => getJunctionBoxTurnsFrom(jb, seg));
}

export function getPossibleTurnsBetween(jb, entrance: Waze.SegmentFeature, exit: Waze.SegmentFeature): any[] {
    let entranceIsForward = entrance.attributes.toCrossroads.includes(jb.attributes.id);
    let exitIsForward = exit.attributes.fromCrossroads.includes(jb.attributes.id);
    let entranceVertex = entranceIsForward ? Vertex().forwardOf(entrance.attributes.id) : Vertex().reverseOf(entrance.attributes.id);
    let exitVertex = exitIsForward ? Vertex().forwardOf(exit.attributes.id) : Vertex().reverseOf(exit.attributes.id);
    return jb.getPossibleTurnsBetween(entranceVertex, exitVertex);
}

export function canCloneJunctionBox(jb, jbEntrances?: Waze.SegmentFeature[], jbTurns?: any[]): CanCloneJunctionBoxResult {
    // return Locked if the jb rank attribute is higher than the current user rank
    if (jb.attributes.rank > W.loginManager.user.rank) {
        return CanCloneJunctionBoxResult.Locked;
    }

    if (!jbEntrances) jbEntrances = getJunctionBoxEntrances(jb);

    // return SegLocked if any of the jb entrances are locked
    if (jbEntrances.some(seg => seg.getLockRank() > W.loginManager.user.rank)) {
        return CanCloneJunctionBoxResult.SegmentsLocked;
    }

    let jbTurnsAnyToAny = jbTurns || getAllJunctionBoxTurns(jb, jbEntrances);

    // check if any of the jb turns have guidance instructions and they are locked for the current user
    // if so return TurnFeatureLocked
    if (jbTurnsAnyToAny.some(turn => {
        const fromSegment = W.model.segments.getObjectById(turn.fromVertex.segmentID);
        const toSegment = W.model.segments.getObjectById(turn.toVertex.segmentID);
        const containsTurnGuidance = turn.getTurnData().hasTurnGuidance();
        const turnGuidanceLockRank = Math.max(
            fromSegment.getAddress().getCountry().allowEditingTurnGuidanceRank,
            toSegment.getAddress().getCountry().allowEditingTurnGuidanceRank
        );

        // return true if the turn has a turn guidance and it is locked for the current user
        return containsTurnGuidance && turnGuidanceLockRank > W.loginManager.user.rank;
    })) {
        return CanCloneJunctionBoxResult.TurnFeatureLocked;
    }

    // return Yes if all checks passed
    return CanCloneJunctionBoxResult.Yes;
}