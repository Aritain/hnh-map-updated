# HavenMap

Fork of [Cediner/hnh-map-vuetify](https://github.com/Cediner/hnh-map-vuetify), an automapper server for Haven & Hearth.

All changes on top of upstream are vibe-coded via Claude.

## Setup

    docker build -t "your_tag" .
    docker run -v /srv/hnh-map:/map -p 80:8080 "your_tag"

Listens internally on port 8080, expects `/map` mounted as a volume (database and images stored here). Put it behind whatever reverse proxy you like and point an auto-mapping-capable client at it.

Login as `admin`/`admin`, go to the admin portal, add your first user with all roles toggled on (you'll need `admin` at least). You'll be logged out and the `admin` account removed — log back in as your new user. Add accounts for everyone else from there, then generate upload tokens.

Set the prefix (prepended to tokens, e.g. `http://example.com`) to make client configuration easier.

The first client to connect sets the 0,0 grid. Wipe data in the admin portal to reset it.

### Roles

- `map`: view the map
- `upload`: send character, marker, and tile data
- `admin`: modify server settings, manage users, wipe data

## Changelog

Changes on top of the upstream fork:

- Roads: draw and label named roads between two points on the map
- Custom markers: user-placed markers in 8 colors, independent of client uploads
- Map pings: ctrl+click broadcasts a ping (sound + snackbar + temp marker) to everyone with the map open, over the existing SSE update channel; admin can upload/select the ping sound
- Cave-entrance icons now render on the map (I'm still not sure if that's something ND fixed on client side or my changes made this work)
- Fixed a marker-upload bug where a non-JSON hex `id` field from some clients silently dropped the whole marker batch
- Fixed broken tile zoom resolution (`_getZoomForUrl`) in the tile layer
- Player markers: pulsing indicator icon, always-on nametag tooltip
- Thingwall triangulation and general marker/tooltip behavior improvements
- Dark theme by default
- Markers and quest tooltips visible by default
- Closer zoom
- Better icon handling while zooming
