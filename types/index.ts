export interface Subject {
  id: string;
  name: string;
  icon: string;
  progress: number;
  lastAccessed?: string;
  totalLessons: number;
  completedLessons: number;
  color: string;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  topics: number;
  completion: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

export interface Topic {
  id: string;
  lessonId: string;
  title: string;
  estimatedTime: string;
  completion: number;
  content: {
    text: string;
    videoUrl?: string;
    comicPanels?: ComicPanel[];
  };
  quiz?: Quiz;
  activity?: Activity;
}

export interface ComicPanel {
  id: string;
  imageUrl: string;
  caption: string;
  dialogue?: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  sarcasticFeedback: {
    correct: string;
    incorrect: string[];
  };
}

export interface Activity {
  type: 'code' | 'text' | 'matching';
  instructions: string;
  starterCode?: string;
  solution?: string;
  exercises?: {
    question: string;
    answer: string;
  }[];
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  totalTimeSpent: number;
  topicsCompleted: number;
}

export interface RecallItem {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectName: string;
  dueDate: Date;
  difficulty: number;
  lastReviewed?: Date;
}