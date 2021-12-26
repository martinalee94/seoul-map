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

// load seoul topojson
import SeoulMap from "./seoul";
const lodash = require("lodash");

const mapWidth =600;
const mapHeight=300;
const defaultMap = lodash.cloneDeep(SeoulMap)
const MAX_ZOOM = 5
// https://gka.github.io/chroma.js/ 참고
const scl = chroma
  .scale(["#02343F", "#F0EDCC"])  //지도 색깔 바꾸는 곳 [시작색, 마지막색]
  .mode("lch") // 컬러 생성 모드
  .colors(8); //8가지 컬러

const DEFAULT_COORDINATION = [126.98820917938465,37.55105648528907] //맨 처음 지도가 렌더링 됐을때 센터 값

const MapChart = ({ setTooltipContent }) => { 
    //
    const [map, setMap] = useState(SeoulMap)
    // 줌 상태인지 check
    const [isZoom, setIsZoom] = useState(false); 
    // FIXME: 현재 작동 안됨.
    const [zoomLevel, setZoomLevel] = useState(1) 
    // 지도 중심 좌표
    const [center, setCenter] = useState(DEFAULT_COORDINATION);
    return (
      <div className="jido">

        <Spring
            from={{ zoom: 1 }}
            to={{ zoom: zoomLevel }}
            config={config.slow}
        >
            {(styles) =>(
            <ComposableMap  
            width={mapWidth}
            height={mapHeight}
                projection="geoMercator"
                projectionConfig={{rotate: [-60, 0, 5], scale: 35000, }} 
                data-tip=""
            >
              <ZoomableGroup 
                  center={center} 
                  zoom={styles.zoom}
              >
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
                                const { name, code } = geo.properties;
                                setTooltipContent(`${name} : ${code}`);
                            }}
                            onMouseLeave={() => {
                                setTooltipContent("");
                            }}
                            onClick={() => {
                                if(!isZoom){ 
                                    // FIXME: 깊은복사 문제 ( 질문 해야 함 )
                                    const copyObj = lodash.cloneDeep(SeoulMap)
                                    const target = copyObj.objects.seoul_municipalities_geo.geometries.filter(x=>{ 
                                        return x.properties.code===geo.properties.code
                                    })
                                    copyObj.objects.seoul_municipalities_geo.geometries = target 

                                    const centroid = geoCentroid(geo);
                                    setMap(copyObj)
                                    setCenter(centroid)
                                    setIsZoom(!isZoom); 
                                    setZoomLevel(MAX_ZOOM);
                                }
                                else{
                                    setIsZoom(!isZoom);
                                    setMap(defaultMap)
                                    setCenter(DEFAULT_COORDINATION) 
                                    setZoomLevel(1);
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
