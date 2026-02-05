import { useState, useEffect, useCallback } from 'react';
import { questionService } from '@/services';

export function useQuestions(chapterId) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!chapterId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await questionService.getAllByChapter(chapterId);
      if (response.success) {
        setQuestions(response.data.questions || []);
      } else {
        setError(response.message || 'Failed to fetch questions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return { questions, loading, error, refetch: fetchQuestions };
}

export function useQuestion(id) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestion = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await questionService.getById(id);
      if (response.success) {
        setQuestion(response.data.question);
      } else {
        setError(response.message || 'Failed to fetch question');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch question');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return { question, loading, error, refetch: fetchQuestion };
}

export function useQuestionStats(chapterId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!chapterId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await questionService.getStats(chapterId);
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
