import p5 from "p5";
import { PCCS, RGB } from "color-system";

function* range(start: number, end: number) {
  let i = start;
  while (i <= end) {
    yield i;
    i++;
  }
}

const sketch = (p: p5) => {
  let seed = 0;

  p.setup = () => {
    p.createCanvas(500, 500);
    // p.frameRate(2);
  };

  p.draw = () => {
    p.clear();

    const [x, y, w, h] = [0, 0, 500, 500];

    const hue = p.random([...PCCS.hues]);
    for (const areaX of range(1, 2)) {
      for (const areaY of range(1, 2)) {
        const pccsColor: PCCS.PCCSColor = (() => {
          const tone = p.random([...PCCS.tones]) as PCCS.Tone;

          return { tone, hue };
        })();
        const color: RGB.RGB = PCCS.pccs2rgb(pccsColor);

        p.noiseDetail(16, 0.5);
        p.noiseSeed(seed++);
        for (const dx of range(
          x + (w / 2 + 1) * (areaX - 1),
          x + (w / 2) * areaX
        )) {
          for (const dy of range(
            y + (h / 2 + 1) * (areaY - 1),
            y + (h / 2) * areaY
          )) {
            p.stroke(
              color.r,
              color.g,
              color.b,
              p.noise(dx * 0.002, dy * 0.002) * 255
            );
            p.point(dx, dy);
          }
        }
      }
    }
  };
};

new p5(sketch, document.getElementById("main")!);
