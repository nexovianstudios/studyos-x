export interface CheatSheet {
  id: string;
  subject: 'Mathematics' | 'Science' | 'Social Science' | 'English';
  chapter: string;
  formulas: string[];
  shortcuts: string[];
  tricks: string[];
  faqs: { q: string; a: string }[];
  tips: string[];
}

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: 'cs-math-real', subject: 'Mathematics', chapter: 'Real Numbers',
    formulas: ['LCM × HCF = a × b', 'Euclid: a = bq + r, 0 ≤ r < b'],
    shortcuts: ['For HCF of two numbers, use Euclid\'s algorithm repeatedly.'],
    tricks: ['If HCF(a,b)=1, then LCM = a×b.'],
    faqs: [{ q: 'What is the fundamental theorem of arithmetic?', a: 'Every composite number can be expressed as a product of primes uniquely.' }],
    tips: ['Practice proving irrationality of √2, √3, √5.'],
  },
  {
    id: 'cs-math-poly', subject: 'Mathematics', chapter: 'Polynomials',
    formulas: ['Sum of roots α+β = -b/a', 'Product αβ = c/a', 'Discriminant D = b²-4ac'],
    shortcuts: ['If sum and product of roots known, form x² - (sum)x + (product).'],
    tricks: ['D>0: 2 distinct real roots; D=0: equal; D<0: no real roots.'],
    faqs: [{ q: 'How to find zeroes graphically?', a: 'Zeroes are x-intercepts of the polynomial graph.' }],
    tips: ['Memorize relationship between zeroes and coefficients.'],
  },
  {
    id: 'cs-math-quad', subject: 'Mathematics', chapter: 'Quadratic Equations',
    formulas: ['x = [-b ± √(b²-4ac)]/2a'],
    shortcuts: ['For x² = a, roots are ±√a.'],
    tricks: ['Check D first to know nature of roots before solving.'],
    faqs: [{ q: 'When does a quadratic have no real roots?', a: 'When discriminant D < 0.' }],
    tips: ['Word problems: form equation from given conditions.'],
  },
  {
    id: 'cs-math-ap', subject: 'Mathematics', chapter: 'Arithmetic Progressions',
    formulas: ['aₙ = a + (n-1)d', 'Sₙ = n/2[2a + (n-1)d]'],
    shortcuts: ['If 3 terms in AP, take a-d, a, a+d.'],
    tricks: ['Sum = n × middle term (for odd n).'],
    faqs: [{ q: 'How to find d given two terms?', a: 'd = (aₘ - aₙ)/(m-n).' }],
    tips: ['Practice word problems on AP extensively.'],
  },
  {
    id: 'cs-math-tri', subject: 'Mathematics', chapter: 'Triangles',
    formulas: ['Pythagoras: a²+b²=c²', 'Area ratio = (ratio of sides)²'],
    shortcuts: ['Common triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25).'],
    tricks: ['BPT: line parallel to one side divides others proportionally.'],
    faqs: [{ q: 'What is the converse of BPT?', a: 'If a line divides two sides proportionally, it is parallel to the third side.' }],
    tips: ['Practice similarity-based proofs.'],
  },
  {
    id: 'cs-math-cg', subject: 'Mathematics', chapter: 'Coordinate Geometry',
    formulas: ['Distance = √[(x₂-x₁)²+(y₂-y₁)²]', 'Section: ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))'],
    shortcuts: ['Midpoint is section formula with m=n=1.'],
    tricks: ['Collinearity: area of triangle = 0.'],
    faqs: [{ q: 'How to find ratio of division?', a: 'Use section formula and equate coordinates.' }],
    tips: ['Memorize all three formulas cold.'],
  },
  {
    id: 'cs-math-trig', subject: 'Mathematics', chapter: 'Introduction to Trigonometry',
    formulas: ['sin²θ+cos²θ=1', '1+tan²θ=sec²θ', '1+cot²θ=cosec²θ'],
    shortcuts: ['sin(90-θ)=cosθ, tan(90-θ)=cotθ.'],
    tricks: ['Learn the table: 0, 30, 45, 60, 90 for all six ratios.'],
    faqs: [{ q: 'How to remember standard values?', a: 'Use the pattern: √0/2, √1/2, √2/2, √3/2, √4/2 for sin.' }],
    tips: ['Practice identity-based simplifications.'],
  },
  {
    id: 'cs-math-circles', subject: 'Mathematics', chapter: 'Circles',
    formulas: ['C = 2πr', 'A = πr²', 'Arc length = (θ/360)×2πr'],
    shortcuts: ['Sector area = (θ/360)×πr².'],
    tricks: ['Tangent ⊥ radius at point of contact.'],
    faqs: [{ q: 'How many tangents from an external point?', a: 'Exactly two, equal in length.' }],
    tips: ['Practice combined area problems (sector + triangle).'],
  },
  {
    id: 'cs-math-stat', subject: 'Mathematics', chapter: 'Statistics',
    formulas: ['Mean = Σfx/Σf', 'Mode = l+[(f₁-f₀)/(2f₁-f₀-f₂)]×h', 'Median = l+[(n/2-cf)/f]×h'],
    shortcuts: ['3 Median = 2 Mean + Mode.'],
    tricks: ['Use step-deviation for large data with equal class width.'],
    faqs: [{ q: 'When to use assumed mean method?', a: 'When direct method numbers are large.' }],
    tips: ['Practice ogive (cumulative frequency curve) construction.'],
  },
  {
    id: 'cs-math-prob', subject: 'Mathematics', chapter: 'Probability',
    formulas: ['P(E) = n(E)/n(S)', 'P(E)+P(Ē)=1'],
    shortcuts: ['Total probability = 1.'],
    tricks: ['For dice: 36 outcomes. For cards: 52. For coins: 2ⁿ.'],
    faqs: [{ q: 'What is a sure event?', a: 'P=1, e.g., rolling a number ≤6 on a die.' }],
    tips: ['Practice card, dice, coin problems.'],
  },
  // Science
  {
    id: 'cs-sci-elec', subject: 'Science', chapter: 'Electricity',
    formulas: ['V=IR', 'R=ρl/A', 'P=VI=I²R'],
    shortcuts: ['Series: R adds. Parallel: 1/R adds.'],
    tricks: ['Two resistors parallel: R = R₁R₂/(R₁+R₂).'],
    faqs: [{ q: 'Why is ammeter in series?', a: 'It must carry full current.' }],
    tips: ['Practice circuit diagrams and equivalent resistance.'],
  },
  {
    id: 'cs-sci-mag', subject: 'Science', chapter: 'Magnetic Effects of Current',
    formulas: ['F=BIL sin θ', 'B=μ₀I/2πr'],
    shortcuts: ['Right-hand thumb rule for current direction.'],
    tricks: ['Fleming\'s left hand: FBI (Force, B-field, Current).'],
    faqs: [{ q: 'What is electromagnetic induction?', a: 'Current induced by changing magnetic field.' }],
    tips: ['Learn AC generator diagram.'],
  },
  {
    id: 'cs-sci-light', subject: 'Science', chapter: 'Light - Reflection and Refraction',
    formulas: ['1/v+1/u=1/f (mirror)', '1/v-1/u=1/f (lens)', 'n=sin i/sin r'],
    shortcuts: ['f = R/2 for mirrors.'],
    tricks: ['Convex mirror always forms virtual, erect, diminished image.'],
    faqs: [{ q: 'When is image real?', a: 'When rays actually meet (screen can catch it).' }],
    tips: ['Memorize sign convention: distances measured from pole/optical center.'],
  },
  {
    id: 'cs-sci-eye', subject: 'Science', chapter: 'Human Eye and Colourful World',
    formulas: ['P = 1/f (diopters)'],
    shortcuts: ['Myopia: concave lens. Hypermetropia: convex lens.'],
    tricks: ['Rainbow: total internal reflection + dispersion.'],
    faqs: [{ q: 'Why is sky blue?', a: 'Rayleigh scattering: I ∝ 1/λ⁴, blue scatters most.' }],
    tips: ['Learn defects of eye and corrections.'],
  },
  {
    id: 'cs-sci-chem', subject: 'Science', chapter: 'Chemical Reactions',
    formulas: ['A+B→AB (combination)', 'AB→A+B (decomposition)'],
    shortcuts: ['Balance by hit-and-trial; start with heaviest element.'],
    tricks: ['Redox: oxidation = loss of electrons.'],
    faqs: [{ q: 'What is a redox reaction?', a: 'Both oxidation and reduction occur simultaneously.' }],
    tips: ['Learn types: combination, decomposition, displacement, double displacement.'],
  },
  {
    id: 'cs-sci-abs', subject: 'Science', chapter: 'Acids, Bases and Salts',
    formulas: ['Acid+Base→Salt+Water', 'pH=-log[H⁺]'],
    shortcuts: ['pH 0-7 acid, 7 neutral, 7-14 base.'],
    tricks: ['Blue litmus → red in acid; red → blue in base.'],
    faqs: [{ q: 'What is a strong acid?', a: 'Completely ionizes in water, e.g., HCl.' }],
    tips: ['Learn salt types: normal, acidic, basic, double.'],
  },
  {
    id: 'cs-sci-mnm', subject: 'Science', chapter: 'Metals and Non-Metals',
    formulas: ['Metal+O₂→Metal oxide', 'Metal+Acid→Salt+H₂'],
    shortcuts: ['Reactivity: K>Na>Ca>Mg>Al>Zn>Fe>Cu>Ag>Au.'],
    tricks: ['Ampere\'s reactivity: more reactive displaces less reactive.'],
    faqs: [{ q: 'What is amphoteric oxide?', a: 'Reacts with both acid and base, e.g., Al₂O₃.' }],
    tips: ['Learn extraction of metals (roasting, calcination, reduction).'],
  },
  {
    id: 'cs-sci-carb', subject: 'Science', chapter: 'Carbon and its Compounds',
    formulas: ['Alkane CₙH₂ₙ₊₂', 'Alkene CₙH₂ₙ', 'Alkyne CₙH₂ₙ₋₂'],
    shortcuts: ['IUPAC: longest chain, lowest locants.'],
    tricks: ['Functional groups: -ol (alcohol), -al (aldehyde), -one (ketone), -oic (acid).'],
    faqs: [{ q: 'What is catenation?', a: 'Carbon\'s ability to form long chains and rings.' }],
    tips: ['Learn ethanol and ethanoic acid reactions.'],
  },
  // Social Science
  {
    id: 'cs-ss-history', subject: 'Social Science', chapter: 'Nationalism in India',
    formulas: [],
    shortcuts: ['Non-Cooperation (1920-22), Civil Disobedience (1930), Quit India (1942).'],
    tricks: ['Timeline: 1919 Rowlatt/Jallianwala, 1920 NCM, 1930 Dandi, 1942 QIM.'],
    faqs: [{ q: 'What was the Rowlatt Act?', a: 'Allowed detention without trial (1919).' }],
    tips: ['Map work: important Congress sessions.'],
  },
  {
    id: 'cs-ss-geo', subject: 'Social Science', chapter: 'Resources and Development',
    formulas: [],
    shortcuts: ['Types: natural, human, man-made. Conservation = sustainable use.'],
    tricks: ['Soil types: alluvial, black, red, laterite, arid, mountain.'],
    faqs: [{ q: 'What is sustainable development?', a: 'Using resources without depleting them for future.' }],
    tips: ['Learn soil conservation methods.'],
  },
  {
    id: 'cs-ss-civics', subject: 'Social Science', chapter: 'Power Sharing',
    formulas: [],
    shortcuts: ['Belgium: community govt. Sri Lanka: majoritarian.'],
    tricks: ['Forms: horizontal (organs), vertical (levels), community.'],
    faqs: [{ q: 'Why power sharing?', a: 'Reduces conflict, ensures stability.' }],
    tips: ['Compare Belgium and Sri Lanka cases.'],
  },
  {
    id: 'cs-ss-econ', subject: 'Social Science', chapter: 'Development',
    formulas: ['Per capita income = National income / Population'],
    shortcuts: ['HDI: health, education, income.'],
    tricks: ['Sustainable development = needs of present + future.'],
    faqs: [{ q: 'What is HDI?', a: 'Human Development Index - measures well-being.' }],
    tips: ['Compare India with neighbors on development indicators.'],
  },
  // English
  {
    id: 'cs-eng-gram', subject: 'English', chapter: 'Grammar',
    formulas: [],
    shortcuts: ['Tenses: 12 total (4 each past/present/future).'],
    tricks: ['Active→Passive: subject-object swap, verb to be + past participle.'],
    faqs: [{ q: 'When to use "the"?', a: 'Before specific/unique nouns, superlatives, ordinal numbers.' }],
    tips: ['Practice editing, omission, sentence transformation.'],
  },
  {
    id: 'cs-eng-writing', subject: 'English', chapter: 'Writing',
    formulas: [],
    shortcuts: ['Letter: sender addr, date, recipient, subject, salutation, body, closing.'],
    tricks: ['Analytical paragraph: intro, data description, conclusion.'],
    faqs: [{ q: 'Format of formal letter?', a: 'Sender\'s address, date, receiver\'s, subject, salutation, body, complimentary close.' }],
    tips: ['Learn formats: formal/informal letter, analytical paragraph, story.'],
  },
  {
    id: 'cs-eng-lit', subject: 'English', chapter: 'Literature - First Flight',
    formulas: [],
    shortcuts: ['Prose: A Letter to God, Nelson Mandela, Two Stories, Mijbil, Glimpses of India.'],
    tricks: ['Poems: Dust of Snow, Fire and Ice, The Ball Poem, Amanda, The Trees.'],
    faqs: [{ q: 'Theme of "A Letter to God"?', a: 'Faith in God and irony of human help.' }],
    tips: ['Learn character sketches and themes.'],
  },
  {
    id: 'cs-eng-lit2', subject: 'English', chapter: 'Literature - Footprints Without Feet',
    formulas: [],
    shortcuts: ['Stories: Thief\'s Story, Midnight Visitor, Necklace, Making of a Scientist, Necklace.'],
    tricks: ['The Hack Driver, Bholi, The Book That Saved the Earth.'],
    faqs: [{ q: 'Theme of "The Necklace"?', a: 'Vanity and the cost of false appearances.' }],
    tips: ['Learn moral of each story.'],
  },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-session', name: 'First Steps', description: 'Complete your first study session', icon: 'Sparkles', requirement: '1 session' },
  { id: 'algebra-master', name: 'Algebra Master', description: 'Master all Algebra formulas', icon: 'Sigma', requirement: 'Favorite 10 math formulas' },
  { id: 'geometry-god', name: 'Geometry God', description: 'Conquer geometry chapters', icon: 'Triangle', requirement: '5 geometry favorites' },
  { id: 'physics-wizard', name: 'Physics Wizard', description: 'Master physics formulas', icon: 'Atom', requirement: '8 physics favorites' },
  { id: 'chem-alchemist', name: 'Chemistry Alchemist', description: 'Master chemistry reactions', icon: 'FlaskConical', requirement: '8 chemistry favorites' },
  { id: 'history-king', name: 'History King', description: 'Bookmark all history sheets', icon: 'Crown', requirement: 'Bookmark 5 sheets' },
  { id: 'revision-beast', name: 'Revision Beast', description: 'Study 10 hours total', icon: 'Flame', requirement: '600 min studied' },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day study streak', icon: 'Zap', requirement: '7 day streak' },
  { id: 'streak-30', name: 'Unstoppable', description: '30-day study streak', icon: 'Trophy', requirement: '30 day streak' },
  { id: 'night-owl', name: 'Night Owl', description: 'Study after 10 PM', icon: 'Moon', requirement: '1 night session' },
  { id: 'level-10', name: 'Level 10', description: 'Reach level 10', icon: 'Star', requirement: '5000 XP' },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Complete 10 quizzes', icon: 'Brain', requirement: '10 quizzes' },
];

export const QUOTES = [
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Hard work beats talent when talent doesn\'t work hard.', author: 'Tim Notke' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'Strive for progress, not perfection.', author: 'Unknown' },
  { text: 'Don\'t let what you cannot do interfere with what you can do.', author: 'John Wooden' },
  { text: 'Excellence is not a skill, it\'s an attitude.', author: 'Ralph Marston' },
];

export const RESOURCES = [
  { name: 'NCERT Textbooks (Official)', url: 'https://ncert.nic.in/textbook.php', category: 'Textbooks', desc: 'Official NCERT textbooks for all classes' },
  { name: 'ePathshala', url: 'https://epathshala.nic.in/', category: 'Textbooks', desc: 'Digital NCERT resources and e-books' },
  { name: 'NCERT Exemplar Problems', url: 'https://ncert.nic.in/exemplar-problems.php', category: 'Practice', desc: 'Advanced practice problems' },
  { name: 'CBSE Sample Papers', url: 'https://cbse.gov.in/academic.html', category: 'Papers', desc: 'Official CBSE sample papers' },
  { name: 'CBSE Previous Year Papers', url: 'https://cbse.gov.in/academic.html', category: 'Papers', desc: 'Previous year board exam papers' },
  { name: 'Khan Academy (Math)', url: 'https://www.khanacademy.org/math', category: 'Videos', desc: 'Free math video lessons' },
  { name: 'Khan Academy (Science)', url: 'https://www.khanacademy.org/science', category: 'Videos', desc: 'Free science video lessons' },
  { name: 'Physics Wallah', url: 'https://www.pw.live/', category: 'Videos', desc: 'Science video lectures' },
  { name: 'BYJU\'S', url: 'https://byjus.com/', category: 'Videos', desc: 'Concept videos and practice' },
  { name: 'Toppr', url: 'https://www.toppr.com/', category: 'Practice', desc: 'Practice questions and tests' },
  { name: 'Vedantu', url: 'https://www.vedantu.com/', category: 'Videos', desc: 'Live online classes' },
  { name: 'NCERT Solutions', url: 'https://ncert.nic.in/', category: 'Solutions', desc: 'Official solutions to NCERT exercises' },
];
