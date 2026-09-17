import { describe, expect, it } from "vitest";

import { angleBetween } from "../lib/pose/angle";
import { PushupCounter } from "../lib/pose/pushup-counter";

describe("angleBetween", () => {
  it("devuelve 180° para tres puntos en línea recta (brazo extendido)", () => {
    const shoulder = { x: 0, y: 0 };
    const elbow = { x: 0, y: 1 };
    const wrist = { x: 0, y: 2 };
    expect(angleBetween(shoulder, elbow, wrist)).toBeCloseTo(180, 5);
  });

  it("devuelve 90° para un ángulo recto (codo doblado en L)", () => {
    const shoulder = { x: 0, y: 0 };
    const elbow = { x: 0, y: 1 };
    const wrist = { x: 1, y: 1 };
    expect(angleBetween(shoulder, elbow, wrist)).toBeCloseTo(90, 5);
  });

  it("devuelve 180 por defecto si dos puntos coinciden (evita NaN)", () => {
    const shoulder = { x: 0, y: 0 };
    const elbow = { x: 0, y: 0 };
    const wrist = { x: 1, y: 1 };
    expect(angleBetween(shoulder, elbow, wrist)).toBe(180);
  });
});

describe("PushupCounter", () => {
  it("no cuenta nada si el ángulo se queda siempre arriba", () => {
    const counter = new PushupCounter();
    expect(counter.feed(170).repCompleted).toBe(false);
    expect(counter.feed(165).repCompleted).toBe(false);
  });

  it("cuenta una repetición tras un ciclo completo abajo → arriba", () => {
    const counter = new PushupCounter();
    expect(counter.feed(170).repCompleted).toBe(false); // arriba (posición inicial)
    expect(counter.feed(80).repCompleted).toBe(false); // abajo
    expect(counter.feed(170).repCompleted).toBe(true); // arriba de nuevo -> rep completa
  });

  it("no cuenta una segunda vez si se queda arriba sin volver a bajar", () => {
    const counter = new PushupCounter();
    counter.feed(80);
    expect(counter.feed(170).repCompleted).toBe(true);
    expect(counter.feed(175).repCompleted).toBe(false);
  });

  it("ignora ángulos intermedios (zona muerta entre 95° y 155°)", () => {
    const counter = new PushupCounter();
    counter.feed(80); // abajo
    expect(counter.feed(120).repCompleted).toBe(false); // en medio, no cuenta todavía
    expect(counter.feed(160).repCompleted).toBe(true); // ahora sí llega arriba
  });

  it("cuenta varias repeticiones seguidas", () => {
    const counter = new PushupCounter();
    let completedCount = 0;
    const sequence = [170, 80, 170, 80, 170, 80, 170];
    for (const angle of sequence) {
      if (counter.feed(angle).repCompleted) completedCount += 1;
    }
    expect(completedCount).toBe(3);
  });

  it("reset() vuelve a empezar el ciclo desde cero", () => {
    const counter = new PushupCounter();
    counter.feed(80);
    counter.reset();
    expect(counter.feed(170).repCompleted).toBe(false);
  });
});
