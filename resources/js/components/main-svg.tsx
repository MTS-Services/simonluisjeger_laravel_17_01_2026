import React from 'react';
// Imports
import ArtProjectAtMit from "./svg-paths/art-project-at-mit";
import ArtProjectInStudioCalder from "./svg-paths/art-project-in-studio-calder";
import ArtProjectParasit from "./svg-paths/art-project-parasit";
import Balloon from "./svg-paths/balloon";
import BaseLayer from "./svg-paths/base-layer";
import Dipper from "./svg-paths/dipper";
import DroneWithAirflowSensor from "./svg-paths/drone-with-airflow-sensor";
import ElectricJaguarEType from "./svg-paths/electric-jaguar-e-type";
import LisEagleMorphing from "./svg-paths/lis-eagle-morphing";
import LisEaglePerching from "./svg-paths/lis-eagle-perching";
import Mount from "./svg-paths/mount";
import Snowboarder from "./svg-paths/snowboarder";
import TensegrityDrone from "./svg-paths/tensegrity-drone";
import TreeOne from "./svg-paths/tree-one";
import TreeTwo from "./svg-paths/tree-two";
import WaterWave from "./svg-paths/water-wave";
import SnowborderOutline from "./svg-paths/snowborder-outline";
import WaterMask from "./svg-paths/water-mask";

// The 11 IDs you requested
export type ProjectID =
  | 'simon_jeger' | 'liseagle_perching' | 'art_calder' | 'triamp'
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
      viewBox="250 600 4500 4500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {/* BACKGROUNDS */}
      <BaseLayer />
      <SnowborderOutline />
      <WaterMask />
      <WaterWave />
      <Mount />
      <TreeOne />
      <TreeTwo />

      {/* 11 INTERACTIVE ELEMENTS */}
      <InteractiveGroup id="simon_jeger">
        {/* Using an invisible rect as a placeholder for the top-left area if text is gone */}
        <rect x="50" y="50" width="1000" height="400" fill="transparent" />
      </InteractiveGroup>

      <InteractiveGroup id="snowboarder"><Snowboarder /></InteractiveGroup>
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
    </svg>
  );
}