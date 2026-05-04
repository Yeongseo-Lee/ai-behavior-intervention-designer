import { useState } from 'react'
import './App.css'

const BARRIERS = [
  { value: 'lack_of_time', label: 'Lack of time' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'pain', label: 'Pain' },
  { value: 'weather', label: 'Weather' },
  { value: 'low_motivation', label: 'Low motivation' },
  { value: 'none', label: 'None' },
  { value: 'other', label: 'Other' },
]

const TIMES = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
]

const PURPOSES = [
  { value: 'health', label: 'Health' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'commute', label: 'Commute' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'other', label: 'Other' },
]

const CONFIDENCE = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const SUPPORT_STYLES = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'practical', label: 'Practical' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'structured', label: 'Structured' },
]

const initialForm = {
  walkingGoalMinutes: 20,
  barrier: 'lack_of_time',
  timeOfDay: 'morning',
  purpose: 'health',
  confidence: 'medium',
  fatigueLevel: 3,
  painLevel: 0,
  supportStyle: 'practical',
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

/** Rule-based plan: no external API — explicit if/else style rules. */
function buildInterventionPlan(input) {
  const goal = clamp(Number(input.walkingGoalMinutes) || 0, 5, 120)
  const barrier = input.barrier
  const timeOfDay = input.timeOfDay
  const purpose = input.purpose
  const confidence = input.confidence
  const fatigue = clamp(Number(input.fatigueLevel), 1, 5)
  const pain = clamp(Number(input.painLevel), 0, 5)
  const support = input.supportStyle

  // Fatigue and pain adjust effective session length (transparent rules)
  let sessionMinutes = goal
  if (fatigue >= 4) sessionMinutes = Math.max(5, Math.round(goal * 0.5))
  else if (fatigue === 3) sessionMinutes = Math.max(5, Math.round(goal * 0.75))
  if (pain >= 3) sessionMinutes = Math.min(sessionMinutes, Math.max(5, Math.round(goal * 0.4)))
  else if (pain === 2) sessionMinutes = Math.min(sessionMinutes, Math.max(5, Math.round(goal * 0.65)))

  const timeLabel =
    timeOfDay === 'morning'
      ? 'in the morning'
      : timeOfDay === 'afternoon'
        ? 'in the afternoon'
        : 'in the evening'

  const purposeBits = {
    health: 'framed as a small health habit',
    exercise: 'framed as movement that fits your exercise goal',
    commute: 'linked to a commute or travel segment when possible',
    transportation: 'used as useful transportation when it fits',
    leisure: 'kept pleasant and low-pressure, like a leisure walk',
    other: 'adapted to your personal reason for walking',
  }

  const supportTone = {
    gentle:
      'Use a kind, permissive tone: small is enough, and you can adjust anytime.',
    practical:
      'Focus on concrete steps, times, and places — what to do first, then next.',
    motivational:
      'Highlight quick wins and what is already working; celebrate showing up.',
    structured:
      'Use clear steps and a simple sequence so the plan feels organized.',
  }[support]

  // --- Barrier → core strategy (explicit mapping)
  let strategy = ''
  let micro = ''
  let ifThen = ''
  let safety = ''
  let reflection = ''
  const whyParts = []

  switch (barrier) {
    case 'lack_of_time':
      strategy =
        'Reduce friction and attach walking to an existing routine (habit stacking): very short walks that piggyback on something you already do.'
      micro =
        'Pick one anchor (e.g., after coffee, after lunch, after parking). Walk just 3–5 minutes at that anchor once today.'
      ifThen = `If I only have a few minutes, then I will walk ${Math.min(5, sessionMinutes)} minutes ${timeLabel} right after my chosen anchor, instead of skipping entirely.`
      safety =
        'Choose well-lit, familiar routes if possible; wear supportive footwear; stop if you feel unsteady.'
      reflection =
        'What routine could hold a 3-minute walk with almost no extra planning?'
      whyParts.push('Your main barrier was lack of time, so the plan shrinks the walk and ties it to a fixed cue.')
      break
    case 'fatigue':
      strategy =
        'Lower intensity and flexible timing: match walk length to energy, allow swaps and shorter sessions without guilt.'
      micro = `Plan one ${sessionMinutes}-minute walk ${timeLabel}, but give yourself permission to cut it in half if energy is low — consistency matters more than duration.`
      ifThen = `If my energy is low, then I will still do ${Math.max(5, Math.min(10, sessionMinutes))} minutes at an easy pace ${timeLabel}, or move the walk to a lighter part of the day.`
      safety =
        'Ease in; rest if dizzy or unusually drained; consider discussing persistent fatigue with a clinician if it is new or severe.'
      reflection =
        'On a 1–5 scale, how did today’s energy match what you expected — and what would “good enough” look like?'
      whyParts.push('Fatigue is your main barrier, so intensity and length flex with how you feel.')
      break
    case 'pain':
      strategy =
        'Safety-first, gentle movement: stay within a comfortable range and prioritize stopping or changing course if pain increases.'
      micro = `Try ${Math.min(sessionMinutes, Math.max(5, Math.round(goal * 0.5)))} minutes of easy walking ${timeLabel}; choose flat ground and slow pace first.`
      ifThen =
        'If pain increases during the walk, then I will stop, rest, and switch to a shorter or indoor alternative tomorrow — not “push through.”'
      safety =
        'This prototype is not medical advice. New, severe, or worsening pain should be evaluated by a qualified professional; do not ignore sharp or escalating symptoms.'
      reflection =
        'Where was your pain on a 0–5 scale before and after — and what distance or surface felt safest?'
      whyParts.push('Pain is your main barrier, so the plan emphasizes gentle movement and clear stop rules.')
      break
    case 'weather':
      strategy =
        'Weather-flexible plan: have an indoor route or backup activity when outdoor conditions are poor.'
      micro = `Schedule ${sessionMinutes} minutes ${timeLabel}; if the forecast is bad, use your indoor backup (hall laps, stairs at an easy pace, or a mall/indoor track).`
      ifThen =
        'If outdoor weather is unsafe or unpleasant, then I will do my indoor backup for the same amount of time instead of canceling.'
      safety =
        'Avoid ice, extreme heat, or poor visibility; hydrate in heat; dress in layers in cold.'
      reflection =
        'What indoor backup feels realistic on your worst-weather days?'
      whyParts.push('Weather is your main barrier, so the plan includes an explicit indoor alternative.')
      break
    case 'low_motivation':
      strategy =
        'Immediate reward and small success: make the first step tiny and pair it with something you enjoy right after.'
      micro = `Commit to only ${Math.max(5, Math.min(10, sessionMinutes))} minutes ${timeLabel}, then do something you like immediately after (music, tea, a short call).`
      ifThen =
        'If I do not feel like walking, then I will put on shoes and step outside for just 2 minutes — I can stop after that if I still want to.'
      safety =
        'Stay aware of traffic and surroundings; keep phone accessible if walking alone in unfamiliar areas.'
      reflection =
        'What tiny reward would genuinely feel good after a short walk — not “should,” but actually pleasant?'
      whyParts.push('Low motivation is your main barrier, so the plan uses very small commitments and immediate reinforcement.')
      break
    case 'none':
      strategy =
        'Maintenance and progress tracking: keep a steady dose you can repeat and notice trends over time.'
      micro = `Walk ${sessionMinutes} minutes ${timeLabel} at a comfortable pace; note one word after (“easier,” “same,” “harder”).`
      ifThen =
        'If I miss a day, then I will return to a shorter walk the next available day rather than doubling up to “make up” for it.'
      safety =
        'Warm up gradually; use footwear suited to your route; scale back if you feel off.'
      reflection =
        'What would “steady progress” mean for you this week — minutes, days per week, or how you feel after?'
      whyParts.push('You reported no single main barrier, so the plan focuses on steady habits and light tracking.')
      break
    default:
      strategy =
        'Flexible tailoring: adjust length, route, and timing based on what fits your week — start simple and refine.'
      micro = `Try ${sessionMinutes} minutes ${timeLabel}; adjust up or down by 5 minutes based on how today feels.`
      ifThen =
        'If my situation changes mid-week, then I will pick one alternative time slot I used successfully before.'
      safety =
        'Choose routes you feel safe on; bring visibility gear if dark; listen to your body.'
      reflection =
        'What one thing would make walking fit your life better — time, place, or company?'
      whyParts.push('Your barrier was “other,” so the plan stays flexible and invites your own constraints.')
  }

  // Purpose overlay (adds to "why")
  whyParts.push(`Your walking purpose is ${purpose.replace('_', ' ')} (${purposeBits[purpose] || purposeBits.other}).`)

  // Time of day
  whyParts.push(`You prefer walking ${timeLabel}, so steps are anchored there.`)

  // Confidence → coaching intensity (transparent)
  if (confidence === 'low') {
    micro += ' Keep expectations modest for the first week — build proof you can show up.'
    whyParts.push('Confidence is low, so the plan keeps steps smaller and emphasizes early wins.')
  } else if (confidence === 'high') {
    micro += ' You can optionally add 5 minutes or a slightly brisk segment if it still feels comfortable.'
    whyParts.push('Confidence is high, so you have room to stretch slightly if you choose.')
  } else {
    whyParts.push('Confidence is medium, so the plan balances structure with flexibility.')
  }

  // Fatigue / pain numeric overlays (when not already pain-primary)
  if (fatigue >= 4 && barrier !== 'fatigue') {
    micro += ` Because fatigue is rated ${fatigue}/5, prefer easy pace and shorter bouts if needed.`
    whyParts.push(`Fatigue is ${fatigue}/5, so pacing stays conservative.`)
  }
  if (pain >= 2 && barrier !== 'pain') {
    safety +=
      ' With pain present, stop if symptoms worsen and consider professional guidance for new or concerning pain.'
    whyParts.push(`Pain level ${pain}/5 means safety checks stay prominent even though pain was not the top barrier.`)
  }

  // Support style — woven into micro + reflection
  micro = `${micro} (${supportTone})`
  reflection = `${reflection} Style preference: ${support} — ${supportTone}`

  const why =
    whyParts.join(' ') +
    ` Target reference: about ${goal} minutes as your stated goal; adjusted session suggestion ~${sessionMinutes} minutes based on fatigue (${fatigue}/5) and pain (${pain}/5) rules.`

  return {
    suggestedStrategy: strategy,
    microIntervention: micro,
    ifThenPlan: ifThen,
    safetyNote: safety,
    reflectionPrompt: reflection,
    whyFits: why,
  }
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [plan, setPlan] = useState(null)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setPlan(buildInterventionPlan(form))
  }

  return (
    <div className="abi">
      <header className="abi-header">
        <p className="abi-badge">Research prototype</p>
        <h1 className="abi-title">AI-Assisted Behavior Intervention Designer</h1>
        <p className="abi-lead">
          Answer a few questions. This tool uses clear, rule-based logic (no
          external AI) to suggest a walking plan tailored to your inputs.
        </p>
      </header>

      <main className="abi-main">
        <section className="abi-card abi-form-card" aria-labelledby="form-heading">
          <h2 id="form-heading" className="abi-h2">
            Your context
          </h2>
          <form className="abi-form" onSubmit={handleSubmit}>
            <div className="abi-field">
              <label htmlFor="walkingGoal">Walking goal (minutes)</label>
              <input
                id="walkingGoal"
                type="number"
                min={5}
                max={120}
                step={5}
                value={form.walkingGoalMinutes}
                onChange={(e) =>
                  handleChange('walkingGoalMinutes', e.target.value)
                }
              />
            </div>

            <div className="abi-field">
              <span className="abi-label">Main barrier</span>
              <div className="abi-options" role="group" aria-label="Main barrier">
                {BARRIERS.map((b) => (
                  <label key={b.value} className="abi-radio">
                    <input
                      type="radio"
                      name="barrier"
                      value={b.value}
                      checked={form.barrier === b.value}
                      onChange={() => handleChange('barrier', b.value)}
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="abi-field">
              <span className="abi-label">Time of day</span>
              <div className="abi-options" role="group" aria-label="Time of day">
                {TIMES.map((t) => (
                  <label key={t.value} className="abi-radio">
                    <input
                      type="radio"
                      name="timeOfDay"
                      value={t.value}
                      checked={form.timeOfDay === t.value}
                      onChange={() => handleChange('timeOfDay', t.value)}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="abi-field">
              <span className="abi-label">Walking purpose</span>
              <div className="abi-options" role="group" aria-label="Walking purpose">
                {PURPOSES.map((p) => (
                  <label key={p.value} className="abi-radio">
                    <input
                      type="radio"
                      name="purpose"
                      value={p.value}
                      checked={form.purpose === p.value}
                      onChange={() => handleChange('purpose', p.value)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="abi-field">
              <span className="abi-label">Confidence level</span>
              <div className="abi-options" role="group" aria-label="Confidence level">
                {CONFIDENCE.map((c) => (
                  <label key={c.value} className="abi-radio">
                    <input
                      type="radio"
                      name="confidence"
                      value={c.value}
                      checked={form.confidence === c.value}
                      onChange={() => handleChange('confidence', c.value)}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="abi-field abi-field-row">
              <div>
                <label htmlFor="fatigue">Fatigue level (1–5)</label>
                <input
                  id="fatigue"
                  type="number"
                  min={1}
                  max={5}
                  value={form.fatigueLevel}
                  onChange={(e) =>
                    handleChange('fatigueLevel', Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label htmlFor="pain">Pain level (0–5)</label>
                <input
                  id="pain"
                  type="number"
                  min={0}
                  max={5}
                  value={form.painLevel}
                  onChange={(e) =>
                    handleChange('painLevel', Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="abi-field">
              <span className="abi-label">Preferred support style</span>
              <div
                className="abi-options"
                role="group"
                aria-label="Preferred support style"
              >
                {SUPPORT_STYLES.map((s) => (
                  <label key={s.value} className="abi-radio">
                    <input
                      type="radio"
                      name="supportStyle"
                      value={s.value}
                      checked={form.supportStyle === s.value}
                      onChange={() => handleChange('supportStyle', s.value)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="abi-submit">
              Generate Intervention Plan
            </button>
          </form>
        </section>

        <section
          className="abi-card abi-output-card"
          aria-labelledby="output-heading"
        >
          <h2 id="output-heading" className="abi-h2">
            Your plan
          </h2>
          {!plan ? (
            <p className="abi-placeholder">
              Fill out the form and click &quot;Generate Intervention Plan&quot;
              to see your personalized recommendation.
            </p>
          ) : (
            <div className="abi-plan">
              <article className="abi-block">
                <h3 className="abi-h3">Suggested strategy</h3>
                <p>{plan.suggestedStrategy}</p>
              </article>
              <article className="abi-block">
                <h3 className="abi-h3">Micro-intervention</h3>
                <p>{plan.microIntervention}</p>
              </article>
              <article className="abi-block">
                <h3 className="abi-h3">If–then plan</h3>
                <p>{plan.ifThenPlan}</p>
              </article>
              <article className="abi-block abi-block-safety">
                <h3 className="abi-h3">Safety-aware note</h3>
                <p>{plan.safetyNote}</p>
              </article>
              <article className="abi-block">
                <h3 className="abi-h3">Reflection prompt</h3>
                <p>{plan.reflectionPrompt}</p>
              </article>
              <article className="abi-block abi-block-why">
                <h3 className="abi-h3">Why this fits your context</h3>
                <p>{plan.whyFits}</p>
              </article>
            </div>
          )}

          <p className="abi-disclaimer" role="note">
            This prototype provides behavior change support suggestions and is not
            medical advice.
          </p>
        </section>
      </main>

      <footer className="abi-footer">
        <span>Transparent rule-based logic · No external AI API</span>
      </footer>
    </div>
  )
}

export default App
