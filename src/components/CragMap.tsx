import React, {useContext, useState} from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { CRAG_MAP_ZOOM, CRAG_MAP_CENTER_LAT, CRAG_MAP_CENTER_LON } from '../lib/constants'
import { AppContext } from "../AppContext";

type MarkerObj = {
  markerOffset: number;
  name: string;
  coordinates: [number, number]
};

type MarkerItem = {
  name: string;
  coordinates: string
};

type CragMapProps = {
  markerItems: MarkerItem[];
}

const CragMap = ({ markerItems }: CragMapProps) => {

  const { userConfig: { mapCenterLat, mapCenterLon, mapZoom }} = useContext(AppContext);

  const markers: MarkerObj[] = markerItems.map((item) => {
    const [lat, lon] = item.coordinates.split(',').slice(0,2);
    return { markerOffset: 0, name: item.name, coordinates: [parseFloat(lon) || 0, parseFloat(lat) || 0] }
  });

  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [-(mapCenterLon ? mapCenterLon : CRAG_MAP_CENTER_LON), -(mapCenterLat ? mapCenterLat : CRAG_MAP_CENTER_LAT), 0],
        scale: mapZoom ? parseInt(mapZoom) * 1000 : CRAG_MAP_ZOOM,
      }}
      style={{ width: "50%", height: "auto" }}
    >
      <Geographies geography={'/uk-counties.json'}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D6D6DA"

            />
          ))
        }
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={10} fill="#F10" stroke="#fff" strokeWidth={2} />
          <text
            textAnchor="middle"
            y={markerOffset}
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
      ))}
    </ComposableMap>
  )
}

export default CragMap;