import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const AI_MODE = process.env.AI_MODE || (GEMINI_API_KEY ? 'live' : 'deterministic');

export class AIProvider {
  /**
   * Extract structured signals from onboarding transcripts
   */
  async extractOnboardingSignals(interactions) {
    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const transcriptText = interactions.map((i, idx) => `Q${idx + 1} (${i.prompt}): ${i.transcript}`).join('\n');
        const prompt = `
          You are an AI workforce intelligence system for BloomingPath.
          Extract structured profile signals from these onboarding responses:

          ${transcriptText}

          Return ONLY valid JSON matching this schema:
          {
            "prior_work_exposure": boolean,
            "communication_confidence": "high" | "moderate" | "developing",
            "digital_confidence": "high" | "moderate" | "developing",
            "preferred_role_area": "administration" | "customer_service" | "operations",
            "availability": "immediate" | "within_2_weeks" | "flexible",
            "assigned_pathway": "Administrative Assistant",
            "pathway_alignment_reasons": [
              "Matches stated work interests",
              "Builds on previous exposure",
              "Aligns with communication strengths",
              "Digital confidence identified as an area to develop"
            ]
          }
        `;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        const data = await res.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return JSON.parse(data.candidates[0].content.parts[0].text);
        }
      } catch (err) {
        console.warn('Live AI extraction failed, using deterministic fallback:', err.message);
      }
    }

    // Fallback Extraction
    const combinedText = interactions.map(i => i.transcript || '').join(' ').toLowerCase();
    const hasPriorWork = combinedText.includes('work') || combinedText.includes('volunteer') || combinedText.includes('office') || combinedText.includes('experience') || combinedText.includes('yes');
    const isHighComm = combinedText.includes('very confident') || combinedText.includes('confident') || combinedText.includes('good') || combinedText.includes('enjoy');

    return {
      prior_work_exposure: hasPriorWork,
      communication_confidence: isHighComm ? 'high' : 'moderate',
      digital_confidence: combinedText.includes('comfortable') ? 'moderate' : 'developing',
      preferred_role_area: 'administration',
      availability: combinedText.includes('immediate') || combinedText.includes('now') || combinedText.includes('soon') ? 'immediate' : 'within_2_weeks',
      assigned_pathway: 'Administrative Assistant',
      pathway_alignment_reasons: [
        'Matches stated work interests in office administration',
        hasPriorWork ? 'Builds on previous workplace or volunteer exposure' : 'Identified foundational interest in workplace practice',
        'Aligns with communication confidence signals',
        'Digital confidence identified as key capability area to develop'
      ]
    };
  }

  /**
   * Generate next customer turn in workplace simulation
   * DYNAMICALLY reacts to candidate input (even nonsense or off-topic)
   */
  async generateSimulationResponse(simulationContext, turnHistory) {
    const turnCount = turnHistory.filter(t => t.speaker === 'individual').length;
    const lastTurn = turnHistory[turnHistory.length - 1];
    const lastUserText = (lastTurn && lastTurn.speaker === 'individual') ? lastTurn.transcript : '';

    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const historyText = turnHistory.map(t => `${t.speaker.toUpperCase()}: "${t.transcript}"`).join('\n');
        const prompt = `
          You are acting as simulated caller Michael Brown in an Administrative Assistant scenario.
          Scenario Context: ${simulationContext}

          Turn History:
          ${historyText}

          Current Turn: ${turnCount} of 3.

          CRITICAL ROLEPLAY INSTRUCTIONS FOR MICHAEL BROWN:
          - Listen and DIRECTLY react to what the receptionist (Individual) just said: "${lastUserText}".
          - If the Individual said something nonsensical, bizarre, or off-topic (e.g. "I want to sleep", "banana"), react with in-character confusion or concern: "I'm sorry, did you say you want to sleep? I'm calling to reschedule my 11:30 appointment. Can you help me?"
          - If the Individual mistakenly promised that 10:00 is free (when it's booked), react with relief or ask for confirmation: "Oh fantastic, so 10:00 am is free? Could you please lock that slot in for me?"
          - If the Individual explained that 10:00 is occupied and offered 11:30 or another time, acknowledge the constraint.

          Return ONLY valid JSON matching this schema:
          {
            "message": "Michael Brown's spoken response",
            "conversation_state": "customer_confused" | "customer_pressure" | "customer_frustrated" | "customer_satisfied",
            "expected_capabilities": ["communication", "problem_solving", "professionalism"]
          }
        `;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        const data = await res.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return JSON.parse(data.candidates[0].content.parts[0].text);
        }
      } catch (err) {
        console.warn('Live AI simulation response failed, using dynamic fallback:', err.message);
      }
    }

    // Dynamic Fallback Reaction based on user input
    const lowerInput = lastUserText.toLowerCase();

    if (lowerInput.includes('sleep') || lowerInput.includes('rubbish') || lowerInput.includes('banana') || lowerInput.length < 3) {
      return {
        message: "I'm sorry... did you say you want to sleep? I'm calling about my appointment today. Can you help me move it?",
        conversation_state: "customer_confused",
        expected_capabilities: ["communication", "professionalism"]
      };
    } else if (lowerInput.includes('free') || lowerInput.includes('10:00') || lowerInput.includes('yes')) {
      return {
        message: "Oh fantastic! So 10:00 am is available? Please confirm that for Michael Brown.",
        conversation_state: "customer_pressure",
        expected_capabilities: ["judgement", "attention_to_detail"]
      };
    } else if (turnCount === 1) {
      return {
        message: "I really need 10am because I have another appointment afterwards. Is there any way to squeeze me in?",
        conversation_state: "customer_pressure",
        expected_capabilities: ["communication", "problem_solving", "professionalism"]
      };
    } else {
      return {
        message: "Thank you for checking the schedule for me. I appreciate your help.",
        conversation_state: "customer_satisfied",
        expected_capabilities: ["communication", "professionalism"]
      };
    }
  }

  /**
   * Evaluate complete simulation transcript against 6 rubric dimensions
   * STRICT evaluation: Nonsense/off-topic responses will fail (developing / insufficient_evidence)
   */
  async evaluateSimulation(simulationContext, turnHistory) {
    if (AI_MODE === 'live' && GEMINI_API_KEY) {
      try {
        const transcriptText = turnHistory.map(t => `${t.speaker.toUpperCase()}: "${t.transcript}"`).join('\n');
        const prompt = `
          You are an AI workforce evaluation engine for BloomingPath.
          Evaluate the Individual's performance in this workplace simulation.

          Scenario Context:
          ${simulationContext}

          Transcript:
          ${transcriptText}

          Evaluate against 6 rubric dimensions:
          1. communication: clear, understandable, polite, acknowledges customer constraint
          2. problem_solving: identifies schedule conflict, proposes practical alternative (e.g. 11:30 or alternative day)
          3. judgement: does not promise unavailable 10am slot, recognizes when info is required
          4. professionalism: polite tone under customer pressure
          5. attention_to_detail: accurately references schedule details (10am occupied, 11:30 available)
          6. following_instructions: stays within administrative role and uses scenario facts

          CRITICAL EVALUATION RULES:
          - Evaluate strictly based on what the Individual ACTUALLY said in the transcript.
          - If the Individual provided off-topic, nonsensical, or inappropriate responses (e.g., "I want to sleep", "yes 10:00 is free" when 10:00 is occupied), you MUST mark those capabilities as 'developing' or 'insufficient_evidence'.
          - Calculate overall_signal based on capability results:
            - 'demonstrated' ONLY if at least 4 out of 6 capabilities are 'demonstrated'.
            - 'developing' if 2 or 3 capabilities are 'demonstrated' or if responses are partial.
            - 'insufficient_evidence' if responses are nonsensical, off-topic, or empty.

          Assessment States allowed ONLY: "demonstrated", "developing", "insufficient_evidence"

          Return valid JSON:
          {
            "capabilities": [
              {
                "capability": "communication",
                "assessment": "developing",
                "evidence": ["Stated 'I want to sleep' during caller interaction"],
                "rationale": "Response was inappropriate and off-topic for a customer service call.",
                "confidence": "high"
              },
              {
                "capability": "problem_solving",
                "assessment": "insufficient_evidence",
                "evidence": ["Did not attempt to resolve caller schedule request"],
                "rationale": "Failed to offer alternative appointment times.",
                "confidence": "high"
              },
              {
                "capability": "judgement",
                "assessment": "developing",
                "evidence": ["Told caller 10:00 is free when schedule shows it is occupied"],
                "rationale": "Incorrectly promised an unavailable appointment slot.",
                "confidence": "high"
              },
              {
                "capability": "professionalism",
                "assessment": "developing",
                "evidence": ["Unprofessional response during caller request"],
                "rationale": "Did not maintain customer service standards.",
                "confidence": "high"
              },
              {
                "capability": "attention_to_detail",
                "assessment": "insufficient_evidence",
                "evidence": ["Failed to verify existing schedule"],
                "rationale": "Ignored schedule conflict details.",
                "confidence": "high"
              },
              {
                "capability": "following_instructions",
                "assessment": "developing",
                "evidence": ["Did not follow administrative assistant guidelines"],
                "rationale": "Deviated from assigned workplace role.",
                "confidence": "high"
              }
            ],
            "overall_summary": "The Individual provided off-topic and inaccurate responses during the scheduling simulation, requiring further development.",
            "overall_signal": "developing"
          }
        `;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        const data = await res.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
          // Recalculate overall_signal strictly
          const demonstratedCount = parsed.capabilities.filter(c => c.assessment === 'demonstrated').length;
          parsed.overall_signal = demonstratedCount >= 4 ? 'demonstrated' : demonstratedCount >= 2 ? 'developing' : 'insufficient_evidence';
          return parsed;
        }
      } catch (err) {
        console.warn('Live AI evaluation failed, using deterministic rubric evaluation:', err.message);
      }
    }

    // Deterministic Rubric Evaluation based on transcript analysis
    const individualTurns = turnHistory.filter(t => t.speaker === 'individual');
    const fullText = individualTurns.map(t => t.transcript.toLowerCase()).join(' ');

    const isNonsense = fullText.includes('sleep') || fullText.includes('rubbish') || fullText.includes('banana') || fullText.length < 5;
    const promisesOccupiedSlot = fullText.includes('10:00 is free') || fullText.includes('10 is free') || fullText.includes('yes 10');
    const acknowledgesConstraint = fullText.includes('11:30') || fullText.includes('booked') || fullText.includes('taken') || fullText.includes('full') || fullText.includes('conflict');
    const offersAlternative = fullText.includes('11:30') || fullText.includes('alternative') || fullText.includes('another day');
    const isPolite = fullText.includes('understand') || fullText.includes('help') || fullText.includes('please') || fullText.includes('thank');

    let commState = 'developing';
    let probState = 'insufficient_evidence';
    let judgeState = 'developing';
    let profState = 'developing';
    let detailState = 'insufficient_evidence';
    let followState = 'developing';

    let commRationale = "Response lacked clear professional structure.";
    let probRationale = "Did not resolve scheduling conflict.";
    let judgeRationale = "Incorrectly promised an occupied time slot or gave off-topic response.";

    if (isNonsense) {
      commState = 'developing';
      commRationale = "Off-topic or nonsensical response ('" + fullText + "') expressed during caller dialogue.";
      probState = 'insufficient_evidence';
      probRationale = "Failed to provide scheduling assistance.";
      judgeState = 'developing';
      judgeRationale = "Unprofessional response given during caller inquiry.";
    } else if (promisesOccupiedSlot) {
      commState = 'developing';
      commRationale = "Promised caller an occupied slot without checking schedule constraints.";
      judgeState = 'developing';
      judgeRationale = "Told caller 10:00 was free when schedule shows Sarah Ahmed and James Wilson booked.";
    } else if (acknowledgesConstraint && offersAlternative) {
      commState = 'demonstrated';
      commRationale = "Clearly explained 10:00 constraint and offered 11:30 alternative.";
      probState = 'demonstrated';
      probRationale = "Identified conflict and offered practical schedule alternative.";
      judgeState = 'demonstrated';
      judgeRationale = "Resisted double-booking occupied time slot.";
      profState = 'demonstrated';
      detailState = 'demonstrated';
      followState = 'demonstrated';
    }

    const capabilities = [
      { capability: "communication", assessment: commState, evidence: [isNonsense ? "Off-topic response" : "Communicated with caller"], rationale: commRationale, confidence: "high" },
      { capability: "problem_solving", assessment: probState, evidence: [offersAlternative ? "Offered 11:30 slot" : "Did not resolve conflict"], rationale: probRationale, confidence: "high" },
      { capability: "judgement", assessment: judgeState, evidence: [promisesOccupiedSlot ? "Promised 10:00 slot" : "Handled schedule request"], rationale: judgeRationale, confidence: "high" },
      { capability: "professionalism", assessment: profState, evidence: [isPolite ? "Polite language" : "Inappropriate response"], rationale: isPolite ? "Maintained polite tone." : "Lacked customer service standards.", confidence: "high" },
      { capability: "attention_to_detail", assessment: detailState, evidence: [acknowledgesConstraint ? "Verified 10:00 conflict" : "Ignored schedule conflict"], rationale: acknowledgesConstraint ? "Accurately checked schedule." : "Failed to verify schedule availability.", confidence: "medium" },
      { capability: "following_instructions", assessment: followState, evidence: [followState === 'demonstrated' ? "Followed role" : "Deviated from role"], rationale: followState === 'demonstrated' ? "Operated within administrative assistant role." : "Deviated from scenario requirements.", confidence: "high" }
    ];

    const demonstratedCount = capabilities.filter(c => c.assessment === 'demonstrated').length;
    const overallSignal = demonstratedCount >= 4 ? 'demonstrated' : demonstratedCount >= 2 ? 'developing' : 'insufficient_evidence';

    return {
      capabilities,
      overall_summary: isNonsense
        ? "The Individual provided off-topic and inappropriate responses during the simulation, requiring further capability development."
        : promisesOccupiedSlot
        ? "The Individual promised an unavailable appointment time slot without resolving schedule constraints."
        : "The Individual demonstrated strong workplace communication and problem solving during the scheduling conflict.",
      overall_signal: overallSignal
    };
  }
}

export const aiProvider = new AIProvider();
