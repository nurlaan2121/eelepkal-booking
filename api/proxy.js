export default async function handler(req, res) {
    const { url } = req;
    const targetPath = url.replace('/api', '');
    const targetUrl = `https://eelepkal.com/api${targetPath}`;

    // Allow only POST, GET, PUT, DELETE for this specific project
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const fetchOptions = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                // Mask the Origin and Referer to bypass backend CORS checks
                'Origin': 'https://eelepkal.com',
                'Referer': 'https://eelepkal.com/',
            },
        };

        if (req.method !== 'GET' && req.method !== 'OPTIONS') {
            fetchOptions.body = JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.json();

        // Set CORS headers for the browser
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Proxy implementation error', details: error.message });
    }
}
