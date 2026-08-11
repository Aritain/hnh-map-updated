import L, {Bounds, LatLng, Point} from "leaflet"
import {getTileUrl} from "../main";

export const TileSize = 100;
export const HnHMaxZoom = 7;
export const HnHMinZoom = 1;

export const GridCoordLayer = L.GridLayer.extend({
    createTile: function (coords) {
        let element = document.createElement("div");
        element.width = TileSize;
        element.height = TileSize;
        element.classList.add("map-tile");

        let scaleFactor = Math.pow(2, HnHMaxZoom - coords.z);
        let topLeft = {x: coords.x * scaleFactor, y: coords.y * scaleFactor};
        let bottomRight = {x: topLeft.x + scaleFactor - 1, y: topLeft.y + scaleFactor - 1};

        let text = `(${topLeft.x};${topLeft.y})`;
        if (scaleFactor !== 1) {
            text += `<br>(${bottomRight.x};${bottomRight.y})`;
        }

        let textElement = document.createElement("div");
        textElement.classList.add("map-tile-text");
        textElement.innerHTML = text;
        textElement.style.display = 'block';
        element.appendChild(textElement);
        return element;
    }
});

export const ImageIcon = L.Icon.extend({
    options: {
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    }
});

export const PlayerPulseIcon = new L.DivIcon({
    className: 'player-pulse-icon',
    html: '<div class="player-pulse"><div class="player-pulse-ring"></div><div class="player-pulse-dot"></div></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

export const CustomMarkerColors = ['white', 'amber', 'red', 'green', 'blue', 'purple', 'coral', 'teal'];

const customMarkerIconCache = {};

export function getCustomMarkerIcon(color) {
    let key = CustomMarkerColors.includes(color) ? color : 'white';
    if (customMarkerIconCache[key]) {
        return customMarkerIconCache[key];
    }
    let icon = new ImageIcon({
        iconUrl: `gfx/terobjs/mm/custom_pin_${key}.png`,
        iconSize: [37, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -48],
        tooltipAnchor: [0, -48]
    });
    customMarkerIconCache[key] = icon;
    return icon;
}

const latNormalization = 90.0 * TileSize / 2500000.0;
const lngNormalization = 180.0 * TileSize / 2500000.0;

const HnHProjection = {
    project: function (latlng) {
        return new Point(latlng.lat / latNormalization, latlng.lng / lngNormalization);
    },

    unproject: function (point) {
        return new LatLng(point.x * latNormalization, point.y * lngNormalization);
    },

    bounds: (function () {
        return new Bounds([-latNormalization, -lngNormalization], [latNormalization, lngNormalization]);
    })()
};

export const HnHCRS = L.extend({}, L.CRS.Simple, {
    projection: HnHProjection
});