const circle1 = new mojs.Shape({
  fill:           'none',
  radius:         25,
  strokeWidth:    { 50 : 0 },
  scale:          { 0: 1 },
  angle:          { 'rand(-35, -70)': 0 },
  duration:       500,
  left: 0,        top: 0,
  easing: 'cubic.out',
  // unique props
  stroke:         'cyan',
});

const circle2 = new mojs.Shape({
  fill:           'none',
  radius:         25,
  strokeWidth:    { 50 : 0 },
  scale:          { 0: 1 },
  angle:          { 'rand(-35, -70)': 0 },
  duration:       500,
  left: 0,        top: 0,
  easing: 'cubic.out',
  // unique props
  radius:         { 0 : 15 },
  strokeWidth:    { 30: 0 },
  stroke:         'magenta',
  delay:          'rand(75, 150)'
});

export {circle1, circle2};
