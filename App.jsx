import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Circle, Utensils, Dumbbell, Calendar, TrendingDown, Activity, Flame, Timer } from 'lucide-react';

const QUOTES = [
  'Change lives in the discomfort.',
  'The curse of discipline is that everyday looks the same, but without discipline every year looks the same.',
];

const PHASES = [
  { name: 'Foundation', start: '2026-09-14', end: '2026-10-08', focus: 'Dial in deficit, daily ankle/knee mobility, 3x/wk strength', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
  { name: 'Pre-Trip Taper', start: '2026-10-08', end: '2026-10-16', focus: 'Keep training light, do not bank a big deficit before travel', color: 'bg-amber-100 border-amber-300 text-amber-900' },
  { name: 'Hawaii (Maintenance)', start: '2026-10-16', end: '2026-10-23', focus: 'Maintenance mode — enjoy it, stay active, no guilt', color: 'bg-sky-100 border-sky-300 text-sky-900' },
  { name: 'Re-Entry', start: '2026-10-23', end: '2026-11-05', focus: 'Rebuild deficit + training rhythm, no restart-from-scratch mindset', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
  { name: 'Build (Main Push)', start: '2026-11-05', end: '2026-12-10', focus: 'Biggest uninterrupted stretch — increase volume, reassess joint scores', color: 'bg-violet-100 border-violet-300 text-violet-900' },
  { name: 'Taper / Hold', start: '2026-12-10', end: '2027-01-04', focus: 'Ease off through holidays, hold weight rather than fight it', color: 'bg-rose-100 border-rose-300 text-rose-900' },
];

const MOBILITY_WORK = [
  { area: 'Right Ankle', score: 31, priority: 1, exercises: ['Banded ankle dorsiflexion mobilization — 2x15', 'Wall-facing knee-to-wall stretch — 3x10 each side', 'Weighted calf/soleus stretch — 2x30sec'] },
  { area: 'Right Knee Alignment', score: 32, priority: 2, exercises: ['Banded lateral walks — 3x12 each direction', 'Single-leg glute bridge — 3x10 each side', 'Step-downs with control — 3x8 each side'] },
  { area: 'Left Knee Mobility', score: 43, priority: 3, exercises: ['Couch stretch — 2x45sec each side', 'Deep squat hold (assisted if needed) — 3x30sec', 'Foam roll quads — 2 min each side'] },
];

const HIIT_ROTATION = ['Hot Cycle', 'Hot Row', 'Cross Row', 'Hot Thunder', 'Hot Blast'];
const ISOMETRIC_ROTATION = ['Hot Pilates', 'Hot Yoga', 'Hot Barre'];

const STRENGTH_FOCUS = {
  Monday: { name: 'Lower body', exercises: ['Back squat 4x6', 'Romanian deadlift 3x8', 'Walking lunges 3x10/leg'] },
  Tuesday: { name: 'Upper body', exercises: ['Push-up or bench variation 4x8', 'Bent-over row 3x10', 'Overhead press 3x10'] },
  Thursday: { name: 'Lower body (posterior chain)', exercises: ['Deadlift 4x5', 'Hip thrust 3x10', 'Calf raises 3x15'] },
  Friday: { name: 'Upper body', exercises: ['Pull-up or row variation 4x8', 'Incline press 3x10', 'Lateral raise 3x12'] },
  Saturday: { name: 'Full body conditioning', exercises: ['Goblet squat 3x12', 'Dumbbell thruster 3x10', 'Renegade row 3x8/side'] },
};

function getMorningPlanForDay(dayName, weekIndex, dayIndex) {
  if (dayName === 'Sunday') {
    return { day: 'Sunday', type: 'Rest', focus: 'Full rest', exercises: ['Full rest or a light walk', 'Stretch / foam roll if anything feels tight'] };
  }
  if (dayName === 'Wednesday') {
    const cls = ISOMETRIC_ROTATION[weekIndex % ISOMETRIC_ROTATION.length];
    return {
      day: 'Wednesday',
      type: '~40 min morning',
      focus: `Stretch + ${cls} (low-impact, knee-focused)`,
      exercises: [
        'Stretch / mobility warm-up — 10 min (fold in ankle + knee mobility work)',
        `Attend ${cls} — 30 min (isometric, low-impact — swapped in for strength this day)`,
      ],
    };
  }
  const classA = HIIT_ROTATION[(weekIndex + dayIndex) % HIIT_ROTATION.length];
  const classB = HIIT_ROTATION[(weekIndex + dayIndex + 1) % HIIT_ROTATION.length];
  const strength = STRENGTH_FOCUS[dayName];
  return {
    day: dayName,
    type: '~60 min morning',
    focus: `Stretch + 30 min HIIT + ${strength.name}`,
    exercises: [
      'Stretch / mobility warm-up — 10 min (fold in ankle + knee mobility work)',
      `HIIT stack — 30 min: ${classA} (15 min) + ${classB} (15 min)`,
      ...strength.exercises,
    ],
  };
}

function getMorningPlanForWeek(weekIndex) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((d, i) => getMorningPlanForDay(d, weekIndex, i));
}


const MEAL_PLAN = {
  breakfast: {
    name: 'Veggie Egg Scramble + Berries',
    items: ['3 large eggs', '1 cup spinach, chopped', '1/4 cup bell pepper, diced', '2 tbsp onion, diced', '1/2 cup mixed berries', '1/2 avocado (~100g)'],
    method: 'Sauté onion and pepper 2-3 min. Add spinach, cook until wilted (~1 min). Whisk eggs, pour in, scramble until just set. Plate with berries and avocado.',
    cals: 420, protein: 26,
    addOns: [
      { name: 'Turkey sausage (2 links, ~3.5oz)', cals: 130, protein: 14 },
      { name: 'Turkey bacon (2 slices)', cals: 70, protein: 6 },
    ]
  },
  lunch: {
    name: 'Chicken + Rice + Greens Bowl',
    items: ['6oz cooked chicken breast (weigh after cooking)', '3/4 cup cooked jasmine or brown rice', '2 cups mixed greens', '1/2 cup cherry tomatoes, halved', '1/2 cup cucumber, diced', '1 tbsp olive oil + juice of 1/2 lemon'],
    method: 'Batch-cook chicken (grilled/baked 375°F, 20-25 min) and rice on prep day. Assemble fresh: greens, rice, chicken, tomato, cucumber — dress right before eating.',
    cals: 520, protein: 48
  },
  snack: {
    name: 'Greek Yogurt + Honey',
    items: ['1 cup plain Greek yogurt (~227g)', '1 tbsp honey'],
    method: 'No cooking — combine yogurt and honey.',
    cals: 190, protein: 23,
    cravingNote: 'Craving something sweet? Frozen grapes/berries (~free), 2 squares dark chocolate 70%+ (~50 cal), a medjool date (~65 cal), or extra cinnamon on the yogurt all fit without derailing the day.'
  },
  dinner: {
    name: 'Baked Salmon + Sweet Potato + Broccoli',
    items: ['6oz salmon fillet (raw weight)', '1 medium sweet potato (~150g)', '2 cups broccoli florets', '1 tbsp olive oil (split)', '1/2 tsp turmeric + 1 clove garlic, minced'],
    method: 'Roast sweet potato whole at 400°F, 35-40 min (pierce skin first). Bake salmon at 400°F, 12-15 min. Roast broccoli tossed in oil/turmeric/garlic at 400°F, 12-15 min — can go in alongside the potato.',
    cals: 560, protein: 42
  },
  totals: { cals: 1690, protein: 139 }
};

const SHOPPING_LIST = {
  'Protein (buy in bulk)': ['Chicken breast (family pack)', 'Salmon fillets', 'Eggs (2 dozen)', 'Plain Greek yogurt (large tub)', 'Turkey sausage or turkey bacon (optional)'],
  'Produce': ['Spinach', 'Bell peppers', 'Onions', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Broccoli', 'Sweet potatoes', 'Avocados', 'Mixed berries (frozen is fine + cheaper)', 'Garlic', 'Lemons'],
  'Pantry / Staples': ['Jasmine or brown rice (bulk bag)', 'Olive oil', 'Honey', 'Turmeric', 'Dark chocolate 70%+ (optional, for cravings)', 'Medjool dates (optional, for cravings)', 'Cinnamon (optional)'],
};

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function getCurrentPhase() {
  const today = getToday();
  for (const p of PHASES) {
    if (today >= p.start && today < p.end) return p;
  }
  if (today < PHASES[0].start) return PHASES[0];
  return PHASES[PHASES.length - 1];
}

function dayOfYear(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

const WEIGHT_KEY = 'deej-weight-log';
const MOBILITY_KEY = 'deej-mobility-log';
const CALORIE_KEY = 'deej-calorie-log';
const HOTWORX_KEY = 'deej-hotworx-log';

export default function App() {
  const [weights, setWeights] = useState({});
  const [mobilityLog, setMobilityLog] = useState({});
  const [calorieLog, setCalorieLog] = useState({});
  const [hotworxLog, setHotworxLog] = useState({});
  const [expandedSection, setExpandedSection] = useState('overview');
  const [newWeight, setNewWeight] = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [loaded, setLoaded] = useState(false);

  const START_WEIGHT = 214.9;
  const START_DATE = '2026-09-14';
  const TARGET_DATE = '2027-01-04';
  const TARGET_WEIGHT = 188;
  const CALORIE_TARGET = 1800;

  useEffect(() => {
    try {
      const w = localStorage.getItem(WEIGHT_KEY);
      if (w) setWeights(JSON.parse(w));
    } catch (e) { /* no data yet */ }
    try {
      const m = localStorage.getItem(MOBILITY_KEY);
      if (m) setMobilityLog(JSON.parse(m));
    } catch (e) { /* no data yet */ }
    try {
      const c = localStorage.getItem(CALORIE_KEY);
      if (c) setCalorieLog(JSON.parse(c));
    } catch (e) { /* no data yet */ }
    try {
      const h = localStorage.getItem(HOTWORX_KEY);
      if (h) setHotworxLog(JSON.parse(h));
    } catch (e) { /* no data yet */ }
    setLoaded(true);
  }, []);

  function saveWeights(updated) {
    setWeights(updated);
    try { localStorage.setItem(WEIGHT_KEY, JSON.stringify(updated)); } catch (e) { /* storage unavailable */ }
  }

  function saveMobility(updated) {
    setMobilityLog(updated);
    try { localStorage.setItem(MOBILITY_KEY, JSON.stringify(updated)); } catch (e) { /* storage unavailable */ }
  }

  function saveCalories(updated) {
    setCalorieLog(updated);
    try { localStorage.setItem(CALORIE_KEY, JSON.stringify(updated)); } catch (e) { /* storage unavailable */ }
  }

  function saveHotworx(updated) {
    setHotworxLog(updated);
    try { localStorage.setItem(HOTWORX_KEY, JSON.stringify(updated)); } catch (e) { /* storage unavailable */ }
  }

  function logWeight() {
    const val = parseFloat(newWeight);
    if (!val || val <= 0 || val > 500) return;
    const updated = { ...weights, [getToday()]: val };
    saveWeights(updated);
    setNewWeight('');
  }

  function logCalories() {
    const val = parseInt(newCalories, 10);
    if (!val || val <= 0 || val > 10000) return;
    const updated = { ...calorieLog, [getToday()]: val };
    saveCalories(updated);
    setNewCalories('');
  }

  function toggleMobility(area) {
    const today = getToday();
    const key = `${today}-${area}`;
    const updated = { ...mobilityLog, [key]: !mobilityLog[key] };
    saveMobility(updated);
  }

  function toggleHotworxExercise(day, idx) {
    const today = getToday();
    const key = `${today}-${day}-${idx}`;
    const updated = { ...hotworxLog, [key]: !hotworxLog[key] };
    saveHotworx(updated);
  }

  const sortedWeights = Object.entries(weights).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  const latestWeight = sortedWeights.length ? sortedWeights[sortedWeights.length - 1][1] : START_WEIGHT;
  const totalLost = (START_WEIGHT - latestWeight).toFixed(1);
  const daysElapsed = Math.max(0, daysBetween(START_DATE, getToday()));
  const daysTotal = daysBetween(START_DATE, TARGET_DATE);
  const progressPct = Math.min(100, Math.max(0, (daysElapsed / daysTotal) * 100));
  const currentPhase = getCurrentPhase();
  const todayMobilityDone = MOBILITY_WORK.filter(m => mobilityLog[`${getToday()}-${m.area}`]).length;

  const daysToGoal = Math.max(0, daysBetween(getToday(), TARGET_DATE));
  const todaysQuote = QUOTES[dayOfYear(getToday()) % QUOTES.length];

  const todayCalories = calorieLog[getToday()] || 0;
  const last7Dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  const weekEntries = last7Dates.map(d => calorieLog[d]).filter(v => v !== undefined);
  const weeklyTotal = weekEntries.reduce((a, b) => a + b, 0);
  const weeklyAvg = weekEntries.length ? Math.round(weeklyTotal / weekEntries.length) : 0;

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const weekIndex = Math.floor(daysBetween(START_DATE, getToday()) / 7);
  const hotworxPlan = getMorningPlanForWeek(weekIndex);
  const todaysHotworx = hotworxPlan.find(d => d.day === todayName) || hotworxPlan[0];
  const hotworxDoneCount = todaysHotworx.exercises.filter((_, i) => hotworxLog[`${getToday()}-${todaysHotworx.day}-${i}`]).length;

  const Section = ({ id, icon: Icon, title, children }) => {
    const isOpen = expandedSection === id;
    return (
      <div className="border border-stone-200 rounded-xl overflow-hidden bg-white mb-3">
        <button
          onClick={() => setExpandedSection(isOpen ? null : id)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-teal-700" />
            <span className="font-semibold text-stone-800">{title}</span>
          </div>
          {isOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
        </button>
        {isOpen && <div className="px-5 pb-5">{children}</div>}
      </div>
    );
  };

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-12">
      <div className="bg-gradient-to-br from-teal-800 to-teal-900 text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Deej's Transformation Tracker</h1>
        <p className="text-teal-100 text-sm">Sep 14, 2026 → Jan 4, 2027</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-teal-200 text-xs mb-1">Current</div>
            <div className="text-xl font-bold">{latestWeight} lb</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-teal-200 text-xs mb-1">Lost So Far</div>
            <div className="text-xl font-bold">{totalLost > 0 ? totalLost : '0.0'} lb</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-teal-200 text-xs mb-1">Goal</div>
            <div className="text-xl font-bold">~{TARGET_WEIGHT} lb</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-teal-200 mb-1">
            <span>Day {daysElapsed} of {daysTotal}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className={`rounded-xl border-2 p-4 mb-4 ${currentPhase.color} shadow-sm`}>
          <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Current Phase</div>
          <div className="font-bold text-lg">{currentPhase.name}</div>
          <div className="text-sm mt-1 opacity-90">{currentPhase.focus}</div>
        </div>

        <div className="rounded-xl bg-stone-800 text-white p-4 mb-4 flex items-center gap-3">
          <Timer size={24} className="text-teal-300 flex-shrink-0" />
          <div>
            <div className="text-xl font-bold leading-tight">{daysToGoal} days</div>
            <div className="text-xs text-stone-300">until goal — Jan 4, 2027</div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 mb-4">
          <p className="text-sm italic text-stone-700 leading-relaxed">"{todaysQuote}"</p>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">

        <Section id="overview" icon={Calendar} title="Phase Schedule">
          <div className="space-y-2">
            {PHASES.map((p) => {
              const isCurrent = p.name === currentPhase.name;
              const isPast = getToday() >= p.end;
              return (
                <div key={p.name} className={`rounded-lg p-3 border ${isCurrent ? p.color + ' border-2' : 'border-stone-200 bg-stone-50'} ${isPast && !isCurrent ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{p.name}</span>
                    {isPast && !isCurrent && <Check size={16} className="text-stone-400" />}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{p.start} → {p.end}</div>
                  <div className="text-xs text-stone-600 mt-1">{p.focus}</div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="calories" icon={Flame} title={`Calories — ${todayCalories}/${CALORIE_TARGET} today`}>
          <p className="text-xs text-stone-500 mb-3">This just logs a total number — it doesn't look up food for you. Figure out the calories first, then enter the total here.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">How to get the number: </span>
            Packaged food — check the nutrition label for calories per serving, then multiply by how many servings you actually ate (weigh/measure the portion if you can). Whole foods without a label (chicken, rice, produce) — look up "[food] calories per [amount]" or use a food-tracking app's database (MyFitnessPal, Cronometer, Lose It). Restaurant meals — most chains post nutrition info on their website or app. Add up each item in a meal, then log the day's total here.
          </div>
          <p className="text-xs text-stone-500 mb-4">Tip: if you stick to the meals in the plan below exactly as portioned, the total is already known (1,800) — you only need to calculate when you eat something different.</p>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Log today's calories"
              value={newCalories}
              onChange={(e) => setNewCalories(e.target.value)}
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button onClick={logCalories} className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-800">
              Log
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-stone-50 rounded-lg p-3">
              <div className="text-xs text-stone-500 mb-1">Weekly total</div>
              <div className="text-lg font-bold text-stone-800">{weeklyTotal}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <div className="text-xs text-stone-500 mb-1">Weekly avg/day</div>
              <div className="text-lg font-bold text-stone-800">{weeklyAvg || '—'}</div>
            </div>
          </div>
          {Object.keys(calorieLog).length === 0 ? (
            <p className="text-sm text-stone-400">No entries yet. Log today's calories to start tracking.</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {Object.entries(calorieLog).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, c]) => (
                <div key={date} className="flex justify-between text-sm py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">{date}</span>
                  <span className="font-medium text-stone-800">{c} cal</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section id="weight" icon={TrendingDown} title="Weight Log">
          <p className="text-xs text-stone-500 mb-2">Logging for: <span className="font-medium text-stone-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              step="0.1"
              placeholder="Enter today's weight"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button onClick={logWeight} className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-800">
              Log
            </button>
          </div>
          {sortedWeights.length === 0 ? (
            <p className="text-sm text-stone-400">No entries yet. Log your weight to start tracking.</p>
          ) : (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {sortedWeights.slice().reverse().map(([date, w]) => (
                <div key={date} className="flex justify-between text-sm py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <span className="font-medium text-stone-800">{w} lb</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section id="mobility" icon={Activity} title={`Daily Mobility Work ${todayMobilityDone}/3`}>
          <div className="space-y-3">
            {MOBILITY_WORK.map((m) => {
              const done = mobilityLog[`${getToday()}-${m.area}`];
              return (
                <div key={m.area} className={`rounded-lg border p-3 ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200'}`}>
                  <button onClick={() => toggleMobility(m.area)} className="w-full flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {done ? <Check size={18} className="text-emerald-600" /> : <Circle size={18} className="text-stone-300" />}
                      <span className="font-semibold text-sm text-stone-800">Priority {m.priority}: {m.area}</span>
                    </div>
                    <span className="text-xs text-stone-400">score {m.score}</span>
                  </button>
                  <ul className="text-xs text-stone-600 space-y-1 ml-6">
                    {m.exercises.map((ex, i) => <li key={i}>• {ex}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="hotworx" icon={Dumbbell} title={`Today's Workout (${todaysHotworx.day}) ${hotworxDoneCount}/${todaysHotworx.exercises.length}`}>
          <div className="mb-3">
            <span className="text-xs font-medium bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full mr-2">{todaysHotworx.type}</span>
            <span className="text-sm font-semibold text-stone-800">{todaysHotworx.focus}</span>
          </div>
          <div className="space-y-2 mb-4">
            {todaysHotworx.exercises.map((ex, i) => {
              const done = hotworxLog[`${getToday()}-${todaysHotworx.day}-${i}`];
              return (
                <button
                  key={i}
                  onClick={() => toggleHotworxExercise(todaysHotworx.day, i)}
                  className={`w-full flex items-center gap-2 rounded-lg border p-2.5 text-left ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200'}`}
                >
                  {done ? <Check size={16} className="text-emerald-600 flex-shrink-0" /> : <Circle size={16} className="text-stone-300 flex-shrink-0" />}
                  <span className="text-xs text-stone-700">{ex}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-400 mb-3">Checklist resets automatically each day. HIIT classes rotate through the week so you're not stacking the same one twice. Full week below for reference.</p>
          <div className="space-y-2 border-t border-stone-100 pt-3">
            {hotworxPlan.map((d) => (
              <div key={d.day} className={`rounded-lg p-2.5 ${d.day === todaysHotworx.day ? 'bg-teal-50' : 'bg-stone-50'}`}>
                <div className="flex justify-between text-xs gap-2">
                  <span className="font-semibold text-stone-700 flex-shrink-0">{d.day}</span>
                  <span className="text-stone-500 text-right">{d.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="training" icon={Dumbbell} title="Morning Routine Structure">
          <div className="space-y-2 text-sm text-stone-700">
            <div className="flex gap-3"><span className="font-semibold w-24">10 min</span><span>Stretch / mobility warm-up (fold in ankle + knee work)</span></div>
            <div className="flex gap-3"><span className="font-semibold w-24">30 min</span><span>HIIT — stack two 15-min Hotworx sessions back to back</span></div>
            <div className="flex gap-3"><span className="font-semibold w-24">~20 min</span><span>Strength training, focus rotates daily (see Today's Workout)</span></div>
          </div>
          <p className="text-xs text-stone-400 mt-3">Roughly 60 min total, done in the morning, 6 days/week with Sunday as full rest. Wednesday is shorter (~40 min) — a rotating Pilates/Yoga/Barre class replaces HIIT + strength that day for lower-impact knee-focused work.</p>
        </Section>

        <Section id="meals" icon={Utensils} title="Weekly Meal Plan (Repeats Daily)">
          <p className="text-xs text-stone-500 mb-3">Same plan every day — weigh/measure portions and track actual calories. Anti-inflammatory focus, no pork, minimal weekday cooking (batch prep on Sunday).</p>
          {Object.entries(MEAL_PLAN).filter(([k]) => k !== 'totals').map(([key, meal]) => (
            <div key={key} className="mb-3 pb-3 border-b border-stone-100 last:border-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm text-stone-800 capitalize">{key}: {meal.name}</span>
                <span className="text-xs text-stone-400">{meal.cals} cal · {meal.protein}g protein</span>
              </div>
              <ul className="text-xs text-stone-600 space-y-0.5 mb-2">
                {meal.items.map((it, i) => <li key={i}>• {it}</li>)}
              </ul>
              {meal.method && (
                <p className="text-xs text-stone-500 bg-stone-50 rounded-lg p-2 leading-relaxed">
                  <span className="font-semibold text-stone-600">Method: </span>{meal.method}
                </p>
              )}
              {meal.addOns && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-stone-600">Optional add-ins:</span>
                  <ul className="text-xs text-stone-600 space-y-0.5 mt-1">
                    {meal.addOns.map((a, i) => (
                      <li key={i}>• {a.name} — +{a.cals} cal, +{a.protein}g protein</li>
                    ))}
                  </ul>
                </div>
              )}
              {meal.cravingNote && (
                <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mt-2 leading-relaxed">{meal.cravingNote}</p>
              )}
            </div>
          ))}
          <div className="bg-teal-50 rounded-lg p-3 mt-2 flex justify-between text-sm font-semibold text-teal-900">
            <span>Daily Total</span>
            <span>{MEAL_PLAN.totals.cals} cal · {MEAL_PLAN.totals.protein}g protein</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Adjust portions up/down based on your tracked deficit target — this gives you the structure, you dial the amounts.</p>
          <p className="text-xs text-stone-400 mt-1">Weigh chicken and salmon after cooking (that's when the cal counts apply). Batch-cook chicken, rice, and sweet potatoes on one prep day — they hold 4-5 days refrigerated.</p>
        </Section>

        <Section id="shopping" icon={Utensils} title="Weekly Shopping List (Cost-Effective)">
          {Object.entries(SHOPPING_LIST).map(([cat, items]) => (
            <div key={cat} className="mb-3">
              <div className="font-semibold text-sm text-stone-800 mb-1">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                  <span key={it} className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full">{it}</span>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-stone-400 mt-2">Buying protein in bulk and repeating the same produce list weekly keeps cost down — frozen berries/veg work fine and are cheaper than fresh.</p>
        </Section>

      </div>
    </div>
  );
}
