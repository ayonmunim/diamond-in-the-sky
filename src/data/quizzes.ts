/**
 * Quick-fire quiz pool used by the Star Quiz mini-game.
 */
export type QuizQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  sourceId: string;
};

export const quizPool: QuizQuestion[] = [
  { id: "q-fusion",      topic: "stars",          question: "What process makes stars shine?",                 options: ["Burning wood", "Nuclear fusion", "Electricity", "Friction"], answer: 1, explain: "Hydrogen atoms fuse into helium, releasing light and heat.", sourceId: "starchild_stars" },
  { id: "q-twinkle",     topic: "twinkle",        question: "Why do stars twinkle?",                            options: ["They blink", "Atmosphere bends their light", "They are moving", "Clouds"], answer: 1, explain: "Earth's atmosphere bends starlight as air layers shift.", sourceId: "starchild_stars" },
  { id: "q-hottest",     topic: "colors",         question: "Which color star is the HOTTEST?",                  options: ["Red", "Yellow", "White", "Blue"], answer: 3, explain: "Blue O-class stars are the hottest known.", sourceId: "imagine_timing" },
  { id: "q-coolest",     topic: "colors",         question: "Which color star is the COOLEST?",                  options: ["Red", "Yellow", "White", "Blue"], answer: 0, explain: "Red M-class stars are the coolest of the main sequence.", sourceId: "imagine_timing" },
  { id: "q-nearest",     topic: "distance",       question: "What is the closest star to our Sun?",              options: ["Sirius", "Vega", "Proxima Centauri", "Polaris"], answer: 2, explain: "Proxima Centauri is 4.24 light-years away.", sourceId: "starchild_stars" },
  { id: "q-cepheid",     topic: "variability",    question: "Cepheid variable stars are useful because they…",   options: ["Change brightness in a regular pattern", "Explode often", "Are dark", "Have planets"], answer: 0, explain: "Their pulsation period reveals their true brightness — and their distance.", sourceId: "starchild_cepheids" },
  { id: "q-sun-class",   topic: "the-sun",        question: "What spectral class is our Sun?",                   options: ["O", "G", "M", "K"], answer: 1, explain: "The Sun is a G-class yellow dwarf.", sourceId: "imagine_timing" },
  { id: "q-constellations",topic: "constellations",question: "How many official constellations are there?",       options: ["12", "50", "88", "200"], answer: 2, explain: "The IAU recognizes 88 constellations.", sourceId: "starchild_stars" },
  { id: "q-cv",          topic: "variability",    question: "A cataclysmic variable involves…",                 options: ["A planet", "A black hole only", "A white dwarf pulling gas from a companion", "A nebula"], answer: 2, explain: "Material from a companion star falls onto a white dwarf, causing outbursts.", sourceId: "imagine_cv" },
  { id: "q-orion-belt",  topic: "constellations", question: "Orion's belt is made of how many bright stars?",    options: ["2", "3", "5", "7"], answer: 1, explain: "Three: Alnitak, Alnilam, and Mintaka.", sourceId: "starchild_stars" },
];
