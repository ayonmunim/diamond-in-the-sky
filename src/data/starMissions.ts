import { usesScienceLab } from "./specialMissions";

/**
 * Diamond In The Sky — 8 Star Missions × 5 Levels.
 * Every level is: storyBeats (cinematic captions) → mini-game → rewards → unlock.
 * Game types rotate to keep consecutive levels feeling fresh.
 */

export type GameConfig =
  | {
      type: "quiz";
      question: string;
      options: string[];
      correctIndex: number;
      explain?: string;
    }
  | {
      type: "sort";
      prompt: string;
      buckets: { id: string; label: string; emoji?: string }[];
      items: { label: string; emoji?: string; bucketId: string }[];
    }
  | {
      type: "match";
      prompt: string;
      pairs: { a: string; b: string; emoji?: string }[];
    }
  | {
      type: "memory";
      prompt: string;
      pairs: { a: string; b: string }[];
    }
  | {
      type: "sequence";
      prompt: string;
      /** Items to be tapped in this exact order. */
      ordered: { label: string; emoji?: string }[];
    }
  | {
      type: "fuse";
      prompt: string;
      ingredientEmoji: string;
      ingredientLabel: string;
      needed: number;
      resultEmoji: string;
      resultLabel: string;
    }
  | {
      type: "tap";
      prompt: string;
      targets: { label: string; emoji?: string; correct: boolean }[];
      needCorrect: number;
    };

export type StarLevel = {
  id: string;
  index: number; // 1..5
  name: string;
  emoji: string;
  color: string;
  /** 3–5 short captions narrated in sequence as the story scene. */
  storyBeats: string[];
  funFact: string;
  game: GameConfig;
};

export type StarMission = {
  id: string;
  index: number; // 1..8
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  color: string;
  badgeId: string;
  badgeName: string;
  badgeEmoji: string;
  levels: StarLevel[];
};

const M = (m: StarMission) => m;

export const starMissions: StarMission[] = [
  /* ───────────────── Mission 1 ───────────────── */
  M({
    id: "what-is-a-star",
    index: 1,
    emoji: "⭐",
    name: "What is a Star?",
    tagline: "Meet your first star",
    description: "Discover what stars really are, what they're made of, and how they shine.",
    color: "oklch(0.85 0.16 85)",
    badgeId: "star-friend",
    badgeName: "Star Friend",
    badgeEmoji: "⭐",
    levels: [
      {
        id: "meet-a-star",
        index: 1,
        name: "Meet a Star",
        emoji: "✨",
        color: "oklch(0.86 0.16 85)",
        storyBeats: [
          "Welcome, Explorer! I'm Nova — a tiny baby star.",
          "Up here, the sky is full of glowing balls of gas.",
          "Each star is a giant ball of mostly hydrogen and helium.",
          "Stars shine because they make their own light. Ready to learn how?",
        ],
        funFact: "Our Sun is a star — and there are over 100 billion stars in our galaxy alone!",
        game: {
          type: "quiz",
          question: "What are stars mostly made of?",
          options: ["Rock and metal", "Hydrogen and helium gas", "Water and ice", "Diamonds"],
          correctIndex: 1,
          explain: "Stars are giant glowing balls of mostly hydrogen and helium gas.",
        },
      },
      {
        id: "hydrogen-helium",
        index: 2,
        name: "Hydrogen + Helium",
        emoji: "🧪",
        color: "oklch(0.80 0.18 60)",
        storyBeats: [
          "Inside every star, tiny atoms zoom around super fast.",
          "Hydrogen is the smallest atom in the whole universe.",
          "When four hydrogens squish together, they make one helium.",
          "Let's squish some hydrogen ourselves!",
        ],
        funFact: "The Sun turns 600 million tons of hydrogen into helium every second!",
        game: {
          type: "fuse",
          prompt: "Tap hydrogen atoms to fuse them into helium!",
          ingredientEmoji: "💧",
          ingredientLabel: "Hydrogen",
          needed: 4,
          resultEmoji: "🟡",
          resultLabel: "Helium",
        },
      },
      {
        id: "nuclear-fusion",
        index: 3,
        name: "Nuclear Fusion",
        emoji: "💥",
        color: "oklch(0.78 0.22 35)",
        storyBeats: [
          "Squishing atoms together is called fusion.",
          "Fusion needs HUGE pressure — only a star's core has enough.",
          "Each fusion makes a tiny burst of energy.",
          "Let's put the fusion steps in order!",
        ],
        funFact:
          "The energy from fusion takes 100,000 years to escape from the Sun's core to its surface!",
        game: {
          type: "sequence",
          prompt: "Put the fusion steps in the right order.",
          ordered: [
            { emoji: "🌫️", label: "Gas gathers" },
            { emoji: "🌡️", label: "Core heats up" },
            { emoji: "💥", label: "Atoms fuse" },
            { emoji: "✨", label: "Energy is born" },
          ],
        },
      },
      {
        id: "how-stars-shine",
        index: 4,
        name: "How Stars Shine",
        emoji: "🌟",
        color: "oklch(0.88 0.14 95)",
        storyBeats: [
          "All that fusion energy turns into light and heat.",
          "It bounces around inside the star for a long, long time.",
          "Finally it escapes from the surface — and twinkles in your sky!",
          "Which things really come from stars?",
        ],
        funFact:
          "Most of the light reaching Earth from stars is older than your great-great-grandparents.",
        game: {
          type: "sort",
          prompt: "Sort what stars give us vs. what they don't.",
          buckets: [
            { id: "yes", label: "From stars", emoji: "⭐" },
            { id: "no", label: "Not from stars", emoji: "🚫" },
          ],
          items: [
            { label: "Light", emoji: "💡", bucketId: "yes" },
            { label: "Heat", emoji: "🔥", bucketId: "yes" },
            { label: "Energy", emoji: "⚡", bucketId: "yes" },
            { label: "Rain", emoji: "🌧️", bucketId: "no" },
            { label: "Music", emoji: "🎵", bucketId: "no" },
            { label: "Pizza", emoji: "🍕", bucketId: "no" },
          ],
        },
      },
      {
        id: "star-finale",
        index: 5,
        name: "Star Finale",
        emoji: "🏆",
        color: "oklch(0.85 0.18 80)",
        storyBeats: [
          "You've learned so much, Explorer!",
          "Stars are gas, glow with fusion, and light up the night.",
          "Time for your first BIG challenge — tap every TRUE fact!",
        ],
        funFact: "You just earned your very first mission badge — well done!",
        game: {
          type: "tap",
          prompt: "Tap every TRUE fact about stars.",
          needCorrect: 4,
          targets: [
            { label: "Stars are mostly hydrogen", emoji: "💧", correct: true },
            { label: "Stars make their own light", emoji: "✨", correct: true },
            { label: "The Sun is a star", emoji: "☀️", correct: true },
            { label: "Stars use fusion", emoji: "💥", correct: true },
            { label: "Stars are made of rock", emoji: "🪨", correct: false },
            { label: "Stars need batteries", emoji: "🔋", correct: false },
            { label: "Stars eat pizza", emoji: "🍕", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 2 ───────────────── */
  M({
    id: "twinkle",
    index: 2,
    emoji: "✨",
    name: "Why Do Stars Twinkle?",
    tagline: "The dance of starlight",
    description:
      "Find out why stars twinkle and planets don't — it's all about Earth's atmosphere.",
    color: "oklch(0.80 0.16 230)",
    badgeId: "twinkle-tracker",
    badgeName: "Twinkle Tracker",
    badgeEmoji: "✨",
    levels: [
      {
        id: "the-twinkle",
        index: 1,
        name: "The Twinkle",
        emoji: "✨",
        color: "oklch(0.85 0.14 220)",
        storyBeats: [
          "Look up at night — those stars are wiggling!",
          "But the stars themselves are perfectly still.",
          "Something between you and the stars makes them dance.",
          "Can you guess what it is?",
        ],
        funFact: "Astronauts in space see stars that don't twinkle at all!",
        game: {
          type: "quiz",
          question: "Why do stars twinkle?",
          options: [
            "Stars are dancing",
            "Earth's atmosphere bends the light",
            "Stars blink on and off",
            "Birds fly in front of them",
          ],
          correctIndex: 1,
          explain: "Air in Earth's atmosphere wobbles, bending starlight and making it twinkle.",
        },
      },
      {
        id: "atmosphere-path",
        index: 2,
        name: "The Light's Journey",
        emoji: "🌬️",
        color: "oklch(0.78 0.16 210)",
        storyBeats: [
          "Light from a star travels for years through empty space.",
          "Then it hits Earth's air — and bumps into wobbling pockets.",
          "Those wobbles bend the light a tiny bit, again and again.",
          "Put the journey in order!",
        ],
        funFact:
          "The closer to the horizon a star is, the more atmosphere its light crosses — and the more it twinkles.",
        game: {
          type: "sequence",
          prompt: "Trace the journey of starlight.",
          ordered: [
            { emoji: "⭐", label: "Star" },
            { emoji: "🌌", label: "Space" },
            { emoji: "🌬️", label: "Atmosphere" },
            { emoji: "👁️", label: "Your eye" },
          ],
        },
      },
      {
        id: "twinkle-or-not",
        index: 3,
        name: "Twinkle or Steady?",
        emoji: "🔭",
        color: "oklch(0.82 0.16 200)",
        storyBeats: [
          "Not everything in the sky twinkles!",
          "Tiny points of light wobble — bigger disks stay calm.",
          "Help me sort which is which.",
        ],
        funFact:
          "Planets look steady because they're disks of light, not single points — the wobbles average out.",
        game: {
          type: "sort",
          prompt: "Drop each into the right bucket.",
          buckets: [
            { id: "tw", label: "Twinkles", emoji: "✨" },
            { id: "st", label: "Steady", emoji: "🟢" },
          ],
          items: [
            { label: "Star", emoji: "⭐", bucketId: "tw" },
            { label: "Distant sun", emoji: "🌞", bucketId: "tw" },
            { label: "Mars", emoji: "🔴", bucketId: "st" },
            { label: "Jupiter", emoji: "🪐", bucketId: "st" },
            { label: "Moon", emoji: "🌕", bucketId: "st" },
            { label: "Venus", emoji: "🌟", bucketId: "st" },
          ],
        },
      },
      {
        id: "color-twinkle",
        index: 4,
        name: "Twinkle Colors",
        emoji: "🌈",
        color: "oklch(0.84 0.18 320)",
        storyBeats: [
          "Sometimes stars twinkle in different colors!",
          "Air bends each color a tiny bit differently.",
          "Sirius — the brightest star — often flashes red, blue, and white.",
          "Match each idea to its partner.",
        ],
        funFact:
          "Sirius is so bright and low in the sky that it twinkles in all the colors of the rainbow.",
        game: {
          type: "match",
          prompt: "Match each idea to its partner.",
          pairs: [
            { a: "Air pocket", b: "Bends light" },
            { a: "Atmosphere", b: "Makes twinkle" },
            { a: "Space", b: "No twinkle" },
            { a: "Sirius", b: "Color flashes" },
          ],
        },
      },
      {
        id: "twinkle-finale",
        index: 5,
        name: "Twinkle Finale",
        emoji: "🏆",
        color: "oklch(0.85 0.18 240)",
        storyBeats: [
          "You're a real Twinkle Tracker now!",
          "Tap every TRUE statement to finish the mission.",
        ],
        funFact: "Telescopes on mountains twinkle less because the air above them is thinner!",
        game: {
          type: "tap",
          prompt: "Tap every TRUE fact.",
          needCorrect: 3,
          targets: [
            { label: "Atmosphere bends starlight", emoji: "🌬️", correct: true },
            { label: "Planets look steadier than stars", emoji: "🪐", correct: true },
            { label: "Astronauts see no twinkle", emoji: "🚀", correct: true },
            { label: "Stars blink on purpose", emoji: "💡", correct: false },
            { label: "Twinkle is caused by clouds only", emoji: "☁️", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 3 ───────────────── */
  M({
    id: "constellations",
    index: 3,
    emoji: "🌌",
    name: "What Are Constellations?",
    tagline: "Pictures in the night sky",
    description:
      "Learn how people have grouped stars into pictures and stories for thousands of years.",
    color: "oklch(0.78 0.18 280)",
    badgeId: "skywalker",
    badgeName: "Sky Walker",
    badgeEmoji: "🌌",
    levels: [
      {
        id: "what-constellation",
        index: 1,
        name: "Star Pictures",
        emoji: "🖼️",
        color: "oklch(0.82 0.16 280)",
        storyBeats: [
          "Long ago, people looked up and saw patterns in the stars.",
          "They connected the dots and saw lions, hunters, and ships.",
          "Those patterns are called constellations!",
        ],
        funFact: "There are 88 official constellations recognized by astronomers today.",
        game: {
          type: "quiz",
          question: "What is a constellation?",
          options: [
            "A type of planet",
            "A pattern of stars in the sky",
            "A space rock",
            "A galaxy",
          ],
          correctIndex: 1,
        },
      },
      {
        id: "myth-and-name",
        index: 2,
        name: "Myths & Names",
        emoji: "📖",
        color: "oklch(0.78 0.18 300)",
        storyBeats: [
          "Every constellation has a name — and a story.",
          "Orion is the great hunter. Leo is the lion.",
          "Match each constellation to its picture!",
        ],
        funFact:
          "Orion's belt is one of the easiest constellations to spot — three bright stars in a row.",
        game: {
          type: "memory",
          prompt: "Find every matching pair.",
          pairs: [
            { a: "Orion", b: "🏹" },
            { a: "Leo", b: "🦁" },
            { a: "Taurus", b: "🐂" },
            { a: "Cygnus", b: "🦢" },
          ],
        },
      },
      {
        id: "draw-the-dipper",
        index: 3,
        name: "Draw the Dipper",
        emoji: "🥄",
        color: "oklch(0.85 0.14 240)",
        storyBeats: [
          "The Big Dipper is part of Ursa Major — the Great Bear.",
          "Seven bright stars make a giant ladle in the sky.",
          "Tap each star in order to draw it!",
        ],
        funFact:
          "Two stars at the end of the Big Dipper's bowl point straight at Polaris — the North Star.",
        game: {
          type: "sequence",
          prompt: "Tap the 7 stars in order to draw the Big Dipper.",
          ordered: [
            { emoji: "⭐", label: "Alkaid" },
            { emoji: "⭐", label: "Mizar" },
            { emoji: "⭐", label: "Alioth" },
            { emoji: "⭐", label: "Megrez" },
            { emoji: "⭐", label: "Phecda" },
            { emoji: "⭐", label: "Merak" },
            { emoji: "⭐", label: "Dubhe" },
          ],
        },
      },
      {
        id: "brightest-star",
        index: 4,
        name: "Brightest Stars",
        emoji: "💡",
        color: "oklch(0.86 0.16 90)",
        storyBeats: [
          "Each constellation has one star that shines brightest.",
          "Astronomers call it the alpha star.",
          "Can you spot the brightest in each picture?",
        ],
        funFact:
          "Sirius in the constellation Canis Major is the brightest star in our whole night sky.",
        game: {
          type: "quiz",
          question: "Which is the brightest star in the constellation Leo?",
          options: ["Regulus", "Sirius", "Polaris", "Vega"],
          correctIndex: 0,
          explain: "Regulus marks the heart of the lion in Leo.",
        },
      },
      {
        id: "constellation-finale",
        index: 5,
        name: "Sky Walker Finale",
        emoji: "🏆",
        color: "oklch(0.80 0.18 290)",
        storyBeats: [
          "You can read the night sky like a book now!",
          "Sort these into Zodiac and Non-Zodiac constellations.",
        ],
        funFact:
          "Zodiac constellations are the 12 that lie along the path the Sun appears to take through the year.",
        game: {
          type: "sort",
          prompt: "Sort each into the right group.",
          buckets: [
            { id: "z", label: "Zodiac", emoji: "♈" },
            { id: "n", label: "Not Zodiac", emoji: "🌠" },
          ],
          items: [
            { label: "Aries", emoji: "🐏", bucketId: "z" },
            { label: "Leo", emoji: "🦁", bucketId: "z" },
            { label: "Pisces", emoji: "🐟", bucketId: "z" },
            { label: "Orion", emoji: "🏹", bucketId: "n" },
            { label: "Cygnus", emoji: "🦢", bucketId: "n" },
            { label: "Ursa Major", emoji: "🐻", bucketId: "n" },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 4 ───────────────── */
  M({
    id: "star-colors",
    index: 4,
    emoji: "🎨",
    name: "Star Colors & Temperature",
    tagline: "Hot blue, cool red",
    description: "Discover how a star's color helps astronomers estimate its surface temperature.",
    color: "oklch(0.80 0.18 260)",
    badgeId: "color-coder",
    badgeName: "Color Coder",
    badgeEmoji: "🎨",
    levels: [
      {
        id: "blue-is-hot",
        index: 1,
        name: "Hot Stars Are Blue",
        emoji: "🔵",
        color: "oklch(0.78 0.20 245)",
        storyBeats: [
          "Stars come in different colors!",
          "A star's color is an important clue to its surface temperature.",
          "Blue is the HOTTEST, red is the COOLEST.",
        ],
        funFact:
          "The hottest stars are over 50,000°C at the surface — five times hotter than the Sun!",
        game: {
          type: "quiz",
          question: "Which color star is the HOTTEST?",
          options: ["Red", "Yellow", "Blue", "White"],
          correctIndex: 2,
        },
      },
      {
        id: "color-thermometer",
        index: 2,
        name: "Color Thermometer",
        emoji: "🌡️",
        color: "oklch(0.82 0.18 95)",
        storyBeats: [
          "Imagine a star color thermometer.",
          "Blue → White → Yellow → Orange → Red.",
          "Sort these stars by how hot they are.",
        ],
        funFact: "Our Sun is yellow-white, sitting comfortably in the middle of the color scale.",
        game: {
          type: "sort",
          prompt: "Place each star in the right heat bucket.",
          buckets: [
            { id: "hot", label: "Hot", emoji: "🔥" },
            { id: "mid", label: "Warm", emoji: "🌤️" },
            { id: "cool", label: "Cool", emoji: "❄️" },
          ],
          items: [
            { label: "Blue star", emoji: "🔵", bucketId: "hot" },
            { label: "White star", emoji: "⚪", bucketId: "hot" },
            { label: "Yellow star", emoji: "🟡", bucketId: "mid" },
            { label: "Orange star", emoji: "🟠", bucketId: "mid" },
            { label: "Red star", emoji: "🔴", bucketId: "cool" },
            { label: "Brown dwarf", emoji: "🟤", bucketId: "cool" },
          ],
        },
      },
      {
        id: "color-match",
        index: 3,
        name: "Color & Temperature Match",
        emoji: "🧩",
        color: "oklch(0.84 0.18 60)",
        storyBeats: [
          "Let's pair each color with its temperature.",
          "Remember: BLUE = HOT, RED = COOL.",
        ],
        funFact:
          "Astronomers measure star color with a 'color index' to figure out the exact temperature.",
        game: {
          type: "match",
          prompt: "Match each star color with its temperature.",
          pairs: [
            { a: "Blue", b: "Very hot" },
            { a: "White", b: "Hot" },
            { a: "Yellow", b: "Medium" },
            { a: "Red", b: "Cool" },
          ],
        },
      },
      {
        id: "cool-to-hot",
        index: 4,
        name: "Cool to Hot",
        emoji: "📈",
        color: "oklch(0.84 0.16 80)",
        storyBeats: ["Tap these stars in order from COOLEST to HOTTEST."],
        funFact:
          "A star's color barely changes during your whole lifetime — they live for billions of years.",
        game: {
          type: "sequence",
          prompt: "Order: coolest → hottest.",
          ordered: [
            { emoji: "🔴", label: "Red" },
            { emoji: "🟠", label: "Orange" },
            { emoji: "🟡", label: "Yellow" },
            { emoji: "⚪", label: "White" },
            { emoji: "🔵", label: "Blue" },
          ],
        },
      },
      {
        id: "color-finale",
        index: 5,
        name: "Color Finale",
        emoji: "🏆",
        color: "oklch(0.82 0.18 280)",
        storyBeats: ["Time to put it all together!", "Tap every TRUE fact about star colors."],
        funFact:
          "Stars only LOOK warm because of their color names — Blue stars actually feel cool to imagine but are SUPER hot.",
        game: {
          type: "tap",
          prompt: "Tap the TRUE facts.",
          needCorrect: 3,
          targets: [
            { label: "Blue stars are hottest", emoji: "🔵", correct: true },
            { label: "Red stars are coolest", emoji: "🔴", correct: true },
            { label: "Color shows temperature", emoji: "🌡️", correct: true },
            { label: "All stars are yellow", emoji: "🟡", correct: false },
            { label: "Red stars are hot", emoji: "🔥", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 5 ───────────────── */
  M({
    id: "distance-brightness",
    index: 5,
    emoji: "🔭",
    name: "Distance & Brightness",
    tagline: "Light years across the sky",
    description:
      "Discover how astronomers measure cosmic distances and how brightness changes with distance.",
    color: "oklch(0.78 0.18 200)",
    badgeId: "light-year-wanderer",
    badgeName: "Light-Year Wanderer",
    badgeEmoji: "🔭",
    levels: [
      {
        id: "light-year",
        index: 1,
        name: "What is a Light Year?",
        emoji: "💡",
        color: "oklch(0.82 0.16 195)",
        storyBeats: [
          "Space is HUGE — way too big for kilometers.",
          "So we use light years.",
          "A light year is how far light travels in one whole year.",
        ],
        funFact: "Light travels 9.46 TRILLION kilometers in a single year!",
        game: {
          type: "quiz",
          question: "A light year measures…",
          options: ["Time", "Distance", "Temperature", "Brightness"],
          correctIndex: 1,
          explain: "It's the distance light travels in one year — a measure of distance, not time.",
        },
      },
      {
        id: "near-or-far",
        index: 2,
        name: "Bright vs Far",
        emoji: "📏",
        color: "oklch(0.80 0.16 215)",
        storyBeats: [
          "Some things are nearby. Others are MIND-bogglingly far.",
          "Sort each into Near or Far.",
        ],
        funFact:
          "Light from the Sun takes 8 minutes to reach Earth — light from Andromeda takes 2.5 million YEARS!",
        game: {
          type: "sort",
          prompt: "Sort each by distance from Earth.",
          buckets: [
            { id: "near", label: "Near (in our system)", emoji: "🪐" },
            { id: "far", label: "Far (other stars/galaxies)", emoji: "🌌" },
          ],
          items: [
            { label: "Moon", emoji: "🌕", bucketId: "near" },
            { label: "Sun", emoji: "☀️", bucketId: "near" },
            { label: "Mars", emoji: "🔴", bucketId: "near" },
            { label: "Sirius", emoji: "⭐", bucketId: "far" },
            { label: "Andromeda", emoji: "🌌", bucketId: "far" },
            { label: "Polaris", emoji: "✨", bucketId: "far" },
          ],
        },
      },
      {
        id: "bright-vs-far",
        index: 3,
        name: "Grow a Giant",
        emoji: "🪄",
        color: "oklch(0.84 0.16 180)",
        storyBeats: [
          "A faraway flashlight looks dim, even if it's powerful.",
          "Stars work the same way — distance dims them.",
          "Order these from BRIGHTEST to dimmest as seen from Earth.",
        ],
        funFact: "Sirius looks bright because it's close AND big — only 8 light years away!",
        game: {
          type: "sequence",
          prompt: "Order: brightest → dimmest as we see them.",
          ordered: [
            { emoji: "☀️", label: "Sun" },
            { emoji: "🌕", label: "Moon" },
            { emoji: "⭐", label: "Sirius" },
            { emoji: "✨", label: "Polaris" },
          ],
        },
      },
      {
        id: "match-distance",
        index: 4,
        name: "Match the Distance",
        emoji: "🧩",
        color: "oklch(0.82 0.18 165)",
        storyBeats: [
          "Astronomers know how far away things really are.",
          "Match each object with its distance.",
        ],
        funFact: "The nearest star to the Sun, Proxima Centauri, is 4.2 light years away.",
        game: {
          type: "match",
          prompt: "Match each object with its distance.",
          pairs: [
            { a: "Moon", b: "1 light second" },
            { a: "Sun", b: "8 light minutes" },
            { a: "Proxima", b: "4 light years" },
            { a: "Andromeda", b: "2.5 million ly" },
          ],
        },
      },
      {
        id: "distance-finale",
        index: 5,
        name: "Distance Finale",
        emoji: "🏆",
        color: "oklch(0.82 0.18 220)",
        storyBeats: [
          "You're a real Light-Year Wanderer now!",
          "Tap every TRUE fact to finish the mission.",
        ],
        funFact:
          "When you look at a star, you're seeing light from the past — like a time machine!",
        game: {
          type: "tap",
          prompt: "Tap every TRUE statement.",
          needCorrect: 3,
          targets: [
            { label: "Light year = distance", emoji: "📏", correct: true },
            { label: "Distance makes stars dimmer", emoji: "🪄", correct: true },
            { label: "Some star light is very old", emoji: "⏳", correct: true },
            { label: "Light year = 1 year of time", emoji: "⏰", correct: false },
            { label: "Closer stars are always dimmer", emoji: "❌", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 6 ───────────────── */
  M({
    id: "the-sun",
    index: 6,
    emoji: "☀️",
    name: "The Sun is a Star",
    tagline: "Our closest star",
    description: "Meet our own friendly star — the Sun — and the amazing things it does.",
    color: "oklch(0.88 0.16 85)",
    badgeId: "sun-keeper",
    badgeName: "Sun Keeper",
    badgeEmoji: "☀️",
    levels: [
      {
        id: "our-sun",
        index: 1,
        name: "Our Sun",
        emoji: "🌞",
        color: "oklch(0.88 0.16 88)",
        storyBeats: [
          "Surprise! The Sun is a star too.",
          "It just LOOKS huge because it's so close.",
          "Without it, Earth would freeze in the dark.",
        ],
        funFact: "1.3 million Earths could fit inside the Sun!",
        game: {
          type: "quiz",
          question: "What is the Sun?",
          options: ["A planet", "A moon", "A star", "A comet"],
          correctIndex: 2,
        },
      },
      {
        id: "sun-layers",
        index: 2,
        name: "Sun Layers",
        emoji: "🧅",
        color: "oklch(0.86 0.18 65)",
        storyBeats: [
          "The Sun has layers like an onion.",
          "Core, radiative zone, convective zone, surface, corona.",
          "Match each layer to its description!",
        ],
        funFact:
          "The Sun's corona is HOTTER than its surface — scientists are still figuring out why!",
        game: {
          type: "memory",
          prompt: "Find each layer's matching description.",
          pairs: [
            { a: "Core", b: "Fusion zone" },
            { a: "Surface", b: "Where light leaves" },
            { a: "Corona", b: "Glowing crown" },
            { a: "Sunspot", b: "Cool dark spot" },
          ],
        },
      },
      {
        id: "solar-storms",
        index: 3,
        name: "Solar Storms",
        emoji: "⚡",
        color: "oklch(0.82 0.22 50)",
        storyBeats: [
          "The Sun isn't quiet — it has BIG storms.",
          "Flares burst out. Sunspots wander.",
          "Sort what's a real Sun phenomenon!",
        ],
        funFact: "A solar flare can release as much energy as a billion atomic bombs!",
        game: {
          type: "sort",
          prompt: "Sort each into the right bucket.",
          buckets: [
            { id: "real", label: "Real Sun thing", emoji: "☀️" },
            { id: "fake", label: "Made up", emoji: "🚫" },
          ],
          items: [
            { label: "Solar flare", emoji: "💥", bucketId: "real" },
            { label: "Sunspot", emoji: "⚫", bucketId: "real" },
            { label: "Prominence", emoji: "🌅", bucketId: "real" },
            { label: "Sun snow", emoji: "❄️", bucketId: "fake" },
            { label: "Sun whales", emoji: "🐋", bucketId: "fake" },
          ],
        },
      },
      {
        id: "life-on-earth",
        index: 4,
        name: "Life on Earth",
        emoji: "🌍",
        color: "oklch(0.82 0.18 145)",
        storyBeats: [
          "Without the Sun, no plants could grow.",
          "No plants means no food, no oxygen, no us!",
          "Order what the Sun gives us.",
        ],
        funFact: "The energy in your breakfast came from the Sun — plants caught it first!",
        game: {
          type: "sequence",
          prompt: "Order the chain: Sun → ?",
          ordered: [
            { emoji: "☀️", label: "Sun" },
            { emoji: "🌱", label: "Plants" },
            { emoji: "🐄", label: "Animals" },
            { emoji: "🧒", label: "You!" },
          ],
        },
      },
      {
        id: "sun-finale",
        index: 5,
        name: "Sun Finale",
        emoji: "🏆",
        color: "oklch(0.88 0.18 80)",
        storyBeats: ["You really know our Sun now!", "Tap every TRUE fact to finish."],
        funFact: "The Sun is 4.6 billion years old and will keep shining for about 5 billion more!",
        game: {
          type: "tap",
          prompt: "Tap every TRUE fact about the Sun.",
          needCorrect: 3,
          targets: [
            { label: "The Sun is a star", emoji: "⭐", correct: true },
            { label: "The Sun has sunspots", emoji: "⚫", correct: true },
            { label: "The Sun gives us light", emoji: "💡", correct: true },
            { label: "The Sun is a planet", emoji: "🪐", correct: false },
            { label: "The Sun is cold", emoji: "❄️", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 7 ───────────────── */
  M({
    id: "variable-stars",
    index: 7,
    emoji: "💡",
    name: "Variable Stars",
    tagline: "Stars that change",
    description: "Meet stars that pulse, flicker, and swap brightness — the universe's heartbeats.",
    color: "oklch(0.78 0.18 320)",
    badgeId: "pulse-keeper",
    badgeName: "Pulse Keeper",
    badgeEmoji: "💓",
    levels: [
      {
        id: "what-variable",
        index: 1,
        name: "Pulse of a Star",
        emoji: "💓",
        color: "oklch(0.82 0.18 320)",
        storyBeats: [
          "Most stars shine steadily, but some PULSE!",
          "They get brighter, then dimmer, then bright again.",
          "We call them variable stars.",
        ],
        funFact: "The first variable star ever discovered, Mira, was found in 1596.",
        game: {
          type: "quiz",
          question: "What do variable stars do?",
          options: ["Stay the same", "Change brightness", "Move fast", "Explode"],
          correctIndex: 1,
        },
      },
      {
        id: "pulse-cycle",
        index: 2,
        name: "Pulse Cycle",
        emoji: "📈",
        color: "oklch(0.80 0.18 305)",
        storyBeats: [
          "A variable star's brightness follows a pattern.",
          "Dim → bright → dim → bright.",
          "Put the cycle in order.",
        ],
        funFact: "Some variable stars pulse every few hours; others take years!",
        game: {
          type: "sequence",
          prompt: "Order one full pulse cycle.",
          ordered: [
            { emoji: "🌑", label: "Dim" },
            { emoji: "🌗", label: "Brightening" },
            { emoji: "🌕", label: "Peak" },
            { emoji: "🌓", label: "Dimming" },
          ],
        },
      },
      {
        id: "binary-friends",
        index: 3,
        name: "Binary Friends",
        emoji: "👯",
        color: "oklch(0.78 0.18 290)",
        storyBeats: [
          "Some 'variable' stars are actually pairs.",
          "When one passes in front of the other, brightness drops.",
          "Match the type to its trick.",
        ],
        funFact:
          "Algol — the 'demon star' — dims every 2.87 days because of an eclipsing binary partner.",
        game: {
          type: "match",
          prompt: "Match the variable type with its trick.",
          pairs: [
            { a: "Cepheid", b: "Pulses regularly" },
            { a: "Eclipsing", b: "Partner blocks light" },
            { a: "Mira", b: "Long slow pulse" },
            { a: "Nova", b: "Sudden bright flash" },
          ],
        },
      },
      {
        id: "variable-or-not",
        index: 4,
        name: "Variable or Steady?",
        emoji: "🔍",
        color: "oklch(0.82 0.18 280)",
        storyBeats: ["Help sort the stars: variable or steady?"],
        funFact: "Cepheid variable stars helped astronomers measure how big the universe is!",
        game: {
          type: "sort",
          prompt: "Sort each star by behavior.",
          buckets: [
            { id: "v", label: "Variable", emoji: "💓" },
            { id: "s", label: "Steady", emoji: "🟢" },
          ],
          items: [
            { label: "Cepheid", emoji: "🔆", bucketId: "v" },
            { label: "Mira", emoji: "🔅", bucketId: "v" },
            { label: "Algol", emoji: "🌗", bucketId: "v" },
            { label: "Sun", emoji: "☀️", bucketId: "s" },
            { label: "Sirius", emoji: "⭐", bucketId: "s" },
            { label: "Vega", emoji: "✨", bucketId: "s" },
          ],
        },
      },
      {
        id: "variable-finale",
        index: 5,
        name: "Pulse Finale",
        emoji: "🏆",
        color: "oklch(0.82 0.18 310)",
        storyBeats: ["You can hear the universe's heartbeat now!", "Tap every TRUE statement."],
        funFact: "Polaris — the North Star — is a Cepheid variable! It pulses every 4 days.",
        game: {
          type: "tap",
          prompt: "Tap the TRUE facts about variable stars.",
          needCorrect: 3,
          targets: [
            { label: "They change brightness", emoji: "💓", correct: true },
            { label: "Cepheids pulse on a clock", emoji: "⏰", correct: true },
            { label: "Some are eclipsing pairs", emoji: "👯", correct: true },
            { label: "All stars are variable", emoji: "❌", correct: false },
            { label: "Variables never repeat", emoji: "🔁", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 8 ───────────────── */
  M({
    id: "star-classes",
    index: 8,
    emoji: "🌈",
    name: "Star Classes (O B A F G K M)",
    tagline: "The seven star families",
    description: "Master the seven spectral classes and see where every star belongs.",
    color: "oklch(0.80 0.20 320)",
    badgeId: "starborn-classifier",
    badgeName: "Starborn Classifier",
    badgeEmoji: "🌈",
    levels: [
      {
        id: "seven-classes",
        index: 1,
        name: "Seven Families",
        emoji: "👨‍👩‍👧",
        color: "oklch(0.82 0.18 290)",
        storyBeats: [
          "Astronomers sort stars into 7 spectral classes.",
          "Their names are O, B, A, F, G, K, M.",
          "Hottest blue O stars to coolest red M stars.",
        ],
        funFact: "A fun way to remember it: 'Oh Be A Fine Guy/Gal, Kiss Me'.",
        game: {
          type: "quiz",
          question: "How many spectral classes are there?",
          options: ["3", "5", "7", "12"],
          correctIndex: 2,
        },
      },
      {
        id: "letter-color",
        index: 2,
        name: "Letter & Color",
        emoji: "🎨",
        color: "oklch(0.78 0.20 245)",
        storyBeats: ["Each class has its own color.", "Find every matching pair: letter ↔ color."],
        funFact: "Our Sun is a G-type star — that's why it looks yellow-white.",
        game: {
          type: "memory",
          prompt: "Match each class letter with its color.",
          pairs: [
            { a: "O", b: "Blue" },
            { a: "A", b: "White" },
            { a: "G", b: "Yellow" },
            { a: "M", b: "Red" },
          ],
        },
      },
      {
        id: "classify-stars",
        index: 3,
        name: "Classify Stars",
        emoji: "🔎",
        color: "oklch(0.84 0.16 60)",
        storyBeats: ["Sort each star by its color and class."],
        funFact: "Only about 1 in every 3 million stars is a hot O-type — they're extremely rare!",
        game: {
          type: "sort",
          prompt: "Place each star into the right family.",
          buckets: [
            { id: "hot", label: "O / B (Blue)", emoji: "🔵" },
            { id: "mid", label: "A / F / G (White/Yellow)", emoji: "🟡" },
            { id: "cool", label: "K / M (Orange/Red)", emoji: "🔴" },
          ],
          items: [
            { label: "Rigel", emoji: "🔵", bucketId: "hot" },
            { label: "Spica", emoji: "🔵", bucketId: "hot" },
            { label: "Vega", emoji: "⚪", bucketId: "mid" },
            { label: "Sun", emoji: "🟡", bucketId: "mid" },
            { label: "Aldebaran", emoji: "🟠", bucketId: "cool" },
            { label: "Betelgeuse", emoji: "🔴", bucketId: "cool" },
          ],
        },
      },
      {
        id: "order-hot-cool",
        index: 4,
        name: "Hot to Cool",
        emoji: "🌡️",
        color: "oklch(0.84 0.18 80)",
        storyBeats: ["Tap the classes in order from HOTTEST to coolest.", "O, B, A, F, G, K, M."],
        funFact: "The hottest O stars burn through their fuel in just a few million years.",
        game: {
          type: "sequence",
          prompt: "Order classes: hottest → coolest.",
          ordered: [
            { emoji: "🔵", label: "O" },
            { emoji: "🔷", label: "B" },
            { emoji: "⚪", label: "A" },
            { emoji: "🤍", label: "F" },
            { emoji: "🟡", label: "G" },
            { emoji: "🟠", label: "K" },
            { emoji: "🔴", label: "M" },
          ],
        },
      },
      {
        id: "class-finale",
        index: 5,
        name: "Classifier Finale",
        emoji: "🏆",
        color: "oklch(0.82 0.20 310)",
        storyBeats: [
          "You can read the spectrum of any star now!",
          "Tap every TRUE fact to claim your Starborn badge.",
        ],
        funFact: "You just finished all 8 missions — you're now an honorary star astronomer!",
        game: {
          type: "tap",
          prompt: "Tap every TRUE statement.",
          needCorrect: 3,
          targets: [
            { label: "O stars are hottest", emoji: "🔵", correct: true },
            { label: "M stars are coolest", emoji: "🔴", correct: true },
            { label: "Sun is class G", emoji: "☀️", correct: true },
            { label: "There are 3 classes", emoji: "3️⃣", correct: false },
            { label: "Class M is blue", emoji: "❌", correct: false },
          ],
        },
      },
    ],
  }),
  /* ───────────────── Mission 9 ───────────────── */
  M({
    id: "planets",
    index: 9,
    emoji: "🪐",
    name: "Planets & Our Solar System",
    tagline: "Eight worlds orbiting one star",
    description: "Tour the planets of our Solar System and learn what makes each world unique.",
    color: "oklch(0.78 0.18 55)",
    badgeId: "planet-pioneer",
    badgeName: "Planet Pioneer",
    badgeEmoji: "🪐",
    levels: [
      {
        id: "what-is-a-planet",
        index: 1,
        name: "What is a Planet?",
        emoji: "🌍",
        color: "oklch(0.80 0.16 210)",
        storyBeats: [
          "A planet is a big round world that orbits a star.",
          "Planets don't make their own light — they shine by reflecting starlight.",
          "Our Solar System has eight of them.",
        ],
        funFact:
          "Planets must also clear their orbit of debris — that rule is why Pluto is a dwarf planet.",
        game: {
          type: "quiz",
          question: "Why can we see planets in the night sky?",
          options: [
            "They burn like stars",
            "They reflect sunlight",
            "They are on fire",
            "They glow from inside",
          ],
          correctIndex: 1,
          explain: "Planets reflect light from the Sun.",
        },
      },
      {
        id: "rocky-or-gas",
        index: 2,
        name: "Rocky or Gas?",
        emoji: "🪨",
        color: "oklch(0.80 0.17 90)",
        storyBeats: [
          "The four inner planets are small and rocky.",
          "The four outer planets are giant balls of gas and ice.",
          "Sort each world into its family.",
        ],
        funFact: "You could fit over 1,300 Earths inside Jupiter.",
        game: {
          type: "sort",
          prompt: "Rocky world or gas giant?",
          buckets: [
            { id: "rocky", label: "Rocky", emoji: "🪨" },
            { id: "gas", label: "Gas / Ice Giant", emoji: "🌀" },
          ],
          items: [
            { label: "Mercury", emoji: "🌑", bucketId: "rocky" },
            { label: "Earth", emoji: "🌍", bucketId: "rocky" },
            { label: "Mars", emoji: "🔴", bucketId: "rocky" },
            { label: "Jupiter", emoji: "🟠", bucketId: "gas" },
            { label: "Saturn", emoji: "🪐", bucketId: "gas" },
            { label: "Neptune", emoji: "🔵", bucketId: "gas" },
          ],
        },
      },
      {
        id: "order-the-planets",
        index: 3,
        name: "Order the Planets",
        emoji: "➡️",
        color: "oklch(0.82 0.17 300)",
        storyBeats: ["Start at the Sun and travel outward.", "Tap the planets in the right order."],
        funFact: "Neptune takes 165 Earth years to orbit the Sun just once.",
        game: {
          type: "sequence",
          prompt: "Tap the planets from closest to the Sun outward.",
          ordered: [
            { emoji: "🌑", label: "Mercury" },
            { emoji: "🟡", label: "Venus" },
            { emoji: "🌍", label: "Earth" },
            { emoji: "🔴", label: "Mars" },
            { emoji: "🟠", label: "Jupiter" },
            { emoji: "🪐", label: "Saturn" },
            { emoji: "🔵", label: "Uranus" },
            { emoji: "🔷", label: "Neptune" },
          ],
        },
      },
      {
        id: "moons-and-rings",
        index: 4,
        name: "Moons & Rings",
        emoji: "🌙",
        color: "oklch(0.84 0.14 250)",
        storyBeats: [
          "Moons orbit planets, and some planets wear rings of ice and rock.",
          "Match each world with what makes it famous.",
        ],
        funFact: "Saturn's rings are mostly chunks of water ice — some as small as sand grains.",
        game: {
          type: "match",
          prompt: "Match each world with its feature.",
          pairs: [
            { a: "Saturn", b: "Bright rings", emoji: "🪐" },
            { a: "Earth", b: "One Moon", emoji: "🌙" },
            { a: "Jupiter", b: "95+ moons", emoji: "🟠" },
            { a: "Mercury", b: "No moons", emoji: "🌑" },
          ],
        },
      },
      {
        id: "planet-finale",
        index: 5,
        name: "Planet Finale",
        emoji: "🏆",
        color: "oklch(0.84 0.18 60)",
        storyBeats: [
          "You've toured every world in the Solar System!",
          "Tap every TRUE fact to earn the Planet Pioneer badge.",
        ],
        funFact: "A day on Venus is longer than its entire year.",
        game: {
          type: "tap",
          prompt: "Tap every TRUE statement.",
          needCorrect: 3,
          targets: [
            { label: "Planets orbit stars", emoji: "🪐", correct: true },
            { label: "Jupiter is the biggest planet", emoji: "🟠", correct: true },
            { label: "Earth has one Moon", emoji: "🌙", correct: true },
            { label: "Planets make their own light", emoji: "❌", correct: false },
            { label: "Mars is a gas giant", emoji: "❌", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 10 ───────────────── */
  M({
    id: "nebulas",
    index: 10,
    emoji: "☁️",
    name: "Nebulas — Star Nurseries",
    tagline: "Clouds where stars are born",
    description: "Explore glowing clouds of gas and dust where brand-new stars come to life.",
    color: "oklch(0.75 0.20 330)",
    badgeId: "nebula-navigator",
    badgeName: "Nebula Navigator",
    badgeEmoji: "☁️",
    levels: [
      {
        id: "what-is-a-nebula",
        index: 1,
        name: "What is a Nebula?",
        emoji: "☁️",
        color: "oklch(0.78 0.20 330)",
        storyBeats: [
          "A nebula is a giant cloud of gas and dust in space.",
          "Some are star nurseries; others are the leftovers of dead stars.",
          "The Orion Nebula is the closest big nursery to Earth.",
        ],
        funFact: "The Orion Nebula is about 1,344 light-years away and 24 light-years wide.",
        game: {
          type: "quiz",
          question: "What is a nebula mostly made of?",
          options: ["Rock and metal", "Gas and dust", "Water and ice", "Solid light"],
          correctIndex: 1,
        },
      },
      {
        id: "nebula-types",
        index: 2,
        name: "Kinds of Nebulas",
        emoji: "🎨",
        color: "oklch(0.80 0.18 20)",
        storyBeats: [
          "Emission nebulas glow. Reflection nebulas shine with borrowed light.",
          "Dark nebulas block the stars behind them.",
          "Match each type to what it does.",
        ],
        funFact: "The Horsehead Nebula is a dark nebula — we only see it as a silhouette.",
        game: {
          type: "match",
          prompt: "Match each nebula type with its behaviour.",
          pairs: [
            { a: "Emission", b: "Glows on its own", emoji: "🔴" },
            { a: "Reflection", b: "Reflects starlight", emoji: "🔵" },
            { a: "Dark", b: "Blocks light behind it", emoji: "⚫" },
            { a: "Planetary", b: "Shell from a dying star", emoji: "💍" },
          ],
        },
      },
      {
        id: "star-birth",
        index: 3,
        name: "How a Star is Born",
        emoji: "🍼",
        color: "oklch(0.82 0.18 60)",
        storyBeats: [
          "Gravity pulls the cloud together.",
          "The core heats up and starts to spin.",
          "Fusion ignites — a new star shines!",
        ],
        funFact: "It takes roughly 10 million years for a Sun-like star to finish forming.",
        game: {
          type: "sequence",
          prompt: "Put star birth in order.",
          ordered: [
            { emoji: "☁️", label: "Gas cloud" },
            { emoji: "🌀", label: "Gravity pulls in" },
            { emoji: "🔥", label: "Core heats up" },
            { emoji: "💥", label: "Fusion starts" },
            { emoji: "⭐", label: "New star" },
          ],
        },
      },
      {
        id: "spot-the-nebula",
        index: 4,
        name: "Spot the Nebula",
        emoji: "🔭",
        color: "oklch(0.78 0.18 280)",
        storyBeats: [
          "Some of these famous objects are nebulas — some are not.",
          "Tap only the nebulas.",
        ],
        funFact: "The Crab Nebula is the wreckage of a supernova seen from Earth in the year 1054.",
        game: {
          type: "tap",
          prompt: "Tap only the nebulas.",
          needCorrect: 3,
          targets: [
            { label: "Orion Nebula", emoji: "☁️", correct: true },
            { label: "Crab Nebula", emoji: "🦀", correct: true },
            { label: "Eagle Nebula", emoji: "🦅", correct: true },
            { label: "Betelgeuse", emoji: "🔴", correct: false },
            { label: "Saturn", emoji: "🪐", correct: false },
          ],
        },
      },
      {
        id: "nebula-finale",
        index: 5,
        name: "Nebula Finale",
        emoji: "🏆",
        color: "oklch(0.80 0.20 330)",
        storyBeats: [
          "You've flown through the star nurseries of the galaxy!",
          "One last memory challenge for your badge.",
        ],
        funFact: "The Pillars of Creation in the Eagle Nebula are light-years tall.",
        game: {
          type: "memory",
          prompt: "Match each nebula with its nickname.",
          pairs: [
            { a: "Eagle Nebula", b: "Pillars of Creation" },
            { a: "Crab Nebula", b: "Supernova remnant" },
            { a: "Orion Nebula", b: "Star nursery" },
            { a: "Horsehead", b: "Dark silhouette" },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 11 ───────────────── */
  M({
    id: "galaxies",
    index: 11,
    emoji: "🌌",
    name: "Galaxies — Cities of Stars",
    tagline: "Billions of stars together",
    description: "Journey beyond the Milky Way and discover the shapes and sizes of galaxies.",
    color: "oklch(0.72 0.20 285)",
    badgeId: "galaxy-voyager",
    badgeName: "Galaxy Voyager",
    badgeEmoji: "🌌",
    levels: [
      {
        id: "what-is-a-galaxy",
        index: 1,
        name: "What is a Galaxy?",
        emoji: "🌌",
        color: "oklch(0.76 0.20 285)",
        storyBeats: [
          "A galaxy is a huge family of stars, gas, dust and dark matter.",
          "Gravity holds it all together.",
          "Our galaxy is called the Milky Way.",
        ],
        funFact: "The Milky Way holds somewhere between 100 and 400 billion stars.",
        game: {
          type: "quiz",
          question: "What holds a galaxy together?",
          options: ["Magnetism", "Gravity", "Wind", "Sound"],
          correctIndex: 1,
        },
      },
      {
        id: "galaxy-shapes",
        index: 2,
        name: "Galaxy Shapes",
        emoji: "🌀",
        color: "oklch(0.78 0.18 200)",
        storyBeats: [
          "Galaxies come in three main shapes.",
          "Spiral, elliptical and irregular.",
          "Sort each galaxy into its shape family.",
        ],
        funFact: "About 60% of the galaxies we can see are spirals.",
        game: {
          type: "sort",
          prompt: "Sort each galaxy by shape.",
          buckets: [
            { id: "spiral", label: "Spiral", emoji: "🌀" },
            { id: "ellip", label: "Elliptical", emoji: "🥚" },
            { id: "irr", label: "Irregular", emoji: "✨" },
          ],
          items: [
            { label: "Milky Way", emoji: "🌌", bucketId: "spiral" },
            { label: "Andromeda", emoji: "🌀", bucketId: "spiral" },
            { label: "M87", emoji: "🥚", bucketId: "ellip" },
            { label: "M60", emoji: "🥚", bucketId: "ellip" },
            { label: "Large Magellanic Cloud", emoji: "✨", bucketId: "irr" },
            { label: "Small Magellanic Cloud", emoji: "✨", bucketId: "irr" },
          ],
        },
      },
      {
        id: "milky-way-home",
        index: 3,
        name: "Our Milky Way",
        emoji: "🥛",
        color: "oklch(0.84 0.12 90)",
        storyBeats: [
          "We live in a spiral arm called the Orion Arm.",
          "The Sun takes about 230 million years to orbit the galaxy once.",
          "A supermassive black hole sits at the centre.",
        ],
        funFact: "The Milky Way is roughly 100,000 light-years across.",
        game: {
          type: "quiz",
          question: "What sits at the centre of the Milky Way?",
          options: ["A giant planet", "A supermassive black hole", "A nebula", "Nothing at all"],
          correctIndex: 1,
        },
      },
      {
        id: "galaxy-neighbours",
        index: 4,
        name: "Galactic Neighbours",
        emoji: "🤝",
        color: "oklch(0.78 0.18 330)",
        storyBeats: [
          "Galaxies travel in groups. Ours is the Local Group.",
          "Match each neighbour with its claim to fame.",
        ],
        funFact: "Andromeda and the Milky Way will merge in about 4.5 billion years.",
        game: {
          type: "match",
          prompt: "Match each galaxy with its fact.",
          pairs: [
            { a: "Andromeda", b: "Nearest big spiral", emoji: "🌀" },
            { a: "Milky Way", b: "Our home galaxy", emoji: "🥛" },
            { a: "Triangulum", b: "Third in the Local Group", emoji: "🔺" },
            { a: "Magellanic Clouds", b: "Small companions", emoji: "☁️" },
          ],
        },
      },
      {
        id: "galaxy-finale",
        index: 5,
        name: "Galaxy Finale",
        emoji: "🏆",
        color: "oklch(0.74 0.20 285)",
        storyBeats: [
          "You've crossed millions of light-years, Explorer!",
          "Tap every TRUE fact to earn the Galaxy Voyager badge.",
        ],
        funFact: "There may be two trillion galaxies in the observable universe.",
        game: {
          type: "tap",
          prompt: "Tap every TRUE statement.",
          needCorrect: 3,
          targets: [
            { label: "The Milky Way is a spiral", emoji: "🌀", correct: true },
            { label: "Galaxies contain billions of stars", emoji: "⭐", correct: true },
            { label: "Andromeda is our neighbour", emoji: "🌌", correct: true },
            { label: "Galaxies are single stars", emoji: "❌", correct: false },
            { label: "The Milky Way is a planet", emoji: "❌", correct: false },
          ],
        },
      },
    ],
  }),

  /* ───────────────── Mission 12 ───────────────── */
  M({
    id: "star-clusters",
    index: 12,
    emoji: "✳️",
    name: "Star Clusters",
    tagline: "Stars born as families",
    description: "Meet open and globular clusters — groups of stars that grew up together.",
    color: "oklch(0.82 0.16 200)",
    badgeId: "cluster-captain",
    badgeName: "Cluster Captain",
    badgeEmoji: "✳️",
    levels: [
      {
        id: "what-is-a-cluster",
        index: 1,
        name: "What is a Cluster?",
        emoji: "✳️",
        color: "oklch(0.84 0.16 200)",
        storyBeats: [
          "A star cluster is a group of stars born from the same cloud.",
          "They travel through space together.",
          "The Pleiades is a famous cluster you can see with your eyes.",
        ],
        funFact: "The Pleiades cluster is about 100 million years old — young for stars!",
        game: {
          type: "quiz",
          question: "Why are stars in a cluster similar in age?",
          options: [
            "They were born from the same cloud",
            "They are the same size",
            "They all orbit Earth",
            "They collided",
          ],
          correctIndex: 0,
        },
      },
      {
        id: "open-vs-globular",
        index: 2,
        name: "Open vs Globular",
        emoji: "⚖️",
        color: "oklch(0.80 0.18 60)",
        storyBeats: [
          "Open clusters are young, loose and hold a few hundred stars.",
          "Globular clusters are ancient, tight balls of hundreds of thousands of stars.",
          "Sort each cluster into the right family.",
        ],
        funFact: "Globular cluster Omega Centauri contains about 10 million stars.",
        game: {
          type: "sort",
          prompt: "Open cluster or globular cluster?",
          buckets: [
            { id: "open", label: "Open (young, loose)", emoji: "✳️" },
            { id: "glob", label: "Globular (old, packed)", emoji: "⚪" },
          ],
          items: [
            { label: "Pleiades", emoji: "✨", bucketId: "open" },
            { label: "Hyades", emoji: "✨", bucketId: "open" },
            { label: "Beehive", emoji: "🐝", bucketId: "open" },
            { label: "Omega Centauri", emoji: "⚪", bucketId: "glob" },
            { label: "M13 in Hercules", emoji: "⚪", bucketId: "glob" },
            { label: "47 Tucanae", emoji: "⚪", bucketId: "glob" },
          ],
        },
      },
      {
        id: "pleiades",
        index: 3,
        name: "The Seven Sisters",
        emoji: "🌟",
        color: "oklch(0.82 0.16 250)",
        storyBeats: [
          "The Pleiades is nicknamed the Seven Sisters.",
          "Its hot blue stars are wrapped in a bluish reflection nebula.",
          "Most people can spot six of them without a telescope.",
        ],
        funFact:
          "The Pleiades appears on the flag-like emblems and legends of cultures all over the world.",
        game: {
          type: "quiz",
          question: "What is the Pleiades also called?",
          options: ["The Great Bear", "The Seven Sisters", "The Southern Cross", "The Hunter"],
          correctIndex: 1,
        },
      },
      {
        id: "cluster-life",
        index: 4,
        name: "Life of a Cluster",
        emoji: "⏳",
        color: "oklch(0.80 0.18 320)",
        storyBeats: [
          "Clusters are born together and slowly drift apart.",
          "Put the story of a cluster in order.",
        ],
        funFact: "Our Sun probably formed in a cluster that scattered billions of years ago.",
        game: {
          type: "sequence",
          prompt: "Order the life of a star cluster.",
          ordered: [
            { emoji: "☁️", label: "Giant gas cloud" },
            { emoji: "⭐", label: "Many stars form" },
            { emoji: "✳️", label: "Young open cluster" },
            { emoji: "🌬️", label: "Stars drift apart" },
            { emoji: "🌠", label: "Lone stars travel on" },
          ],
        },
      },
      {
        id: "cluster-finale",
        index: 5,
        name: "Cluster Finale",
        emoji: "🏆",
        color: "oklch(0.84 0.16 200)",
        storyBeats: [
          "You've mapped the star families of the galaxy!",
          "Match each cluster with its fact to finish the chapter.",
        ],
        funFact:
          "Globular clusters orbit in a halo around the Milky Way and can be 12 billion years old.",
        game: {
          type: "memory",
          prompt: "Match each cluster with its fact.",
          pairs: [
            { a: "Pleiades", b: "Seven Sisters" },
            { a: "Omega Centauri", b: "10 million stars" },
            { a: "Hyades", b: "Closest open cluster" },
            { a: "M13", b: "Hercules globular" },
          ],
        },
      },
    ],
  }),
];

export function missionById(id: string): StarMission | undefined {
  return starMissions.find((m) => m.id === id);
}

export function levelInMission(
  missionId: string,
  levelId: string,
): { mission: StarMission; level: StarLevel; index: number } | undefined {
  const mission = missionById(missionId);
  if (!mission) return undefined;
  const index = mission.levels.findIndex((l) => l.id === levelId);
  if (index < 0) return undefined;
  return { mission, level: mission.levels[index], index };
}

/** Is this mission unlocked given the player's progress? */
export function isMissionUnlocked(mission: StarMission, completedMissionLevels: string[]): boolean {
  if (usesScienceLab(mission.id)) return true;
  if (mission.index === 1) return true;
  const prev = starMissions[mission.index - 2];
  if (!prev) return true;
  return prev.levels.every((l) => completedMissionLevels.includes(`${prev.id}:${l.id}`));
}

/** Is this level unlocked within its mission? */
export function isLevelUnlocked(
  mission: StarMission,
  levelIndex: number,
  completedMissionLevels: string[],
): boolean {
  if (usesScienceLab(mission.id)) return true;
  if (levelIndex === 0) return true;
  const prev = mission.levels[levelIndex - 1];
  return completedMissionLevels.includes(`${mission.id}:${prev.id}`);
}
