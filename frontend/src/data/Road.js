import {HnHMaxZoom} from "../utils/LeafletCustomTypes";
import * as L from "leaflet";

export class Road {
    constructor(roadData) {
        this.id = roadData.id;
        this.map = roadData.map;
        this.name = roadData.name;
        this.pointA = roadData.pointA;
        this.pointB = roadData.pointB;
        this.line = false;
        this.outline = false;
    }

    remove(mapview) {
        if (this.outline) {
            mapview.map.removeLayer(this.outline);
            this.outline.remove();
            this.outline = null;
        }
        if (this.line) {
            this.line.unbindTooltip();
            mapview.map.removeLayer(this.line);
            this.line.remove();
            this.line = null;
        }
    }

    add(mapview) {
        let a = mapview.map.unproject([this.pointA.x, this.pointA.y], HnHMaxZoom);
        let b = mapview.map.unproject([this.pointB.x, this.pointB.y], HnHMaxZoom);
        this.outline = L.polyline([a, b], {color: "#000000", weight: 6, opacity: 0.9, interactive: false});
        this.outline.addTo(mapview.roadLayer);
        this.line = L.polyline([a, b], {color: "#FFFFFF", weight: 3, opacity: 1});
        this.line.road = this;
        this.line.bindTooltip("<div style='color:#FDB800;'><b>" + this.name + "</b></div>", {
            permanent: false,
            sticky: true,
            opacity: 0.9
        });
        this.line.addTo(mapview.roadLayer);
        this.line.on("contextmenu", this.callContextCallback.bind(this));
    }

    setContextMenu(callback) {
        this.onContext = callback;
    }

    callContextCallback(e) {
        if (this.onContext != null) {
            this.onContext(e);
        }
    }
}
