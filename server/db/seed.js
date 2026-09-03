import { runQuery, getQuery, initDatabase } from './database.js';

// ============================================================
// PATHWAY DEFINITIONS — 5 tracks for foreigners in the UK
// ============================================================
const PATHWAYS = [
  {
    id: 'pathway-admin-asst',
    name: 'Administrative Assistant',
    description: 'Prepares individuals for administrative, scheduling, customer contact, and office operations roles in UK workplaces.',
    icon: 'admin_panel_settings',
    color: 'blue'
  },
  {
    id: 'pathway-health-support',
    name: 'Health & Social Care Support',
    description: 'Prepares individuals for care assistant, healthcare support worker, and NHS porter roles in hospitals, care homes, and community settings.',
    icon: 'health_and_safety',
    color: 'green'
  },
  {
    id: 'pathway-retail-customer',
    name: 'Retail & Customer Service',
    description: 'Prepares individuals for retail assistant, till operator, stock room, and customer-facing service roles in UK shops and supermarkets.',
    icon: 'storefront',
    color: 'orange'
  },
  {
    id: 'pathway-hospitality',
    name: 'Hospitality & Catering Assistant',
    description: 'Prepares individuals for hotel front-of-house, restaurant service, kitchen assistant, and catering support roles in the UK hospitality sector.',
    icon: 'restaurant',
    color: 'purple'
  },
  {
    id: 'pathway-cleaning-fm',
    name: 'Cleaning & Facilities Management',
    description: 'Prepares individuals for commercial cleaning operative, building services assistant, and facilities support roles in offices, hospitals, and public buildings.',
    icon: 'cleaning_services',
    color: 'teal'
  }
];

// ============================================================
// SIMULATION DEFINITIONS — 1 per track
// ============================================================
const SIMULATIONS = [
  {
    id: 'sim-appointment-scheduling',
    pathway_id: 'pathway-admin-asst',
    title: 'Administrative Assistant — Appointment Scheduling',
    description: 'Handle a caller appointment modification request while managing schedule constraints.',
    scenario_context: 'You are supporting an office administrator. Your role involves handling appointment requests, updating schedules and communicating professionally with customers and colleagues. Current Schedule: 09:00 Team meeting, 10:00 Sarah Ahmed, 10:00 James Wilson, 11:30 Michael Brown, 14:00 Priya Shah. Michael Brown calls and asks whether his appointment can be moved to 10:00.'
  },
  {
    id: 'sim-care-handover',
    pathway_id: 'pathway-health-support',
    title: 'Health & Social Care — Patient Handover Communication',
    description: 'Communicate a patient care update clearly and professionally to an incoming colleague during a shift handover.',
    scenario_context: 'You are a healthcare support worker at Meadowbrook Care Home. It is 7:00am and you are handing over to the day shift. Resident Mrs. Eleanor Davies (Room 14) had a difficult night — she woke at 2am distressed, refused her evening medication, and her blood pressure reading was slightly elevated at 145/92. She has settled now and eaten a light breakfast. The incoming care assistant (Janet) needs a clear, calm handover so she can monitor Mrs. Davies appropriately and flag to the nurse. You must communicate the situation clearly, calmly, and professionally.'
  },
  {
    id: 'sim-retail-complaint',
    pathway_id: 'pathway-retail-customer',
    title: 'Retail & Customer Service — Handling a Complaint',
    description: 'Handle a customer complaint about a faulty product while following store policy.',
    scenario_context: 'You are a retail assistant at FreshMart supermarket. A customer, Mr. David Clarke, approaches the customer service desk. He is visibly frustrated because he bought a pack of strawberries two days ago that were mouldy when he opened them at home. He has the receipt but not the product. Store policy: Offer a full refund or replacement for perishables within 7 days with receipt, no product required. You must de-escalate the situation, follow store policy, and resolve the complaint professionally.'
  },
  {
    id: 'sim-hotel-checkin',
    pathway_id: 'pathway-hospitality',
    title: 'Hospitality — Hotel Check-In with a Special Request',
    description: 'Check in a guest and handle an unexpected room upgrade request professionally.',
    scenario_context: 'You are a front-of-house assistant at The Kensington Grand Hotel. A guest, Ms. Priya Sharma, arrives to check in. Her reservation is for a standard double room (Room 204) for 2 nights. However, she mentions she is celebrating her wedding anniversary and politely asks if there is any possibility of an upgrade. The hotel is currently at 90% capacity. One superior room (Room 312) is available and could be offered at an additional £40/night, or you can offer a complimentary late checkout instead. You must check her in smoothly, handle the upgrade conversation professionally, and ensure she feels welcomed.'
  },
  {
    id: 'sim-cleaning-incident',
    pathway_id: 'pathway-cleaning-fm',
    title: 'Cleaning & Facilities — Reporting a Safety Incident',
    description: 'Identify and correctly report a health and safety hazard discovered during a cleaning round.',
    scenario_context: 'You are a cleaning operative at Meridian Office Park. During your morning cleaning round on the 3rd floor, you discover a broken ceiling tile has fallen and left sharp debris on the floor near the photocopier area. Several members of staff are due to arrive within 30 minutes. Your supervisor, Kevin, is on site but currently on a call. You must: correctly isolate the hazard area, communicate the incident to your supervisor clearly, and ensure the area is made safe before staff arrive. The simulated conversation is with your supervisor Kevin, who you need to brief on the situation.'
  }
];

export async function seedDatabase() {
  await initDatabase();

  // ── 1. Seed all 5 Pathways ──────────────────────────────────
  for (const pathway of PATHWAYS) {
    const existing = await getQuery('SELECT id FROM pathways WHERE id = ?', [pathway.id]);
    if (!existing) {
      await runQuery(
        `INSERT INTO pathways (id, name, description, active) VALUES (?, ?, ?, 1)`,
        [pathway.id, pathway.name, pathway.description]
      );
      console.log(`[SEED] Pathway created: ${pathway.name}`);
    }
  }

  // ── 2. Seed all 5 Simulations ───────────────────────────────
  for (const sim of SIMULATIONS) {
    const existing = await getQuery('SELECT id FROM simulations WHERE id = ?', [sim.id]);
    if (!existing) {
      await runQuery(
        `INSERT INTO simulations (id, pathway_id, title, description, scenario_context, active) VALUES (?, ?, ?, ?, ?, 1)`,
        [sim.id, sim.pathway_id, sim.title, sim.description, sim.scenario_context]
      );
      console.log(`[SEED] Simulation created: ${sim.title}`);
    }
  }

  // ── 3. Primary Individual: Amina Hassan (Admin pathway) ─────
  let amina = await getQuery('SELECT * FROM individuals WHERE email = ?', ['amina.hassan@example.com']);
  if (!amina) {
    await runQuery(
      `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language, availability, employment_interests, previous_work_exposure, digital_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['ind-amina-hassan', 'REF-8842', 'Amina Hassan', 'amina.hassan@example.com', 'en', 'immediate', 'administration', 'yes', 'moderate']
    );
    amina = await getQuery('SELECT * FROM individuals WHERE email = ?', ['amina.hassan@example.com']);
  }

  const aminaProfile = await getQuery('SELECT * FROM readiness_profiles WHERE individual_id = ?', [amina.id]);
  if (!aminaProfile) {
    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version) VALUES (?, ?, ?, 'demonstrated', 'v1.0')`,
      ['prof-amina', amina.id, 'pathway-admin-asst']
    );

    const aminaCaps = [
      { name: 'communication', state: 'demonstrated', confidence: 'high' },
      { name: 'problem_solving', state: 'demonstrated', confidence: 'high' },
      { name: 'judgement', state: 'demonstrated', confidence: 'medium' },
      { name: 'professionalism', state: 'demonstrated', confidence: 'high' },
      { name: 'attention_to_detail', state: 'developing', confidence: 'medium' },
      { name: 'following_instructions', state: 'demonstrated', confidence: 'high' }
    ];
    for (const c of aminaCaps) {
      await runQuery(
        `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence) VALUES (?, ?, ?, ?, 2, ?)`,
        [`sig-amina-${c.name}`, amina.id, c.name, c.state, c.confidence]
      );
    }

    await runQuery(
      `INSERT INTO simulation_sessions (id, individual_id, simulation_id, status) VALUES (?, ?, ?, 'completed')`,
      ['simses-amina-01', amina.id, 'sim-appointment-scheduling']
    );
    await runQuery(
      `INSERT INTO assessments (id, simulation_session_id, status, overall_signal, summary) VALUES (?, ?, 'completed', 'demonstrated', 'Demonstrated strong communication, conflict resolution, and calm professionalism during appointment scheduling simulation.')`,
      ['asm-amina-01', 'simses-amina-01']
    );

    const aminaEvidence = [
      {
        id: 'EV-00017', cap: 'problem_solving',
        obs: 'Identified scheduling conflict at 10:00 and proposed alternative 11:30 slot.',
        text: 'Identified that the requested 10:00 appointment was unavailable and proposed an alternative slot at 11:30.',
        state: 'demonstrated', conf: 'high',
        rationale: 'Recognized double-booking risk and offered practical schedule alternative.'
      },
      {
        id: 'EV-00018', cap: 'communication',
        obs: 'Acknowledged customer request politely and explained constraint clearly.',
        text: 'I understand you need 10am, but that time is already booked. I can offer 11:30 instead.',
        state: 'demonstrated', conf: 'high',
        rationale: 'Maintained polite customer service tone while standing firm on appointment schedule constraints.'
      },
      {
        id: 'EV-00019', cap: 'professionalism',
        obs: 'Responded calmly when customer expressed frustration.',
        text: 'Maintained polite demeanor when customer pressed for unavailable time slot.',
        state: 'demonstrated', conf: 'high',
        rationale: 'Used respectful language under customer pressure.'
      }
    ];
    for (const ev of aminaEvidence) {
      await runQuery(
        `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
         VALUES (?, 'asm-amina-01', ?, 'simses-amina-01', ?, ?, ?, ?, ?, ?)`,
        [ev.id, amina.id, ev.cap, ev.obs, ev.text, ev.state, ev.conf, ev.rationale]
      );
    }
  }

  // ── 4. Secondary Candidate: Maria Garcia (Retail pathway) ───
  let maria = await getQuery('SELECT * FROM individuals WHERE email = ?', ['maria.garcia@example.com']);
  if (!maria) {
    await runQuery(
      `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language, availability, employment_interests, previous_work_exposure, digital_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['ind-maria-garcia', 'REF-7721', 'Maria Garcia', 'maria.garcia@example.com', 'en', 'within_2_weeks', 'retail', 'yes', 'high']
    );
    maria = await getQuery('SELECT * FROM individuals WHERE email = ?', ['maria.garcia@example.com']);

    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version) VALUES ('prof-maria', ?, 'pathway-retail-customer', 'demonstrated', 'v1.0')`,
      [maria.id]
    );
    await runQuery(
      `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence) VALUES ('sig-maria-comm', ?, 'communication', 'demonstrated', 1, 'high')`,
      [maria.id]
    );
    await runQuery(
      `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
       VALUES ('EV-00021', 'asm-maria-01', ?, 'simses-maria-01', 'communication', 'De-escalated anxious customer inquiry', 'Handled scheduling update calmly and verified details.', 'demonstrated', 'high', 'Clear communication during caller inquiry.')`,
      [maria.id]
    );
  }

  // ── 5. Tertiary Candidate: Fatima Zahra (Health pathway) ────
  let fatima = await getQuery('SELECT * FROM individuals WHERE email = ?', ['fatima.zahra@example.com']);
  if (!fatima) {
    await runQuery(
      `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language, availability, employment_interests, previous_work_exposure, digital_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['ind-fatima-zahra', 'REF-9903', 'Fatima Zahra', 'fatima.zahra@example.com', 'en', 'immediate', 'care', 'no', 'moderate']
    );
    fatima = await getQuery('SELECT * FROM individuals WHERE email = ?', ['fatima.zahra@example.com']);

    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version) VALUES ('prof-fatima', ?, 'pathway-health-support', 'developing', 'v1.0')`,
      [fatima.id]
    );
    await runQuery(
      `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence) VALUES ('sig-fatima-ps', ?, 'problem_solving', 'developing', 1, 'medium')`,
      [fatima.id]
    );
    await runQuery(
      `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
       VALUES ('EV-00022', 'asm-fatima-01', ?, 'simses-fatima-01', 'problem_solving', 'Identified care handover information gap', 'Noted incomplete patient notes during shift handover.', 'developing', 'medium', 'Needs further practice structuring care handover communication.')`,
      [fatima.id]
    );
  }

  console.log('[SEED] Database seeded successfully — 5 pathways, 5 simulations ready.');
}
