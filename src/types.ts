export type QuestionCategory =
  | 'All'
  | 'Behavioral'
  | 'Functional_Technical'
  | 'Leadership_Culture'
  | 'Curveball';

export interface StarApproach {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface QuestionItem {
  id: string;
  category: string;
  categoryLabel: string;
  questionText: string;
  whyTheyAsk: string;
  evaluationGoal: string;
  recommendedStarApproach: StarApproach;
  doTips: string[];
  dontTips: string[];
  sampleAnswerSkeleton: string;
}

export interface ReverseQuestion {
  question: string;
  strategicObjective: string;
}

export interface InterviewerPersona {
  title: string;
  mindset: string;
  keyPriorities: string[];
  potentialRedFlags: string[];
  whatImpressesThem: string[];
}

export interface InterviewAnalysis {
  interviewerPersona: InterviewerPersona;
  evaluationCriteria: string[];
  questions: QuestionItem[];
  reverseInterviewQuestions: ReverseQuestion[];
  confidenceBoostTip: string;
  timestamp?: number;
  metadata?: {
    interviewerTitle: string;
    targetRole: string;
    industry: string;
    experienceLevel: string;
  };
}

export interface TrainingItem {
  id: string;
  title: string;
  providerOrInstitution: string;
  completedYear?: string;
  contentDescription: string;
  keySkillsCovered: string[];
}

export interface SkillGap {
  skill: string;
  gapType: 'Teknik' | 'Stratejik' | 'Yönetsel' | 'Metodolojik' | string;
  impactOnCareer: string;
  priority: 'High' | 'Medium' | 'Foundational' | string;
}

export interface RoadmapStep {
  step: number;
  phaseTitle: string;
  courseTopic: string;
  whyThisNow: string;
  curriculumOutline: string[];
  recommendedPlatformsOrCerts: string[];
  handsOnProject: string;
}

export interface HighValueCert {
  name: string;
  issuer: string;
  careerImpact: string;
}

export interface LearningPathAnalysis {
  profileDiagnosis: {
    currentMasteryLevel: string;
    acquiredCoreStrengths: string[];
    domainBreadth: string;
  };
  skillGaps: SkillGap[];
  recommendedRoadmap: RoadmapStep[];
  highValueCertifications: HighValueCert[];
  coachExecutiveSummary: string;
  timestamp?: number;
  metadata?: {
    trainingsCount: number;
    targetCareerGoal: string;
    currentRole: string;
  };
}

export interface SavedReport {
  id: string;
  type: 'interview' | 'learning_path';
  title: string;
  date: string;
  interviewData?: InterviewAnalysis;
  learningPathData?: LearningPathAnalysis;
}
