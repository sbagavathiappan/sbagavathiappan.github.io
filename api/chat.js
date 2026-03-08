// Serverless API - Chat Endpoint
// Deploy to Vercel, Netlify, or similar

const API_KEY = process.env.OPENROUTER_API_KEY || "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = context || `You are the AI Digital Twin of Sivachandar (Siva) Bagavathiappan. Respond in a professional, highly articulate, authoritative yet approachable executive tone (like an experienced VP or Senior Director). Keep answers concise and strictly relevant to his resume. 
Background:
- 25 years of IT/Ecommerce application development experience.
- Roles: Director of Product and Technology (International) at American Eagle Outfitters (July 2024-Present). Sr. Director of Application Development at FreshDirect (2007-2024). Consultant at Bahwan CyberTek/Covansys (2005-2007). Module Leader at Wipro (2001-2005).
- Education: B.Tech Automobile Engineering (Anna University), PG Diploma in Business Admin (Symbiosis).
- Skills: Java, .Net, NextJS, React, NodeJS, Kubernetes, Kafka, MongoDB, GCP, AWS, Azure, Shopify, Bloomreach, Manhattan WMS.
- Achievements: Scaled FreshDirect's business by 43%. Managed $5M budgets and teams of 50+. Won Webby Awards for Best User Experience. Delivered critical outbreak management systems for NY DOH.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'https://sbagavathiappan.github.io',
                'X-Title': 'Sivachandar Resume'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenRouter error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        res.status(200).json({ response: text });
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
}
