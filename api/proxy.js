export default async function handler(req, res) {
    // Use the 'path' query parameter from the vercel.json rewrite
    const { path } = req.query;

    // Construct the target URL correctly
    // If path is undefined (hitting /api directly), we use an empty string
    const targetUrl = `https://eelepkal.com/api/${path || ''}`;

    console.log(`[Proxy] ${req.method} ${req.url} -> ${targetUrl}`);

    // Set up common headers
    const headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://eelepkal.com',
        'Referer': 'https://eelepkal.com/',
    };

    // Forward Authorization header if present
    if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
    }

    try {
        const fetchOptions = {
            method: req.method,
            headers: headers,
        };

        // Forward body for non-GET requests
        if (req.method !== 'GET' && req.method !== 'OPTIONS' && req.method !== 'HEAD') {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, fetchOptions);

        // Get response content type to handle non-JSON responses
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        // Pass CORS headers back to the browser
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        return res.status(response.status).send(responseData);
    } catch (error) {
        console.error('[Proxy Error]:', error);
        return res.status(500).json({
            error: 'Proxy Error',
            message: error.message,
            targetUrl
        });
    }
}
