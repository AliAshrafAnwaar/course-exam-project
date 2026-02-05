import { useState, useEffect, useCallback } from 'react';
import { chapterService } from '@/services';

export function useChapters(courseId) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapters = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await chapterService.getAllByCourse(courseId);
      if (response.success) {
        setChapters(response.data.chapters || []);
      } else {
        setError(response.message || 'Failed to fetch chapters');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chapters');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  return { chapters, loading, error, refetch: fetchChapters };
}

export function useChapter(id) {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapter = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await chapterService.getById(id);
      if (response.success) {
        setChapter(response.data.chapter);
      } else {
        setError(response.message || 'Failed to fetch chapter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chapter');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  return { chapter, loading, error, refetch: fetchChapter };
}
