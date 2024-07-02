import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { ModelProps } from '../components/Model';

const useModel = ({ url }: ModelProps) => {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return { scene: clonedScene };
};

export default useModel;
