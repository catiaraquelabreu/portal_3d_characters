import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  useCursor,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { easing } from "maath";
import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Dragon } from "./Dragon";
import { Cactoro } from "./Cactoro";
import { Dino } from "./Dino";
import { useThree } from "@react-three/fiber";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);

      controlsRef.current.setLookAt(
        0,
        0,
        4,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 8, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="forest" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      <OrbitControls />

      <MonsterStage
        texture={"textures/planet_fire.png"}
        name="Dragonauro"
        color={"#df8d52"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}>
        <Dragon
          scale={0.5}
          position-y={-1}
          hovered={hovered === "Dragonauro"}
        />
      </MonsterStage>

      <MonsterStage
        texture={"textures/cactus.png"}
        name="Cactoro"
        color="#739d3c"
        position-x={active ? -0 : -2.5}
        rotation-y={active ? Math.PI / 200 : Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}>
        <Cactoro
          scale={0.5}
          position-y={-1}
          position-x={active ? 0 : 0}
          hovered={hovered === "Cactoro"}
        />
      </MonsterStage>

      <MonsterStage
        texture={"textures/jungle.png"}
        name="DinoBlau"
        color={"#38adcf"}
        position-x={active ? 0 : 2.5}
        rotation-y={active ? Math.PI / 200 : Math.PI / -12}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}>
        <Dino
          scale={0.5}
          position-y={-1}
          position-x={active ? 0 : 0}
          hovered={hovered === "DinoBlau"}
        />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.1, delta);
  });
  return (
    <group {...props}>
      <Text
        font="fonts/Rowdies-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.2, 0.051]}
        anchory={"bottom"}>
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}>
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[4, 62, 62]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
