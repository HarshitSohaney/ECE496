import { supabase } from '../../src/components/supabaseClient'; // Adjusted path

export default async function handler(req, res) {
  const { id } = req.query; // Get the unique ID from the URL
console.log(id);
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('ar_content')
        .select('html_content')
        .eq('url', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Content not found' });
      }
      console.log(data);
      // Serve the HTML content with the correct MIME type
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(data.html_content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve content' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
