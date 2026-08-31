export function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(origin, target) {
  if (!origin?.coordinates || !target?.coordinates) {
    return Number.POSITIVE_INFINITY;
  }

  const [lng1, lat1] = origin.coordinates;
  const [lng2, lat2] = target.coordinates;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}
