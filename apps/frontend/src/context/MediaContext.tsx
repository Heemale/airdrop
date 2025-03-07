'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { MediaConfigRecord } from '@/api/types/response';
import { getMediaConfig } from '@/api';

interface MediaContextType {
  mediaConfig: MediaConfigRecord | null;
}

const MediaContext = createContext<MediaContextType>({
  mediaConfig: null,
});

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context.mediaConfig;
};

export const MediaProvider: React.FC<{
  page: string;
  children: React.ReactNode;
}> = ({ page, children }) => {
  const [mediaConfig, setMediaConfig] = useState<MediaConfigRecord | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchMediaConfig = async () => {
    try {
      setLoading(true);
      const data = await getMediaConfig(page);
      setMediaConfig(data || {});
    } catch (error) {
      setMediaConfig({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaConfig();
  }, [page]);

  if (loading) {
    return <div className="loading-indicator">Loading content...</div>;
  }

  return (
    <MediaContext.Provider value={{ mediaConfig }}>
      {children}
    </MediaContext.Provider>
  );
};
