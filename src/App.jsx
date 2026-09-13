import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Circle, Utensils, Dumbbell, Calendar, TrendingDown, Activity } from 'lucide-react';

const PHASES = [
  { name: 'Foundation', start: '2026-09-10', end: '2026-10-08', focus: 'Dial in deficit, daily ankle/knee mobility, 3x/wk strength', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
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

const MEAL_PLAN = {
  breakfast: { name: 'Veggie Egg Scramble + Berries', items: ['3 eggs scrambled with spinach, peppers, onion', '1/2 cup mixed berries', '1/2 avocado'], cals: 420, protein: 26 },
  snack: { name: 'Greek Yogurt + Walnuts', items: ['1 cup plain Greek yogurt', '1 tbsp honey', '1oz walnuts'], cals: 300, protein: 24 },
  dinner: { name: 'Baked Salmon + Sweet Potato + Broccoli', items: ['6oz baked salmon', '1 medium roasted sweet potato', '2 cups steamed broccoli w/ olive oil, turmeric, garlic'], cals: 560, protein: 42 },
  totals: { cals: 1800, protein: 140 }
};

const LUNCH_OPTIONS = [
  { name: 'Chicken + Rice + Greens Bowl', items: ['6oz grilled chicken breast (batch cooked)', '3/4 cup cooked jasmine or brown rice', '2 cups mixed greens + olive oil/lemon dressing', 'Handful cherry tomatoes + cucumber'], cals: 520, protein: 48 },
  { name: 'Three-Bean Chicken Salad', items: ['1/2 cup each chickpeas, black beans, kidney beans', '4-5oz grilled chicken', 'Cilantro, red onion, bell pepper', '1oz feta', 'Olive oil + red wine vinegar'], cals: 610, protein: 46, note: 'Higher cal than the bowl (beans + feta add up) — great fiber/protein combo, just measure the beans and feta since those are easy to overpour.' },
];

const SHOPPING_LIST = {
  'Protein (buy in bulk)': ['Chicken breast (family pack)', 'Salmon fillets', 'Eggs (2 dozen)', 'Plain Greek yogurt (large tub)', 'Feta (block, cheaper than crumbled)'],
  'Produce': ['Spinach', 'Bell peppers', 'Red onion', 'Onions', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Broccoli', 'Sweet potatoes', 'Avocados', 'Mixed berries (frozen is fine + cheaper)', 'Garlic', 'Lemons', 'Cilantro'],
  'Pantry / Staples': ['Jasmine or brown rice (bulk bag)', 'Olive oil', 'Red wine vinegar', 'Walnuts', 'Honey', 'Turmeric', 'Canned chickpeas', 'Canned black beans', 'Canned kidney beans'],
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

const WEIGHT_KEY = 'deej-weight-log';
const MOBILITY_KEY = 'deej-mobility-log';

export default function App() {
  const [weights, setWeights] = useState({});
  const [mobilityLog, setMobilityLog] = useState({});
  const [expandedSection, setExpandedSection] = useState('overview');
  const [newWeight, setNewWeight] = useState('');
  const [loaded, setLoaded] = useState(false);

  const START_WEIGHT = 214.9;
  const START_DATE = '2026-09-10';
  const TARGET_DATE = '2027-01-04';
  const TARGET_WEIGHT = 188;

  useEffect(() => {
    try {
      const w = localStorage.getItem(WEIGHT_KEY);
      if (w) setWeights(JSON.parse(w));
    } catch (e) { /* no data yet */ }
    try {
      const m = localStorage.getItem(MOBILITY_KEY);
      if (m) setMobilityLog(JSON.parse(m));
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

  function logWeight() {
    const val = parseFloat(newWeight);
    if (!val || val <= 0 || val > 500) return;
    const updated = { ...weights, [getToday()]: val };
    saveWeights(updated);
    setNewWeight('');
  }

  function toggleMobility(area) {
    const today = getToday();
    const key = `${today}-${area}`;
    const updated = { ...mobilityLog, [key]: !mobilityLog[key] };
    saveMobility(updated);
  }

  const sortedWeights = Object.entries(weights).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  const latestWeight = sortedWeights.length ? sortedWeights[sortedWeights.length - 1][1] : START_WEIGHT;
  const totalLost = (START_WEIGHT - latestWeight).toFixed(1);
  const daysElapsed = Math.max(0, daysBetween(START_DATE, getToday()));
  const daysTotal = daysBetween(START_DATE, TARGET_DATE);
  const progressPct = Math.min(100, Math.max(0, (daysElapsed / daysTotal) * 100));
  const currentPhase = getCurrentPhase();
  const todayMobilityDone = MOBILITY_WORK.filter(m => mobilityLog[`${getToday()}-${m.area}`]).length;

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
        <p className="text-teal-100 text-sm">Sep 10, 2026 → Jan 4, 2027</p>

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

        <Section id="weight" icon={TrendingDown} title="Weight Log">
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
                  <span className="text-stone-500">{date}</span>
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

        <Section id="training" icon={Dumbbell} title="Weekly Training Structure">
          <div className="space-y-2 text-sm text-stone-700">
            <div className="flex gap-3"><span className="font-semibold w-28">3x/week</span><span>Strength: squat pattern, hinge pattern, single-leg work, upper body push/pull</span></div>
            <div className="flex gap-3"><span className="font-semibold w-28">2–3x/week</span><span>Mobility-specific work, 15–20 min (see Daily Mobility above)</span></div>
            <div className="flex gap-3"><span className="font-semibold w-28">2–3x/week</span><span>Cardio (keep current routine) — add 1x zone 2 session per week</span></div>
          </div>
        </Section>

        <Section id="meals" icon={Utensils} title="Weekly Meal Plan (Repeats Daily)">
          <p className="text-xs text-stone-500 mb-3">Same plan every day — weigh/measure portions and track actual calories. Anti-inflammatory focus, no pork, minimal weekday cooking (batch prep on Sunday).</p>

          <div className="mb-3 pb-3 border-b border-stone-100">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-semibold text-sm text-stone-800 capitalize">breakfast: {MEAL_PLAN.breakfast.name}</span>
              <span className="text-xs text-stone-400">{MEAL_PLAN.breakfast.cals} cal · {MEAL_PLAN.breakfast.protein}g protein</span>
            </div>
            <ul className="text-xs text-stone-600 space-y-0.5">
              {MEAL_PLAN.breakfast.items.map((it, i) => <li key={i}>• {it}</li>)}
            </ul>
          </div>

          <div className="mb-3 pb-3 border-b border-stone-100">
            <span className="font-semibold text-sm text-stone-800">lunch — rotate between two options</span>
            {LUNCH_OPTIONS.map((meal, idx) => (
              <div key={idx} className="mt-2 bg-stone-50 rounded-lg p-2.5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-xs text-stone-800">{meal.name}</span>
                  <span className="text-xs text-stone-400">{meal.cals} cal · {meal.protein}g protein</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-0.5">
                  {meal.items.map((it, i) => <li key={i}>• {it}</li>)}
                </ul>
                {meal.note && <p className="text-xs text-amber-700 mt-1">{meal.note}</p>}
              </div>
            ))}
          </div>

          {['snack', 'dinner'].map((key) => {
            const meal = MEAL_PLAN[key];
            return (
              <div key={key} className="mb-3 pb-3 border-b border-stone-100 last:border-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-sm text-stone-800 capitalize">{key}: {meal.name}</span>
                  <span className="text-xs text-stone-400">{meal.cals} cal · {meal.protein}g protein</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-0.5">
                  {meal.items.map((it, i) => <li key={i}>• {it}</li>)}
                </ul>
              </div>
            );
          })}

          <div className="bg-teal-50 rounded-lg p-3 mt-2 flex justify-between text-sm font-semibold text-teal-900">
            <span>Daily Total (using bowl lunch)</span>
            <span>{MEAL_PLAN.totals.cals} cal · {MEAL_PLAN.totals.protein}g protein</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Adjust portions up/down based on your tracked deficit target — this gives you the structure, you dial the amounts.</p>
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
