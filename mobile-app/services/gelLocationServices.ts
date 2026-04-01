
export const getLocation = async (lat : number , lon : number) => {
    const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:3000,${lat},${lon});
      node["amenity"="police"](around:3000,${lat},${lon});
      node["office"="government"](around:3000,${lat},${lon});
    );
    out;
  `;

    const res = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: query,
        }
    );

    const data = await res.json();
    return data.elements;
}