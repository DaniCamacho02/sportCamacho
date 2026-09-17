import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { Buffer } from "buffer";

import { angleBetween, type Point } from "./angle";

const MIN_KEYPOINT_SCORE = 0.3;

let detectorPromise: Promise<poseDetection.PoseDetector> | null = null;

/**
 * Carga el modelo MoveNet (Lightning, el más ligero). La primera vez descarga
 * los pesos de internet (unos pocos MB) y tarda algo más; luego queda en caché
 * en memoria mientras la app siga abierta.
 */
export function preloadPoseModel(): Promise<poseDetection.PoseDetector> {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      await tf.ready();
      await tf.setBackend("cpu");
      return poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
    })();
  }
  return detectorPromise;
}

export type ElbowReading = {
  /** Ángulo del codo en grados, o null si no se detectó el brazo con suficiente confianza. */
  angle: number | null;
  confidence: number;
};

function keypointsByName(keypoints: poseDetection.Keypoint[]) {
  const map: Record<string, poseDetection.Keypoint> = {};
  for (const keypoint of keypoints) {
    if (keypoint.name) map[keypoint.name] = keypoint;
  }
  return map;
}

/** Elige el lado (izquierdo o derecho) del que la cámara ve mejor el brazo. */
function pickBestArm(keypoints: poseDetection.Keypoint[]) {
  const byName = keypointsByName(keypoints);
  const score = (side: "left" | "right") =>
    (byName[`${side}_shoulder`]?.score ?? 0) + (byName[`${side}_elbow`]?.score ?? 0) + (byName[`${side}_wrist`]?.score ?? 0);

  const side = score("right") >= score("left") ? "right" : "left";
  return {
    shoulder: byName[`${side}_shoulder`],
    elbow: byName[`${side}_elbow`],
    wrist: byName[`${side}_wrist`],
  };
}

/**
 * Analiza una foto (JPEG en base64, tal como la devuelve CameraView.takePictureAsync)
 * y devuelve el ángulo del codo más fiable que encuentre.
 */
export async function estimateElbowAngle(base64Jpeg: string): Promise<ElbowReading> {
  const detector = await preloadPoseModel();
  const bytes = new Uint8Array(Buffer.from(base64Jpeg, "base64"));
  const imageTensor = decodeJpeg(bytes, 3);

  try {
    const poses = await detector.estimatePoses(imageTensor, { flipHorizontal: false });
    if (poses.length === 0) return { angle: null, confidence: 0 };

    const { shoulder, elbow, wrist } = pickBestArm(poses[0].keypoints);
    if (!shoulder || !elbow || !wrist) return { angle: null, confidence: 0 };

    const confidence = Math.min(shoulder.score ?? 0, elbow.score ?? 0, wrist.score ?? 0);
    if (confidence < MIN_KEYPOINT_SCORE) return { angle: null, confidence };

    const shoulderPoint: Point = { x: shoulder.x, y: shoulder.y };
    const elbowPoint: Point = { x: elbow.x, y: elbow.y };
    const wristPoint: Point = { x: wrist.x, y: wrist.y };

    return { angle: angleBetween(shoulderPoint, elbowPoint, wristPoint), confidence };
  } finally {
    imageTensor.dispose();
  }
}
