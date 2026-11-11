import { handleOmarChat } from '../src/server/omarService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message = '', history = [], lang = 'fr' } = req.body || {};
    const result = await handleOmarChat({ message, history, lang });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
