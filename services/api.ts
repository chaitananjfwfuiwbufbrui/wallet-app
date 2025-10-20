const API_BASE_URL = 'http://localhost:8000';

// Fallback mock data when API is unavailable
const MOCK_SUBJECTS = [
  {
    id: 'mock-1',
    title: 'Mathematics',
    description: 'Learn fundamental mathematical concepts',
    image_url: null
  },
  {
    id: 'mock-2', 
    title: 'Programming',
    description: 'Master programming fundamentals',
    image_url: null
  },
  {
    id: 'mock-3',
    title: 'Science',
    description: 'Explore scientific principles',
    image_url: null
  }
];

const MOCK_LESSONS = [
  {
    id: 'mock-lesson-1',
    title: 'Introduction to the Subject',
    description: 'Get started with the basics',
    order: 0,
    subject_id: ''
  },
  {
    id: 'mock-lesson-2',
    title: 'Intermediate Concepts',
    description: 'Build on your foundation',
    order: 1,
    subject_id: ''
  }
];

const MOCK_TOPICS = [
  {
    id: 'mock-topic-1',
    title: 'Getting Started',
    description: 'Your first steps in learning',
    lesson_id: ''
  },
  {
    id: 'mock-topic-2',
    title: 'Core Concepts',
    description: 'Understanding the fundamentals',
    lesson_id: ''
  }
];

const MOCK_CONTENT = [
  {
    id: 'mock-content-1',
    content_type: 'in-depth',
    data: JSON.stringify({
      topic: 'Sample Topic',
      content: {
        introduction: 'This is a sample topic to demonstrate the app functionality when the API server is not available.',
        core_principles: 'The core principles involve understanding the basic concepts and applying them effectively.',
        applications: 'This knowledge can be applied in various real-world scenarios.',
        limitations: 'Every approach has its limitations that should be considered.',
        future_scope: 'There are many opportunities for future development and improvement.'
      }
    }),
    youtube_links: null,
    topic_id: ''
  }
];

export interface ApiSubject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
}

export interface ApiLesson {
  id: string;
  title: string;
  description: string;
  order: number;
  subject_id: string;
}

export interface ApiTopic {
  id: string;
  title: string;
  description: string;
  lesson_id: string;
}

export interface ApiContent {
  id: string;
  content_type: string;
  data: string;
  youtube_links: string | null;
  topic_id: string;
}

export interface ParsedContent {
  topic: string;
  content: {
    introduction: string;
    core_principles: string;
    architecture_workflow: string;
    mathematical_foundation: string;
    implementation_details: string;
    applications: string;
    limitations: string;
    future_scope: string;
  };
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API Error for ${url}:`, error);
      console.warn('Using fallback mock data');
      return null;
    }
  }

  async getSubjects(): Promise<ApiSubject[]> {
    const result = await this.fetchWithErrorHandling('/subjects/');
    return result || MOCK_SUBJECTS;
  }

  async getLessons(subjectId: string): Promise<ApiLesson[]> {
    const result = await this.fetchWithErrorHandling(`/lessons/subject/${subjectId}`);
    if (result) return result;
    
    // Return mock lessons with the correct subject_id
    return MOCK_LESSONS.map(lesson => ({
      ...lesson,
      subject_id: subjectId
    }));
  }

  async getTopics(lessonId: string): Promise<ApiTopic[]> {
    // Remove hyphens from lesson ID for API call
    const cleanLessonId = lessonId.replace(/-/g, '');
    const result = await this.fetchWithErrorHandling(`/topics/lesson/${cleanLessonId}`);
    if (result) return result;
    
    // Return mock topics with the correct lesson_id
    return MOCK_TOPICS.map(topic => ({
      ...topic,
      lesson_id: lessonId
    }));
  }

  async getTopicContent(topicId: string, regen: boolean = false): Promise<ApiContent[]> {
    const result = await this.fetchWithErrorHandling<ApiContent[]>(`/content/topic/${topicId}?regen=${regen}`);
    if (result) return result;

    return MOCK_CONTENT.map(content => ({
      ...content,
      topic_id: topicId
    }));
  }

  parseContentData(contentData: string): ParsedContent {
    try {
      return JSON.parse(contentData);
    } catch (error) {
      console.error('Error parsing content data:', error);
      return {
        topic: 'Content Error',
        content: {
          introduction: 'Failed to load content',
          core_principles: '',
          architecture_workflow: '',
          mathematical_foundation: '',
          implementation_details: '',
          applications: '',
          limitations: '',
          future_scope: ''
        }
      };
    }
  }
}

export const apiService = new ApiService();