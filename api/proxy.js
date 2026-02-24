export default async function handler(req, res) {
    // 1. Extract path from query parameter
    const { path } = req.query;
    const targetUrl = `https://eelepkal.com/api/${path || ''}`;

    console.log(`[Proxy Request] ${req.method} ${path || '/'} -> ${targetUrl}`);

    // 2. Prepare request headers for the backend
    const forwardHeaders = {
        'Content-Type': 'application/json',
        'Origin': 'https://eelepkal.com',
        'Referer': 'https://eelepkal.com/',
    };

    // Forward Authorization if exists
    if (req.headers.authorization) {
        forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // Handle CORS Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://app.eelepkal.com');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(200).end();
    }

    try {
        const fetchOptions = {
            method: req.method,
            headers: forwardHeaders,
        };

        // Forward body for mutations
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.body) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, fetchOptions);

        // Check content type to handle JSON or Text
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        console.log(`[Proxy Response] ${req.method} ${path} -> Status: ${response.status}`);

        // Set CORS headers for the frontend (app.eelepkal.com)
        res.setHeader('Access-Control-Allow-Origin', 'https://app.eelepkal.com');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        return res.status(response.status).send(responseData);
    } catch (error) {
        console.error(`[Proxy Error] ${req.method} ${path}:`, error);
        return res.status(500).json({
            error: 'Proxy Error',
            message: error.message,
            path
        });
    }
}
