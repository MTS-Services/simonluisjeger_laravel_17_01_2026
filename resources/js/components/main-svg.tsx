import React, { Suspense, lazy } from 'react';

import BaseLayer from "./svg-paths/base-layer";
import WaterWave from "./svg-paths/water-wave";
import WaterMask from "./svg-paths/water-mask";
import TreeOne from "./svg-paths/tree-one";
import TreeTwo from "./svg-paths/tree-two";

// import Mount from "./svg-paths/mount";
// import ArtProjectAtMit from "./svg-paths/art-project-at-mit";
// import ArtProjectInStudioCalder from "./svg-paths/art-project-in-studio-calder";
// import ArtProjectParasit from "./svg-paths/art-project-parasit";
// import Balloon from "./svg-paths/balloon";
// import Dipper from "./svg-paths/dipper";
// import DroneWithAirflowSensor from "./svg-paths/drone-with-airflow-sensor";
// import ElectricJaguarEType from "./svg-paths/electric-jaguar-e-type";
// import LisEagleMorphing from "./svg-paths/lis-eagle-morphing";
// import LisEaglePerching from "./svg-paths/lis-eagle-perching";
// import Snowboarder from "./svg-paths/snowboarder";
// import TensegrityDrone from "./svg-paths/tensegrity-drone";
// import SnowborderOutline from "./svg-paths/snowborder-outline";
// import SimonJeger from './svg-paths/simon-jeger';

const Mount = lazy(() => import("./svg-paths/mount"));
const SnowborderOutline = lazy(() => import("./svg-paths/snowborder-outline"));
const SimonJeger = lazy(() => import("./svg-paths/simon-jeger"));
const Snowboarder = lazy(() => import("./svg-paths/snowboarder"));
const LisEaglePerching = lazy(() => import("./svg-paths/lis-eagle-perching"));
const ArtProjectInStudioCalder = lazy(() => import("./svg-paths/art-project-in-studio-calder"));
const ElectricJaguarEType = lazy(() => import("./svg-paths/electric-jaguar-e-type"));
const Balloon = lazy(() => import("./svg-paths/balloon"));
const LisEagleMorphing = lazy(() => import("./svg-paths/lis-eagle-morphing"));
const Dipper = lazy(() => import("./svg-paths/dipper"));
const ArtProjectParasit = lazy(() => import("./svg-paths/art-project-parasit"));
const DroneWithAirflowSensor = lazy(() => import("./svg-paths/drone-with-airflow-sensor"));
const TensegrityDrone = lazy(() => import("./svg-paths/tensegrity-drone"));
const ArtProjectAtMit = lazy(() => import("./svg-paths/art-project-at-mit"));


// The 11 IDs you requested
export type ProjectID =
  | 'liseagle_perching' | 'art_calder' | 'triamp'
  | 'balloon' | 'liseagle_morphing' | 'dipper' | 'art_parasit'
  | 'airflow' | 'tensegrity' | 'art_mit' | 'snowboarder';

interface MainSvgProps {
  onSelect: (id: ProjectID) => void;
  activeId: ProjectID | null;
}

export default function MainSvg({ onSelect, activeId }: MainSvgProps) {

  const InteractiveGroup = ({ id, children }: { id: ProjectID, children: React.ReactNode }) => (
    <g
      className={`map-element ${activeId === id ? 'is-active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {children}
    </g>
  );

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="250 600 4500 4000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {/* BACKGROUNDS */}
      <BaseLayer />
      <WaterMask />
      <WaterWave />
      <TreeOne />
      <TreeTwo />

      <Suspense fallback={<g />}>
        <Mount />

        <SnowborderOutline />

        {/* 11 INTERACTIVE ELEMENTS */}
        <InteractiveGroup id="snowboarder"><Snowboarder /><SimonJeger /></InteractiveGroup>
        <InteractiveGroup id="liseagle_perching"><LisEaglePerching /></InteractiveGroup>
        <InteractiveGroup id="art_calder"><ArtProjectInStudioCalder /></InteractiveGroup>
        <InteractiveGroup id="triamp"><ElectricJaguarEType /></InteractiveGroup>
        <InteractiveGroup id="balloon"><Balloon /></InteractiveGroup>
        <InteractiveGroup id="liseagle_morphing"><LisEagleMorphing /></InteractiveGroup>
        <InteractiveGroup id="dipper"><Dipper /></InteractiveGroup>
        <InteractiveGroup id="art_parasit"><ArtProjectParasit /></InteractiveGroup>
        <InteractiveGroup id="airflow"><DroneWithAirflowSensor /></InteractiveGroup>
        <InteractiveGroup id="tensegrity"><TensegrityDrone /></InteractiveGroup>
        <InteractiveGroup id="art_mit"><ArtProjectAtMit /></InteractiveGroup>
      </Suspense>
    </svg>
  );
}