import p5 from "p5";
import { PCCS } from "color-system";

function* range(start: number, end: number, step: number = 1) {
  let i = start;
  while (i < end) {
    yield i;
    i += step;
  }
}

const sides = ["top", "right", "bottom", "left"] as const;
type Side = typeof sides[number];

const getRandomPoint = (p: p5, side: Side, w: number, h: number): p5.Vector => {
  if (side === "top") {
    return p.createVector(p.random(w), 0);
  }
  if (side === "right") {
    return p.createVector(w, p.random(h));
  }
  if (side === "bottom") {
    return p.createVector(p.random(w), h);
  }
  return p.createVector(0, p.random(h));
};

const getCornerPoint = (
  p: p5,
  side1: Side,
  side2: Side,
  w: number,
  h: number
): p5.Vector => {
  const sides = [side1, side2];

  if (sides.includes("top") && sides.includes("left")) {
    return p.createVector(0, 0);
  }
  if (sides.includes("top") && sides.includes("right")) {
    return p.createVector(w, 0);
  }
  if (sides.includes("bottom") && sides.includes("left")) {
    return p.createVector(0, h);
  }
  return p.createVector(w, h);
};

const drawGraphic = (p: p5, g: p5.Graphics, w: number, h: number) => {
  g.background(0);
  g.fill(1);
  g.noStroke();

  const side1: Side = p.random([...sides]);
  const point1: p5.Vector = getRandomPoint(p, side1, w, h);

  const side2: Side = sides[(sides.indexOf(side1) + 1) % sides.length];
  const point2: p5.Vector = getRandomPoint(p, side2, w, h);

  const cornerPoint = getCornerPoint(p, side1, side2, w, h);

  g.beginShape();
  g.vertex(point1.x, point1.y);
  g.vertex(point2.x, point2.y);
  g.vertex(cornerPoint.x, cornerPoint.y);
  g.endShape();
};

const sketch = (p: p5) => {
  const margin = 0;
  const w = p.windowWidth - margin;
  const h = p.windowHeight - margin;
  const lowSats = [...PCCS.lowSaturationTones];
  const midSats = [...PCCS.middleSaturationTones];

  p.setup = () => {
    p.createCanvas(w, h);
    p.noLoop();
  };

  p.draw = () => {
    const tones = p.random([
      lowSats,
      midSats,
      [...lowSats].reverse(),
      [...midSats].reverse(),
      [...lowSats, ...[...midSats].reverse()],
      [...lowSats, ...[...midSats].reverse()].reverse(),
      [...[...lowSats].reverse(), ...midSats],
      [...[...lowSats].reverse(), ...midSats].reverse(),
    ]) as PCCS.Tone[];
    const hue = p.random([...PCCS.hues]) as PCCS.Hue;
    const colors = [
      ...tones
        .map((tone) => ({
          tone: tone as Exclude<PCCS.Tone, "v">,
          hue,
        }))
        .map(PCCS.pccs2rgb),
    ];

    const polygonNumbers = p.random(3, colors.length);

    const baseGraphic = p.createGraphics(w, h);
    baseGraphic.blendMode(p.ADD);
    [...range(0, polygonNumbers)].forEach((_) => {
      const g = p.createGraphics(w, h);
      drawGraphic(p, g, w, h);
      baseGraphic.image(g, 0, 0);
      g.remove();
    });

    baseGraphic.loadPixels();
    baseGraphic.pixels.forEach((v, i) => {
      const rgba = i % 4;
      if (rgba === 3) {
        return;
      }
      const rgb = ["r", "g", "b"][rgba] as "r" | "g" | "b";
      const color = colors[v % colors.length];
      baseGraphic.pixels[i] = color[rgb];
    });
    baseGraphic.updatePixels();

    p.image(baseGraphic, margin, margin);
    baseGraphic.remove();
  };

  p.mouseClicked = () => {
    p.redraw();
  };
};

new p5(sketch, document.getElementById("main")!);
