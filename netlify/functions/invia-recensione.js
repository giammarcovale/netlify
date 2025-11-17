// netlify/functions/invia-recensione.js

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo non consentito' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    const airtableData = {
      fields: {
        "azienda": data.azienda,
        "manager": data.manager,
        "valutazione": data.valutazione,
        "testo recensione": data.testo_recensione,
        "ruolo": data.ruolo,
        "approvata": false,
        "data": new Date().toISOString().split('T')[0]
      }
    };

    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Recensioni`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableData)
    });

    if (!response.ok) {
      throw new Error(`Errore Airtable: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Recensione inviata con successo!',
        id: result.id 
      })
    };

  } catch (error) {
    console.error('Errore:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Errore nel salvataggio della recensione' 
      })
    };
  }
};
