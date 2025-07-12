const axios = require('axios');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { numero } = req.query;

  if (!numero || numero.length !== 11) {
    return res.status(400).json({ error: 'RUC inválido' });
  }

  try {
    const response = await axios.get(`https://api.apis.net.pe/v1/ruc?numero=${numero}`, {
      headers: {
        'Authorization': `Bearer ${process.env.APIS_TOKEN}`
      }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Error al consultar la API' });
  }
}