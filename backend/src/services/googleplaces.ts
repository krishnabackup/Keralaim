import axios from "axios";

type OsmElement = {
  type: "node" | "way";
  id: number;
  lat?: number;
  lon?: number;
  nodes?: number[];
  tags?: Record<string, string>;
};

// Multiple Overpass API mirrors — try them in order
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.terrasso.de/api/interpreter",
];

const buildQuery = (lat: number, lon: number, type: string) => `
  [out:json][timeout:25];
  (
    node["amenity"="${type}"](around:5000,${lat},${lon});
    way["amenity"="${type}"](around:5000,${lat},${lon});
  );
  out body;
  >;
  out skel qt;
`;

async function fetchFromOverpass(query: string) {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await axios.post(
        endpoint,
        new URLSearchParams({ data: query }),
        { timeout: 10000 } // 10 second timeout per mirror
      );

      // Some mirrors return HTML error pages instead of throwing
      // So we check that the response is actually valid JSON with elements
      if (response.data?.elements && Array.isArray(response.data.elements)) {
        return response.data.elements;
      }
    } catch (err) {
      console.warn(`Mirror ${endpoint} failed, trying next...`);
      // Continue to next mirror
    }
  }

  // All mirrors failed
  throw new Error("All Overpass API mirrors are unavailable");
}

export async function getNearbyPlaces(lat: number, lon: number, type: string) {
  const query = buildQuery(lat, lon, type);

  // This now safely returns [] instead of crashing if API fails
  const elements = await fetchFromOverpass(query).catch(() => []);

  return filterLocations(elements); // elements is always an array now
}


const filterLocations = (elements: OsmElement[]) => {
     const NodeMap = new Map<number , {lat : number , lon : number}>();

     elements.forEach(el => {
        if(el.type === "node" && el.lat !== undefined && el.lon !== undefined){
            NodeMap.set(el.id , {lat : el.lat , lon : el.lon});
        }
     })

     return elements.filter(
      el => {
        const hasName = !!el.tags?.name;
        const hasType = !!el.tags?.amenity || !!el.tags?.office;
        return hasName && hasType;
      }
     )
     .map(el => {
      let lat : number | null = null;
      let lon : number | null = null;
      if(el.type === "node" && el.lat !== undefined && el.lon !== undefined){
        lat = el.lat;
        lon = el.lon;
      }
      else if(el.type === "way" && el.nodes){
        const coordinates = el.nodes.map(id => NodeMap.get(id)).
        filter( c => !!c) as {lat : number , lon : number}[];

        if(coordinates.length > 0){
            lat = coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
            lon = coordinates.reduce((sum, c) => sum + c.lon, 0) / coordinates.length;
        }
      }
      if(lat === null && lon === null) return null;
      return {
        id : el.id,
        name : el.tags?.name,
        type : el.tags?.amenity || el.tags?.office,
        lat,
        lon
      }
     }).filter(el => el !== null) as {id : number , name : string , type : string , lat : number , lon : number}[];
};

