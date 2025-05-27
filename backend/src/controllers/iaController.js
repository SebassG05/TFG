import fetch from 'node-fetch';

// Controlador para recomendación de zapatilla ideal usando IA (dummy o integración real)
export const recomendarZapatilla = async (req, res) => {
  try {
    const { respuestas, zapatillas } = req.body;
    console.log('Respuestas recibidas:', respuestas);
    console.log('Zapatillas recibidas:', Array.isArray(zapatillas) ? zapatillas.map(z => z.name) : zapatillas);
    if (!respuestas || !zapatillas) {
      return res.status(400).json({ error: 'Faltan respuestas o listado de zapatillas' });
    }
    // Llamada a OpenAI o similar
    const prompt = `Eres un asistente experto en zapatillas deportivas. El usuario ha respondido: ${JSON.stringify(respuestas)}. Elige la zapatilla más adecuada del siguiente listado (devuelve solo el nombre exacto): ${zapatillas.map(z => z.name + ' (marca: ' + z.brand + ', color: ' + z.color + ', precio: ' + z.price + '€)').join('; ')}.`;
    console.log('Prompt enviado a OpenAI:', prompt);
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un experto en zapatillas deportivas.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 30,
        temperature: 0.2
      })
    });
    const data = await openaiRes.json();
    console.log('Respuesta de OpenAI:', data);
    const nombreZapatilla = data.choices?.[0]?.message?.content?.trim();
    // Busca el objeto de la zapatilla por nombre
    const recomendada = zapatillas.find(z => z.name.toLowerCase() === (nombreZapatilla ? nombreZapatilla.toLowerCase() : ''));
    if (!recomendada) return res.status(404).json({ error: 'No se encontró una zapatilla recomendada por la IA', nombreZapatilla });
    return res.json(recomendada);
  } catch (e) {
    console.error('Error en la recomendación IA:', e);
    return res.status(500).json({ error: 'Error en la recomendación', details: e.message });
  }
};

function matchPrecio(precio, rango) {
  if (rango === '<50€') return precio < 50;
  if (rango === '50-100€') return precio >= 50 && precio <= 100;
  if (rango === '100-150€') return precio > 100 && precio <= 150;
  if (rango === '>150€') return precio > 150;
  return true;
}
