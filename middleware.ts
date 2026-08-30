// Edge Middleware Vercel — protege /v1 par la cle applicative x-rax-key.
// Deux cles simultanees (RAX_KEY_K1 / RAX_KEY_K2) pour la rotation sans coupure.
// Les headers de cache sont geres par vercel.json ; ici uniquement l'auth.

export const config = { matcher: '/v1/:path*' };

export default function middleware(request: Request): Response | undefined {
  const provided = request.headers.get('x-rax-key');
  const validKeys = [process.env.RAX_KEY_K1, process.env.RAX_KEY_K2].filter(
    (k): k is string => typeof k === 'string' && k.length > 0
  );

  if (validKeys.length === 0) {
    // Env non configuree : on ferme plutot que d'ouvrir.
    return new Response('service unavailable', { status: 503 });
  }
  if (provided === null || !validKeys.includes(provided)) {
    return new Response('unauthorized', { status: 401 });
  }
  return undefined; // continue vers le fichier statique
}
