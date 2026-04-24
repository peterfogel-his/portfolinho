import type { PortfolioTemplate, StudentPortfolio } from '@/types/portfolinho'

export const mockTemplate: PortfolioTemplate = {
  id: 'tmpl-01',
  title: 'Musikproduktion — Portfoliokurs',
  course: 'MUS301',
  semester: 'HT 2026',
  rubric: {
    id: 'rubric-01',
    title: 'Bedömningsmatris',
    source: 'portfolinho',
    criteria: [
      {
        id: 'c1',
        title: 'Musikaliskt hantverk',
        description: 'Teknisk skicklighet och konstnärligt uttryck i produktionen',
        ratings: [
          { points: 4, label: 'Excellent',      description: 'Visar avancerat hantverk med tydlig konstnärlig röst' },
          { points: 3, label: 'Väl godkänt',    description: 'Solida tekniska färdigheter med personligt uttryck' },
          { points: 2, label: 'Godkänt',         description: 'Grundläggande teknisk kompetens uppnådd' },
          { points: 1, label: 'Ej godkänt',      description: 'Tekniska brister som påverkar slutresultatet' },
        ],
      },
      {
        id: 'c2',
        title: 'Reflektion och lärande',
        description: 'Förmåga att reflektera kring sin konstnärliga process',
        ratings: [
          { points: 4, label: 'Excellent',      description: 'Djupgående, kritisk och framåtblickande reflektion' },
          { points: 3, label: 'Väl godkänt',    description: 'Genomtänkt reflektion med konkreta insikter' },
          { points: 2, label: 'Godkänt',         description: 'Grundläggande reflektion över processen' },
          { points: 1, label: 'Ej godkänt',      description: 'Ytlig eller saknad reflektion' },
        ],
      },
      {
        id: 'c3',
        title: 'Samarbete och peer-feedback',
        description: 'Kvalitet och konstruktivitet i feedback till kurskamrater',
        ratings: [
          { points: 4, label: 'Excellent',      description: 'Specifik, konstruktiv och handlingsorienterad feedback' },
          { points: 3, label: 'Väl godkänt',    description: 'Genomtänkt feedback med konkreta förslag' },
          { points: 2, label: 'Godkänt',         description: 'Generell feedback med viss konkrethet' },
          { points: 1, label: 'Ej godkänt',      description: 'Ytlig eller icke-konstruktiv feedback' },
        ],
      },
    ],
  },
  peerRubrics: [
    {
      id: 'pr-01',
      title: 'Peer-review — Moment 1',
      questions: [
        { id: 'q1', question: 'Vad fungerar bäst i produktionen?' },
        { id: 'q2', question: 'Vad kan förbättras och hur?' },
        { id: 'q3', question: 'Hur relaterar arbetet till kursens lärandemål?' },
      ],
    },
  ],
  activities: [
    {
      id: 'act-01',
      position: 1,
      title: 'Moment 1 — Inlämning',
      type: 'submission',
      description: 'Ladda upp din första komposition med reflektionstext (max 500 ord)',
      opensWeek: 1,
      deadlineWeek: 3,
      assessmentType: 'rubric_criteria',
      criteriaIds: ['c1', 'c2'],
      notes: 'Inkludera råfiler (DAW-projekt) och exporterad mixad version',
    },
    {
      id: 'act-02',
      position: 2,
      title: 'Moment 1 — Peer-review',
      type: 'peer_review',
      description: 'Ge feedback på två kurskamraters kompositioner',
      opensWeek: 3,
      deadlineWeek: 4,
      assessmentType: 'pass_fail',
      criteriaIds: ['c3'],
      peerRubricId: 'pr-01',
      notes: 'Anonymiserad — du ser inte vems arbete du granskar',
    },
    {
      id: 'act-03',
      position: 3,
      title: 'Moment 1 — Självvärdering',
      type: 'self_assessment',
      description: 'Reflektera kring din process efter att ha fått peer-feedback',
      opensWeek: 4,
      deadlineWeek: 5,
      assessmentType: 'none',
      criteriaIds: ['c2'],
      notes: '',
    },
    {
      id: 'act-04',
      position: 4,
      title: 'Moment 2 — Inlämning',
      type: 'submission',
      description: 'Reviderad version baserat på feedback, med förändringsdagbok',
      opensWeek: 5,
      deadlineWeek: 8,
      assessmentType: 'rubric_criteria',
      criteriaIds: ['c1', 'c2', 'c3'],
      notes: 'Beskriv konkret vad du förändrade och varför',
    },
  ],
}

export const mockStudentPortfolio: StudentPortfolio = {
  id: 'port-01',
  student: {
    id: 'stu-01',
    name: 'Anna Lindström',
    email: 'anna.lindstrom@student.hv.se',
  },
  template: mockTemplate,
  submissions: [
    {
      id: 'sub-01',
      activityId: 'act-01',
      content: 'Reflektionstext: Jag har i detta moment utforskat dynamik och textur i elektronisk musik...',
      submittedAt: '2026-09-22T14:30:00Z',
      teacherComment: 'Stark teknisk grund. Reflektionen visar god självkännedom om processen.',
      peerFeedback: [
        {
          fromStudent: 'Anonym kurskamrat',
          comment: 'Riktigt intressant val av synth-ljud i vers 2.',
          responses: {
            q1: 'Arrangemanget är genomtänkt och rytmiken funkar bra.',
            q2: 'Bassen saknar lite punch i mitten — prova en EQ-boost runt 200Hz.',
            q3: 'Passar väl in på lärandemålet om produktion och mix.',
          },
          submittedAt: '2026-09-25T10:00:00Z',
        },
      ],
    },
    {
      id: 'sub-02',
      activityId: 'act-02',
      content: 'Feedback given till kurskamrater',
      submittedAt: '2026-09-28T16:00:00Z',
    },
  ],
  activityStatuses: {
    'act-01': 'reviewed',
    'act-02': 'submitted',
    'act-03': 'in_progress',
    'act-04': 'not_started',
  },
  currentWeek: 5,
  assessment: {
    criteriaScores: { c1: 3, c2: 4, c3: 3 },
    comment: 'Anna visar tydlig konstnärlig utveckling och stark reflektiv förmåga.',
    finalGrade: 'VG',
    assessedAt: '2026-10-01T09:00:00Z',
    assessedBy: 'Erik Johansson',
  },
}

export const mockStudentList: StudentPortfolio[] = [
  mockStudentPortfolio,
  {
    ...mockStudentPortfolio,
    id: 'port-02',
    student: { id: 'stu-02', name: 'Marcus Ek', email: 'marcus.ek@student.hv.se' },
    activityStatuses: {
      'act-01': 'submitted',
      'act-02': 'not_started',
      'act-03': 'not_started',
      'act-04': 'not_started',
    },
    assessment: undefined,
  },
  {
    ...mockStudentPortfolio,
    id: 'port-03',
    student: { id: 'stu-03', name: 'Sara Nilsson', email: 'sara.nilsson@student.hv.se' },
    activityStatuses: {
      'act-01': 'reviewed',
      'act-02': 'reviewed',
      'act-03': 'submitted',
      'act-04': 'not_started',
    },
    assessment: {
      criteriaScores: { c1: 2, c2: 3, c3: 3 },
      comment: 'Sara har god reflektiv förmåga men behöver stärka det tekniska hantverket.',
      finalGrade: 'G',
      assessedAt: '2026-10-01T10:30:00Z',
      assessedBy: 'Erik Johansson',
    },
  },
]
