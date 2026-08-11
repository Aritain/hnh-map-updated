import {HnHMaxZoom, getCustomMarkerIcon} from "../utils/LeafletCustomTypes";
import * as L from "leaflet";

export class CustomMarker {
    constructor(markerData) {
        this.id = markerData.id;
        this.map = markerData.map;
        this.name = markerData.name;
        this.x = markerData.x;
        this.y = markerData.y;
        this.color = markerData.color || 'white';
        this.marker = false;
        this.onContext = null;
        this.text = this.name;
        this.value = this.id;
    }

    remove(mapview) {
        if (this.marker) {
            this.marker.unbindTooltip();
            mapview.map.removeLayer(this.marker);
            this.marker.remove();
            this.marker = null;
        }
    }

    add(mapview) {
        let icon = getCustomMarkerIcon(this.color);
        let position = mapview.map.unproject([this.x, this.y], HnHMaxZoom);
        this.marker = L.marker(position, {icon: icon, riseOnHover: true});
        this.marker.marker = this;
        this.marker.bindTooltip("<div style='color:#FFF;'><b>" + this.name + "</b></div>", {
            permanent: true,
            direction: 'top',
            sticky: false,
            opacity: 0.9
        });
        this.marker.addTo(mapview.markerLayer);
        this.marker.on("contextmenu", this.callContextCallback.bind(this));
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
