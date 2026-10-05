// Read-only HTTP probe using the same native fetch client as the application.
const response = await fetch(process.argv[2], {
  redirect: 'manual',
  signal: AbortSignal.timeout(30000),
  headers: { 'User-Agent': 'ManualDeCocina-Preview-QA/1.0', 'Cache-Control': 'no-cache' },
});
console.log(JSON.stringify({
  status: response.status,
  headers: Object.fromEntries(response.headers),
  body: await response.text(),
}));
