const API_BASE_URL = 'http://localhost:8000';

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
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
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
      console.error(`API Error for ${url}:`, error);
      throw error;
    }
  }

  async getSubjects(): Promise<ApiSubject[]> {
    return this.fetchWithErrorHandling<ApiSubject[]>('/subjects/');
  }

  async getLessons(subjectId: string): Promise<ApiLesson[]> {
    return this.fetchWithErrorHandling<ApiLesson[]>(`/lessons/subject/${subjectId}`);
  }

  async getTopics(lessonId: string): Promise<ApiTopic[]> {
    // Remove hyphens from lesson ID for API call
    const cleanLessonId = lessonId.replace(/-/g, '');
    return this.fetchWithErrorHandling<ApiTopic[]>(`/topics/lesson/${cleanLessonId}`);
  }

  async getTopicContent(topicId: string, regen: boolean = false): Promise<ApiContent[]> {
    return this.fetchWithErrorHandling<ApiContent[]>(`/content/topic/${topicId}?regen=${regen}`);
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