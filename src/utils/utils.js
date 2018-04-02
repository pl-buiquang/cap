
export const filterActorsByViewport = ({ ne, sw }, a) => {
  const { lat, lng } = a;
  if (!ne || !sw || !lat || !lng) {
    return false;
  }
  const top = (ne.lat > parseFloat(lat));
  const bottom = (parseFloat(lat) > sw.lat);
  const right = (parseFloat(lng) < ne.lng);
  const left = (parseFloat(lng) > sw.lng);

  const horizontal = (top && bottom);
  const vertical = (right && left);
  const ok = (horizontal && vertical);
  return ok;
};

export const filterActors = ( a, {selectedTypos, selectedKeywords} ) => {
  const {zone, typo, id} = a;
  const typoOk = selectedTypos !== "default" ? typo && typo.find(e => e.id == selectedTypos) : true;
  const keywordsOk = !selectedKeywords || selectedKeywords.find(e => e == id);
  return typoOk && keywordsOk;
}

export const filteActorsByLocation = ( a, {selectedZone} ) => {
  const {zone, id} = a;
  const zoneOk = selectedZone !== "default" ? zone && zone.find(e => e.id == selectedZone) : true;
  return zoneOk;
}

export const findClassHtmlCollection = (klass, collection) => {
  for (var i = collection.length - 1; i >= 0; i--) {
    if (collection[i].classList.contains(klass)) {
      return collection[i];
    }
  }
  return null;
}

const findMarkerInCluster = (markerId, cluster) => {
  const marker = cluster._markers.find(m => m.options.id == markerId);
  if (marker) {
    return marker;
  }
  for (var i = cluster._childClusters.length - 1; i >= 0; i--) {
    const markerInCluster = findMarkerInCluster(markerId, cluster._childClusters[i]);
    if (markerInCluster) {
      return markerInCluster;
    }
  }
  return null;
}

const findMarker = (markerId, mapRef) => {
  const layers = Object.keys(mapRef._layers);
  for (var i = layers.length - 1; i >= 0; i--) {
    const layer = mapRef._layers[layers[i]];
    if (layer.options) {
      if (layer.options.pane === "markerPane") {
        const marker = findMarkerInCluster(markerId, layer);
        if (marker) {
          return marker;
        }
      } else if(layer.options.type === "capmarker") {
        if (layer.options.id == markerId) {
          return layer;
        }
      }
    } 
  }
  return null;
} 

export const animateMarker = (markerId, active, mapRef) => {
  const el = document.getElementById(`cap-marker-${markerId}`);
  if (el) {
    const pin = findClassHtmlCollection('pin', el.children);
    const base = findClassHtmlCollection('base', el.children);
    if (active) {
      if (pin && base) {
        pin.classList.add("bounce");
        base.classList.add("pulse");
      }
    } else {
      if (pin && base) {
        pin.classList.remove("bounce");
        base.classList.remove("pulse");
      }
    }
  }
}

export const sortByDate = (list, reverse = false) => {
  return list.sort(function(a,b){
    const res = new Date(b.creation_date) - new Date(a.creation_date);
    return reverse ? - res : res;
  });
}

export const sortByCommentCount = (list, reverse = false) => {
  return list.sort(function(a,b){
    const res = b.comment_count - a.comment_count;
    return reverse ? - res : res;
  }); 
}

const validLatLng = (actor) => {
  if (actor.lat && actor.lng) {
    try {
      const geo = {
        lat: parseFloat(actor.lat),
        lng: parseFloat(actor.lng)
      };
      if (geo.lat < 54.1109429427243 && 
        geo.lat > 39.825413103424786 &&
        geo.lng < 14.062500000000002 &&
        geo.lng > -10.634765625) {
        return geo;
      } else {
        console.log(actor, "Out of bound latlong...");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export const getBounds = (actors) => {
  const seed = actors.find(a => {
    return validLatLng(a);
  });
  if (seed) {
    const calculation = actors.reduce((center, a)=>{
      const geo = validLatLng(a);
      if (geo) {
        const newBounds = {
          top: center.top > geo.lat ? center.top : geo.lat,
          bottom: center.bottom > geo.lat ? geo.lat : center.bottom,
          right: center.right < geo.lng ? center.right : geo.lng,
          left: center.left < geo.lng ? geo.lng : center.left,
          count: center.count + 1
        };
        return newBounds;
      }
      return center;  
    }, {top:seed.lat, bottom:seed.lat, left:seed.lng, right: seed.lng, count: 0});
    if (calculation.count) {
      return {
        _northEast: {lat: calculation.top, lng: calculation.left}, 
        _southWest: {lat: calculation.bottom, lng: calculation.right}, 
      };
    }    
  }
}