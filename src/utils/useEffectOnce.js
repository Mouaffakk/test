import { useEffect, useRef } from "react";
export const useEffectOnce = (effect, values) => {
  const destroyFunc = useRef();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }
  useEffect(() => {
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }
    return () => {
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
      effectCalled.current = false;
    };
  }, [...values]);
};
