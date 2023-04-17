import { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';

export function DebugObserver() {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug('The following atoms were modified:');

      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
        console.debug(node.key, snapshot.getLoadable(node));
      }
    }
  }, [snapshot]);

  return null;
}
