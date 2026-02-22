addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Handle CORS Preflight (OPTIONS)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  // Ensure it's a POST request to /data
  if (request.method === "POST" && url.pathname === "/data") {
    try {
      const { type, value } = await request.json();
      let reversedValue;

      switch (type) {
        case 'string':
          reversedValue = value.split('').reverse().join('');
          break;
        case 'array':
          reversedValue = [...value].reverse();
          break;
        case 'words':
          reversedValue = value.split(' ').reverse().join(' ');
          break;
        case 'number':
          // Reverse digits: 123 -> 321
          const reversedStr = Math.abs(value).toString().split('').reverse().join('');
          reversedValue = parseInt(reversedStr) * Math.sign(value);
          break;
        default:
          return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400 });
      }

      const responseBody = {
        reversed: reversedValue,
        email: "23f3001092@ds.study.iitm.ac.in"
      };

      return new Response(JSON.stringify(responseBody), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: "Bad Request" }), { status: 400 });
    }
  }

  return new Response("Not Found", { status: 404 });
}
