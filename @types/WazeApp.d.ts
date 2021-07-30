interface Config_ShownByDefaultBase {
    shownByDefault: boolean
}
interface Config_AllowEditingBase {
    allowEditing: boolean
}

interface Config_InitialPosition {
    lon: number,
    lat: number,
    initialZoom: number
}
interface Config {
    api_base: string;
    big__junctions: {
        minRank: number,
        enable: true
    },
    cameras: Config_ShownByDefaultBase,
    closures: Config_ShownByDefaultBase,
    draggable: {
        minDragZoom: number
    },
    houseNumbers: Config_ShownByDefaultBase & Config_AllowEditingBase & {
        minEditZoom: number
    },
    liveMap: {
        zoom_offset: number,
        max_zoom: number, 
        url: string
    },
    login: {
        paths: {
            create: string,
            destroy: string,
            email_verification: string,
            get: string
        }
    },
    map: {
        initialPosition: {
            il: Config_InitialPosition,
            row: Config_InitialPosition,
            usa: Config_InitialPosition
        },
        projection: {
            remote: string,
            local: string
        }
    },
    openlayers: {
        img_path: string
    },
    paths: {
        archive: string,
        archiveSessions: string,
        auth: string,
        cityExists: string,
        configurationInfo: string,
        elementHistory: string,
        features: string,
        houseNumbers: string,
        issues: string,
        issuesTrackerSearchList: string,
        issuesTrackerSearchMap: string,
        logger: string,
        mapCommentConversation: string,
        mapCommentFollow: string,
        mteDetails: string,
        mtePublish: string,
        mteReady: string,
        notifications: string,
        problemDetails: string,
        updateRequestComments: string,
        updateRequestFollow: string,
        updateRequestSessions: string,
        version: string
    },
    place_updates: {
        focusZoom: number
    },
    problems: {
        maxDetailsZoom: number,
        minDetailsZoom: number
    },
    restrictions: Config_AllowEditingBase,
    search: {
        server: string,
        resultZoom: number,
        options: {
            origin: string
        }
    },
    speed_limit: {
        enabled: boolean
    },
    tts: {
        url: string,
        options: {
            content_type: string,
            lat: number,
            lon: number,
            protocol: number,
            sessionid: number,
            skipCache: boolean,
            type: string,
            validate_data: boolean,
            version: number
        },
        default_locale: {
            tts: string,
            locale: string
        }
    },
    units: {
        lonLatPrecision: number
    },
    user_drive: {
        arrowsMinDisplayZoom: number,
        gutterMinDisplayZoom: number,
        initialZoom: number,
        instructionsMinDisplayZoom: number,
        weightMinDisplayZoom: number
    },
    user_editing_enabled: boolean,
    user_profile: {
        enabled: boolean,
        url: string
    },
    venues: {
        categories: string[],
        image_bucket_url: string,
        subcategories: { [key: string]: string[] },
    }
}


declare interface WazeApp {
    Config: Config,
    Rule: any,
    accelerators, // TODO
    app, // TODO
    changesLogController, // TODO
    commands, // TODO
    controller, // TODO
    editingMediator, // TODO
    layerSwitchController, // TODO
    loginManager, // TODO
    map, // TODO
    model, // TODO
    prefs, // TODO
    reqres, // TODO
    saveController, // TODO
    selectionManager, // TODO
    snapshotManager, // TODO
    streetViewController, // TODO
    togglerTree, // TODO
    vent, // TODO
    version: string
}