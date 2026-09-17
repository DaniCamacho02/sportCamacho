import type { CameraView } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";

import { estimateElbowAngle } from "@/lib/pose/pose-model";
import { PushupCounter, type PushupPhase } from "@/lib/pose/pushup-counter";

const CAPTURE_INTERVAL_MS = 450;

export type PushupDetectorState = {
  active: boolean;
  modelLoading: boolean;
  phase: PushupPhase;
  lastAngle: number | null;
  lastConfidence: number;
};

/**
 * Mientras `active` es true, captura fotos de la cámara a intervalos y las
 * analiza con MoveNet para contar flexiones reales por ángulo de codo.
 * No usa un `setInterval` fijo: programa la siguiente captura solo cuando
 * termina de procesar la anterior, para no acumular trabajo si el modelo
 * tarda más que el intervalo en un móvil concreto.
 */
export function usePushupDetector(cameraRef: React.RefObject<CameraView | null>, active: boolean, onRep: () => void) {
  const [state, setState] = useState<PushupDetectorState>({
    active: false,
    modelLoading: true,
    phase: "unknown",
    lastAngle: null,
    lastConfidence: 0,
  });

  const counterRef = useRef(new PushupCounter());
  const onRepRef = useRef(onRep);
  onRepRef.current = onRep;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedRef = useRef(true);

  const runOnce = useCallback(async () => {
    if (stoppedRef.current || !cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3, skipProcessing: true });
      if (stoppedRef.current) return;
      if (photo?.base64) {
        const { angle, confidence } = await estimateElbowAngle(photo.base64);
        if (stoppedRef.current) return;
        setState((current) => ({ ...current, modelLoading: false, lastAngle: angle, lastConfidence: confidence }));
        if (angle != null) {
          const result = counterRef.current.feed(angle);
          setState((current) => ({ ...current, phase: result.phase }));
          if (result.repCompleted) onRepRef.current();
        }
      }
    } catch (error) {
      console.warn("[pushup-detector] Error analizando el frame:", error);
    } finally {
      if (!stoppedRef.current) {
        timeoutRef.current = setTimeout(runOnce, CAPTURE_INTERVAL_MS);
      }
    }
  }, [cameraRef]);

  useEffect(() => {
    stoppedRef.current = !active;
    setState((current) => ({ ...current, active }));

    if (active) {
      counterRef.current.reset();
      runOnce();
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      stoppedRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, runOnce]);

  return state;
}
