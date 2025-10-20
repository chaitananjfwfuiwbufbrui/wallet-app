import { useState, useEffect } from 'react';
import { apiService, ApiSubject, ApiLesson, ApiTopic, ApiContent } from '../services/api';

export function useSubjects() {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSubjects();
        setSubjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, loading, error, refetch: () => fetchSubjects() };
}

export function useLessons(subjectId: string | null) {
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLessons(subjectId);
        setLessons(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [subjectId]);

  return { lessons, loading, error };
}

export function useLesson(lessonId: string | null) {
  const [lesson, setLesson] = useState<ApiLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLesson(lessonId);
        setLesson(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, loading, error };
}

export function useTopics(lessonId: string | null) {
  const [topics, setTopics] = useState<ApiTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTopics(lessonId);
        setTopics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [lessonId]);

  return { topics, loading, error };
}

export function useTopicContent(topicId: string | null) {
  const [content, setContent] = useState<ApiContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTopicContent(topicId);
        setContent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [topicId]);

  return { content, loading, error };
}