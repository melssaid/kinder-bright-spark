export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  developmentalData: { day: string; focus: number; play: number; learning: number }[];
  attentionScore: number;
  behavioralLogs: { time: string; note: string; type: "positive" | "concern" | "neutral" }[];
  recommendations: { title: string; description: string; priority: "high" | "medium" | "low" }[];
  moodEntries: { time: string; mood: "happy" | "focused" | "frustrated" | "calm" | "anxious"; note: string }[];
  learningStyle: { subject: string; value: number }[];
  peerInteractions: { peer: string; frequency: number; quality: "strong" | "moderate" | "developing" }[];
  emotionalScenarios: { scenario: string; icon: string; response: string; assessment: "excellent" | "good" | "needs-practice"; tip: string }[];
  teacherNotes: string;
  parentMessage: string;
  actionPlan: string[];
  talents: { skill: string; level: number; category: "artistic" | "logical" | "motor" | "social" | "linguistic" }[];
  speechMetrics: { vocabularySize: number; avgSentenceLength: number; benchmark: { vocabulary: number; sentenceLength: number } };
  nutrition: { meal: string; calories: number; protein: number; carbs: number; vitamins: number; items: string[] }[];
  suggestedMeals: string[];
}

export const children: Child[] = [
  {
    id: "1",
    name: "Lina Al-Rashid",
    age: 5,
    avatar: "👧",
    developmentalData: [
      { day: "Mon", focus: 72, play: 85, learning: 78 },
      { day: "Tue", focus: 68, play: 90, learning: 82 },
      { day: "Wed", focus: 75, play: 88, learning: 80 },
      { day: "Thu", focus: 80, play: 82, learning: 85 },
      { day: "Fri", focus: 85, play: 78, learning: 90 },
      { day: "Sat", focus: 70, play: 92, learning: 75 },
      { day: "Sun", focus: 78, play: 86, learning: 83 },
    ],
    attentionScore: 76,
    behavioralLogs: [
      { time: "8:30 AM", note: "Settled quickly into morning circle", type: "positive" },
      { time: "10:15 AM", note: "Lost focus during group reading, fidgeting with pencil", type: "concern" },
      { time: "11:00 AM", note: "Engaged well in art activity", type: "positive" },
      { time: "1:30 PM", note: "Brief conflict over shared toys, resolved with guidance", type: "neutral" },
    ],
    recommendations: [
      { title: "Movement Breaks", description: "Introduce 5-minute movement breaks between focused activities to help Lina reset attention.", priority: "high" },
      { title: "Visual Timers", description: "Use a visual countdown timer during group reading to help her track remaining time.", priority: "medium" },
      { title: "Praise Specifics", description: "Acknowledge specific moments of focus: 'I noticed you listened through the whole story!'", priority: "low" },
    ],
    moodEntries: [
      { time: "8:00 AM", mood: "happy", note: "Arrived excited" },
      { time: "9:30 AM", mood: "focused", note: "Deep in puzzle play" },
      { time: "10:30 AM", mood: "frustrated", note: "Struggled with letter tracing" },
      { time: "12:00 PM", mood: "calm", note: "Relaxed after lunch" },
      { time: "2:00 PM", mood: "happy", note: "Playing with friends" },
    ],
    learningStyle: [
      { subject: "Visual", value: 85 },
      { subject: "Auditory", value: 60 },
      { subject: "Kinesthetic", value: 90 },
      { subject: "Social", value: 75 },
    ],
    peerInteractions: [
      { peer: "Omar", frequency: 8, quality: "strong" },
      { peer: "Sophie", frequency: 5, quality: "moderate" },
      { peer: "Yuki", frequency: 3, quality: "developing" },
      { peer: "Carlos", frequency: 6, quality: "strong" },
    ],
    emotionalScenarios: [
      { scenario: "Anger Management", icon: "😠", response: "Lina took 3 deep breaths and asked for help.", assessment: "excellent", tip: "Great self-regulation! Continue encouraging breathing techniques." },
      { scenario: "Sharing Toys", icon: "🤝", response: "Initially resisted but agreed to take turns with a timer.", assessment: "good", tip: "Introduce more structured turn-taking games." },
      { scenario: "Waiting in Line", icon: "⏳", response: "Became restless after 2 minutes, started poking the child in front.", assessment: "needs-practice", tip: "Practice waiting with fun countdown songs." },
    ],
    teacherNotes: "Lina had difficulty staying seated during circle time today. She was frequently looking around the room and playing with her shoelaces. During free play, she showed strong leadership by organizing a building game with three other children. She struggled with letter 'R' during writing practice but didn't ask for help.",
    parentMessage: "Hi! Lina had a wonderful day full of creativity and social engagement! 🌟 She showed amazing leadership during play time, organizing a fun building activity with her friends. We noticed she's working hard on her writing skills — she's making great progress! To support her at home, you might enjoy these activities together.",
    actionPlan: [
      "Day 1: Practice writing the letter 'R' together using finger paint or sand tracing — make it fun and tactile!",
      "Day 2: Play a 'freeze dance' game to practice body control and listening skills in an enjoyable way.",
      "Day 3: Read a short story together and ask Lina to retell it — this builds both focus and language skills.",
    ],
    talents: [
      { skill: "Drawing & Painting", level: 4, category: "artistic" },
      { skill: "Building & Construction", level: 5, category: "logical" },
      { skill: "Dancing", level: 4, category: "motor" },
      { skill: "Storytelling", level: 3, category: "linguistic" },
      { skill: "Team Games", level: 4, category: "social" },
    ],
    speechMetrics: {
      vocabularySize: 2200,
      avgSentenceLength: 6.5,
      benchmark: { vocabulary: 2100, sentenceLength: 5.5 },
    },
    nutrition: [
      { meal: "Breakfast", calories: 280, protein: 12, carbs: 40, vitamins: 65, items: ["Oatmeal", "Banana", "Milk"] },
      { meal: "Snack", calories: 120, protein: 4, carbs: 18, vitamins: 30, items: ["Apple slices", "Cheese stick"] },
      { meal: "Lunch", calories: 380, protein: 18, carbs: 45, vitamins: 70, items: ["Chicken wrap", "Carrots", "Yogurt"] },
    ],
    suggestedMeals: ["Whole grain pasta with veggie sauce", "Hummus with cucumber sticks", "Fruit smoothie with spinach"],
  },
  {
    id: "2",
    name: "Omar Petrov",
    age: 4,
    avatar: "👦",
    developmentalData: [
      { day: "Mon", focus: 55, play: 70, learning: 60 },
      { day: "Tue", focus: 50, play: 75, learning: 58 },
      { day: "Wed", focus: 60, play: 72, learning: 65 },
      { day: "Thu", focus: 45, play: 80, learning: 55 },
      { day: "Fri", focus: 58, play: 78, learning: 62 },
      { day: "Sat", focus: 52, play: 85, learning: 58 },
      { day: "Sun", focus: 65, play: 75, learning: 68 },
    ],
    attentionScore: 52,
    behavioralLogs: [
      { time: "8:15 AM", note: "Difficulty separating from parent at drop-off", type: "concern" },
      { time: "9:45 AM", note: "Wandered away from group activity twice", type: "concern" },
      { time: "11:30 AM", note: "Excellent focus during music time — sang along enthusiastically", type: "positive" },
      { time: "2:00 PM", note: "Needed extra prompting to start clean-up routine", type: "neutral" },
    ],
    recommendations: [
      { title: "Transition Rituals", description: "Create a special goodbye ritual with parent to ease morning separation anxiety.", priority: "high" },
      { title: "Interest-Based Focus", description: "Use Omar's love of music to anchor other learning activities — sing instructions, use rhythm.", priority: "high" },
      { title: "One-Step Instructions", description: "Break multi-step tasks into single clear steps with visual cue cards.", priority: "medium" },
    ],
    moodEntries: [
      { time: "8:00 AM", mood: "anxious", note: "Clingy at drop-off" },
      { time: "9:30 AM", mood: "calm", note: "Settled after snack" },
      { time: "10:30 AM", mood: "frustrated", note: "Couldn't complete puzzle" },
      { time: "11:30 AM", mood: "happy", note: "Loved music class" },
      { time: "2:00 PM", mood: "calm", note: "Quiet play with blocks" },
    ],
    learningStyle: [
      { subject: "Visual", value: 55 },
      { subject: "Auditory", value: 92 },
      { subject: "Kinesthetic", value: 70 },
      { subject: "Social", value: 45 },
    ],
    peerInteractions: [
      { peer: "Lina", frequency: 8, quality: "strong" },
      { peer: "Sophie", frequency: 3, quality: "developing" },
      { peer: "Yuki", frequency: 2, quality: "developing" },
      { peer: "Mia", frequency: 4, quality: "moderate" },
    ],
    emotionalScenarios: [
      { scenario: "Anger Management", icon: "😠", response: "Omar threw the toy but then said sorry without prompting.", assessment: "good", tip: "Acknowledge his self-correction — 'I noticed you said sorry on your own, that's kind.'" },
      { scenario: "Sharing Toys", icon: "🤝", response: "Reluctant to share, needed adult mediation.", assessment: "needs-practice", tip: "Use a 'sharing basket' with special toys to practice in low-stakes situations." },
      { scenario: "Waiting in Line", icon: "⏳", response: "Waited patiently while humming a song to himself.", assessment: "excellent", tip: "His musical self-soothing is a strength — encourage it!" },
    ],
    teacherNotes: "Omar had a tough start this morning with separation anxiety. He wandered during group time and needed redirection. However, he was a star during music — he remembered all the lyrics and even helped another child learn the song. He needs more support with fine motor tasks like cutting and tracing.",
    parentMessage: "Hello! Omar had a day with some wonderful highlights! 🎵 He absolutely shone during music class — he remembered all the lyrics and even helped a friend learn a new song. That shows incredible memory and kindness! We're working on making mornings smoother and building his confidence with hands-on activities.",
    actionPlan: [
      "Day 1: Practice cutting with safety scissors at home — try cutting play dough 'snakes' for fun!",
      "Day 2: Sing a favorite song together and clap out the rhythm — this builds his auditory strengths.",
      "Day 3: Create a morning goodbye routine (special handshake or phrase) to ease transitions.",
    ],
    talents: [
      { skill: "Singing & Rhythm", level: 5, category: "artistic" },
      { skill: "Memory Recall", level: 4, category: "logical" },
      { skill: "Empathy", level: 4, category: "social" },
      { skill: "Gross Motor", level: 3, category: "motor" },
      { skill: "Vocabulary", level: 3, category: "linguistic" },
    ],
    speechMetrics: {
      vocabularySize: 1600,
      avgSentenceLength: 4.2,
      benchmark: { vocabulary: 1800, sentenceLength: 4.8 },
    },
    nutrition: [
      { meal: "Breakfast", calories: 220, protein: 8, carbs: 35, vitamins: 50, items: ["Toast", "Jam", "Orange juice"] },
      { meal: "Snack", calories: 100, protein: 3, carbs: 15, vitamins: 25, items: ["Crackers", "Grapes"] },
      { meal: "Lunch", calories: 340, protein: 14, carbs: 50, vitamins: 55, items: ["Rice", "Chicken nuggets", "Peas"] },
    ],
    suggestedMeals: ["Egg muffins with veggies", "Trail mix with dried fruit", "Fish sticks with sweet potato fries"],
  },
  {
    id: "3",
    name: "Sophie Chen",
    age: 5,
    avatar: "👧🏻",
    developmentalData: [
      { day: "Mon", focus: 90, play: 75, learning: 92 },
      { day: "Tue", focus: 88, play: 78, learning: 95 },
      { day: "Wed", focus: 92, play: 70, learning: 90 },
      { day: "Thu", focus: 85, play: 72, learning: 88 },
      { day: "Fri", focus: 95, play: 68, learning: 93 },
      { day: "Sat", focus: 88, play: 80, learning: 90 },
      { day: "Sun", focus: 90, play: 76, learning: 92 },
    ],
    attentionScore: 91,
    behavioralLogs: [
      { time: "8:00 AM", note: "Arrived early and immediately started reading a book", type: "positive" },
      { time: "10:00 AM", note: "Completed math worksheet ahead of peers, asked for more", type: "positive" },
      { time: "11:30 AM", note: "Preferred solo play over group activity", type: "neutral" },
      { time: "1:45 PM", note: "Became upset when her block tower was accidentally knocked over", type: "concern" },
    ],
    recommendations: [
      { title: "Social Integration", description: "Gently encourage Sophie to join small group activities — pair her with a calm, patient peer.", priority: "high" },
      { title: "Challenge Materials", description: "Provide advanced puzzles and early reading books to keep her engaged and prevent boredom.", priority: "medium" },
      { title: "Frustration Tolerance", description: "Introduce 'mistake-friendly' activities (e.g., watercolor) to help her accept imperfection.", priority: "medium" },
    ],
    moodEntries: [
      { time: "8:00 AM", mood: "focused", note: "Reading independently" },
      { time: "9:30 AM", mood: "happy", note: "Excited about math" },
      { time: "11:00 AM", mood: "calm", note: "Drawing quietly" },
      { time: "1:45 PM", mood: "frustrated", note: "Upset about tower" },
      { time: "3:00 PM", mood: "focused", note: "Engaged in science experiment" },
    ],
    learningStyle: [
      { subject: "Visual", value: 95 },
      { subject: "Auditory", value: 78 },
      { subject: "Kinesthetic", value: 60 },
      { subject: "Social", value: 40 },
    ],
    peerInteractions: [
      { peer: "Lina", frequency: 5, quality: "moderate" },
      { peer: "Omar", frequency: 3, quality: "developing" },
      { peer: "Yuki", frequency: 7, quality: "strong" },
      { peer: "Mia", frequency: 2, quality: "developing" },
    ],
    emotionalScenarios: [
      { scenario: "Anger Management", icon: "😠", response: "Sophie walked away silently and sat in the reading corner.", assessment: "good", tip: "Encourage her to name her feelings verbally — 'I feel upset because...'" },
      { scenario: "Sharing Toys", icon: "🤝", response: "Willingly shared her crayons and showed another child how to blend colors.", assessment: "excellent", tip: "She shares well with materials — expand to sharing ideas in group settings." },
      { scenario: "Waiting in Line", icon: "⏳", response: "Waited quietly but seemed disengaged, staring at the ceiling.", assessment: "good", tip: "Give her a 'thinking challenge' to do while waiting to keep her mind active." },
    ],
    teacherNotes: "Sophie is academically ahead of her peers — she's already reading simple sentences and doing basic addition. However, she tends to prefer working alone and got quite upset when her block tower was knocked down. She needs more opportunities for collaborative play and learning to handle frustration when things don't go perfectly.",
    parentMessage: "Hi there! Sophie had an impressive day of learning! 📚 She's reading beautifully and tackled math challenges with enthusiasm. She also created a wonderful block tower! We're working on helping her enjoy group activities more and building resilience when things don't go exactly as planned — both great life skills.",
    actionPlan: [
      "Day 1: Do a collaborative art project together (like a collage) where 'mistakes' become happy accidents.",
      "Day 2: Invite a friend for a playdate with structured cooperative games (building something together).",
      "Day 3: Read a story about a character who makes mistakes and learns from them, then discuss.",
    ],
    talents: [
      { skill: "Reading & Writing", level: 5, category: "linguistic" },
      { skill: "Mathematics", level: 5, category: "logical" },
      { skill: "Detailed Drawing", level: 4, category: "artistic" },
      { skill: "Science Curiosity", level: 5, category: "logical" },
      { skill: "Fine Motor Skills", level: 4, category: "motor" },
    ],
    speechMetrics: {
      vocabularySize: 2800,
      avgSentenceLength: 8.1,
      benchmark: { vocabulary: 2100, sentenceLength: 5.5 },
    },
    nutrition: [
      { meal: "Breakfast", calories: 310, protein: 15, carbs: 38, vitamins: 75, items: ["Scrambled eggs", "Whole wheat toast", "Berries"] },
      { meal: "Snack", calories: 150, protein: 6, carbs: 20, vitamins: 40, items: ["Yogurt", "Granola"] },
      { meal: "Lunch", calories: 420, protein: 22, carbs: 48, vitamins: 80, items: ["Salmon rice bowl", "Broccoli", "Mango slices"] },
    ],
    suggestedMeals: ["Veggie sushi rolls", "Lentil soup with bread", "Berry oat pancakes"],
  },
];
