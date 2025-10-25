const http = require('http');
const url = require('url');
const { getExpense, getExpenses, createExpense, updateExpense, deleteExpense} = require('./backend/controller/expenseController');

const PORT = 3000;

// Helper to parse the request body
const getRequestBody = async(req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        })
    })
}

const server = http.createServer(async(req, res) => {
    const method = req.method;
    const parsedUrl = url.parse(req.url);
    const { pathname, query } = parsedUrl;

    // Header
    res.setHeader('content-type','application/json');

    // Routes
    if(method === 'GET' && pathname === '/expenses'){
        const results = getExpenses();
        res.writeHead(200);
        res.end(JSON.stringify(results));
    } else if(method === 'GET' && pathname.startsWith('/expenses/')){
        const id = pathname.split('/')[2];
        const results = getExpense(id);
        res.writeHead(results.success ? 200 : 404);
        res.end(JSON.stringify(results));
    } else if (method === 'POST' && pathname === '/expenses'){
        try {
            const body = await getRequestBody(req);
            const { title, category, amount } = body;
            const result = createExpense(title, category, amount );
            res.writeHead(result.success ? 201 : 400);
            res.end(JSON.stringify(result));
        } catch {
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: "Invalid json body"}));
        }
    } else if(method === 'PUT' && pathname.startsWith('/expenses/')){
        const id = pathname.split('/')[2];
        try {
            const body = await getRequestBody(req);
            const result = updateExpense(id, body);
            res.writeHead(result.success ? 200 : 400);
            res.end(JSON.stringify(result));
        } catch {
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: 'Invalid JSON body'}));
        }
    } else if(method === 'DELETE' && pathname.startsWith('/expenses/')){
        const id = pathname.split('/')[2];
        const result = deleteExpense(id)
        res.writeHead(result.success ? 200 : 400);
        res.end(JSON.stringify(result));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({success: false, message: 'Route not found.'}));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})