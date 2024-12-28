import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ARContentViewer = () => {
  const { uniqueId } = useParams();
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchARContent = async () => {
      const { data, error } = await supabase
        .from('ar_content')
        .select('html_content')
        .eq('url', uniqueId)
        .single();

      if (error) {
        console.error('Failed to fetch content:', error.message);
      } else {
        setHtmlContent(data?.html_content || '<p>Content not found</p>');
      }

      setLoading(false);
    };

    fetchARContent();
  }, [uniqueId]);

  if (loading) {
    return <p>Loading content...</p>;
  }

  return (
    <div>
      {htmlContent ? (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <p>Content not found</p>
      )}
    </div>
  );
};

export default ARContentViewer;