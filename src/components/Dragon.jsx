import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Dragon({ hovered, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/Dragon.gltf");
  const { actions } = useAnimations(animations, group);
  // console.log(actions);

  // ANIMATION CHARACTER
  useEffect(() => {
    const anim = hovered ? "Punch" : "Flying_Idle";
    actions[anim].reset().fadeIn(0.5).play();
    return () => {
      if (actions[anim]) {
        actions[anim].fadeOut(0.5);
      }
    };
  }, [hovered]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <skinnedMesh
            name="Dragon"
            geometry={nodes.Dragon.geometry}
            material={materials.Atlas}
            skeleton={nodes.Dragon.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Dragon.gltf");
