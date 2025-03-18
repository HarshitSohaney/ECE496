import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ARContentViewer = () => {
  const { uniqueId } = useParams(); // Get uniqueId from URL
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchARContent = async () => {
      try {
        const { data, error } = await supabase
          .from('ar_content')
          .select('html_content')
          .eq('url', uniqueId)  // Query the content by uniqueId
          .single();
        
        if (error) {
          console.error('Error fetching content:', error.message);
          setHtmlContent('<p>Failed to fetch content.</p>'); // Handle error case
        } else {
          setHtmlContent(data?.html_content || '<p>Content not found.</p>'); // Set content or "not found"
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setHtmlContent('<p>Unexpected error occurred.</p>'); // Handle unexpected errors
      }
      setLoading(false); // Update loading state when finished
    };

    fetchARContent();
  }, [uniqueId]);  // Re-run effect if uniqueId changes

  if (loading) {
    return <p>Loading content...</p>; // Show loading message while fetching content
  }

  return (
    <div>
      {htmlContent ? (
        <iframe
          title="AR Content"
          srcDoc={htmlContent} // Embed the HTML content directly into the iframe
          style={{ width: '100%', height: '100vh', border: 'none' }} // Make iframe take up the full screen
        />
      ) : (
        <p>Content not found.</p> // Show message if no content found
      )}
    </div>
  );
};

export default ARContentViewer;