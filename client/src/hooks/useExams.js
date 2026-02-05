import { useState, useEffect, useCallback } from 'react';
import { examService } from '@/services';

export function useExams(courseId) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await examService.getByCourse(courseId);
      if (response.success) {
        setExams(response.data.exams || []);
      } else {
        setError(response.message || 'Failed to fetch exams');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refetch: fetchExams };
}

export function useExam(id) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExam = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await examService.getById(id);
      if (response.success) {
        setExam(response.data.exam);
      } else {
        setError(response.message || 'Failed to fetch exam');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exam');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  return { exam, loading, error, refetch: fetchExam };
}
