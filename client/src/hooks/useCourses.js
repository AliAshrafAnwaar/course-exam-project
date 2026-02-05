import { useState, useEffect, useCallback } from 'react';
import { courseService } from '@/services';

export function useCourses(initialParams = {}) {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (params = initialParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getAll(params);
      if (result.success) {
        setCourses(result.data.courses);
        setPagination(result.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, pagination, loading, error, refetch: fetchCourses };
}

export function useCourse(id) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getById(id);
      if (result.success) {
        setCourse(result.data.course);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
}

export default useCourses;
