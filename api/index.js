export default function handler(req, res) {
  res.json({ 
    status: 'RAID AI Chat is running!',
    endpoints: {
      chat: '/api/chat',
      embed: '/api/embed'
    },
    timestamp: new Date().toISOString()
  });
}