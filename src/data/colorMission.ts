export const starPalette = [
  { id: "blue", name: "Blue", hex: "#65adff", kelvin: 25000, example: "Spica", zone: "hot" },
  { id: "white", name: "White", hex: "#eef5ff", kelvin: 10000, example: "Vega", zone: "hot" },
  { id: "yellow", name: "Yellow", hex: "#ffe071", kelvin: 6000, example: "Sun", zone: "warm" },
  {
    id: "orange",
    name: "Orange",
    hex: "#ffa458",
    kelvin: 4000,
    example: "Aldebaran",
    zone: "warm",
  },
  { id: "red", name: "Red", hex: "#ff6c7e", kelvin: 3000, example: "Betelgeuse", zone: "cool" },
] as const;
export type StarColor = (typeof starPalette)[number];
export const discoveryStars = [
  { name: "Blue", hex: "#65adff", family: "blue" },
  { name: "Green", hex: "#76edab", family: null },
  { name: "Yellow-white", hex: "#fff4bd", family: "yellow" },
  { name: "Red", hex: "#ff6c7e", family: "red" },
  { name: "Purple", hex: "#b58aff", family: null },
  { name: "White", hex: "#eef5ff", family: "white" },
  { name: "Orange", hex: "#ffa458", family: "orange" },
  { name: "Blue-white", hex: "#b9dcff", family: "white" },
  { name: "Pink", hex: "#ff9dd9", family: null },
  { name: "Yellow", hex: "#ffe071", family: "yellow" },
];
export const colorFacts = [
  {
    text: "Blue stars have hotter surfaces than red stars.",
    truth: true,
    why: "Blue is at the hot end of our stellar color scale.",
  },
  {
    text: "Every star has exactly the same color.",
    truth: false,
    why: "Stars range from reddish to bluish, with shades in between.",
  },
  {
    text: "A red star is cold enough to touch.",
    truth: false,
    why: "Even our coolest example is around 3,000 kelvin. All these stars are extremely hot!",
  },
  {
    text: "Star color gives clues about surface temperature.",
    truth: true,
    why: "Astronomers study a star's light to estimate its temperature.",
  },
  {
    text: "Our yellow learning example is the Sun.",
    truth: true,
    why: "We group the Sun with yellow stars here; its combined light looks white from space.",
  },
];
export const colorLessons = [
  {
    title: "THE HIDDEN RAINBOW",
    instruction: "Find star colors and fill all five color homes.",
    lines: [
      "Hi, I'm Nova! Many stars look silver-white and twinkly in the night sky. But stars have colors: blue, white, yellow, orange and red!",
      "Their colors blend through shades such as blue-white and yellow-white. Our eyes find faint colors harder to see. These cartoons make the colors easier to explore.",
      "Hover or touch a star to discover its color. Choose real star colors to fill five homes. Green, purple and pink are fantasy choices in this game.",
    ],
  },
  {
    title: "NOVA'S HEAT HARBORS",
    instruction: "Move each star into Hot, Warm or Cool.",
    lines: [
      "Welcome to our heat harbors! Blue and white stars belong at the hot end of this learning scale.",
      "Place yellow and orange in the warm harbor, then red in the cool harbor. These words compare stars. Even red stars are thousands of degrees hot!",
      "Drag a star to a harbor. You can also tap a star, then tap its harbor. I will help if you want to try another place.",
    ],
  },
  {
    title: "THE COSMIC THERMOMETER",
    instruction: "Drag each star to its temperature on the scale.",
    lines: [
      "Kelvin is a temperature unit. Our five rounded learning values go from 3,000 kelvin for red to 25,000 kelvin for blue.",
      "Our examples are Betelgeuse, Aldebaran, the Sun, Vega and Spica. Real stars have measured temperatures that can differ from these rounded examples.",
      "Follow the horizontal thermometer! Match every colored star to its temperature. A wrong match returns to your tray so you can try again.",
    ],
  },
  {
    title: "BUILD A STAR TRAIL",
    instruction: "Type a color in each circle, coolest → hottest.",
    lines: [
      "Let's build a trail from cooler stars to hotter stars. Start with red, then orange.",
      "Next comes yellow, then white, and finally blue. Watch the arrows: they point toward hotter surfaces.",
      "Type each color name inside its circle. The right name turns that circle into a smiling star. Take your time; there is no countdown!",
    ],
  },
  {
    title: "THE TRUTH COMET",
    instruction: "Aim your arrow at True or False, then launch.",
    lines: [
      "It's time for our color explorer finale! We will test what we discovered together.",
      "Read each star fact with me. Aim at the green target for true, or the coral target for false. Launch when you are ready.",
      "Remember: stars have different colors, blue is hotter than red, and even cool stars are very hot. Your explorer award is waiting!",
    ],
  },
];
