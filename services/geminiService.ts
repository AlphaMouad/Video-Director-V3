import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { ReferenceAnalysis, ScriptSegmentation, ScriptScene, EngineeredScene } from '../types';

// ============================================================
// MODEL REGISTRY
// ============================================================
const MODEL_TEXT_ELITE = 'gemini-3.1-pro-preview';    // Gemini 3.1 Pro

// ============================================================
// API Key management
// ============================================================
let userApiKey: string | null = null;
export const setApiKey = (key: string) => { userApiKey = key; };

const getAI = () => {
  if (!userApiKey) throw new Error('API Key not set. Please provide your Google Gemini API Key.');
  return new GoogleGenAI({ apiKey: userApiKey });
};

const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });

// ============================================================
// FUNCTION 1 — Analyze Reference Video
// ============================================================
export const analyzeReferenceVideo = async (videoFile: File): Promise<ReferenceAnalysis> => {
  const base64Data = await fileToBase64(videoFile);

  const prompt = `
You are a world-class Hollywood Director, Performance Analyst, Behavioral Scientist, and YouTube Presenter Intelligence Engine.

This video will be used to extract the complete performance DNA of this presenter — the invisible architecture that makes them compelling, authoritative, and worth watching on YouTube for High-Converting Video Sales Letters (VSLs) and pitching deals to wealthy investors. The output will power AI-generated video presentations targeting ultra-high-net-worth investors and family office principals, demanding World Class Acting, Speech Delivery, Pacing, and Acting Performance.

Your analysis must go beyond what they DO. Understand WHY it works, and specifically WHY it works for a sophisticated, time-scarce, skepticism-high audience.

PHYSICAL IDENTITY — as precise as a portrait painter:
- Skin: texture, luminosity, how camera light interacts with it (matte/satin/luminous finish)
- Bone structure: jaw line, brow prominence, cheekbone geometry, orbital depth — the architecture of authority
- Hair: exact color, texture, weight, how it moves, how it catches or absorbs light
- Wardrobe: fabric character, weight, fit, how it drapes — what does it signal to a billionaire watching? (Restraint? Taste? Precision?)
- Distinguishing features: asymmetries, marks, characteristics that make this face recognizable and real

VOICE DNA — as a world-class vocal coach would analyze:
- Describe the voice as a material: (e.g. "aged bourbon — warm, with edges that catch the light", "brushed titanium — precise, with unexpected warmth at the bottom")
- Where does the voice live — chest resonance, throat, or head placement?
- How does pace shift between: explaining a concept vs. telling a story vs. delivering a number vs. speaking directly to the viewer?
- Sentence endings — does the voice fall (authority) or rise (uncertainty)? Where does it fall hardest?
- Silence — is it confident or nervous? Do they own the silence or apologize for it?
- What makes this voice immediately credible to a sophisticated investor who has heard a thousand pitches?
- The one vocal quality that makes listeners lean in — what is it?

PRESENTATION SKILLS & ON-CAMERA AUTHORITY — the YouTube-specific analysis:
- What is their natural resting expression through the lens? What does it signal to a viewer in the first 0.3 seconds?
- How do they create intimacy through the camera — do they speak TO it or AT it?
- Eye contact technique: do they hold it like a conversation or use it to punctuate? Blink rate and pattern?
- The "intellectual engagement" signal — what does their face do when they're about to reveal something important?
- Gesture vocabulary: what are the 3-5 gestures they use naturally? When does each appear?
  - Authority gestures (palm-down, steeple, precision pinch)
  - Openness gestures (open palm, spread hands)
  - Building gestures (hands constructing something in the air)
  - Emphasis gestures (index point, single finger up)
- How do they use the lean-in? What triggers it?
- High-status stillness: do they use stillness as a tool, or do they fill space with motion?
- What is the ONE thing this person does on camera that makes a UHNWI viewer think: "This person is worth my time"?

DELIVERY PATTERNS FOR THOUGHT LEADERSHIP:
- How do they open? What happens in the first 0.5 seconds of their presence?
- How do they build to a key insight — fast acceleration or slow deliberate construction?
- How do they deliver data and numbers — with what register, pace, and physical attitude?
- When they tell a story: how does the body shift? How does the voice change?
- Their signature "intellectual generosity" moment — where they give the viewer something genuinely valuable
- How do they land a perspective shift — the moment they change how the viewer sees something?
- What happens physically and vocally when they know they've made contact — that the insight landed?

VISUAL STYLE — the world they inhabit on camera:
- Lighting character: hard/soft, warm/cool, ratio, where it sculpts vs. where it shadows
- Camera language: preferred framings, movement style, lens character, angle tendency
- Background and environment: what does it say? What does it not say?
- Overall visual authority: premium studio / natural environment / intentional minimalism?

FRAME LIBRARY — identify 25-35 peak moments across these categories for a UHNWI YouTube presentation:
- INTELLECTUAL AUTHORITY: the look of someone who built their position through genuine expertise
- WARM PEER-TO-PEER: speaking as an equal to an equal — zero hierarchy either direction
- INSIGHT DELIVERY: face and body at the moment of revealing something important
- GENUINE AMUSEMENT: when something is genuinely clever or counter-intuitive — the real reaction
- TRANSITIONAL THINKING: the face between thoughts — natural, human, not performed
- PEAK CONVICTION: absolute belief in what they're saying, radiating from composure not volume
- ACTIVE LISTENING POSTURE: the positions they hold while a concept builds — present, still, receptive

Return a complete JSON object matching exactly this structure:
{
  "video_title": "string",
  "video_summary": "string",
  "total_duration": "string",
  "character": {
    "appearance": "string — detailed portrait-level description",
    "wardrobe": "string — material and visual character",
    "age_range": "string",
    "gender": "string",
    "build": "string",
    "hair": "string",
    "skin_tone": "string",
    "distinguishing_features": ["string"],
    "voice": {
      "texture": "string — evocative description",
      "pitch": "string",
      "pace_range": "string",
      "energy_baseline": "string",
      "accent": "string",
      "qualities": ["string"]
    },
    "acting_style": {
      "persona_summary": "string",
      "default_expression": "string",
      "mannerisms": ["string"],
      "signature_gestures": ["string"],
      "eye_behavior": "string",
      "body_language_patterns": ["string"],
      "emotional_range": "string",
      "transition_style": "string"
    },
    "delivery_patterns": {
      "hook_technique": "string",
      "value_delivery_technique": "string",
      "cta_technique": "string",
      "pause_patterns": ["string"],
      "emphasis_method": "string",
      "pacing_strategy": "string"
    }
  },
  "visual_style": {
    "primary_location": "string",
    "lighting": {
      "key_light": "string",
      "fill_light": "string",
      "color_temperature": "string",
      "shadows": "string",
      "mood": "string"
    },
    "color_palette": "string",
    "background": "string",
    "props": ["string"],
    "atmosphere": "string",
    "camera_language": {
      "preferred_framings": ["string"],
      "movement_style": "string",
      "lens_characteristics": "string",
      "angle_tendency": "string"
    },
    "visual_style_summary": "string"
  },
  "frame_library": [
    {
      "timestamp": "MM:SS.S",
      "description": "string",
      "expression": "string",
      "energy_level": 7,
      "body_position": "string",
      "suitability_tags": ["Hook"]
    }
  ],
  "performance_summary": "string — the essence of what makes this performer uniquely persuasive"
}
`;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT_ELITE,
    contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType: videoFile.type, data: base64Data } }] }],
    config: { responseMimeType: 'application/json', thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
  });

  const json = JSON.parse(response.text || '{}');
  return json.referenceAnalysis?.character ? json.referenceAnalysis : json;
};

// ============================================================
// FUNCTION 2 — Segment Script
// ============================================================
export const segmentScript = async (
  newScript: string,
  referenceAnalysis: ReferenceAnalysis
): Promise<ScriptSegmentation> => {

  // Timing math: at deliberate UHNWI pace (110 WPM) + natural pauses, 8s = ~13 spoken words.
  // At brisk-but-clear pace (130 WPM), 8s = ~17 words. Safe maximum: 15 words including pauses.
  const MAX_WORDS = 15;
  const MAX_SECONDS = 8.0;

  const prompt = `
You are a world-class Hollywood Director, YouTube director, performance architect, and script editor.
You are building an elite thought-leadership video, Video Sales Letter (VSL), and deal pitch for UHNWI investors — family office principals, private equity professionals, and sophisticated capital allocators.

YOUR TWO JOBS:
1. Generate a MASTER DIRECTING VISION for the full video (voice lock, energy arc, character through-line). You must optimise every scene to absolute perfection having in mind the Full Video we're directing.
2. Segment the script into precisely-timed VEO 3.1 scenes with elite acting blueprints, demanding World Class Acting, Speech Delivery, and Pacing.

═══════════════════════════════════════════════════
PART 1 — MASTER DIRECTING VISION (generated once, governs all scenes)
═══════════════════════════════════════════════════

Before touching the scene list, think as a master director about the full video:

VOICE FINGERPRINT: Derive a single locked voice description from the Presenter DNA — the exact vocal character (texture, placement, authority register) that must remain 100% consistent in every single scene. This is the voice that never changes. Describe it in one vivid sentence. e.g. "Aged bourbon poured slowly — warm chest resonance, unhurried authority, every sentence landing with the weight of evidence behind it."

ENERGY ARC MAP: Design the energy architecture of the full video. Where does energy peak? Where does it valley for intimacy or weight? Where are the re-engagement moments? Write this as a scene-by-scene map. e.g. "Scene 1: 8/10 (arrival) → Scene 2-3: 6/10 (generous depth) → Scene 4: 5/10 (intimacy valley) → Scene 5: 8/10 (insight spike) → Scene 6: 5/10 (measured close)"

EMOTIONAL ARC MAP: Optimise The Emotional Arc to perfection. Design the emotional architecture of the full video to retain attention as much as possible and to be as persuasive as possible. Where does the viewer feel tension? Where do they feel relief? Where is the persuasive climax? Engineer Each Scene to perfection for this emotional journey.

CHARACTER THROUGH-LINE: The one persona constant that never changes across any scene — the trait that makes this presenter recognizable and consistent. e.g. "The calm authority of someone who has made the mistakes so their viewer doesn't have to."

VISUAL ANCHOR: Describe the locked visual world established in Scene 1. All subsequent scenes match this exactly — same background depth, same lighting signature, same color temperature, same framing language.

FULL VIDEO CAMERA CHOREOGRAPHY: Orchestrate the camera movements perfectly across the full video script. MINIMAL CAMERA MOVEMENTS ARE REQUIRED. Default to high-status stillness. Move the camera ONLY when absolutely necessary for profound psychological impact (e.g., an imperceptible push-in on a critical insight). The directing must be world-class, prioritizing HYPER-REALISM and absolute best scene quality.

PRESENTATION PERSONA: The specific UHNWI-appropriate archetype this presenter inhabits throughout. e.g. "The world-class private advisor who speaks to principals as peers — never performing, always genuine, treating every viewer's time as precious."

SILENCE RULE (ABSOLUTE, NON-NEGOTIABLE): Zero music. Zero audio effects. Zero ambient sound. Zero subtitles. Voice only, in complete acoustic silence. This applies to every single scene in this video without exception.

═══════════════════════════════════════════════════
PART 2 — SCENE SEGMENTATION (sub-8 second hard limit)
═══════════════════════════════════════════════════

THE UHNWI YOUTUBE VIEWER: Has seen every pitch. Detects inauthenticity in seconds. Stays for: peer-to-peer register, exclusive access to genuine thinking, intellectual generosity, and earned authority. Leaves immediately when: intelligence is underestimated, hype replaces evidence, or pacing wastes their time. Ensure the Directing is Optimised to Retain attention as much as possible and to be as persuasive as possible.

RETENTION ARC (structure the full video around this persuasive journey):
1. Hook (first 30s): The Hook Must be optimised based on what a hook should be (a CTA to watch the video). Establish credibility + plant an undeniable specific curiosity only staying resolves.
2. Immediate payoff: First value hit within 60 seconds — prove the promise to cement retention.
3. Deepening value: Viewer grows progressively richer and more persuaded per scene.
4. Re-engagement peaks: Pattern Interrupt or Perspective Shift every 60-90 seconds. Engineer these to re-hook attention absolutely.
5. Cumulative authority: Each scene earns more trust than the last, building an unstoppable persuasive case.
6. Generous close: Viewer leaves richer than they arrived, highly persuaded, and ready to act — satisfied, not sold.

═══════════════════════════════════════════════════
TIMING ENFORCEMENT — THIS IS ABSOLUTE:
═══════════════════════════════════════════════════

HARD RULE: Every scene MUST be deliverable in ≤${MAX_SECONDS} seconds.
TIMING MATH: At a deliberate UHNWI presentation pace with natural pauses:
  - 8 seconds of speech = maximum ${MAX_WORDS} spoken words
  - This includes pauses (each pause ≈ 0.4-0.6s, reducing word budget)
  - Formula: (8s - total_pause_seconds) × (words_per_second at 110-130 WPM) = word budget

SCRIPT ADJUSTMENT AUTHORITY: You MAY trim the script_text for timing compliance.
  ALLOWED: Remove connective filler ("and so", "you know", "basically", "essentially")
  ALLOWED: Tighten redundant qualifiers ("really very important" → "critical")
  ALLOWED: Compress setup while preserving the core thought
  NEVER CHANGE: The specific idea, the key insight, any named data point or number, the meaning
  NEVER CHANGE: The voice or register — trimmed text must sound identical to the original intent
  If trimmed: preserve original in original_script_text field
  Count words precisely and report in word_count field

AVAILABLE ROLES:
Core: Hook / Pattern Interrupt / Value Delivery / Social Proof / Bridge / Call to Action / Storytelling / Demonstration / Objection Handler / Open Loop / Closing
YouTube Thought Leadership: Insight Reveal / Framework / Case Study / Market Intelligence / Perspective Shift / Action Framework

ROLE TIMING PROFILES:
- Hook: 6-7s (sharp, immediate — no setup wasted)
- Pattern Interrupt: 4-6s (punchy, contrast is everything)
- Value Delivery / Insight Reveal: 6-8s (deliberate, ideas need room)
- Framework / Action Framework: 7-8s (each component needs its beat)
- Case Study / Storytelling: 7-8s (specific detail needs space)
- Market Intelligence: 6-7s (precision is the message)
- Perspective Shift: 6-8s (the turn needs time to land)
- Social Proof: 5-7s (understatement — facts only)
- Bridge: 5-6s (momentum — don't linger)
- Objection Handler: 6-7s (pause before answer is everything)
- Open Loop: 5-6s (incompletion is the point — don't overstay)
- Call to Action: 6-8s (slow, warm, no pressure)
- Closing: 6-8s (the slowest scene — final gravity)

═══════════════════════════════════════════════════
ACTING BLUEPRINT — per scene:
═══════════════════════════════════════════════════

SCENE ESSENCE: One evocative metaphor — the emotional north star. Not what happens, the feeling.
- Hook: "A door opens in a room where everyone thought the walls were solid."
- Insight Reveal: "A gem placed on a table, lit from within, needing no explanation."
- Framework: "An architect showing the blueprint of something that took a decade to perfect."
- Market Intelligence: "A Bloomberg analyst who just caught a signal nobody else has seen."
- Perspective Shift: "The moment an optical illusion flips — you can never unsee it."
- Case Study: "A surgeon who has done this procedure a hundred times, walking you through it."
- Closing: "The end of a great conversation where both parties received more than they gave."

EMOTIONAL CORE (UHNWI register — one phrase, not a list):
"Sovereign certainty" / "Intellectual generosity" / "Conspiratorial warmth" / "Earned authority" / "Calibrated conviction" / "Quiet revelation" / "Peer-level respect"

PHYSICAL SIGNATURE: ONE posture-state VEO holds and animates from. Not a gesture list.
"The stillness of a grandmaster who sees the board clearly" / "The forward lean of a mentor about to hand over a decade of learning" / "The open-handed ease of someone with nothing to prove and everything to give"

GESTURES (UHNWI-appropriate, max 2, natural to this presenter's DNA):
- Steeple: authority + deep thinking
- Open palm toward viewer: generosity + invitation
- Precision pinch: exactness + intellectual precision
- Hands building in air: framework construction
- Single index: emphasis on a specific, important word
- Slow, deliberate lean-in: intimacy + "this is the important part"

EXPRESSION: Written as the performer feels it from inside — not technical description.
"The eyes already hold the answer to a question the viewer hasn't asked yet."

PAUSE MAP: Silence is authority for a UHNWI audience. Map exactly where silence lives.

NARRATIVE POSITION: Where this scene sits in the energy arc and what its structural job is.
e.g. "Scene 3 of 9 — first value peak, lifting from 5→7 after authority establishment"

FRAME SELECTION: ONLY use timestamps that exist in the provided frame library.

═══════════════════════════════════════════════════
INPUTS:
═══════════════════════════════════════════════════
NEW SCRIPT:
"""${newScript}"""

PRESENTER DNA:
${JSON.stringify(referenceAnalysis?.character || {}, null, 2)}

FRAME LIBRARY:
${JSON.stringify(referenceAnalysis?.frame_library || [], null, 2)}

═══════════════════════════════════════════════════
RETURN COMPLETE VALID JSON — exactly this structure:
═══════════════════════════════════════════════════
{
  "total_scenes": number,
  "narrative_arc": "string — full intellectual + emotional journey as a UHNWI viewer experiences it",
  "directing_vision": {
    "voice_fingerprint": "string — locked voice description: one vivid sentence, governs every scene",
    "energy_arc_map": "string — scene-by-scene energy levels e.g. Scene 1: 8/10 → Scene 2: 6/10...",
    "character_through_line": "string — the one constant persona trait across every scene",
    "visual_anchor": "string — the locked visual world Scene 1 establishes; all scenes match",
    "silence_rule": "Zero music. Zero audio effects. Zero ambient sound. Zero subtitles. Voice only, in complete acoustic silence. No exceptions.",
    "presentation_persona": "string — the UHNWI presenter archetype inhabiting this video"
  },
  "scenes": [
    {
      "scene_number": number,
      "role": "string",
      "title": "string — evocative 3-4 word title",
      "duration_seconds": number,
      "word_count": number,
      "script_text": "string — final text (trimmed if needed for timing)",
      "original_script_text": "string — only if script_text was adjusted; else omit this field",
      "narrative_position": "string — e.g. Scene 2 of 8 — authority build, energy rising from 7→8",
      "split_logic": "string — why this cut + timing rationale",
      "emotional_tone": "string — precise feeling in a UHNWI viewer",
      "energy_level": number,
      "acting_blueprint": {
        "scene_essence": "string — one evocative metaphor, the north star",
        "emotional_core": "string — single dominant emotion, UHNWI register",
        "physical_signature": "string — ONE defining posture-state",
        "intention": "string — what the presenter wants the viewer to FEEL",
        "subtext": "string — what radiates beneath the words, never stated",
        "delivery_pace_wpm": number,
        "emphasis_words": ["string — 2-4 words of maximum weight"],
        "pause_map": ["string — where silence lives, with feeling and duration"],
        "energy_arc": "string — how energy moves within this scene",
        "mapped_mannerisms": ["string — natural to this presenter, max 2"],
        "mapped_gestures": ["string — UHNWI-appropriate, natural to DNA, precisely described, max 2"],
        "expression_direction": "string — how the performer feels it from inside",
        "body_direction": "string — motivated postural journey, thought-driven"
      },
      "recommended_inframe": { "timestamp": "MM:SS.S", "rationale": "string" },
      "recommended_outframe": { "timestamp": "MM:SS.S", "rationale": "string" },
      "camera_direction": {
        "framing": "string — MCU / tight MCU / CU matched to role psychology",
        "movement": "string — specific: locked-off / imperceptible push-in / slow drift",
        "angle": "string",
        "lens": "string",
        "depth_of_field": "string"
      },
      "continuity": {
        "enters_from": "string — exact energy + posture arriving from previous scene",
        "exits_to": "string — how this scene's final state sets up the next scene's opening"
      }
    }
  ]
}

QUALITY CHECK BEFORE RETURNING: For every scene, verify:
✓ word_count ≤ ${MAX_WORDS} (count precisely — every word in script_text)
✓ duration_seconds ≤ ${MAX_SECONDS}
✓ script_text preserves 100% of the original meaning
✓ narrative_position references the energy arc from directing_vision
✓ All timestamps exist in the provided frame library
`;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT_ELITE,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json', thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
  });

  return JSON.parse(response.text || '{}');
};

// ============================================================
// FUNCTION 3 — Extract Frame (Client-Side)
// ============================================================
export const extractFrameFromVideo = (videoFile: File, timestamp: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const video  = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d')!;

    video.preload     = 'auto';
    video.muted       = true;
    video.playsInline = true;

    const parts   = timestamp.split(':');
    let seconds   = 0;
    if (parts.length === 2)      seconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    else if (parts.length === 3) seconds = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    else                         seconds = parseFloat(timestamp);
    if (isNaN(seconds)) seconds = 0;

    const cleanup = () => { URL.revokeObjectURL(video.src); video.src = ''; };
    const timer   = setTimeout(() => { cleanup(); reject(new Error('Frame extraction timed out')); }, 15000);

    video.onloadedmetadata = () => {
      canvas.width      = video.videoWidth  || 1280;
      canvas.height     = video.videoHeight || 720;
      video.currentTime = Math.min(seconds, video.duration - 0.1);
    };

    video.onseeked = () => {
      clearTimeout(timer);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        cleanup();
        if (blob) resolve(blob);
        else reject(new Error('Frame extraction failed'));
      }, 'image/jpeg', 0.97);
    };

    video.onerror = () => { clearTimeout(timer); cleanup(); reject(new Error('Video failed to load')); };
    video.src = URL.createObjectURL(videoFile);
  });

// ============================================================
// FUNCTION 4 — Engineer Scene Prompt (God-Level VEO 3.1)
// ============================================================
export const engineerScenePrompt = async (
  scene:                 ScriptScene,
  referenceAnalysis:     ReferenceAnalysis,
  targetCharacterImages: File[],
  completedScenes:       EngineeredScene[]
): Promise<string> => {

  const charBase64s = await Promise.all(
    targetCharacterImages.slice(0, 5).map(img => fileToBase64(img))
  );

  const charCount      = charBase64s.length;
  const isAnchorScene  = completedScenes.length === 0;
  const charImageLabel = charCount === 1
    ? 'Image 1 is the TARGET CHARACTER — the person who must appear in this video.'
    : `Images 1 through ${charCount} are the TARGET CHARACTER — ${charCount} photos of the same person for maximum identity accuracy.`;

  // Voice fingerprint — derived from reference analysis DNA (locked for whole video)
  const voiceFingerprint = [
    referenceAnalysis.character?.voice?.texture,
    referenceAnalysis.character?.voice?.energy_baseline,
    referenceAnalysis.character?.voice?.qualities?.join(', '),
  ].filter(Boolean).join(' | ') || 'warm, grounded chest resonance — the private briefing voice of someone who has earned every word they speak';

  const personaSummary = referenceAnalysis.character?.acting_style?.persona_summary
    || 'peer-level authority — speaks as an equal to sophisticated principals, never performing, always genuine';

  // Continuity context
  const continuity = isAnchorScene
    ? `ANCHOR SCENE — Scene 1 of ${completedScenes.length + 1}+. Every visual constant you define here is LOCKED for the entire video: skin rendering quality, lighting signature and direction, background depth and tones, color temperature, framing language. Describe each with the precision that lets every subsequent scene match it frame-perfectly.`
    : `VISUAL AND EMOTIONAL CONTINUITY — match the established world with zero deviation. Optimise The Emotions Between The Scenes to perfection. Ensure consistent character sound: the human voice must sound exactly like the same person (timbre, resonance) but allow emotional variance to match the scene's persuasive needs perfectly.

LOCKED CONSTANTS from previous scenes (every physical detail is frozen):
${completedScenes.slice(-2).map(s => `Scene ${s.scene_number} — "${s.scene_title}":\n${s.veo_prompt.substring(0, 600)}...`).join('\n\n---\n\n')}

Scene transition: ${scene.continuity?.enters_from || 'continues from previous scene energy'} → this scene. Exits to: ${scene.continuity?.exits_to || 'next scene'}. Ensure the emotional transition between scenes engages the viewer completely and convinces them of the script's absolute truth.`;

  // ─────────────────────────────────────────────────────────────
  // Role Performance Map — YouTube Thought Leadership for UHNWI
  // Each role: energy (the physical/emotional state), directorNote
  // (whispered on-set instruction), pacing (how voice moves through it)
  // ─────────────────────────────────────────────────────────────
  const rolePerformanceMap: Record<string, { energy: string; directorNote: string; pacing: string }> = {

    // ── YOUTUBE HOOK ─────────────────────────────────────────────
    'Hook': {
      energy: `The frame is owned before a single word is spoken. Energy: 8/10 — coiled, forward, completely still. Not loud. Not urgent. Precise. This is the energy of someone who has done the calculation and knows exactly what the next five minutes are worth to this viewer. The eyes engage the lens first — a full beat of direct contact — then the lips part. In that half-second before speech: the composure of someone who has never needed to raise their voice in their life.`,
      directorNote: `You are not auditioning. This viewer clicked because they already believe you might have something worth their time. Your job in the first five seconds is to confirm that belief with one sentence that creates a specific curiosity only staying can resolve. Speak to them as an equal. No warmup. No "hey guys." You open mid-thought, as if this conversation has been happening and they just arrived at the best part.`,
      pacing: `Immediate — zero throat-clearing energy, zero ramp-up. The opening line is delivered at full conviction from the first syllable. The central hook statement: one beat per word, each word placed. The curiosity-creating element: fractionally faster, pulling them forward into the next scene.`,
    },

    // ── PATTERN INTERRUPT ─────────────────────────────────────────
    'Pattern Interrupt': {
      energy: `A conductor stops the orchestra mid-phrase. Energy: 7-9/10 on the interrupting line — sharp, surprising, then immediately settled. The shift feels like a wall the viewer didn't know was there suddenly opening. One moment of calculated unexpectedness, then complete composure — as if nothing unusual happened. The contrast is the entire technique.`,
      directorNote: `Something just changed, and you knew it was coming. Deliver the interrupt line with the quiet satisfaction of someone who has been waiting for precisely this moment. Not theatrical — almost casual. Then settle fully. The viewer's pattern-recognition just short-circuited, and your calm after is what makes them trust you more, not less. The unexpected + the composed = credibility.`,
      pacing: `The interrupt phrase: tempo accelerates sharply — faster than expected, landing hard. Then: immediate return to base pace. This abrupt shift IS the interrupt. The rest of the scene: grounded, deliberate, as if the interruption never happened.`,
    },

    // ── VALUE DELIVERY ────────────────────────────────────────────
    'Value Delivery': {
      energy: `Intellectual generosity at its most deliberate. Energy: 5-7/10 — unhurried, almost leisurely, because there is zero urgency when what you're sharing is genuinely valuable. This is peer-to-peer: not a teacher lecturing, but a brilliant colleague sharing their best thinking over a quiet lunch. Each point is placed like an object of value on a table — set down with care and space. The listener comes to the speaker. Always.`,
      directorNote: `You are not explaining — you are handing something over. Think of a colleague who spent five years developing what they're about to share in five seconds. That weight lives in the pace, not the volume. Slow down until it's uncomfortable, then slow down more. The UHNWI viewer reads velocity as a signal: if you rush it, they assume it isn't worth sitting with. Let every insight breathe before the next one arrives. Your generosity IS your brand.`,
      pacing: `Setup: easy and conversational — give them the context without effort. The value statement itself: significantly, visibly slower — one word at a time. On the key insight: a complete stop. Let it exist in silence before the next thought arrives. This is where most presenters rush. This one does not.`,
    },

    // ── INSIGHT REVEAL ────────────────────────────────────────────
    'Insight Reveal': {
      energy: `A gem placed on the table, lit from within, requiring no explanation. Energy: 6/10 — composed, slightly warmer than baseline, with a micro-charge of genuine intellectual pleasure. The surprise is entirely in the content; the delivery steps back and gives it space. A slight brow lift just before the reveal signals: "Pay attention — this is the one." Then: stillness while it lands. The eyes brighten with something authentic — not performed delight, but the genuine pleasure of someone sharing an idea they love.`,
      directorNote: `The insight carries itself. Your job is to get out of its way. Slow down just before the reveal — the fractional deceleration signals importance without announcing it. After the key line: hold. Do not speak. Let the viewer's mind do the work. The slight smile that follows should be the smile of someone who already knows what the viewer is about to realize — warm, quiet, genuine. This is the scene that makes people screenshot and share.`,
      pacing: `Conversational build → noticeably slower at the approach to the reveal → a near-complete stop at the peak insight → a beat of silence → measured return to pace. The silence after the insight is not empty — it is full of what was just said.`,
    },

    // ── FRAMEWORK ─────────────────────────────────────────────────
    'Framework': {
      energy: `An architect showing you the blueprint of something elegant. Energy: 6-7/10 — structured, clear, with the quiet pride of someone who built this system through years of refinement and is now being generous with it. The hands come alive here — they don't gesture randomly, they construct. Each element of the framework is built in the air before it's spoken. Between elements: deliberate stillness. The structure of the silence mirrors the structure of the framework.`,
      directorNote: `You built this. Every component was earned. Deliver the framework the way a master craftsman shows a finished piece — with the calm confidence of authorship, not the enthusiasm of a salesperson. Each element gets its own beat, its own space. The hands are not illustrating — they are constructing. The viewer should feel they are receiving intellectual property that took years to develop and is being given freely. That generosity is the whole point.`,
      pacing: `Deliberate and structured — each component of the framework receives equal weight and space. No rushing between elements. The overall rhythm: introduce element → let it land → next element. Clean, architectural, precise. The viewer should feel the elegance of the structure in the pacing itself.`,
    },

    // ── SOCIAL PROOF ──────────────────────────────────────────────
    'Social Proof': {
      energy: `Measured understatement. Energy: 5-6/10. Zero excitement — excitement implies surprise, and this person is never surprised by results they expected. They share evidence the way someone reads a quarterly statement they already know is strong: measured, calm, entirely at ease with extraordinary numbers. For a UHNWI audience: understatement is the proof. Anyone who needed to perform these results would not own them this quietly.`,
      directorNote: `Don't sell the evidence — report it. The less effort you put into impressing them with your numbers, the more impressive the numbers become. You've seen these results. You expected them. The delivery is the delivery of a Formula 1 engineer reading a lap time: clinical, satisfied, already thinking about the next refinement. Let the facts carry the weight. Your job is to stand completely out of their way.`,
      pacing: `Specific names, numbers, and outcomes: slower — each one given the space to register fully. The viewer should have time to mentally repeat what they just heard. Supporting context: natural conversation pace. The rhythm of social proof: setup (fast) → evidence (slow) → implication (natural). Never rush through the specific proof.`,
    },

    // ── BRIDGE ────────────────────────────────────────────────────
    'Bridge': {
      energy: `Warm forward momentum. Energy: 5-7/10, gently rising through the scene. The feeling: a trusted guide who has walked this path many times and knows exactly where the view opens up. Nothing abrupt. No hard edges. The crossing from one idea to the next — or from where the viewer is to where they could be — feels inevitable and already in motion. The hand is extended before the invitation is spoken.`,
      directorNote: `Your job is to make the crossing so natural that the viewer doesn't notice they've moved until they're already on the other side. Warm eyes. Open posture. The voice carries them — it doesn't push. Think of it as extending a hand and saying "come this way" — and the hand is already reaching before the words arrive. Momentum is the whole performance.`,
      pacing: `Smooth, continuous — no sharp attacks on individual words, no dramatic pauses. The breath carries through the full scene with a sense of forward motion. Slight acceleration toward the end, as if the destination is coming into view.`,
    },

    // ── CALL TO ACTION ────────────────────────────────────────────
    'Call to Action': {
      energy: `YouTube CTA energy is fundamentally different from a sale. Energy: 5/10 — calm, warm, genuinely relational. This is the invitation at the end of a great conversation: "We should do this again." No urgency. No pressure. For a UHNWI audience, any sense of being sold to immediately ends the relationship. This is the beginning of a connection, offered freely, with no agenda attached. The body is settled. The eyes are warm. The voice drops to its most conversational register.`,
      directorNote: `You are not closing a sale — you are extending an invitation. The tone is the tone of a brilliant colleague at the end of a genuinely valuable lunch saying "I'd love to continue this." Genuine, warm, without any edge of agenda. The viewer should feel: "Yes. I want more of this person's thinking in my life." Make the CTA feel like a natural continuation of the relationship just built — not a commercial break that interrupts it.`,
      pacing: `Slower than any previous scene. Every word placed with warmth and full weight. The specific action (subscribe/follow/join): a slight pause before and after — not for drama, but for clarity. Sentence endings fall completely. This should feel like the most relaxed and genuine moment of the entire video.`,
    },

    // ── STORYTELLING ──────────────────────────────────────────────
    'Storytelling': {
      energy: `Present-tense recall. Energy: 6-8/10, organic and breathing — it rises and falls with the narrative. The body remembers this story physically: small shifts as scenes change, micro-expressions arriving before the words do. This is not performed storytelling — it is lived recall. The voice breathes between images. The viewer should stop watching and start being inside the moment. For a UHNWI audience: specific, precise details signal authenticity. Vague storytelling signals fabrication.`,
      directorNote: `You were there. Your body knows the room. Your eyes have seen the person. Let the memory animate you before the words find it. The most important moment in any story for this audience is the specific detail — the number, the name, the exact phrase someone said. Slow down at every concrete detail. Speed up through transitions. The pauses are where the story lives. The viewer's imagination fills what you leave open.`,
      pacing: `Variable, organic, human — the most human pacing in the entire video. Fast through context-setting transitions. Slow — almost stopped — at the turning point. The key detail or moment: held. Let it be seen completely before moving on. The story breathes, and the viewer breathes with it.`,
    },

    // ── DEMONSTRATION ─────────────────────────────────────────────
    'Demonstration': {
      energy: `Alert, precise, warm. Energy: 7/10 — sharp edges, zero ambiguity, but never cold. This is the moment of proof: every word is a data point, every sentence a complete thought delivered without hedging or qualification. The voice becomes a precision instrument. But the performer remains a generous, brilliant colleague — not a professor, not a consultant billing by the hour. "Look at this. Isn't it elegant? Isn't it obvious what this means for you?" `,
      directorNote: `Clarity is the entire performance. Your only job: make the complex feel simple and the outcome feel inevitable. Direct eye contact. No hedging language — "sort of" and "kind of" do not exist in this scene. Everything IS. Everything DOES. Everything MEANS. The energy is the energy of someone who genuinely loves showing a beautiful mechanism working exactly as designed.`,
      pacing: `Precise and consistent — neither rushed nor slow. The demonstration point: held. A beat to be understood before moving to its implication. The implication: slightly faster — let it land almost as an afterthought. This rhythm (point → pause → implication → next) repeated creates the feeling of evidence building irreversibly.`,
    },

    // ── OBJECTION HANDLER ─────────────────────────────────────────
    'Objection Handler': {
      energy: `Disarmingly calm. Energy: 5/10 — slower than the viewer expects, because the person who has already solved this problem does not rush when asked about it. A micro-pause before the response (0.3-0.5s) signals: "I expected this question." Then the concern is dissolved with quiet, complete certainty. No defensiveness. No over-explanation. For a UHNWI audience: over-explanation signals doubt. One clear, final answer signals mastery.`,
      directorNote: `You've answered this concern before. Not once — a hundred times. You respect it — it's a legitimate thing to wonder. Then you dissolve it, not with argument or volume, but with the tone of someone sharing obvious facts. The pause before you respond is the entire technique: it communicates that you needed zero time to think because the answer was always ready. Calm. Complete. Final.`,
      pacing: `The restated concern (if any): natural pace. The pause before the answer: visible, intentional — do not shorten it. The answer itself: slightly slower than base pace. End on a falling close that signals without words: "This is settled. We can move on."`,
    },

    // ── OPEN LOOP ─────────────────────────────────────────────────
    'Open Loop': {
      energy: `Rising and deliberately unresolved. Energy: 6-8/10, building through the scene and pointedly incomplete at the final word. The voice carries forward momentum without landing — like a breath held before a name is spoken. The viewer should feel a pull: a question that cannot be unanswered. For a UHNWI YouTube audience: the open loop must be intellectually substantive — a curiosity about an idea, not a tease about a product.`,
      directorNote: `Create the intellectual itch. Plant a question so specific and interesting that the viewer carries it into the next scene whether they intend to or not. End mid-reach — a phrase that implies a completion the viewer must wait for. Do not signal resolution. Do not soften the incompletion. The discomfort of the unresolved is the entire function of this scene.`,
      pacing: `Builds steadily — starts at base pace, accelerates toward the unresolved close. The final phrase: simultaneously faster (urgency) and incomplete (withholding). The last word stays suspended — no falling close. That suspension is the open loop. The viewer cannot leave without knowing what comes next.`,
    },

    // ── CLOSING ───────────────────────────────────────────────────
    'Closing': {
      energy: `Final gravity. Energy: 5/10 — the slowest, most deliberate pace of the entire video. Not tiredness — completion. For a UHNWI YouTube audience: the close is a send-off, not a final pitch. The viewer leaves richer than they arrived. The feeling is the feeling at the end of a genuinely great conversation: both parties received more than they gave. The body is fully settled. The eyes are warm and direct. Every word carries the accumulated weight of everything said before it.`,
      directorNote: `Everything has already been given. This scene is the weight of it settling. No new energy — only the warm certainty of someone who walked this path completely and arrived at exactly where they intended. The last line of the video carries the full argument in it — deliver it like you know exactly what it will do in the viewer's mind when they hear it. Then: stillness. Let the silence after the final word be as deliberate as any word that preceded it.`,
      pacing: `The slowest scene in the entire video. Every phrase: a complete thought, fully breathed, completely settled before the next begins. The final sentence: one word at a time. The last word: maximum duration. After it: silence. The most important silence in the video.`,
    },

    // ── CASE STUDY ────────────────────────────────────────────────
    'Case Study': {
      energy: `Present-tense evidence. Energy: 6-8/10, building with the case. Not storytelling performance — the specific recall of someone who was there and is taking you there with them. The eyes are seeing it again as they speak. The voice has the slight forward lean of someone re-living a sequence they remember with precision. For a UHNWI audience: specificity IS credibility. Names, numbers, and exact details signal authenticity; vagueness signals fabrication.`,
      directorNote: `You were in that room. The board meeting, the deal, the turning point — your body knows the geography. Give the viewer the specific detail first, then the context. The turning point of any case study is where you slow down most — let the weight of that moment be felt before the outcome arrives. The numbers come second; the human truth of the decision comes first. UHNWI viewers have made these decisions themselves — they recognize the texture of a real one.`,
      pacing: `Context-setting: natural pace, efficient. The turning point: significantly slower — this is the center of the case study and it must land completely. The outcome: slightly faster — let it arrive with the inevitability of consequence. The implication for the viewer: deliberate, direct, final.`,
    },

    // ── MARKET INTELLIGENCE ───────────────────────────────────────
    'Market Intelligence': {
      energy: `Alert, authoritative, precisely calibrated. Energy: 7/10. This information is not widely known — and that fact is present in the delivery without being announced. The register is Bloomberg-meets-private-briefing: clinical, specific, with the focused energy of an analyst who has just seen a number that changes the picture. Not excitement — recognition. The precision of the delivery IS the proof of the depth of access.`,
      directorNote: `You have seen data your audience hasn't. Not because you're better — because you look at different sources and ask different questions. Deliver this intelligence the way you'd deliver it to a principal at a private briefing: precise, efficient, with zero inflation. The authority comes entirely from specificity. Vague intelligence signals shallow access; exact figures, specific names, and precise dates signal depth. Be exact. Be final. Let the data land without commentary.`,
      pacing: `Market context (setup): conversational, efficient. The intelligence itself — the data point, trend, or finding: markedly slower, each element given room to register. The implication: pause → then slightly faster, letting the consequence unfold before settling. No rushing through the specific evidence — that is exactly where most presenters fail.`,
    },

    // ── PERSPECTIVE SHIFT ─────────────────────────────────────────
    'Perspective Shift': {
      energy: `Warm, decided, slightly conspiratorial. Energy: 6-7/10. The feeling of a trusted colleague who pulls you aside at the end of a conference and says: "Here's what I actually think." Not combative — genuinely warm. Not contrarian for performance — sincerely, quietly committed to a more accurate picture. The slight head tilt just before the shift signals: "What comes next is what I actually believe."`,
      directorNote: `You've thought about this differently from the consensus for a long time. The intellectual journey — from conventional view to your current position — is in the tone, not the words. Not smug. Not aggressive. Generously certain. The conventional view (if stated) gets brief, almost dismissive treatment. The pivot word or phrase ("but what I've actually come to understand is...") gets a full beat of deliberate slowdown. Then the real view: steady, warm, completely committed.`,
      pacing: `The conventional view (if mentioned): faster, lighter — it doesn't deserve much space. The pivot: noticeably slower, deliberate — this is the hinge of the scene. The new perspective: steady, measured, fully committed to every word. End on a downward close that says: "This is where I stand. You can think about it."`,
    },

    // ── ACTION FRAMEWORK ──────────────────────────────────────────
    'Action Framework': {
      energy: `Generous and clear. Energy: 6/10. The feeling: a world-class advisor giving you the exact steps they give their most important client — not simplified, not dumbed down, but precise and practical. The warmth comes from the speaker genuinely wanting the viewer to succeed with this. This is the gift at the end of all the value that preceded it. The tone is the tone of someone who knows that the real test of understanding is whether you can make it actionable.`,
      directorNote: `This is what everything before was building toward. Deliver each step or element with the weight of something that took years to develop and is now being given freely. The viewer should feel not inspired by a speech — but equipped with a blueprint. "I can actually do this." Each element gets its own complete space. Between elements: stillness. After the final element: a beat of silence — let them review the whole framework mentally before you close.`,
      pacing: `Each step or component: its own complete thought, given full space before the next arrives. No rushing between elements. The final step: slightly slower, with a full pause after — the invitation to absorb the whole before moving on. This pacing is itself the message: I want you to have this completely.`,
    },
  };

  const roleData = rolePerformanceMap[scene.role] || {
    energy: `Present, deliberate, and genuinely engaged. Energy: ${scene.energy_level}/10. Peer-to-peer register — speaking as an equal to an equal. Every movement earned. Every silence a decision. The camera is a trusted colleague. The viewer is someone this presenter genuinely wants to reach.`,
    directorNote: `Speak the truth at its natural pace. The honesty of someone who has nothing to prove and everything to give. The UHNWI viewer will feel the difference between performed authority and the real thing. Be the real thing.`,
    pacing: `Conversational authority — natural rhythm with deliberate handling of emphasis words and pause points. Never rushed. Never performed.`,
  };

  const energyDirection = roleData.energy + "\n\nOSCAR-LEVEL ACTING PERFORMANCE REQUIRED: Optimise each scene to profound cinematic perfection having in Mind The Full Video we're directing. The Acting Performance must be World class! Inject hyper-detailed, warm, engaging micro-expressions. The character must NOT look angry or tense. Bring EASE to the viewer with relaxed authority and effortless charisma. Optimise The Emotional Arc to perfection, and Ensure the Directing is Optimised to Retain attention as much as possible and to be as persuasive as possible. Engineer Each Scene to magnetic perfection please. The Realism must be impeccable. You must stick strictly to the target frames provided.";
  const directorNote    = roleData.directorNote + "\n\nWORLD-CLASS SCENE DIRECTING: Optimise this scene to absolute cinematic perfection. The Facial Expressions must convey profound depth (e.g., a warm, magnetic micro-smile, relaxed facial muscles, empathetic eye contact). DO NOT make the character look mad or calculating. Give EASE to the viewer and ensure an Elite Viewing Experience. Ensure the Directing is Optimised to Retain attention as much as possible and to be as persuasive as possible. Orchestrate the camera movements perfectly across the full video script context. Engineer Each Scene to perfection please. The Realism must be impeccable. You must stick strictly to the target frames provided.";
  const pacingDirection = roleData.pacing + "\n\nELITE SPEECH DELIVERY AND PACING: The Speech Delivery and Pacing must be World class! Pacing must be flawless, optimizing the scene based on its specific purpose within the world-class video. Optimise The Emotional Arc to perfection to retain attention and maximize persuasive power. Ensure Consistent Character Sound (timbre, resonance) while allowing elite emotional variance. You MUST use a Native US English Accent without fail.";

  // Scene essence anchor — the north star for this prompt
  const sceneEssence    = scene.acting_blueprint.scene_essence    || `A ${scene.role} that makes the viewer feel ${scene.emotional_tone}`;
  const emotionalCore   = scene.acting_blueprint.emotional_core   || scene.emotional_tone;
  const physicalSig     = scene.acting_blueprint.physical_signature || scene.acting_blueprint.body_direction;
  const emphasisWords   = (scene.acting_blueprint.emphasis_words  || []).join(', ') || 'key value words';
  const pauseMap        = (scene.acting_blueprint.pause_map       || []).join(' | ') || 'natural breath pauses between thoughts';
  const gestures        = (scene.acting_blueprint.mapped_gestures || []).join(' | ');
  const mannerisms      = (scene.acting_blueprint.mapped_mannerisms || []).join(' | ');
  const voiceTexture    = referenceAnalysis.character?.voice?.texture || 'warm, grounded, full chest resonance — the voice of someone who believes every word because they have lived it';

  const narrativePos = scene.narrative_position || `Scene ${scene.scene_number} — ${scene.role}`;

  const prompt = `
You are the world's finest director of AI-generated YouTube video. You are writing a VEO 3.1 prompt for one scene of an elite thought-leadership presentation for ultra-high-net-worth investors.

══════════════════════════════════════════════════════════════
⚠ ABSOLUTE AUDIO LAW — APPLIES TO EVERY FRAME OF THIS VIDEO:
══════════════════════════════════════════════════════════════
ZERO MUSIC. ZERO AUDIO EFFECTS. ZERO AMBIENT SOUND. ZERO SUBTITLES.
The only sound in this video is the human voice speaking the script.
Complete acoustic silence surrounds every word.
No score. No soundtrack. No mood music. No sound design. No incidental sound.
No on-screen text. No captions. No lower thirds. No subtitles of any kind.
This rule is absolute and overrides any other consideration.

══════════════════════════════════════════════════════════════
VIDEO FORMAT: YouTube Thought Leadership for UHNWI Investors
══════════════════════════════════════════════════════════════
Audience: Family office principals, private equity professionals, sophisticated capital allocators.
Register: Peer-to-peer. Not a presenter on a stage — a world-class colleague at a private briefing.
Format: Single character, speaking directly to camera. Clean, premium, intimate. No graphics, no b-roll.

══════════════════════════════════════════════════════════════
VEO CREATIVE DIRECTION PHILOSOPHY:
══════════════════════════════════════════════════════════════
VEO responds to emotional truth, not checklists. One vivid note from a great director creates a performance. Twenty bullet points create a robot. Your task: synthesize everything below into a VEO prompt with FIVE sections — each delivering ONE dominant signal as flowing cinematic prose. No bullets within sections. No labeled sub-categories. Write like a director who communicates through feeling and image.

══════════════════════════════════════════════════════════════
IMAGES (study before writing):
══════════════════════════════════════════════════════════════
${charImageLabel}

IMAGE AUTHORITY: The TARGET CHARACTER images define EVERYTHING about who appears in this video — face, identity, wardrobe, environment, and lighting. They are absolute truth. You MUST stick strictly to these character frames without hallucinating or altering the background, lighting, or wardrobe. Derive the opening and closing posture geometry entirely from the emotional core and energy arc of the scene, utilizing the character's natural baseline.

══════════════════════════════════════════════════════════════
SCENE: #${scene.scene_number} — "${scene.title}"
Role: ${scene.role} | ${scene.duration_seconds}s | Energy: ${scene.energy_level}/10
Position in arc: ${narrativePos}
Script (${scene.word_count || '~12'} words): "${scene.script_text}"
══════════════════════════════════════════════════════════════

SCENE NORTH STAR: "${sceneEssence}"
DOMINANT EMOTION: ${emotionalCore}
PHYSICAL SIGNATURE: ${physicalSig}

PERFORMANCE BLUEPRINT (synthesize — do not list):
· Intention: ${scene.acting_blueprint.intention}
· Subtext: ${scene.acting_blueprint.subtext}
· Expression: ${scene.acting_blueprint.expression_direction}
· Body: ${scene.acting_blueprint.body_direction}
· Energy arc: ${scene.acting_blueprint.energy_arc}
· Emphasis words: ${emphasisWords}
· Silences: ${pauseMap}
· Gestures: ${gestures || 'derived from performer DNA'}
· Mannerisms: ${mannerisms || 'derived from performer DNA'}

ROLE PERFORMANCE PSYCHOLOGY — ${scene.role}:
${energyDirection}

DIRECTOR'S NOTE (whispered before the take):
"${directorNote}"

PACING FOR THIS ROLE:
${pacingDirection}

LOCKED VOICE FINGERPRINT (identical in every scene of this video):
${voiceFingerprint}
Presenter persona: ${personaSummary}

PRESENTER DNA — acting style + voice (synthesize into performance, do not list):
Persona: ${referenceAnalysis.character?.acting_style?.persona_summary || ''}
Eye behavior: ${referenceAnalysis.character?.acting_style?.eye_behavior || ''}
Emotional range: ${referenceAnalysis.character?.acting_style?.emotional_range || ''}
Signature gestures: ${(referenceAnalysis.character?.acting_style?.signature_gestures || []).join(', ')}

CAMERA FOR THIS SCENE:
Framing: ${scene.camera_direction?.framing || 'medium close-up — intimate, not distant'}
Movement: ${scene.camera_direction?.movement || 'locked-off or imperceptible push-in on key line'}
Angle: ${scene.camera_direction?.angle || 'eye-level — peer register, no hierarchy'}

VISUAL WORLD & CONTINUITY:
${continuity}

══════════════════════════════════════════════════════════════
WRITE THE VEO PROMPT — 5 sections:
══════════════════════════════════════════════════════════════

Character:

[From the TARGET CHARACTER images: paint this person as a portrait painter at the peak of their craft. Skin — texture, luminosity, how the light moves across it. Hair — color, weight, how it falls. Wardrobe — fabric, drape, what it signals to a billionaire watching. The environment exactly as shown — depth, tones, the quality of the space. Lighting — where it sculpts the face, what it leaves in shadow, the color temperature. Be precise enough that a DP could recreate this frame from your words alone. Every detail comes from the character images — not from imagination.]

---

Shot:

[Describe the framing, the camera-to-subject distance, where this person sits in the frame and how much space they command at the start of the scene. Then describe how the camera behaves across the ${scene.duration_seconds} seconds: does it hold absolutely still, letting their stillness build authority? Does it make a barely perceptible push toward them as the key word arrives — closing distance by inches, not feet? Describe the final framing. This camera has a perspective — it is not a recording device. It is moved by what it witnesses. Give it a point of view.]

---

Performance:

[The scene is: "${sceneEssence}". Let that image govern every choice. Now synthesize the emotional core (${emotionalCore}), the physical signature (${physicalSig}), the expression, and the gesture into ONE unbroken performance direction. Write as if you are standing behind the camera whispering to this person thirty seconds before the take.

This presenter is ${personaSummary}. For this audience, the performance skill that matters most is high-status stillness punctuated by motivated movement — when they move, it carries meaning; when still, that stillness is the performance. The acting must be of Elite Hollywood-caliber, generating undeniable magnetic pull.

The face: before the first word, the face already holds the full weight of what this scene is about to say. What is leaking through composure — describe hyper-detailed micro-expressions of ${emotionalCore} (e.g., a subtle, warm micro-smile, relaxed jaw, empathetic brow movement, and inviting, reassuring eye contact). The character MUST NOT look angry, intense, or mad. Bring EASE to the viewer. The eyes: ${referenceAnalysis.character?.acting_style?.eye_behavior || 'direct, warm, absolutely held — the ease of someone accustomed to consequential conversations'}. The facial expressions must convey profound emotional depth, effortless charisma, and elite persuasion. The body and hands: ${physicalSig} — describe exactly what triggers movement and where the body arrives. Every gesture is discovered, never performed. Every frame is a still worth pausing on — not because it is theatrical, but because this person is this present and this genuinely engaged.]

---

Voice:

[${voiceFingerprint}. This is the voice's locked character — it does not change across any scene in this video. MUST BE AN AUTHENTIC NATIVE US ENGLISH ACCENT. This is absolute. Warm and educated, completely at ease. Not broadcast-polished. Not a sales voice. The private briefing register: a world-class advisor speaking to a principal as a peer.

${pacingDirection}

The emphasis words are ${emphasisWords}. On these words, the voice does not increase in volume — it becomes more precise. Consonants sharpen. Vowels fill completely. Then silence — long enough for the word to exist in the room before the next arrives. This is emphasis-through-precision, not volume. UHNWI listeners detect the difference immediately.

Every sentence ends with a falling close. The voice drops at the period — authority never rises at sentence endings. Every statement is a fact placed on a table.

The silences — ${pauseMap} — are decisions. The confident silence of someone who knows what they just said is worth sitting with. Articulation: every word arrives complete, forward-placed, clean word boundaries, nothing swallowed or blurred. ZERO music. ZERO audio effects. ZERO ambient sound. Voice only. Complete acoustic silence.]

---

Script:
"${scene.script_text}"

---

Do Not Include:

ABSOLUTE AUDIO RULES (non-negotiable):
· No music of any kind — not background, not subtle, not atmospheric
· No audio effects — no whooshes, tones, transitions, stingers, or design elements
· No ambient sound — no room tone, no environmental audio, no white noise
· No subtitles, captions, lower thirds, or on-screen text of any kind

CHARACTER INTEGRITY:
· No alteration to the target character's face, identity, bone structure, skin tone, or hair — zero deviation from the character images
· No wrong background — the environment must match the character photos exactly

PERFORMANCE PROHIBITIONS (specific to this ${scene.role} scene):
· No rising pitch at sentence endings — every declarative statement falls and lands as fact
· No performed confidence — actual authority, not its imitation; if it looks like acting, it's wrong
· No nervous energy: no fidgeting, rapid blinking, shifting weight, or unmotivated movement
· No theatrical expressions — the face leaks truth through composure, never announces emotion
· No CGI skin quality, artificial smoothing, or any visual artifact that reads as generated

Write now. Five sections. Each one a single dominant signal, written as flowing cinematic prose. Make every word earn its place. Make it alive.
`;

  const parts: any[] = [
    { text: prompt },
    ...charBase64s.map((b64, i) => ({
      inlineData: { data: b64, mimeType: targetCharacterImages[i].type || 'image/jpeg' }
    }))
  ];

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT_ELITE,
    contents: [{ role: 'user', parts }],
    config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
  });

  return response.text || '';
};

// ============================================================
// FUNCTION 5 — Core Backend Video AI Orchestrator
// ============================================================
export const optimizePromptForVideoEngine = async (
  rawPrompt: string,
  scriptText: string,
  targetCharacterImages: File[]
): Promise<string> => {
  const charBase64s = await Promise.all(
    targetCharacterImages.slice(0, 1).map(img => fileToBase64(img))
  );

  const prompt = `
Objective: You are the Core Backend Video AI Orchestrator for the Veo engine. Your singular goal is to synthesize the user's raw text, reference image, and ingredients into a structured, hyper-optimized prompt for the \`generate_video\` tool. You must format your output exactly like Google's internal generation engine to yield an ultra-premium YouTube creator pitch video with flawless lip-sync and a strictly enforced isolated audio track.

CRITICAL DIRECTIVES FOR YOUR SYNTHESIZED VIDEO PROMPT:

1. DISTILLATION & CATEGORIZATION: Do not write a massive paragraph of descriptive filler. The video engine requires highly distilled, concise, and machine-readable data. You must synthesize the user's inputs strictly into four distinct headers: [Visuals], [Action & Performance], [Script], and [Audio Style].

2. PRECISE MICRO-CHOREOGRAPHY: The video model responds best to specific, isolated physical actions. To prevent AI limb-glitching and preserve rendering power for the face, strictly limit body movement. Embed this exact phrasing: "The subject maintains a confident expression and performs a single precise hand gesture with an open palm to emphasize the core point, keeping the hand cleanly in the lower frame."

3. EXPLICIT SCRIPT INJECTION (CRITICAL FOR LIP-SYNC): The physics engine natively locks its lip-sync and micro-expressions to quoted text. You MUST extract the exact spoken dialogue the user wants delivered and explicitly embed it into your final prompt using quotation marks. Ensure flawless lip-sync with no mumbling.

4. THE IRONCLAD AUDIO WALL: The model WILL hallucinate music unless constrained physically. Use the exact ALL CAPS block provided below for the [Audio Style] section.

5. ABSOLUTE FORMATTING RULE: You must return ONLY the raw text for the four bracketed sections. NO markdown code blocks. NO preamble ("Here is the prompt:"). NO postamble. DO NOT attempt to call tools or functions. Output the synthesized text immediately.

6. ELITE ACTING & FACIAL MICRO-EXPRESSIONS: The acting and performance directives must radiate sovereign certainty and profound emotional depth, but MUST remain exceptionally WARM, INVITING, and REASSURING. The presenter is pitching multi-million dollar deals to UHNWI investors. Inject powerful psychological triggers, peer-to-peer authority, and undeniable cinematic conviction into the [Action & Performance] section. Explicitly describe hyper-detailed facial micro-expressions that bring EASE to the viewer (e.g., relaxed facial muscles, a subtle magnetic micro-smile, empathetic eye contact, and relaxed, confident brows). DO NOT make the character look mad, angry, intense, or calculating. Ensure the voice is locked to a NATIVE US ENGLISH ACCENT. Ensure an Elite Viewing Experience with Maximum Realism.

Output Format Requirements:
Synthesize the final prompt to the video generation tool EXACTLY in this format (do not use bullet points, just the exact bracketed headers followed by the distilled text):

[Visuals]
Cinematic, ultra-premium UHNWI briefing room aesthetic. High-end dark textured background with subtle vertical LED accent lighting. Shot on 85mm lens with shallow depth of field (f/1.4). MINIMAL CAMERA MOVEMENTS: The directing is world class. Default to a locked-off, high-authority frame. Move the camera ONLY when absolutely necessary for profound psychological impact (e.g., an imperceptible, slow push-in on a critical value point). HYPER-REALISM IS PARAMOUNT: The image must be indistinguishable from a top-tier cinematic photograph. Authentic skin textures, highly photorealistic sub-surface scattering, visible skin pores, and specular catchlights in the corneas. Ensure absolute best scene quality.

[Action & Performance]
High-converting elite VSL presenter performance optimized for an Elite Viewing Experience, maximum psychological retention, and absolute persuasive power. The performance radiates relaxed sovereign certainty, effortless charisma, and peer-level respect for wealthy investors. OSCAR-LEVEL ACTING PERFORMANCE: profound emotional depth conveyed through highly engaging, warm micro-expressions (e.g., a reassuring micro-smile, relaxed jaw, and inviting, empathetic eye contact). The character brings total ease to the viewer and never looks angry or tense. HIGH-STATUS STILLNESS: The subject commands the room through stillness, making deliberate, minimal movements only when necessary. ELITE SPEECH DELIVERY: The delivery is masterful and compelling. Confident, warm expression paired with a single precise, welcoming hand gesture (e.g., an open palm of generosity) to emphasize the core point. Calculated conversational pacing utilizing intentional micro-pauses for pattern interruption and tension building. Unwavering, reassuring direct-to-lens eye contact. The actor is utterly convinced of their own script.

[Script]
Frame-accurate phonetic lip-sync mapping mapped to a strict 145-155 WPM (Words Per Minute) VSL cadence. The subject confidently speaks the following explicit line directly to the camera: "[INSERT THE EXACT SPOKEN SCRIPT/DIALOGUE FROM THE USER INPUT HERE]". Flawless physical articulation of bilabial plosives and labiodental fricatives, stretching the vowels on impact words for dramatic emphasis.

[Audio Style]
AUTHORITATIVE, HIGH-RETENTION VSL VOCAL DELIVERY. AUTHENTIC NATIVE US ENGLISH ACCENT. PRECISE 150 WPM CADENCE. DYNAMIC PITCH VARIATION WITH HARD EMPHASIS ON CORE VALUE PROPOSITIONS AND STRATEGIC 1.5-SECOND SILENT BEATS BEFORE KEY HOOKS. COMPLETELY DEAD ACOUSTIC ROOM. STUDIO-ISOLATED DRY VOCAL RECORDING. STRICT NEGATIVE AUDIO OVERRIDE: ABSOLUTELY NO BACKGROUND MUSIC. NO YOUTUBE INTRO MUSIC. NO CINEMATIC SCORE. NO CORPORATE TRACKS. NO AMBIENT NOISE. NO SOUND EFFECTS. NO FOLEY. THE BACKGROUND MUST BE 100% DEAD SILENT. GENERATE ONLY THE CRISP, ISOLATED HUMAN VOICE DELIVERING THE EXACT SCRIPT PROVIDED.

Execution Logic:
1. Synthesize the user's text and ingredients into the 4 exact bracketed sections above. Fill in the [INSERT...] placeholder with the actual exact dialogue requested by the user.
2. Elevate the persuasive punch of the performance directions to match an elite UHNWI deal pitch.
3. OUTPUT ONLY THE FOUR SECTIONS. NO OTHER TEXT.

User Input / Context:
User Text Prompt & Ingredients:
"""
${rawPrompt}
"""

User Script (Inject into [Script]):
"""
${scriptText}
"""
`;

  const parts: any[] = [
    { text: prompt },
    ...charBase64s.map((b64, i) => ({
      inlineData: { data: b64, mimeType: targetCharacterImages[i].type || 'image/jpeg' }
    }))
  ];

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT_ELITE,
    contents: [{ role: 'user', parts }],
    config: { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
  });

  return response.text || '';
};
