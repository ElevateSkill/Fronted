import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Custom hook to fetch homepage data with error handling and loading states
 * @returns {Object} { data, loading, error, refetch }
 */
export function useHomepageData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/homepage/');
      setData(response.data);
      
      // Cache the data for offline use
      if (response.data) {
        localStorage.setItem('elevate_homepage_cache', JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.warn('Homepage API fetch failed, using cached or static data:', err);
      setError(err);
      
      // Try to load cached data as fallback
      try {
        const cached = localStorage.getItem('elevate_homepage_cache');
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const ONE_HOUR = 60 * 60 * 1000;
          
          // Use cached data if less than 1 hour old
          if (Date.now() - timestamp < ONE_HOUR) {
            console.info('Using cached homepage data');
            setData(cachedData);
          }
        }
      } catch (cacheErr) {
        console.warn('Could not load cached data:', cacheErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook to fetch announcements
 */
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('access_token');
        let data = [];
        
        if (token) {
          try {
            const res = await api.get('/announcements/');
            data = Array.isArray(res.data) ? res.data : res.data?.results || [];
          } catch {
            const res = await api.get('/admin/announcements/');
            const allData = Array.isArray(res.data) ? res.data : res.data?.results || [];
            data = allData.filter(a => a.is_published);
          }
        } else {
          const res = await api.get('/news/');
          data = Array.isArray(res.data) ? res.data : res.data?.results || [];
          data = data.filter(n => n.status === 'published' || n.is_published !== false);
        }

        if (data && data.length > 0) {
          setAnnouncements(data);
          localStorage.setItem('elevateskill_public_announcements', JSON.stringify(data));
          window.dispatchEvent(new Event('announcements-updated'));
        }
      } catch (err) {
        console.error('Announcements fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return { announcements, loading };
}

/**
 * Hook to fetch latest news
 */
export function useLatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news/');
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        const published = data
          .filter((item) => item.status === 'published')
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        
        setNews(published);
      } catch (err) {
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading };
}
