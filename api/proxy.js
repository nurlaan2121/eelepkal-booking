export default async function handler(req, res) {
    // 1. Extract path from query parameter
    const { path, ...query } = req.query;
    delete query.path;

    const queryString = new URLSearchParams(query).toString();
    const targetUrl = `https://eelepkal.com/api/${path || ''}${queryString ? `?${queryString}` : ''}`;

    console.log(`[Proxy] ${req.method} -> ${targetUrl}`);

    // 2. Prepare request headers for the backend
    // We forward the original Content-Type to preserve multi-part boundaries
    const forwardHeaders = {
        ...req.headers,
        'host': 'eelepkal.com',
        'origin': 'https://eelepkal.com',
        'referer': 'https://eelepkal.com/',
    };

    // Remove headers that might interfere with the proxying process or cause SSL issues
    delete forwardHeaders['host'];
    delete forwardHeaders['connection'];
    delete forwardHeaders['content-length']; // fetch will recalculate this if needed

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

        // For mutations, we stream the request body directly
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            fetchOptions.body = req;
            // duplex: 'half' is required when the body is a stream in some fetch implementations
            fetchOptions.duplex = 'half';
        }

        const response = await fetch(targetUrl, fetchOptions);

        // Get the response body as a buffer or JSON
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        console.log(`[Proxy Response] ${response.status} from ${path}`);

        // Set CORS headers for the frontend
        res.setHeader('Access-Control-Allow-Origin', 'https://app.eelepkal.com');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        return res.status(response.status).send(responseData);
    } catch (error) {
        console.error(`[Proxy Error] ${path}:`, error);
        return res.status(500).json({
            error: 'Proxy Error',
            message: error.message,
            path
        });
    }
}

export const config = {
    api: {
        bodyParser: false, // Disable Vercel body parsing to allow streaming
    },
};
