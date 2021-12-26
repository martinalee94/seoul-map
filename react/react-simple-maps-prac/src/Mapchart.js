import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup, 
} from "react-simple-maps";
import chroma from "chroma-js";
import { Spring, config } from "react-spring";
import { geoCentroid } from "d3-geo";

import test from "./test";
const lodash = require("lodash");

console.log(test)
const defaultMap = lodash.cloneDeep(test)

console.log(defaultMap)
/*
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const colorScale = chroma.brewer.Oranges.slice(1);
const colors = Array(180)

  .fill()
  .map(d => colorScale[getRandomInt(0, colorScale.length - 1)]);
*/
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let copy = {};
  for (let key in obj) {
    copy[key] = deepCopy(obj[key]);
  }
  return copy;
}
const scl = chroma
  .scale(["#02343F", "#F0EDCC"])  //choose specific color here
  .mode("lch")
  .colors(8);

const DEFAULT_COORDINATION = [126.98820917938465,37.55105648528907]

const MapChart = ({ setTooltipContent }) => { 
    const [map, setMap] = useState(test)
    const [geoMap, setGeoMap] = useState('0');
    const [zoomLevel, setZoomLevel] = useState(1) 
    const [springZoomLevel, setSpringZoomLevel] = useState(1) 
    const [center, setCenter] = useState(DEFAULT_COORDINATION);
    return (
      <div className="jido">

        <Spring
            from={{ zoom: 1 }}
            to={{ zoom: {springZoomLevel} }}
            config={config.slow}
        >
            {styles =>(
            <ComposableMap  
            width={800}
            height={300}
                projection="geoMercator"
                projectionConfig={{rotate: [-60, 0, 5], scale: 35000, }}
                style={{ width: "100%", height: "auto" }}
                data-tip=""
            >
              <ZoomableGroup center={center} zoom={zoomLevel}>
                <Geographies geography={map}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => {
                        return <Geography key={geo.rsmKey} geography={geo}
                            style={{
                                default: {
                                    fill: scl[i%8],
                                    outline: "none"
                                },
                                hover: {
                                    fill:'#A4193D',
                                    outline: "none"
                                },
                                pressed: {
                                    fill: scl[i%8],
                                    outline: "none"
                                }
                            }}
                            onMouseEnter={() => {
                                console.log(geoMap)
                                const { name, code } = geo.properties;
                                setTooltipContent(`${name} : ${code}`);
                            }}
                            onMouseLeave={() => {
                                setTooltipContent("");
                            }}
                            onClick={() => {
                                if(geoMap === '0'){
                                  
                                  console.log(defaultMap)
                                    const copyObj = lodash.cloneDeep(test)
                                    // copyObj.objects.seoul_municipalities_geo.geometries={}

                                    const target = copyObj.objects.seoul_municipalities_geo.geometries.filter(x=>{ 
                                        return x.properties.code===geo.properties.code
                                    })
                                    copyObj.objects.seoul_municipalities_geo.geometries = target 

                                    const centroid = geoCentroid(geo);
                                    setMap(copyObj)
                                    setCenter(centroid)
                                    console.log(centroid)
                                    // alert(`현재 유저가 클릭한 구:` + geo.properties.name);
                                    setGeoMap(geo.properties.name);
                                    setZoomLevel(4);
                                    setSpringZoomLevel(60);
                                    console.log(geoMap)
                                }
                                else{
                                    setGeoMap('0');
                                    console.log(defaultMap);
                                    setMap(defaultMap)
                                    // console.log("sss")
                                    // console.log(test)
                                    setCenter(DEFAULT_COORDINATION)
                                    setZoomLevel(1);
                                    setSpringZoomLevel(1);
                                }
                            }}
                        />
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            )}
        </Spring>
      </div>
    );
  };
  
  export default MapChart;
