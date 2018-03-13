
export const filterActorsByViewport = ({ ne, sw }, a) => {
  const { lat, lng } = a;
  if (!ne || !sw || !lat || !lng) {
    return true;
  }
  const top = (ne.lat > parseFloat(lat));
  const bottom = (parseFloat(lat) > sw.lat);
  const right = (parseFloat(lng) < ne.lng);
  const left = (parseFloat(lng) > sw.lng);

  const horizontal = (top && bottom);
  const vertical = (right && left);
  return (horizontal && vertical);
};

export const filterActors = ( a, {selectedZone, selectedTypos, selectedKeywords} ) => {
  const {zone, typo, id} = a;
  const zoneOk = selectedZone !== "default" ? zone && zone.find(e => e.id == selectedZone) : true;
  const typoOk = selectedTypos !== "default" ? typo && typo.find(e => e.id == selectedTypos) : true;
  const keywordsOk = !selectedKeywords || selectedKeywords.find(e => e == id);
  return zoneOk && typoOk && keywordsOk;
}

export const findClassHtmlCollection = (klass, collection) => {
  for (var i = collection.length - 1; i >= 0; i--) {
    if (collection[i].classList.contains(klass)) {
      return collection[i];
    }
  }
  return null;
}

export const animateMarker = (markerId, active) => {
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