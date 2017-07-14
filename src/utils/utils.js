
export const filterActorsByViewport = ({ ne, sw }, { lat, lng }) => {
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

export const filterActors = ( {zone, district, typo}, {selectedZone, selectedDistrict, selectedTypos} ) => {
  const zoneOk = selectedZone !== "0" ? zone == selectedZone : true;
  const districtOk = selectedZone !== "0" && selectedDistrict !== "0" ? district == selectedDistrict : true;
  const typoOk = selectedTypos.length ? selectedTypos.indexOf(typo) !== -1 : true;
  return zoneOk && districtOk && typoOk;
}