import express from 'express';
import { runQuery, getQuery, allQuery } from '../db/database.js';
import { aiProvider } from '../services/aiProvider.js';

const router = express.Router();

// Helper to generate IDs
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

// ============================================================
// 1. INDIVIDUALS
// ============================================================
router.post('/individuals', async (req, res) => {
  try {
    const { email, display_name, preferred_language = 'en' } = req.body;
    let individual = await getQuery('SELECT * FROM individuals WHERE email = ?', [email]);

    if (!individual) {
      const id = uid('ind');
      await runQuery(
        `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language)
         VALUES (?, ?, ?, ?, ?)`,
        [id, `REF-${Math.floor(1000 + Math.random() * 9000)}`, display_name || 'New User', email, preferred_language]
      );
      individual = await getQuery('SELECT * FROM individuals WHERE id = ?', [id]);
      console.log(`[INDIVIDUALS] Created new individual: ${email} (${id})`);
    } else {
      console.log(`[INDIVIDUALS] Found existing individual: ${email} (${individual.id})`);
    }

    res.json(individual);
  } catch (err) {
    console.error('[INDIVIDUALS] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/individuals/:id', async (req, res) => {
  try {
    const individual = await getQuery('SELECT * FROM individuals WHERE id = ?', [req.params.id]);
    if (!individual) return res.status(404).json({ error: 'Individual not found' });
    res.json(individual);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 2. ONBOARDING
// ============================================================
router.post('/onboarding/sessions', async (req, res) => {
  try {
    const { individual_id } = req.body;
    const sessionId = uid('onb');
    await runQuery(
      `INSERT INTO onboarding_sessions (id, individual_id, status) VALUES (?, ?, 'in_progress')`,
      [sessionId, individual_id]
    );
    const session = await getQuery('SELECT * FROM onboarding_sessions WHERE id = ?', [sessionId]);
    console.log(`[ONBOARDING] Session started: ${sessionId} for individual ${individual_id}`);
    res.json(session);
  } catch (err) {
    console.error('[ONBOARDING] Session creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/onboarding/sessions/:id/interactions', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { individual_id, modality, prompt, raw_input, transcript } = req.body;
    const interactionId = uid('int');

    await runQuery(
      `INSERT INTO interactions (id, individual_id, session_id, modality, prompt, raw_input, transcript)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [interactionId, individual_id, sessionId, modality || 'voice', prompt, raw_input, transcript]
    );

    console.log(`[ONBOARDING] Interaction recorded: q="${prompt?.substring(0, 50)}" answer="${transcript?.substring(0, 60)}"`);
    const interaction = await getQuery('SELECT * FROM interactions WHERE id = ?', [interactionId]);
    res.json(interaction);
  } catch (err) {
    console.error('[ONBOARDING] Interaction recording error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// NEW: Per-answer real-time AI feedback
router.post('/onboarding/ai-feedback', async (req, res) => {
  try {
    const { question, answer, question_index = 0 } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'question and answer are required' });
    }

    console.log(`[ONBOARDING AI-FEEDBACK] Q${question_index + 1}: "${answer?.substring(0, 80)}"`);
    const feedback = await aiProvider.getOnboardingFeedback(question, answer, question_index);
    console.log(`[ONBOARDING AI-FEEDBACK] redirect_needed=${feedback.redirect_needed} tentative_track=${feedback.tentative_track_name}`);
    res.json(feedback);
  } catch (err) {
    console.error('[ONBOARDING AI-FEEDBACK] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/onboarding/sessions/:id/complete', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await getQuery('SELECT * FROM onboarding_sessions WHERE id = ?', [sessionId]);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const interactions = await allQuery(
      'SELECT * FROM interactions WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );

    console.log(`[ONBOARDING] Completing session ${sessionId} with ${interactions.length} interactions — calling AI...`);

    // AI Extraction — now returns pathway_id directly
    const extractedSignals = await aiProvider.extractOnboardingSignals(interactions);

    console.log(`[ONBOARDING] AI assigned pathway: ${extractedSignals.assigned_pathway} (${extractedSignals.assigned_pathway_id})`);

    // Update session status
    await runQuery(
      'UPDATE onboarding_sessions SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', sessionId]
    );

    // Update Individual profile fields
    await runQuery(
      `UPDATE individuals SET
       availability = ?,
       employment_interests = ?,
       previous_work_exposure = ?,
       digital_confidence = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        extractedSignals.availability,
        extractedSignals.preferred_role_area,
        extractedSignals.prior_work_exposure ? 'yes' : 'no',
        extractedSignals.digital_confidence,
        session.individual_id
      ]
    );

    // Get Pathway — use assigned_pathway_id first, fall back to name match
    let pathway = null;
    if (extractedSignals.assigned_pathway_id) {
      pathway = await getQuery('SELECT * FROM pathways WHERE id = ?', [extractedSignals.assigned_pathway_id]);
    }
    if (!pathway && extractedSignals.assigned_pathway) {
      pathway = await getQuery('SELECT * FROM pathways WHERE name = ?', [extractedSignals.assigned_pathway]);
    }
    if (!pathway) {
      pathway = await getQuery('SELECT * FROM pathways LIMIT 1');
      console.warn(`[ONBOARDING] Pathway not found for "${extractedSignals.assigned_pathway_id}" — defaulting to first pathway`);
    }

    console.log(`[ONBOARDING] Pathway resolved: ${pathway.name} (${pathway.id})`);

    // Delete any existing readiness profile for this individual (re-assign on re-onboarding)
    await runQuery('DELETE FROM readiness_profiles WHERE individual_id = ?', [session.individual_id]);

    // Create Readiness Profile
    const profileId = uid('prof');
    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version)
       VALUES (?, ?, ?, ?, 'v1.0')`,
      [profileId, session.individual_id, pathway.id, 'developing']
    );

    console.log(`[ONBOARDING] Readiness profile created: ${profileId}`);

    res.json({
      session_id: sessionId,
      individual_id: session.individual_id,
      extracted_signals: extractedSignals,
      assigned_pathway: pathway,
      pathway_alignment: {
        pathway_name: pathway.name,
        reasons: extractedSignals.pathway_alignment_reasons
      }
    });
  } catch (err) {
    console.error('[ONBOARDING] Complete session error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 3. PATHWAYS
// ============================================================
router.get('/pathways', async (req, res) => {
  try {
    const pathways = await allQuery('SELECT * FROM pathways WHERE active = 1');
    console.log(`[PATHWAYS] Returning ${pathways.length} active pathways`);
    res.json(pathways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pathways/assign', async (req, res) => {
  try {
    const { individual_id, pathway_id } = req.body;
    const pathway = await getQuery('SELECT * FROM pathways WHERE id = ?', [pathway_id]);
    if (!pathway) return res.status(404).json({ error: 'Pathway not found' });

    let profile = await getQuery(
      'SELECT * FROM readiness_profiles WHERE individual_id = ? AND pathway_id = ?',
      [individual_id, pathway_id]
    );
    if (!profile) {
      const profileId = uid('prof');
      await runQuery(
        `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal) VALUES (?, ?, ?, 'developing')`,
        [profileId, individual_id, pathway_id]
      );
      profile = await getQuery('SELECT * FROM readiness_profiles WHERE id = ?', [profileId]);
    }

    res.json({ profile, pathway });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 4. SIMULATIONS
// ============================================================

// Get simulation for a specific pathway
router.get('/simulations/by-pathway/:pathway_id', async (req, res) => {
  try {
    const simulation = await getQuery(
      'SELECT * FROM simulations WHERE pathway_id = ? AND active = 1',
      [req.params.pathway_id]
    );
    if (!simulation) return res.status(404).json({ error: 'No simulation found for this pathway' });
    res.json(simulation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/simulations/sessions', async (req, res) => {
  try {
    const { individual_id, simulation_id } = req.body;
    const sessionId = uid('simses');
    await runQuery(
      `INSERT INTO simulation_sessions (id, individual_id, simulation_id, status) VALUES (?, ?, ?, 'in_progress')`,
      [sessionId, individual_id, simulation_id]
    );

    const session = await getQuery('SELECT * FROM simulation_sessions WHERE id = ?', [sessionId]);
    const simulation = await getQuery('SELECT * FROM simulations WHERE id = ?', [simulation_id]);
    console.log(`[SIMULATION] Session started: ${sessionId} for simulation "${simulation?.title}"`);
    res.json({ session, simulation });
  } catch (err) {
    console.error('[SIMULATION] Session start error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/simulations/sessions/:id/turns', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { turn_number, input_modality = 'voice', transcript } = req.body;

    const session = await getQuery('SELECT * FROM simulation_sessions WHERE id = ?', [sessionId]);
    if (!session) return res.status(404).json({ error: 'Simulation session not found' });

    const simulation = await getQuery('SELECT * FROM simulations WHERE id = ?', [session.simulation_id]);

    // Record Individual's turn
    const turnId = uid('turn');
    await runQuery(
      `INSERT INTO simulation_turns (id, simulation_session_id, turn_number, speaker, input_modality, transcript)
       VALUES (?, ?, ?, 'individual', ?, ?)`,
      [turnId, sessionId, turn_number, input_modality, transcript]
    );

    console.log(`[SIMULATION] Turn ${turn_number} recorded: "${transcript?.substring(0, 80)}"`);

    // Fetch full turn history
    const history = await allQuery(
      'SELECT * FROM simulation_turns WHERE simulation_session_id = ? ORDER BY turn_number ASC',
      [sessionId]
    );

    // AI Generates Customer/Colleague Response
    const aiResponse = await aiProvider.generateSimulationResponse(simulation.scenario_context, history);
    console.log(`[SIMULATION] AI response (state=${aiResponse.conversation_state}): "${aiResponse.message?.substring(0, 80)}"`);

    // Record AI's turn
    const aiTurnId = uid('turn');
    await runQuery(
      `INSERT INTO simulation_turns (id, simulation_session_id, turn_number, speaker, input_modality, transcript)
       VALUES (?, ?, ?, 'simulated_customer', 'text', ?)`,
      [aiTurnId, sessionId, turn_number + 1, aiResponse.message]
    );

    res.json({
      individual_turn_id: turnId,
      ai_response: aiResponse,
      turn_number: turn_number + 1
    });
  } catch (err) {
    console.error('[SIMULATION] Turn error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/simulations/sessions/:id/evaluate', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await getQuery('SELECT * FROM simulation_sessions WHERE id = ?', [sessionId]);
    if (!session) return res.status(404).json({ error: 'Simulation session not found' });

    const simulation = await getQuery('SELECT * FROM simulations WHERE id = ?', [session.simulation_id]);
    const history = await allQuery(
      'SELECT * FROM simulation_turns WHERE simulation_session_id = ? ORDER BY turn_number ASC',
      [sessionId]
    );

    console.log(`[SIMULATION] Evaluating session ${sessionId} (${history.length} turns) — calling AI...`);

    // Run AI Evaluation
    const evalResult = await aiProvider.evaluateSimulation(simulation.scenario_context, history);
    console.log(`[SIMULATION] Evaluation complete: overall_signal=${evalResult.overall_signal}`);

    // Create Assessment record
    const assessmentId = uid('asm');
    await runQuery(
      `INSERT INTO assessments (id, simulation_session_id, status, overall_signal, summary)
       VALUES (?, ?, 'completed', ?, ?)`,
      [assessmentId, sessionId, evalResult.overall_signal, evalResult.overall_summary]
    );

    // Generate Evidence Records and Capability Signals
    for (const cap of evalResult.capabilities) {
      const evidenceId = uid('ev');
      const evidenceText = cap.evidence.join('; ');

      await runQuery(
        `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [evidenceId, assessmentId, session.individual_id, sessionId,
          cap.capability, cap.evidence[0] || 'Observable workplace behaviour demonstrated during scenario', evidenceText,
          cap.assessment, cap.confidence || 'medium', cap.rationale]
      );

      const existingSignal = await getQuery(
        'SELECT * FROM capability_signals WHERE individual_id = ? AND capability = ?',
        [session.individual_id, cap.capability]
      );

      if (existingSignal) {
        await runQuery(
          `UPDATE capability_signals SET state = ?, evidence_count = evidence_count + 1, confidence = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [cap.assessment, cap.confidence || 'medium', existingSignal.id]
        );
      } else {
        const signalId = uid('sig');
        await runQuery(
          `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence) VALUES (?, ?, ?, ?, 1, ?)`,
          [signalId, session.individual_id, cap.capability, cap.assessment, cap.confidence || 'medium']
        );
      }
    }

    // Mark Simulation Session Completed
    await runQuery(
      'UPDATE simulation_sessions SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', sessionId]
    );

    // Update Readiness Profile
    const signals = await allQuery('SELECT * FROM capability_signals WHERE individual_id = ?', [session.individual_id]);
    const demonstratedCount = signals.filter(s => s.state === 'demonstrated').length;
    const overallSignal = demonstratedCount >= 4 ? 'demonstrated' : demonstratedCount >= 2 ? 'developing' : 'insufficient_evidence';

    await runQuery(
      `UPDATE readiness_profiles SET overall_signal = ?, updated_at = CURRENT_TIMESTAMP WHERE individual_id = ?`,
      [overallSignal, session.individual_id]
    );

    console.log(`[SIMULATION] Readiness profile updated: overall_signal=${overallSignal}`);

    const assessment = await getQuery('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
    const evidence = await allQuery('SELECT * FROM evidence_records WHERE assessment_id = ?', [assessmentId]);

    res.json({ assessment, evaluation: evalResult, evidence });
  } catch (err) {
    console.error('[SIMULATION] Evaluation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 5. EVIDENCE & READINESS
// ============================================================
router.get('/individuals/:id/evidence', async (req, res) => {
  try {
    const evidence = await allQuery(
      `SELECT e.*, s.title as simulation_title
       FROM evidence_records e
       LEFT JOIN simulation_sessions ss ON e.simulation_session_id = ss.id
       LEFT JOIN simulations s ON ss.simulation_id = s.id
       WHERE e.individual_id = ?
       ORDER BY e.created_at DESC`,
      [req.params.id]
    );
    res.json(evidence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/individuals/:id/readiness', async (req, res) => {
  try {
    const individualId = req.params.id;
    const individual = await getQuery(
      'SELECT id, display_name, email, preferred_language, availability, employment_interests, digital_confidence FROM individuals WHERE id = ?',
      [individualId]
    );
    if (!individual) return res.status(404).json({ error: 'Individual not found' });

    const profile = await getQuery(
      `SELECT rp.*, p.name as pathway_name, p.description as pathway_description, p.id as pathway_id
       FROM readiness_profiles rp
       JOIN pathways p ON rp.pathway_id = p.id
       WHERE rp.individual_id = ?`,
      [individualId]
    );

    const signals = await allQuery('SELECT * FROM capability_signals WHERE individual_id = ?', [individualId]);
    const evidence = await allQuery(
      'SELECT * FROM evidence_records WHERE individual_id = ? ORDER BY created_at DESC',
      [individualId]
    );

    res.json({
      individual,
      readiness_profile: profile,
      capability_signals: signals,
      evidence_count: evidence.length,
      evidence_summary: evidence.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// 6. EMPLOYER ENDPOINTS (Privacy Controlled)
// ============================================================
router.get('/employer/individuals', async (req, res) => {
  try {
    const individuals = await allQuery(`
      SELECT i.id, i.display_name, i.external_reference, i.availability, i.digital_confidence,
             rp.overall_signal, p.name as pathway_name, p.id as pathway_id
      FROM individuals i
      LEFT JOIN readiness_profiles rp ON i.id = rp.individual_id
      LEFT JOIN pathways p ON rp.pathway_id = p.id
    `);

    const candidates = await Promise.all(
      individuals.map(async (ind) => {
        const signals = await allQuery(
          'SELECT capability, state, confidence FROM capability_signals WHERE individual_id = ?',
          [ind.id]
        );
        const evidenceCount = (await getQuery(
          'SELECT COUNT(*) as cnt FROM evidence_records WHERE individual_id = ?',
          [ind.id]
        )).cnt;

        return {
          id: ind.id,
          alias: ind.display_name,
          external_reference: ind.external_reference,
          pathway: ind.pathway_name || 'Pathway Not Assigned',
          pathway_id: ind.pathway_id,
          overall_signal: ind.overall_signal || 'developing',
          digital_confidence: ind.digital_confidence || 'moderate',
          availability: ind.availability || 'immediate',
          capability_signals: signals,
          evidence_count: evidenceCount
        };
      })
    );

    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/employer/individuals/:id', async (req, res) => {
  try {
    const individualId = req.params.id;
    const ind = await getQuery(
      'SELECT id, display_name, external_reference, availability, digital_confidence FROM individuals WHERE id = ?',
      [individualId]
    );
    if (!ind) return res.status(404).json({ error: 'Individual not found' });

    const profile = await getQuery(
      `SELECT rp.*, p.name as pathway_name
       FROM readiness_profiles rp
       JOIN pathways p ON rp.pathway_id = p.id
       WHERE rp.individual_id = ?`,
      [individualId]
    );

    const signals = await allQuery(
      'SELECT capability, state, confidence, evidence_count FROM capability_signals WHERE individual_id = ?',
      [individualId]
    );

    // Privacy model: no raw transcripts exposed
    const evidenceSummaries = await allQuery(
      `SELECT id, capability, observable_behaviour, evidence_text, assessment_state, confidence, created_at
       FROM evidence_records WHERE individual_id = ? ORDER BY created_at DESC`,
      [individualId]
    );

    res.json({
      individual: {
        id: ind.id,
        alias: ind.display_name,
        external_reference: ind.external_reference,
        availability: ind.availability,
        digital_confidence: ind.digital_confidence
      },
      readiness_profile: profile,
      capability_signals: signals,
      evidence_records: evidenceSummaries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
