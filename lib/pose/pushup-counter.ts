export type PushupPhase = "unknown" | "up" | "down";

export type PushupFeedResult = {
  phase: PushupPhase;
  repCompleted: boolean;
};

/** Codo doblado por debajo de esto = "abajo". Brazo extendido por encima de esto = "arriba". */
export const DOWN_ANGLE_THRESHOLD = 95;
export const UP_ANGLE_THRESHOLD = 155;

/**
 * Cuenta una repetición completa cada vez que ve una transición limpia
 * abajo → arriba. Requiere haber pasado por "abajo" antes de contar el
 * "arriba", así que no cuenta temblores ni medio movimientos.
 */
export class PushupCounter {
  private phase: PushupPhase = "unknown";

  feed(elbowAngleDegrees: number): PushupFeedResult {
    let repCompleted = false;

    if (elbowAngleDegrees <= DOWN_ANGLE_THRESHOLD) {
      this.phase = "down";
    } else if (elbowAngleDegrees >= UP_ANGLE_THRESHOLD) {
      if (this.phase === "down") repCompleted = true;
      this.phase = "up";
    }

    return { phase: this.phase, repCompleted };
  }

  reset() {
    this.phase = "unknown";
  }
}
