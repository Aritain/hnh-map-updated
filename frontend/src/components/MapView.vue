<template>
  <div>
    <v-app-bar app dense height="56" color="#1a1a1a" dark style="z-index: 1001;">
      <img src="haven.jpg" height="36" style="border-radius:4px;object-fit:cover;margin-right:10px;"/>
      <span style="font-size:1.25rem;"><span style="color:#FF9800;">Haven</span><span style="color:#fff;">Map</span></span>
      <v-spacer></v-spacer>
      <v-btn text href="/map" class="mr-2">Map</v-btn>
      <v-btn text href="/" class="mr-4">Tokens</v-btn>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            {{ username }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="auths.includes('admin')" href="/admin">
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item>
          <v-list-item href="/logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
        :mini-variant.sync="mini"
        app
        style="z-index: 1000"
        prominent>
      <v-list-item>
        <v-btn
            icon
            @click.stop="mini = !mini"
            style="/*margin-left: -6px;*/"
        >
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense v-if="!mini">
        <!-- HIDE GRID -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn width="100%" @click="showGridCoordinates = !showGridCoordinates">
                {{ (!showGridCoordinates) ? 'Show' : 'Hide' }} grid coordinates
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- ZOOM -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn width="100%" @click="zoomOut">
                Zoom Out
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- TO MAP -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <label class="title">Jump To Map</label>
              <v-autocomplete return-object outlined dense :items="maps" v-model="selectedMap"
                              placeholder="Select Map"></v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- SELECT OVERLAY -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <label class="title">Overlay Map</label>
              <v-autocomplete return-object outlined dense :items="maps" v-model="overlayMap"
                              placeholder="Select Map"></v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- HIDE MARKER -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showMarkers = !showMarkers">
                {{ (!showMarkers) ? 'Show' : 'Hide' }} Markers
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- TO ANY MARKER -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <!--              <label class="title">Markers</label>-->
              <v-autocomplete return-object outlined dense :items="otherMarks" v-model="selectedMarker"
                              placeholder="Select Marker">

                <template v-slot:item="data">
                  <img class="mr-2" style="width:24px;height: 24px;" :src="data.item.image + '.png'"/>
                  {{ data.item.name }}
                </template>
              </v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showThingwalls = !showThingwalls">
                {{ (!showThingwalls) ? 'Show' : 'Hide' }} Thingwalls
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <!--              <label class="title">Thingwalls</label>-->
              <v-autocomplete return-object outlined dense :items="thingMarks" v-model="selectedThing"
                              placeholder="Select Marker">

                <template v-slot:item="data">
                  <img class="mr-2" style="width:24px;height: 24px;" :src="data.item.image + '.png'"/>
                  {{ data.item.name }}
                </template>
              </v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showThingwallTooltips = !showThingwallTooltips">
                {{ (!showThingwallTooltips) ? 'Show' : 'Hide' }} Thingwall Tooltips
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showQuests = !showQuests">
                {{ (!showQuests) ? 'Show' : 'Hide' }} Quest Givers
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <!--              <label class="title">Quest Givers</label>-->
              <v-autocomplete return-object outlined dense :items="questMarks" v-model="selectedQuest"
                              placeholder="Select Marker">

                <template v-slot:item="data">
                  <img class="mr-2" style="width:24px;height: 24px;" :src="data.item.image + '.png'"/>
                  {{ data.item.name }}
                </template>
              </v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showQuestTooltips = !showQuestTooltips">
                {{ (!showQuestTooltips) ? 'Show' : 'Hide' }} Quest Tooltips
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showPlayers = !showPlayers">
                {{ (!showPlayers) ? 'Show' : 'Hide' }} Players
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showRoads = !showRoads">
                {{ (!showRoads) ? 'Show' : 'Hide' }} Roads
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showCustomMarkers = !showCustomMarkers">
                {{ (!showCustomMarkers) ? 'Show' : 'Hide' }} Custom Markers
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <!--              <label class="title">Custom Markers</label>-->
              <v-autocomplete return-object outlined dense :items="customMarks" v-model="selectedCustomMarker"
                              placeholder="Select Marker">

                <template v-slot:item="data">
                  <img class="mr-2" style="width:24px;height: 24px;" :src="'gfx/terobjs/mm/custom_pin_' + data.item.color + '.png'"/>
                  {{ data.item.name }}
                </template>
              </v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showPlayerTooltips = !showPlayerTooltips">
                {{ (!showPlayerTooltips) ? 'Show' : 'Hide' }} Players Names
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- TO PLAYER -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <!--              <label class="title">Jump to Player</label>-->
              <v-autocomplete return-object outlined dense :items="players" v-model="selectedPlayer"
                              placeholder="Select Player">
              </v-autocomplete>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- DRAW ROAD -->
        <v-list-item v-if="auths.includes('admin') || auths.includes('writer')">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" :color="drawingRoad ? 'primary' : undefined"
                     @click="toggleDrawRoad">
                {{ drawingRoad ? 'Cancel Draw Road' : 'Draw Road' }}
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- HIDE CLUTTER -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="showClutter = !showClutter">
                {{ (!showClutter) ? 'Show' : 'Hide' }} Clutter
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- HIDE CHARACTER NAMES -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn class="short-btn" width="100%" @click="hideCharacterNames = !hideCharacterNames">
                {{ (!hideCharacterNames) ? 'Hide' : 'Show' }} Character Names
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>


      <!--        <div style="position: absolute;"><button class="btn btn-primary btn-sm" v-on:click="expandControlPanel = !expandControlPanel">-</button></div>-->
      <!--        <div class="card-body" v-bind:class="{ hidden: !expandControlPanel }">-->
      <!--          <div class="form-group">-->
      <!--            <div class="form-check">-->
      <!--              <input type="checkbox" class="form-check-input" id="check-grid-coords"-->
      <!--                     v-model="showGridCoordinates">-->
      <!--              <label class="form-check-label" for="check-grid-coords">Show grid coordinates</label>-->
      <!--            </div>-->
      <!--            <div class="form-check">-->
      <!--              <input type="checkbox" class="form-check-input" id="check-hide-markers"-->
      <!--                     v-model="hideMarkers">-->
      <!--              <label class="form-check-label" for="check-hide-markers">Hide Markers</label>-->
      <!--            </div>-->
      <!--            <button type="button" class="btn btn-secondary" style="margin-top: 10px;" v-on:click="zoomOut">Zoom-->
      <!--              out-->
      <!--            </button>-->
      <!--          </div>-->
      <!--          <div class="form-group">-->
      <!--            <label>Jump to Map</label>-->
      <!--            <v-autocomplete :items="maps" v-model="selectedMap" placeholder="Select Map"></v-autocomplete>-->
      <!--          </div>-->
      <!--          <div class="form-group">-->
      <!--            <label>Overlay Map</label>-->
      <!--            <v-autocomplete :items="maps" v-model="overlayMap" placeholder="Select Map"></v-autocomplete>-->
      <!--          </div>-->
      <!--          <div class="form-group">-->
      <!--            <label>Jump to Any Marker</label>-->
      <!--            <v-autocomplete :items="allMarks" v-model="selectedMarker"-->
      <!--                            placeholder="Select Marker"></v-autocomplete>-->
      <!--          </div>-->
      <!--          <div class="form-group">-->
      <!--            <label>Jump to Player</label>-->
      <!--            <v-autocomplete :items="players" v-model="selectedPlayer" placeholder="Select Player"></v-autocomplete>-->
      <!--          </div>-->
      <!--        </div>-->
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <div ref="map" class="map"></div>
        <div class="control-panel card">

        </div>

        <vue-context ref="menu">
          <template slot-scope="tile" v-if="tile.data">
            <li>
              <a @click.prevent="wipeTile(tile.data)">Wipe tile {{ tile.data.coords.x }}, {{ tile.data.coords.y }}</a>
            </li>
            <li>
              <a @click.prevent="queryCoordSet(tile.data)">Rewrite tile coords for {{ tile.data.coords.x }},
                {{ tile.data.coords.y }}</a>
            </li>
            <li>
              <a @click.prevent="promptCustomMarker(tile.data)">Add marker here</a>
            </li>
          </template>
        </vue-context>

        <vue-context ref="markermenu">
          <template slot-scope="data" v-if="data.data">
            <li>
              <a @click.prevent="hideMarker(data.data)">Hide marker {{ data.data.name }}</a>
            </li>
          </template>
        </vue-context>

        <vue-context ref="roadmenu">
          <template slot-scope="data" v-if="data.data">
            <li>
              <a @click.prevent="deleteRoad(data.data)">Delete road {{ data.data.name }}</a>
            </li>
          </template>
        </vue-context>

        <vue-context ref="custommarkermenu">
          <template slot-scope="data" v-if="data.data">
            <li>
              <a @click.prevent="deleteCustomMarker(data.data)">Delete marker {{ data.data.name }}</a>
            </li>
          </template>
        </vue-context>

        <modal name="coordSet">
          <form class="pa-4" v-on:submit.prevent="setCoords(form)">
            <v-text-field light v-model="coordSet.x" label="X" placeholder="0"></v-text-field>
            <v-text-field light v-model="coordSet.y" label="Y" placeholder="0"></v-text-field>
            <v-btn color="primary" type="submit">Submit</v-btn>
          </form>
        </modal>

        <modal name="roadName">
          <form class="pa-4" v-on:submit.prevent="saveRoad">
            <v-text-field light v-model="roadName" label="Road name" autofocus></v-text-field>
            <v-btn color="primary" type="submit">Submit</v-btn>
          </form>
        </modal>

        <modal name="customMarkerName">
          <form class="pa-4" v-on:submit.prevent="saveCustomMarker">
            <v-text-field light v-model="customMarkerName" label="Marker name" autofocus></v-text-field>
            <div class="color-swatches">
              <img v-for="c in customMarkerColors" :key="c"
                   class="color-swatch" :class="{selected: customMarkerColor === c}"
                   :src="`gfx/terobjs/mm/custom_pin_${c}.png`"
                   :title="c"
                   @click="customMarkerColor = c">
            </div>
            <v-btn color="primary" type="submit">Submit</v-btn>
          </form>
        </modal>
      </v-container>
    </v-main>
    <v-snackbar v-model="pingSnackbar.show" :timeout="6000">
      {{ pingSnackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="jumpToPing">Jump to ping</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ModelSelect from 'vue-search-select'
import {GridCoordLayer, HnHCRS, HnHMaxZoom, HnHMinZoom, TileSize, CustomMarkerColors} from "../utils/LeafletCustomTypes";
import {SmartTileLayer} from "../utils/SmartTileLayer";
import * as L from "leaflet";
import {API_ENDPOINT} from "../main";
import {Marker} from "../data/Marker";
import {Road} from "../data/Road";
import {CustomMarker} from "../data/CustomMarker";
import {UniqueList} from "../data/UniqueList";
import {Character} from "../data/Character";
import VueContext from 'vue-context';

const CLUTTER_TYPES = ["burrow", "clamreef", "flintwash", "spawningbed"];

export default {
  name: "MapView",
  components: {
    ModelSelect,
    VueContext,
  },
  data: function () {
    return {
      mini: true,
      showGridCoordinates: false,
      showMarkers: true,
      showQuests: true,
      showQuestTooltips: true,
      showThingwalls: true,
      showThingwallTooltips: true,
      showPlayers: true,
      showPlayerTooltips: true,
      showRoads: true,
      showCustomMarkers: true,
      showClutter: false,
      hideCharacterNames: true,
      expandControlPanel: true,

      drawingRoad: false,
      roadPoints: [],
      roadTempMarker: null,
      roadName: '',
      pingMarker: null,

      pendingMarkerPoint: null,
      customMarkerName: '',
      customMarkerColor: 'white',
      customMarkerColors: CustomMarkerColors,

      trackingCharacterId: -1,
      autoMode: false,
      polling: null,
      zz: false,
      // markersCache: [],
      allMarks: [],
      otherMarks: [],
      customMarks: [],
      marksCategories: [],
      thingMarks: [],
      questMarks: [],
      clutterMarks: [],
      players: [],
      maps: [],
      selectedMap: null,
      selectedMarker: null,
      selectedCustomMarker: null,
      selectedQuest: null,
      selectedThing: null,
      selectedPlayer: {value: false},
      overlayMap: {value: false},
      auths: [],
      username: '',
      mapid: 0,
      coordSetFrom: {x: 0, y: 0},
      coordSet: {
        x: 0,
        y: 0
      },
      pingSnackbar: {show: false, text: '', map: 0, x: 0, y: 0}
    }
  },
  watch: {
    showGridCoordinates(value) {
      console.log("showGridCoordinates", value);
      if (value) {
        this.coordLayer.setOpacity(1);
      } else {
        this.coordLayer.setOpacity(0);
      }
    },
    showMarkers(value) {
      console.log("showMarkers", value);
      if (!value) {
        this.otherMarks.forEach(it => it.remove(this));
      } else {
        this.otherMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
      }
    },
    showThingwalls(value) {
      console.log("showThingwalls", value);
      if (!value) {
        this.thingMarks.forEach(it => it.remove(this));
      } else {
        this.thingMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => {
          it.add(this);
          it.tooltip(this.showThingwallTooltips);
        });
      }
    },
    showQuests(value) {
      console.log("showQuests", value);
      if (!value) {
        this.questMarks.forEach(it => it.remove(this));
      } else {
        this.questMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => {
          it.add(this);
          it.tooltip(this.showQuestTooltips);
        });
      }
    },
    showClutter(value) {
      console.log("showClutter", value);
      if (!value) {
        this.clutterMarks.forEach(it => it.remove(this));
      } else {
        this.clutterMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
      }
    },
    showPlayers(value) {
      console.log("showPlayers", value);
      if (!value) {
        this.characters.getElements().forEach(it => it.remove(this));
      } else {
        this.characters.getElements().filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => {
          it.add(this);
          it.tooltip(this.showPlayers);
        });
      }
    },
    showRoads(value) {
      console.log("showRoads", value);
      if (!value) {
        this.roads.getElements().forEach(it => it.remove(this));
      } else {
        this.roads.getElements().filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
      }
    },
    showCustomMarkers(value) {
      console.log("showCustomMarkers", value);
      if (!value) {
        this.customMarkers.getElements().forEach(it => it.remove(this));
      } else {
        this.customMarkers.getElements().filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
      }
    },
    showThingwallTooltips(value) {
      console.log("showThingwallTooltips", value);
      this.thingMarks.forEach(it => it.tooltip(value));
    },
    showQuestTooltips(value) {
      console.log("showQuestTooltips", value);
      this.questMarks.forEach(it => it.tooltip(value));
    },
    showPlayerTooltips(value) {
      console.log("showPlayerTooltips", value);
      this.characters.getElements().forEach(it => it.tooltip(value));
    },
    hideCharacterNames(value) {
      console.log("hideCharacterNames", value);
      this.characters.getElements().forEach(it => it.setHideCharacterNames(value));
    },
    trackingCharacterId(value) {
      if (value !== -1) {
        let character = this.characters.byId(value);
        if (character) {
          this.changeMap(character.map);
          let latlng = this.map.unproject([character.position.x, character.position.y], HnHMaxZoom);
          this.map.setView(latlng, HnHMaxZoom);

          this.$router.push({path: `/character/${value}`});
          this.autoMode = true;
        } else {
          this.map.setView([0, 0], HnHMinZoom);
          let mapid = this.maps[0].ID;
          this.$router.replace({path: `/grid/${mapid}/0/0/${HnHMinZoom}`}).catch(() => {});
          this.trackingCharacterId = -1;
        }
      }
    },
    selectedMap(value) {
      console.log('selectedMap', value)
      if (value) {
        this.changeMap(value.ID);
        let zoom = this.map.getZoom();
        this.map.setView([0, 0], zoom);

        this.$router.replace({path: `/grid/${this.mapid}/0/0/${zoom}`}).catch(() => {});
        this.trackingCharacterId = -1;
      }
    },
    overlayMap(value) {
      console.log("overlayMap");
      if (value) {
        this.overlayLayer.map = value.ID;
        this.overlayLayer.redraw();
        if (this.showMarkers) {
          this.otherMarks.forEach(it => it.remove(this));
          this.otherMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
        }
        if (this.showThingwalls) {
          this.thingMarks.forEach(it => it.remove(this));
          this.thingMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => {
            it.add(this);
            it.tooltip(this.showThingwallTooltips);
          });
        }
        if (this.showQuests) {
          this.questMarks.forEach(it => it.remove(this));
          this.questMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => {
            it.add(this);
            it.tooltip(this.showQuestTooltips);
          });
        }
        if (this.showClutter) {
          this.clutterMarks.forEach(it => it.remove(this));
          this.clutterMarks.filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
        }
        if (this.showPlayers) {
          this.characters.getElements().forEach(it => it.remove(this));
          this.characters.getElements().filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => {
            it.add(this);
            it.tooltip(this.showPlayerTooltips);
          });
        }
        if (this.showRoads) {
          this.roads.getElements().forEach(it => it.remove(this));
          this.roads.getElements().filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
        }
        if (this.showCustomMarkers) {
          this.customMarkers.getElements().forEach(it => it.remove(this));
          this.customMarkers.getElements().filter(it => it.map === this.mapid || it.map === this.overlayLayer.map).forEach(it => it.add(this));
        }
      } else {
        this.overlayLayer.map = -1;
        this.overlayLayer.redraw();
        if (this.showMarkers) {
          this.otherMarks.forEach(it => it.remove(this));
          this.otherMarks.filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
        if (this.showThingwalls) {
          this.thingMarks.forEach(it => it.remove(this));
          this.thingMarks.filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(this.showThingwallTooltips);
          });
        }
        if (this.showQuests) {
          this.questMarks.forEach(it => it.remove(this));
          this.questMarks.filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(this.showPlayerTooltips);
          });
        }
        if (this.showClutter) {
          this.clutterMarks.forEach(it => it.remove(this));
          this.clutterMarks.filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
        if (this.showPlayers) {
          this.characters.getElements().forEach(it => it.remove(this));
          this.characters.getElements().filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(this.showPlayerTooltips);
          });
        }
        if (this.showRoads) {
          this.roads.getElements().forEach(it => it.remove(this));
          this.roads.getElements().filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
        if (this.showCustomMarkers) {
          this.customMarkers.getElements().forEach(it => it.remove(this));
          this.customMarkers.getElements().filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
      }
    },
    selectedMarker(value) {
      //selectedMap
      console.log('selectedMarker', value);
      if (value) {
        let markerMapId = value.map;

        this.maps.forEach((map) => {
          if (markerMapId === map.ID) {
            if (this.mapid !== map.ID)
              this.changeMap(map.ID);

            if (!value.marker) value.add(this);
            this.map.setView(value.marker.getLatLng(), HnHMaxZoom);
            this.trackingCharacterId = -1;
            return;
          }
        })
      }
    },
    selectedQuest(value) {
      //selectedMap
      console.log('selectedQuest', value);
      if (value) {
        let markerMapId = value.map;

        this.maps.forEach((map) => {
          if (markerMapId === map.ID) {
            if (this.mapid !== map.ID)
              this.changeMap(map.ID);

            if (!value.marker) value.add(this);
            this.map.setView(value.marker.getLatLng(), HnHMaxZoom);
            this.trackingCharacterId = -1;
            return;
          }
        })
      }
    },
    selectedThing(value) {
      //selectedMap
      console.log('selectedThing', value);
      if (value) {
        let markerMapId = value.map;

        this.maps.forEach((map) => {
          if (markerMapId === map.ID) {
            if (this.mapid !== map.ID)
              this.changeMap(map.ID);

            if (!value.marker) value.add(this);
            this.map.setView(value.marker.getLatLng(), HnHMaxZoom);
            this.trackingCharacterId = -1;
            return;
          }
        })
      }
    },
    selectedCustomMarker(value) {
      console.log('selectedCustomMarker', value);
      if (value) {
        let markerMapId = value.map;

        this.maps.forEach((map) => {
          if (markerMapId === map.ID) {
            if (this.mapid !== map.ID)
              this.changeMap(map.ID);

            if (!value.marker) value.add(this);
            this.map.setView(value.marker.getLatLng(), HnHMaxZoom);
            this.trackingCharacterId = -1;
            return;
          }
        })
      }
    },
    selectedPlayer(value) {
      if (value && value.id) {
        this.trackingCharacterId = value.id;
      }
    }
  },
  mounted() {
    let chars = this.$http.get(`${API_ENDPOINT}/v1/characters`)
    let maps = this.$http.get(`${API_ENDPOINT}/maps`)

    Promise.all([chars, maps]).then(values => {
      this.setupMap(values[0].body, values[1].body);
    }, () => this.$emit("error"));
  },
  beforeDestroy: function () {
    clearInterval(this.intervalId)
  },
  methods: {
    setupMap(characters, maps) {
      this.$http.get(`${API_ENDPOINT}/config`).then(response => {
        this.processConfig(response.body);
      }, () => this.$emit("error"));
      // Create map and layer
      this.map = L.map(this.$refs.map, {
        // Map setup
        minZoom: HnHMinZoom,
        maxZoom: HnHMaxZoom + 2,
        crs: HnHCRS,

        // Disable all visuals
        attributionControl: false,
        inertia: false,
        zoomAnimation: false,
        fadeAnimation: false,
        markerZoomAnimation: false
      });

      for (let id in maps) {
        let map = maps[id];
        map.text = map.Name;
        map.value = map.ID;
        this.maps.push(map);
      }
      this.maps.sort((a, b) => {
        return a.size < b.size;
      });

      // Update url on manual drag, zoom
      this.map.on("drag", () => {
        let point = this.map.project(this.map.getCenter(), this.map.getZoom());
        let coordinate = {x: ~~(point.x / TileSize), y: ~~(point.y / TileSize), z: this.map.getZoom()};
        this.$router.replace({path: `/grid/${this.mapid}/${coordinate.x}/${coordinate.y}/${coordinate.z}`}).catch(() => {});
        this.trackingCharacterId = -1;
      });
      this.map.on("zoom", () => {
        if (this.autoMode) {
          this.autoMode = false;
        } else {
          let point = this.map.project(this.map.getCenter(), this.map.getZoom());
          let coordinate = {
            x: Math.floor(point.x / TileSize),
            y: Math.floor(point.y / TileSize),
            z: this.map.getZoom()
          };
          this.$router.replace({path: `/grid/${this.mapid}/${coordinate.x}/${coordinate.y}/${coordinate.z}`}).catch(() => {});
          this.trackingCharacterId = -1;
        }
      });

      this.layer = new SmartTileLayer('grids/{map}/{z}/{x}_{y}.png?{cache}', {
        minZoom: HnHMinZoom,
        maxZoom: HnHMaxZoom + 2,
        maxNativeZoom: HnHMaxZoom,
        zoomOffset: 0,
        zoomReverse: true,
        tileSize: TileSize
      });
      this.layer.invalidTile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
      this.layer.addTo(this.map);

      this.overlayLayer = new SmartTileLayer('grids/{map}/{z}/{x}_{y}.png?{cache}', {
        minZoom: HnHMinZoom,
        maxZoom: HnHMaxZoom + 2,
        maxNativeZoom: HnHMaxZoom,
        zoomOffset: 0,
        zoomReverse: true,
        tileSize: TileSize,
        opacity: 0.6
      });
      this.overlayLayer.invalidTile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      this.overlayLayer.addTo(this.map);

      this.coordLayer = new GridCoordLayer({tileSize: TileSize, opacity: 0});
      this.coordLayer.addTo(this.map);

      this.markerLayer = L.layerGroup();
      this.markerLayer.addTo(this.map);

      this.roadLayer = L.layerGroup();
      this.roadLayer.addTo(this.map);

      this.thingwallConnectionsLayer = L.layerGroup();
      this.thingwallConnectionsLayer.addTo(this.map);

      /*this.map.on('mousemove', (mev) => {
          coords = this.map.project(mev.latlng, this.map.getZoom());
      })*/

      this.map.on('contextmenu', ((mev) => {
        if (this.drawingRoad) {
          return;
        }
        if (this.auths.includes('admin') || this.auths.includes('writer')) {
          let point = this.map.project(mev.latlng, this.map.getZoom());
          let coords = {x: Math.floor(point.x / TileSize), y: Math.floor(point.y / TileSize)};
          let markerPoint = this.map.project(mev.latlng, HnHMaxZoom);
          this.$refs.menu.open(mev.originalEvent, {
            coords: coords,
            point: {x: Math.round(markerPoint.x), y: Math.round(markerPoint.y)}
          });
        }
      }).bind(this));

      this.map.on('click', ((mev) => {
        if (mev.originalEvent.ctrlKey) {
          this.sendPing(mev.latlng);
          return;
        }
        if (!this.drawingRoad) {
          return;
        }
        let point = this.map.project(mev.latlng, HnHMaxZoom);
        this.roadPoints.push({x: Math.round(point.x), y: Math.round(point.y)});
        if (this.roadPoints.length === 1) {
          this.roadTempMarker = L.circleMarker(mev.latlng, {radius: 5, color: '#FDB800'}).addTo(this.map);
        } else if (this.roadPoints.length === 2) {
          this.drawingRoad = false;
          if (this.roadTempMarker) {
            this.map.removeLayer(this.roadTempMarker);
            this.roadTempMarker = null;
          }
          this.roadName = '';
          this.$modal.show('roadName');
        }
      }).bind(this));

      this.source = new EventSource("updates");
      this.source.onmessage = (function (event) {
        var updates = JSON.parse(event.data);
        for (var update of updates) {
          var key = update['M'] + ':' + update['X'] + ':' + update['Y'] + ':' + update['Z'];
          this.layer.cache[key] = update['T'];
          if (this.layer.map === update['M']) {
            this.layer.refresh(update['X'], update['Y'], update['Z']);
          }
        }
      }).bind(this);

      this.source.addEventListener('merge', ((e) => {
        var merge = JSON.parse(e.data);
        if (this.mapid === merge['From']) {
          let mapTo = merge['To'];
          let point = this.map.project(this.map.getCenter(), this.map.getZoom());
          let coordinate = {
            x: Math.floor(point.x / TileSize),
            y: Math.floor(point.y / TileSize),
            z: this.map.getZoom()
          };
          coordinate.x += merge['Shift'].x;
          coordinate.y += merge['Shift'].y;
          this.$router.replace({path: `/grid/${mapTo}/${coordinate.x}/${coordinate.y}/${coordinate.z}`}).catch(() => {});

          let latLng = this.toLatLng(coordinate.x * 100, coordinate.y * 100);

          this.changeMap(mapTo);
          this.$http.get(`${API_ENDPOINT}/v1/markers`).then(response => {
            this.updateMarkers(response.body);
          }, () => {
            this.$emit("error")
          });
          this.map.setView(latLng, this.map.getZoom());
        }
      }).bind(this));

      this.source.addEventListener('ping', ((e) => {
        let ping = JSON.parse(e.data);
        this.playPingSound();
        this.pingSnackbar = {
          show: true,
          text: `${ping.Username} pinged the map`,
          map: ping.Map,
          x: ping.X,
          y: ping.Y
        };
        if (this.mapid === ping.Map) {
          this.showPingMarker(this.toLatLng(ping.X, ping.Y));
        }
      }).bind(this));

      this.markers = new UniqueList();
      this.characters = new UniqueList();
      this.roads = new UniqueList();
      this.customMarkers = new UniqueList();

      // Create markers
      this.updateCharacters(characters);

      // Check parameters
      if (this.$route.params.characterId) { // Navigate to character
        this.trackingCharacterId = +this.$route.params.characterId;
      } else if (this.$route.params.gridX && this.$route.params.gridY && this.$route.params.zoom) { // Navigate to specific grid
        let latLng = this.toLatLng(this.$route.params.gridX * 100, this.$route.params.gridY * 100);

        if (this.mapid !== +this.$route.params.map) {
          this.changeMap(+this.$route.params.map);
        }

        this.map.setView(latLng, this.$route.params.zoom);
      } else { // Just show a map
        if (this.maps.length > 0) {
          this.changeMap(this.maps[0].ID);
        }
        this.map.setView([0, 0], HnHMinZoom);
      }

      this.intervalId = setInterval(() => {
        this.$http.get(`${API_ENDPOINT}/v1/characters`).then(response => {
          this.updateCharacters(response.body);
        }, () => {
          clearInterval(this.intervalId);
          this.$emit("error")
        });
      }, 2000);
      // Request markers
      this.$http.get(`${API_ENDPOINT}/v1/markers`).then(response => {
        this.updateMarkers(response.body);
      }, () => {
        this.$emit("error")
      });
      // Request roads
      this.$http.get(`${API_ENDPOINT}/v1/roads`).then(response => {
        this.updateRoads(response.body);
      }, () => {
        this.$emit("error")
      });
      // Request custom markers
      this.$http.get(`${API_ENDPOINT}/v1/customMarkers`).then(response => {
        this.updateCustomMarkers(response.body);
      }, () => {
        this.$emit("error")
      });
    },
    updateMarkers(markersData) {
      this.markers.update(markersData.map(it => {
            let m = new Marker(it);
            if (m.type === "thingwall")
              m.tstate = this.showThingwallTooltips;
            else if (m.type === "quest")
              m.tstate = this.showQuestTooltips;
            else
              m.tstate = false;
            return m;
          }),
          (marker) => { // Add
            let visible = marker.type === "thingwall" ? this.showThingwalls
                : marker.type === "quest" ? this.showQuests
                : CLUTTER_TYPES.includes(marker.type) ? this.showClutter
                : this.showMarkers;
            if (visible && (marker.map === this.mapid || marker.map === this.overlayLayer.map)) {
              marker.add(this);
            }
            marker.setClickCallback(() => {
              this.map.setView(marker.marker.getLatLng(), this.map.getZoom());
            });
            marker.setContextMenu((mev) => {
              if (this.auths.includes('admin') || this.auths.includes('writer')) {
                this.$refs.markermenu.open(mev.originalEvent, {name: marker.name, id: marker.id});
              }
            });
            if (marker.type === "thingwall") {
              marker.setHoverCallback(
                  (m) => this.showThingwallConnections(m),
                  () => this.clearThingwallConnections()
              );
            }
          },
          (marker) => { // Remove
            marker.remove(this);
          },
          (marker, updated) => { // Update
            marker.update(this, updated);
          });
      // this.markersCache.length = 0;
      // this.markers.getElements().forEach(it => this.markersCache.push(it));
      /*this.markersCache.sort((a, b) => {
        let im = a.image.localeCompare(b.image);
        return im === 0 ? a.name.localeCompare(b.name) : im;
      });*/

      this.allMarks.length = 0;
      this.otherMarks.length = 0;
      this.thingMarks.length = 0;
      this.questMarks.length = 0;
      this.clutterMarks.length = 0;
      this.markers.getElements().filter(it => it.name != null && it.name.length > 0 && !it.hidden).sort((a, b) => {
        let im = a.image.localeCompare(b.image);
        return im === 0 ? a.name.localeCompare(b.name) : im;
      }).forEach(it => {
        this.allMarks.push(it);
        if (it.type === "thingwall")
          this.thingMarks.push(it);
        else if (it.type === "quest")
          this.questMarks.push(it);
        else if (CLUTTER_TYPES.includes(it.type))
          this.clutterMarks.push(it);
        else
          this.otherMarks.push(it);

        if (!this.marksCategories.includes(it.type))
          this.marksCategories.push(it.type);
      });
    },
    showThingwallConnections(marker) {
      this.thingwallConnectionsLayer.clearLayers();
      let neighbors = this.thingMarks
          .filter(it => it !== marker && it.map === marker.map && it.marker)
          .map(it => ({
            marker: it,
            dist: Math.hypot(it.position.x - marker.position.x, it.position.y - marker.position.y)
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3);
      let from = marker.marker.getLatLng();
      neighbors.forEach(n => {
        L.polyline([from, n.marker.marker.getLatLng()], {
          color: '#00cffd',
          weight: 2,
          opacity: 0.8,
          dashArray: '6, 6'
        }).addTo(this.thingwallConnectionsLayer);
      });
    },
    clearThingwallConnections() {
      this.thingwallConnectionsLayer.clearLayers();
    },
    updateRoads(roadsData) {
      this.roads.update(roadsData.map(it => new Road(it)),
          (road) => { // Add
            if (this.showRoads && (road.map === this.mapid || road.map === this.overlayLayer.map)) {
              road.add(this);
            }
            road.setContextMenu((mev) => {
              if (this.auths.includes('admin') || this.auths.includes('writer')) {
                this.$refs.roadmenu.open(mev.originalEvent, {name: road.name, id: road.id});
              }
            });
          },
          (road) => { // Remove
            road.remove(this);
          }
      );
    },
    toggleDrawRoad() {
      this.drawingRoad = !this.drawingRoad;
      this.roadPoints = [];
      if (this.roadTempMarker) {
        this.map.removeLayer(this.roadTempMarker);
        this.roadTempMarker = null;
      }
    },
    saveRoad() {
      if (!this.roadName || this.roadPoints.length !== 2) {
        return;
      }
      this.$http.get(`${API_ENDPOINT}/admin/addRoad`, {
        params: {
          map: this.mapid,
          ax: this.roadPoints[0].x,
          ay: this.roadPoints[0].y,
          bx: this.roadPoints[1].x,
          by: this.roadPoints[1].y,
          name: this.roadName
        }
      }).then(response => {
        this.updateRoads([...this.roads.getElements(), response.body]);
        this.$modal.hide('roadName');
        this.roadPoints = [];
      }, () => this.$emit("error"));
    },
    deleteRoad(data) {
      this.$http.get(`${API_ENDPOINT}/admin/deleteRoad`, {params: {id: data.id}});
      let road = this.roads.byId(data.id);
      if (road) {
        road.remove(this);
        delete this.roads.elements[data.id];
      }
    },
    updateCustomMarkers(markersData) {
      this.customMarkers.update(markersData.map(it => new CustomMarker(it)),
          (marker) => { // Add
            if (this.showCustomMarkers && (marker.map === this.mapid || marker.map === this.overlayLayer.map)) {
              marker.add(this);
            }
            marker.setContextMenu((mev) => {
              if (this.auths.includes('admin') || this.auths.includes('writer')) {
                this.$refs.custommarkermenu.open(mev.originalEvent, {name: marker.name, id: marker.id});
              }
            });
          },
          (marker) => { // Remove
            marker.remove(this);
          }
      );
      this.customMarks.length = 0;
      this.customMarkers.getElements().filter(it => it.name != null && it.name.length > 0).sort((a, b) => {
        return a.name.localeCompare(b.name);
      }).forEach(it => this.customMarks.push(it));
    },
    promptCustomMarker(data) {
      this.pendingMarkerPoint = data.point;
      this.customMarkerName = '';
      this.customMarkerColor = 'white';
      this.$modal.show('customMarkerName');
    },
    saveCustomMarker() {
      if (!this.customMarkerName || !this.pendingMarkerPoint) {
        return;
      }
      this.$http.get(`${API_ENDPOINT}/admin/addCustomMarker`, {
        params: {
          map: this.mapid,
          x: this.pendingMarkerPoint.x,
          y: this.pendingMarkerPoint.y,
          name: this.customMarkerName,
          color: this.customMarkerColor
        }
      }).then(response => {
        this.updateCustomMarkers([...this.customMarkers.getElements(), response.body]);
        this.$modal.hide('customMarkerName');
        this.pendingMarkerPoint = null;
      }, () => this.$emit("error"));
    },
    deleteCustomMarker(data) {
      this.$http.get(`${API_ENDPOINT}/admin/deleteCustomMarker`, {params: {id: data.id}});
      let marker = this.customMarkers.byId(data.id);
      if (marker) {
        marker.remove(this);
        delete this.customMarkers.elements[data.id];
      }
    },
    updateCharacters(charactersData) {
      this.characters.update(charactersData.map(it => {
            let ch = new Character(it);
            ch.tstate = this.showPlayerTooltips;
            ch.hideCharacterNames = this.hideCharacterNames;
            return ch;
          }),
          (character) => { // Add
            character.add(this);
            character.setClickCallback(() => { // Zoom to character on marker click
              this.trackingCharacterId = character.id;
            });
          },
          (character) => { // Remove
            character.remove(this);
          },
          (character, updated) => { // Update
            if (this.trackingCharacterId === updated.id) {
              if (this.mapid !== updated.map) {
                this.changeMap(updated.map);
              }
              let latlng = this.map.unproject([updated.position.x, updated.position.y], HnHMaxZoom);
              this.map.setView(latlng, this.map.getZoom());
            }
            character.update(this, updated);
          }
      );
      this.players.length = 0;
      this.characters.getElements().forEach(it => this.players.push(it));
    },
    processConfig(config) {
      document.title = config.title;
      this.auths = config.auths;
      this.username = config.username;
    },
    toLatLng(x, y) {
      return this.map.unproject([x, y], HnHMaxZoom);
    },
    sendPing(latlng) {
      let point = this.map.project(latlng, HnHMaxZoom);
      this.$http.get(`${API_ENDPOINT}/v1/ping`, {
        params: {map: this.mapid, x: Math.round(point.x), y: Math.round(point.y)}
      });
    },
    jumpToPing() {
      this.pingSnackbar.show = false;
      if (this.mapid !== this.pingSnackbar.map) {
        this.changeMap(this.pingSnackbar.map);
      }
      let latLng = this.toLatLng(this.pingSnackbar.x, this.pingSnackbar.y);
      this.map.setView(latLng, HnHMaxZoom);
      this.showPingMarker(latLng);
    },
    showPingMarker(latlng) {
      if (this.pingMarker) {
        this.map.removeLayer(this.pingMarker);
        this.pingMarker = null;
      }
      this.pingMarker = L.circleMarker(latlng, {radius: 12, color: '#FF0000', weight: 3, fillColor: '#FF0000', fillOpacity: 0.3}).addTo(this.map);
      setTimeout(() => {
        if (this.pingMarker) {
          this.map.removeLayer(this.pingMarker);
          this.pingMarker = null;
        }
      }, 8000);
    },
    playPingSound() {
      let audio = new Audio('/map/api/v1/pingSound?t=' + Date.now());
      audio.addEventListener('error', () => this.playDefaultPingSound());
      audio.play().catch(() => this.playDefaultPingSound());
    },
    playDefaultPingSound() {
      let ctx = new (window.AudioContext || window.webkitAudioContext)();
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    },
    zoomOut() {
      this.trackingCharacterId = -1;
      this.map.setView([0, 0], HnHMinZoom);
    },
    wipeTile(data) {
      this.$http.get(`${API_ENDPOINT}/admin/wipeTile`, {params: {...data.coords, map: this.mapid}});
    },
    hideMarker(data) {
      this.$http.get(`${API_ENDPOINT}/admin/hideMarker`, {params: {id: data.id}});
      this.markers.byId(data.id).remove(this);
    },
    queryCoordSet(data) {
      this.coordSetFrom = data.coords;
      this.$modal.show('coordSet');
    },
    setCoords(form) {
      this.$http.get(`${API_ENDPOINT}/admin/setCoords`, {
        params: {
          map: this.mapid,
          fx: this.coordSetFrom.x,
          fy: this.coordSetFrom.y,
          tx: this.coordSet.x,
          ty: this.coordSet.y,
        }
      });
    },
    changeMap(mapid) {
      if (mapid !== this.mapid) {
        this.mapid = mapid;
        this.layer.map = this.mapid;
        this.layer.redraw();
        this.overlayLayer.map = -1;
        this.overlayLayer.redraw();
        if (this.showMarkers) {
          this.otherMarks.forEach(it => it.remove(this));
          this.otherMarks.filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(false);
          });
        }
        if (this.showThingwalls) {
          this.thingMarks.forEach(it => it.remove(this));
          this.thingMarks.filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(this.showThingwallTooltips);
          });
        }
        if (this.showQuests) {
          this.questMarks.forEach(it => it.remove(this));
          this.questMarks.filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(this.showQuestTooltips);
          });
        }
        if (this.showClutter) {
          this.clutterMarks.forEach(it => it.remove(this));
          this.clutterMarks.filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
        if (this.showPlayers) {
          this.characters.getElements().forEach(it => it.remove(this));
          this.characters.getElements().filter(it => it.map === this.mapid).forEach(it => {
            it.add(this);
            it.tooltip(this.showPlayerTooltips);
          });
        }
        if (this.showRoads) {
          this.roads.getElements().forEach(it => it.remove(this));
          this.roads.getElements().filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
        if (this.showCustomMarkers) {
          this.customMarkers.getElements().forEach(it => it.remove(this));
          this.customMarkers.getElements().filter(it => it.map === this.mapid).forEach(it => it.add(this));
        }
      }
    }
  }
}
</script>

<style>
.container {
  max-width: 100%;
  padding: 0px !important;
}

.map {
  width: 100vw;
  height: calc(100vh - 56px);
}

.leaflet-container {
  background: #000;
}

.player-pulse-icon {
  background: transparent;
  border: none;
}

.custom-marker-icon {
  background: transparent;
  border: none;
}

.color-swatches {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}

.color-swatch {
  display: inline-block;
  width: 26px;
  height: 36px;
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
}

.color-swatch.selected {
  outline: 2px solid #FF9800;
  background: rgba(255, 152, 0, 0.15);
}

.player-pulse {
  position: relative;
  width: 24px;
  height: 24px;
}

.player-pulse-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  margin: -7.5px 0 0 -7.5px;
  background: #ff0000;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 0, 0, 0.9);
}

.player-pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  margin: -7.5px 0 0 -7.5px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.7);
  animation: player-pulse-anim 1.5s ease-out infinite;
}

@keyframes player-pulse-anim {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(3.5);
    opacity: 0;
  }
}

.leaflet-control {
  margin: auto !important;
}

.map-tile {
  border-bottom: 1px solid #404040;
  border-right: 1px solid #404040;
  color: #404040;
  font-size: 12px;
}

.map-tile-text {
  position: absolute;
  left: 2px;
  top: 2px;
  color: #FDB800;
  font-size: 10px;
  text-shadow: -1px -1px #000, 1px 1px #000, -1px 1px #000, 1px -1px #000;
}

.control-panel {
  position: absolute;
  top: 10%;
  left: 10px;
  z-index: 502;
}

.v-list-item {
  padding: 0px !important;
  min-height: 0px !important;
  margin-left: 0 !important;
  height: auto !important;
}

.v-btn {
  padding: 0px !important;
}

.short-btn {
  min-height: auto !important;
  height: auto !important;
  text-transform: none !important;
}

.v-list {
  padding: 5px !important;
  height: auto !important;
  min-height: 0px !important;
}

.v-navigation-drawer__content {
  padding: 0px !important;
}

.v-navigation-drawer {
  width: auto !important;
}

.v-text-field__details {
  min-height: 0px !important;
  margin: 0px !important;
}

.v-messages {
  min-height: 0px !important;
}

.v-list-item__content {
  padding: 0px !important;
}

.v-input__slot {
  padding: 0px 5px !important;
}

.leaflet-tooltip {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #FDB800 !important;
  font-size: 10px !important;
  text-shadow: -1px -1px #000, 1px 1px #000, -1px 1px #000, 1px -1px #000 !important;
}

.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
  border: none !important;
}

.leaflet-popup-content-wrapper {
  background: transparent !important;
  box-shadow: none !important;
}

.leaflet-popup-content {
  font-size: 13px !important;
  color: #ffffff !important;
  text-shadow: -1px -1px #000, 1px 1px #000, -1px 1px #000, 1px -1px #000 !important;
  text-align: center !important;
}

.leaflet-popup-tip {
  display: none !important;
}

.hidden {
  display: none;
}

@import '~vue-context/dist/css/vue-context.css';
</style>