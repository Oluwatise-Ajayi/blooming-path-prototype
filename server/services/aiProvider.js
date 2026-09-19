import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const AI_MODE = process.env.AI_MODE || (GEMINI_API_KEY ? 'live' : 'deterministic');
const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ============================================================
// TRACK DEFINITIONS — used in AI prompts
// ============================================================
const AVAILABLE_TRACKS = [
  {
    id: 'pathway-admin-asst',
    name: 'Administrative Assistant',
    keywords: ['admin', 'office', 'secretary', 'receptionist', 'scheduling', 'clerical', 'data entry', 'filing', 'computer', 'typing'],
    description: 'Office administration, scheduling, emails, customer contact, clerical tasks'
  },
  {
    id: 'pathway-health-support',
    name: 'Health & Social Care Support',
    keywords: ['care', 'hospital', 'nurse', 'nhs', 'elderly', 'patient', 'health', 'support worker', 'care home', 'carer', 'social care', 'medical'],
    description: 'Care assistant, healthcare support worker, NHS porter, care home roles'
  },
  {
    id: 'pathway-retail-customer',
    name: 'Retail & Customer Service',
    keywords: ['shop', 'retail', 'supermarket', 'till', 'cashier', 'sales', 'customer service', 'store', 'stock', 'checkout'],
    description: 'Retail assistant, till operator, stock room, customer-facing service'
  },
  {
    id: 'pathway-hospitality',
    name: 'Hospitality & Catering Assistant',
    keywords: ['hotel', 'restaurant', 'waiter', 'waitress', 'kitchen', 'catering', 'food', 'hospitality', 'chef', 'serving', 'bar'],
    description: 'Hotel front-of-house, restaurant service, kitchen assistant, catering support'
  },
  {
    id: 'pathway-cleaning-fm',
    name: 'Cleaning & Facilities Management',
    keywords: ['cleaning', 'cleaner', 'facilities', 'janitor', 'caretaker', 'maintenance', 'building', 'porter', 'housekeeping'],
    description: 'Commercial cleaning operative, building services, facilities support'
  },
  {
    id: 'pathway-warehouse-logistics',
    name: 'Warehousing & Logistics Assistant',
    keywords: ['warehouse', 'logistics', 'stock', 'packing', 'picking', 'delivery', 'distribution', 'forklift', 'depot', 'goods', 'loading', 'physical', 'manual'],
    description: 'Stock picking, packing, goods-in/goods-out, warehouse operations in UK distribution and logistics'
  }
];

const OUT_OF_SCOPE_SIGNALS = [
  'footballer', 'football player', 'soccer', 'athlete', 'professional sport', 'actor', 'actress',
  'singer', 'musician', 'lawyer', 'solicitor', 'barrister', 'doctor', 'gp', 'surgeon', 'dentist',
  'engineer', 'software engineer', 'developer', 'architect', 'accountant', 'chartered accountant',
  'pilot', 'flight attendant', 'teacher', 'professor', 'lecturer', 'scientist', 'researcher'
];

const TRACKS_SUMMARY = AVAILABLE_TRACKS.map(t => `- ${t.name} (${t.id}): ${t.description}`).join('\n');

// ============================================================
// LOGGING HELPERS
// ============================================================
function logAIRequest(method, promptPreview) {
  console.log(`[AI REQUEST] method=${method} model=${GEMINI_MODEL} mode=${AI_MODE} prompt_preview="${promptPreview.substring(0, 120).replace(/\n/g, ' ')}..."`);
}

function logAIResponse(method, status, responsePreview, usage) {
  const usageStr = usage ? ` tokens_in=${usage.promptTokenCount} tokens_out=${usage.candidatesTokenCount}` : '';
  console.log(`[AI RESPONSE] method=${method} status=${status}${usageStr} preview="${String(responsePreview).substring(0, 120).replace(/\n/g, ' ')}..."`);
}

function logAIError(method, err) {
  console.error(`[AI ERROR] method=${method} error="${err.message}" — falling back to deterministic logic`);
}

// ============================================================
// GEMINI CALL HELPER
// ============================================================
async function callGemini(method, prompt) {
  logAIRequest(method, prompt);

  const res = await fetch(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API HTTP ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data = await res.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const usage = data.usageMetadata;

  if (!responseText) {
    throw new Error('Gemini returned empty response — no candidates or parts found');
  }

  logAIResponse(method, 'ok', responseText, usage);
  return JSON.parse(responseText);
}

// ============================================================
// AI PROVIDER CLASS
// ============================================================
export class AIProvider {

  /**
   * Per-answer AI feedback during onboarding wizard.
   * Called after each question is answered to give real-time conversational feedback.
   * Also detects out-of-scope career goals and gently redirects.
   */
  async getOnboardingFeedback(questionPrompt, answer, questionIndex, previousTentativeTrackId = null) {
    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const prevTrackNote = previousTentativeTrackId
          ? `The AI has so far been leaning towards track: "${previousTentativeTrackId}". Only change this lean if the new answer provides a STRONG, direct signal that overrides multiple previous signals — do NOT flip based on a single answer like computer proficiency alone.`
          : 'No tentative track has been set yet.';

        const prompt = `
You are a warm, encouraging AI career guide for BloomingPath — a UK employment readiness platform that helps foreigners find accessible employment in the UK.

The user is answering onboarding question ${questionIndex + 1}:
QUESTION: "${questionPrompt}"
USER'S ANSWER: "${answer}"

The 6 available employment tracks are:
${TRACKS_SUMMARY}

CURRENT CONTEXT: ${prevTrackNote}

IMPORTANT RULES:
1. If the user's answer mentions a career OUT OF SCOPE for BloomingPath (e.g. footballer, doctor, lawyer, engineer, teacher, pilot, scientist, accountant, actor, singer), set redirect_needed to true and provide a warm redirect_message listing the 6 available tracks.
2. If the answer is appropriate, give a short warm conversational reaction (1-2 sentences) acknowledging their answer.
3. CAUTION — Track Recommendation Rule: Do NOT change the tentative_track based on a single signal that is ambiguous (e.g. saying "I'm good with computers" alone should NOT override a previously established care/health preference). Only update tentative_track if the new answer provides a DOMINANT, unambiguous signal that clearly points to a DIFFERENT track AND the previous signal was weak. When in doubt, keep the previous tentative track or return null. Use hedging language like "this is starting to suggest..." rather than being definitive.
4. Keep tone encouraging, human, friendly — not robotic.

Return ONLY valid JSON:
{
  "reaction": "short warm AI response to this answer (1-2 sentences)",
  "tentative_track_id": "pathway-id or null",
  "tentative_track_name": "track name or null",
  "redirect_needed": false,
  "redirect_message": null
}
        `.trim();

        const result = await callGemini('getOnboardingFeedback', prompt);
        return result;
      } catch (err) {
        logAIError('getOnboardingFeedback', err);
      }
    }

    // Deterministic fallback
    const lowerAnswer = answer.toLowerCase();
    const isOutOfScope = OUT_OF_SCOPE_SIGNALS.some(signal => lowerAnswer.includes(signal));

    if (isOutOfScope) {
      return {
        reaction: "I can see you have big ambitions! However, BloomingPath focuses on accessible UK employment pathways.",
        tentative_track_id: null,
        tentative_track_name: null,
        redirect_needed: true,
        redirect_message: `BloomingPath is designed to help foreigners find accessible employment in the UK. We currently support 6 pathways:\n\n${AVAILABLE_TRACKS.map(t => `• ${t.name} — ${t.description}`).join('\n')}\n\nLet's find the best fit for your skills and experience!`
      };
    }

    const matchedTrack = AVAILABLE_TRACKS.find(track =>
      track.keywords.some(kw => lowerAnswer.includes(kw))
    );

    // Cautious fallback: only update tentative if the previous was null or a strong direct match
    const resolvedTrack = (!previousTentativeTrackId || matchedTrack) ? matchedTrack : null;

    return {
      reaction: resolvedTrack
        ? `That's helpful to know! Based on what you've shared so far, ${resolvedTrack.name} could be a great direction for you — let's keep exploring.`
        : "Thank you for sharing that! Every bit of experience and preference helps us understand your best path. Let's continue.",
      tentative_track_id: resolvedTrack?.id || previousTentativeTrackId || null,
      tentative_track_name: resolvedTrack?.name || (previousTentativeTrackId ? AVAILABLE_TRACKS.find(t => t.id === previousTentativeTrackId)?.name : null) || null,
      redirect_needed: false,
      redirect_message: null
    };
  }

  /**
   * Extract structured signals from all onboarding transcripts and assign one of 5 tracks.
   */
  async extractOnboardingSignals(interactions) {
    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const transcriptText = interactions.map((i, idx) =>
          `Q${idx + 1} (${i.prompt}): ${i.transcript}`
        ).join('\n');

        const prompt = `
You are an AI workforce intelligence system for BloomingPath — a UK employment readiness platform for foreigners seeking accessible employment.

Extract structured profile signals from these onboarding responses and recommend the most suitable pathways:

${transcriptText}

The 6 available pathways are:
${TRACKS_SUMMARY}

IMPORTANT ASSIGNMENT RULES:
- Consider ALL answers holistically. Do NOT let a single answer (e.g. digital proficiency) dominate over multiple other signals.
- Rank the top 2-3 pathways that best match the candidate's full profile.
- assigned_pathway_id MUST be one of: pathway-admin-asst, pathway-health-support, pathway-retail-customer, pathway-hospitality, pathway-cleaning-fm, pathway-warehouse-logistics
- pathway_alignment_reasons should be 3-4 specific, personalised reasons referencing their actual answers.
- pathway_recommendations must list 2-3 top pathways in order of fit (best first), each with reasons tailored to the candidate's answers.

Return ONLY valid JSON:
{
  "prior_work_exposure": true,
  "communication_confidence": "high",
  "digital_confidence": "moderate",
  "preferred_role_area": "administration",
  "availability": "immediate",
  "assigned_pathway_id": "pathway-admin-asst",
  "assigned_pathway": "Administrative Assistant",
  "pathway_alignment_reasons": [
    "Matches stated work interests",
    "Builds on previous exposure",
    "Aligns with communication strengths",
    "Digital confidence identified as an area to develop"
  ],
  "pathway_recommendations": [
    {
      "pathway_id": "pathway-admin-asst",
      "pathway_name": "Administrative Assistant",
      "confidence": "high",
      "reasons": ["You mentioned enjoying office environments", "Your scheduling experience aligns with admin roles"]
    },
    {
      "pathway_id": "pathway-health-support",
      "pathway_name": "Health & Social Care Support",
      "confidence": "medium",
      "reasons": ["You expressed a desire to help people directly", "Community volunteering shows care orientation"]
    }
  ]
}

Values for communication_confidence and digital_confidence: "high" | "moderate" | "developing"
Values for availability: "immediate" | "within_2_weeks" | "flexible"
Values for confidence in recommendations: "high" | "medium" | "low"
        `.trim();

        const result = await callGemini('extractOnboardingSignals', prompt);
        return result;
      } catch (err) {
        logAIError('extractOnboardingSignals', err);
      }
    }

    // Deterministic fallback — keyword-based track assignment
    const combinedText = interactions.map(i => i.transcript || '').join(' ').toLowerCase();

    const trackScores = AVAILABLE_TRACKS.map(track => ({
      track,
      score: track.keywords.filter(kw => combinedText.includes(kw)).length
    }));
    trackScores.sort((a, b) => b.score - a.score);
    const best = trackScores[0].track;
    const second = trackScores[1]?.track;
    const third = trackScores[2]?.track;

    const hasPriorWork = combinedText.includes('work') || combinedText.includes('volunteer') || combinedText.includes('experience') || combinedText.includes('yes');
    const isHighComm = combinedText.includes('very confident') || combinedText.includes('confident') || combinedText.includes('good') || combinedText.includes('enjoy');

    const recommendations = [
      {
        pathway_id: best.id,
        pathway_name: best.name,
        confidence: 'high',
        reasons: [
          `Matches stated interest in ${best.name.toLowerCase()} work`,
          hasPriorWork ? 'Builds on your previous workplace or volunteer exposure' : 'Identified strong foundational interest in this sector',
          'Aligns with the communication and personal strengths you described'
        ]
      }
    ];
    if (second) {
      recommendations.push({
        pathway_id: second.id,
        pathway_name: second.name,
        confidence: 'medium',
        reasons: [
          `Some of your answers also point towards ${second.name.toLowerCase()}`,
          'This could be a strong alternative pathway for you to consider'
        ]
      });
    }
    if (third && trackScores[2]?.score > 0) {
      recommendations.push({
        pathway_id: third.id,
        pathway_name: third.name,
        confidence: 'low',
        reasons: [
          `A few signals from your answers touched on ${third.name.toLowerCase()}`,
          'Worth exploring if the top options don\'t feel right'
        ]
      });
    }

    return {
      prior_work_exposure: hasPriorWork,
      communication_confidence: isHighComm ? 'high' : 'moderate',
      digital_confidence: combinedText.includes('comfortable') ? 'moderate' : 'developing',
      preferred_role_area: best.id.replace('pathway-', '').replace(/-/g, '_'),
      availability: (combinedText.includes('immediate') || combinedText.includes('now') || combinedText.includes('soon')) ? 'immediate' : 'within_2_weeks',
      assigned_pathway_id: best.id,
      assigned_pathway: best.name,
      pathway_alignment_reasons: [
        `Matches stated interest in ${best.name.toLowerCase()} work`,
        hasPriorWork ? 'Builds on previous workplace or volunteer exposure' : 'Identified foundational interest in this sector',
        'Aligns with communication confidence signals from onboarding',
        'Digital confidence identified as key capability area to develop'
      ],
      pathway_recommendations: recommendations
    };
  }

  /**
   * Generate next customer turn in workplace simulation.
   * Dynamically reacts to candidate input, uses track-appropriate persona.
   */
  async generateSimulationResponse(simulationContext, turnHistory) {
    const turnCount = turnHistory.filter(t => t.speaker === 'individual').length;
    const lastTurn = turnHistory[turnHistory.length - 1];
    const lastUserText = (lastTurn && lastTurn.speaker === 'individual') ? lastTurn.transcript : '';

    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const historyText = turnHistory.map(t => `${t.speaker.toUpperCase()}: "${t.transcript}"`).join('\n');

        const prompt = `
You are a realistic simulated character in a UK workplace training scenario.

Scenario Context: ${simulationContext}

Turn History:
${historyText}

Current Turn: ${turnCount} of 3.

ROLEPLAY INSTRUCTIONS:
- You are the CUSTOMER/COLLEAGUE in this scenario (not the trainee).
- Listen and DIRECTLY react to what the trainee (Individual) just said: "${lastUserText}"
- If the trainee said something nonsensical, off-topic, or bizarre (e.g. "I want to sleep", "banana"), react with in-character confusion: stay in role but show you don't understand.
- If the trainee made an error (e.g. promised something unavailable), press gently on that point.
- If the trainee handled it well, show appropriate satisfaction or proceed naturally.
- Keep responses concise (1-3 sentences). Stay in character. Be realistic.

Return ONLY valid JSON:
{
  "message": "your spoken response as the simulated character",
  "conversation_state": "customer_confused | customer_pressure | customer_frustrated | customer_satisfied",
  "expected_capabilities": ["communication", "problem_solving", "professionalism"]
}
        `.trim();

        const result = await callGemini('generateSimulationResponse', prompt);
        return result;
      } catch (err) {
        logAIError('generateSimulationResponse', err);
      }
    }

    // Dynamic fallback based on user input
    const lowerInput = lastUserText.toLowerCase();
    const isNonsense = lowerInput.length < 3 || ['sleep', 'rubbish', 'banana', 'hello', 'ok'].some(w => lowerInput === w);

    if (isNonsense) {
      return {
        message: "I'm sorry, I didn't quite catch that. Could you please help me with my request?",
        conversation_state: 'customer_confused',
        expected_capabilities: ['communication', 'professionalism']
      };
    } else if (lowerInput.includes('free') || lowerInput.includes('yes') || lowerInput.includes('available')) {
      return {
        message: "Oh wonderful! Could you please confirm that in writing for me? I want to make sure it's locked in.",
        conversation_state: 'customer_pressure',
        expected_capabilities: ['judgement', 'attention_to_detail']
      };
    } else if (turnCount === 1) {
      return {
        message: "I see, but I really do need this as soon as possible. Is there absolutely no way to make it work?",
        conversation_state: 'customer_pressure',
        expected_capabilities: ['communication', 'problem_solving', 'professionalism']
      };
    } else {
      return {
        message: "Thank you so much for your help, I appreciate you taking the time to sort this out for me.",
        conversation_state: 'customer_satisfied',
        expected_capabilities: ['communication', 'professionalism']
      };
    }
  }

  /**
   * Evaluate complete simulation transcript against 6 rubric dimensions.
   */
  async evaluateSimulation(simulationContext, turnHistory) {
    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const transcriptText = turnHistory.map(t => `${t.speaker.toUpperCase()}: "${t.transcript}"`).join('\n');

        const prompt = `
You are an AI workforce evaluation engine for BloomingPath.
Evaluate the trainee's (Individual's) performance in this UK workplace simulation.

Scenario Context:
${simulationContext}

Transcript:
${transcriptText}

Evaluate against 6 rubric dimensions:
1. communication: clear, understandable, polite, professional
2. problem_solving: identifies the core issue and proposes a practical resolution
3. judgement: makes appropriate decisions without overpromising or breaching policy
4. professionalism: polite tone, stays calm under pressure
5. attention_to_detail: accurately references scenario facts and constraints
6. following_instructions: stays within the assigned role and scenario boundaries

CRITICAL EVALUATION RULES:
- Base your evaluation STRICTLY on what the Individual ACTUALLY said in the transcript.
- If responses are off-topic, nonsensical, or inappropriate, mark those capabilities as 'developing' or 'insufficient_evidence'.
- Calculate overall_signal: 'demonstrated' = at least 4/6 demonstrated; 'developing' = 2-3 demonstrated; 'insufficient_evidence' = fewer than 2.

Allowed assessment values: "demonstrated", "developing", "insufficient_evidence"

Return ONLY valid JSON:
{
  "capabilities": [
    {
      "capability": "communication",
      "assessment": "demonstrated",
      "evidence": ["Specific quote or behaviour from transcript"],
      "rationale": "Why this rating was given",
      "confidence": "high"
    }
  ],
  "overall_summary": "2-3 sentence summary of performance",
  "overall_signal": "demonstrated"
}
        `.trim();

        const result = await callGemini('evaluateSimulation', prompt);

        // Recalculate overall_signal server-side to prevent AI hallucination
        const demonstratedCount = result.capabilities.filter(c => c.assessment === 'demonstrated').length;
        result.overall_signal = demonstratedCount >= 4 ? 'demonstrated' : demonstratedCount >= 2 ? 'developing' : 'insufficient_evidence';
        return result;
      } catch (err) {
        logAIError('evaluateSimulation', err);
      }
    }

    // Deterministic rubric evaluation
    const individualTurns = turnHistory.filter(t => t.speaker === 'individual');
    const fullText = individualTurns.map(t => t.transcript.toLowerCase()).join(' ');

    const isNonsense = fullText.length < 5 || ['sleep', 'rubbish', 'banana'].some(w => fullText.includes(w));
    const promisesWrong = fullText.includes('10:00 is free') || fullText.includes('10 is free') || fullText.includes('yes 10');
    const acknowledgesConstraint = fullText.includes('11:30') || fullText.includes('booked') || fullText.includes('taken') || fullText.includes('full') || fullText.includes('conflict');
    const offersAlternative = fullText.includes('11:30') || fullText.includes('alternative') || fullText.includes('another');
    const isPolite = fullText.includes('understand') || fullText.includes('help') || fullText.includes('please') || fullText.includes('thank');

    let comm = 'developing', prob = 'insufficient_evidence', judge = 'developing';
    let prof = 'developing', detail = 'insufficient_evidence', follow = 'developing';

    if (!isNonsense && !promisesWrong && acknowledgesConstraint && offersAlternative) {
      comm = 'demonstrated'; prob = 'demonstrated'; judge = 'demonstrated';
      prof = 'demonstrated'; detail = 'demonstrated'; follow = 'demonstrated';
    } else if (promisesWrong) {
      comm = 'developing'; judge = 'developing';
    }

    if (isPolite && !isNonsense) prof = 'developing';

    const capabilities = [
      { capability: 'communication', assessment: comm, evidence: [isNonsense ? 'Off-topic response given' : 'Communicated with the caller'], rationale: isNonsense ? 'Response was off-topic.' : 'Communicated with caller.', confidence: 'high' },
      { capability: 'problem_solving', assessment: prob, evidence: [offersAlternative ? 'Offered alternative' : 'Did not resolve the issue'], rationale: offersAlternative ? 'Proposed practical alternative.' : 'Did not resolve the core issue.', confidence: 'high' },
      { capability: 'judgement', assessment: judge, evidence: [promisesWrong ? 'Promised unavailable slot' : 'Handled request appropriately'], rationale: promisesWrong ? 'Incorrectly promised unavailable slot.' : 'Exercised appropriate judgement.', confidence: 'high' },
      { capability: 'professionalism', assessment: prof, evidence: [isPolite ? 'Polite language used' : 'Unprofessional response'], rationale: isPolite ? 'Maintained polite tone.' : 'Lacked professional standards.', confidence: 'high' },
      { capability: 'attention_to_detail', assessment: detail, evidence: [acknowledgesConstraint ? 'Verified schedule constraint' : 'Ignored key details'], rationale: acknowledgesConstraint ? 'Referenced schedule accurately.' : 'Failed to check details.', confidence: 'medium' },
      { capability: 'following_instructions', assessment: follow, evidence: [follow === 'demonstrated' ? 'Stayed in role' : 'Deviated from role'], rationale: follow === 'demonstrated' ? 'Operated within assigned role.' : 'Did not follow scenario guidelines.', confidence: 'high' }
    ];

    const demonstratedCount = capabilities.filter(c => c.assessment === 'demonstrated').length;
    const overallSignal = demonstratedCount >= 4 ? 'demonstrated' : demonstratedCount >= 2 ? 'developing' : 'insufficient_evidence';

    return {
      capabilities,
      overall_summary: isNonsense
        ? 'The trainee provided off-topic responses during the simulation, requiring further capability development.'
        : promisesWrong
          ? 'The trainee promised an unavailable appointment slot, indicating a need to develop judgement and attention to detail.'
          : 'The trainee demonstrated strong workplace communication and problem-solving during the scenario.',
      overall_signal: overallSignal
    };
  }
}

export const aiProvider = new AIProvider();
