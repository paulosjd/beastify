
import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

type MarkerObj = {
  markerOffset: number;
  name: string;
  coordinates: [number, number]
};

const markers: MarkerObj[] = [
  { markerOffset: 0, name: "Lima", coordinates: [-1.3443, 50.2334] }
];

const CragMap = () => {
  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [4.4, -50.9, 0],
        scale: 24000,
      }}
      style={{ width: "40%", height: "auto" }}
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