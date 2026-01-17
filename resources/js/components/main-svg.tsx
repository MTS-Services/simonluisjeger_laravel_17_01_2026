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

export default function MainSvg() {
  return (
    <>
        <svg
          width="1000"
          height="1000"
          viewBox="0 0 5000 5000"
          fill="none"
          version="1.1"
          id="svg1151"
          inkscape:export-filename="Drones.jpg"
          inkscape:export-xdpi="96"
          inkscape:export-ydpi="96"
          xmlns="http://www.w3.org/2000/svg">

          {/* Snowborder outline */}
          <SnowborderOutline />

          {/* Water hide mask */}
          <WaterMask />

          {/* Base Layer */}
          <BaseLayer />

          {/* Art project at MIT */}
          <ArtProjectAtMit />

          {/* Drone with airflow Sensor */}
          <DroneWithAirflowSensor />

          {/* Water Wave */}
          <WaterWave />

          {/* Dipper */}
          <Dipper />

          {/* Art project parasit */}
          <ArtProjectParasit />

          {/* Art project in Studio Calder */}
          <ArtProjectInStudioCalder />
          
          {/* Balloon */}
          <Balloon />

          {/* Electric Jaguar E type */}
        <ElectricJaguarEType />

          {/* Tensegrity Drone */}
          <TensegrityDrone />

        {/* Tree One  */}
        <TreeOne />
        {/* Tree Two  */}
        <TreeTwo />
          
        {/* Mount */}
          <Mount />

        {/* Snowboarder */}
          <Snowboarder />

        {/* LisEagle perching */}
        <LisEaglePerching />

          {/* LisEagle morphing */}
          <LisEagleMorphing />
        </svg>
    </>
  )
}
