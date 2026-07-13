const html = await Bun.file(new URL('../index.html', import.meta.url)).text();
const failures = [];

const report = (ok, message) => {
  if (!ok) failures.push(message);
};

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
report(scripts.length === 1, `expected one inline script, found ${scripts.length}`);

for (const [idx, script] of scripts.entries()) {
  try {
    new Function(script);
  } catch (error) {
    failures.push(`script ${idx + 1} does not parse: ${error.message}`);
  }
}

const htmlIds = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
const idsBlock = html.match(/const ids = \[([\s\S]*?)\];/);
report(Boolean(idsBlock), 'missing central const ids block');

if (idsBlock) {
  const referencedIds = [...idsBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
  const missingIds = referencedIds.filter(id => !htmlIds.has(id));
  report(missingIds.length === 0, `ids missing in markup: ${missingIds.join(', ')}`);
}

const getElementByIdCalls = [...html.matchAll(/document\.getElementById\(([^)]+)\)/g)];
report(
  getElementByIdCalls.length === 1 && getElementByIdCalls[0][1] === 'id',
  'DOM lookups should stay centralized in collectDom()'
);

const externalScripts = [...html.matchAll(/<script\b[^>]*\bsrc=/g)];
report(externalScripts.length === 0, 'external script dependencies are not allowed');

if (failures.length) {
  console.error(failures.map(message => `- ${message}`).join('\n'));
  process.exit(1);
}

console.log('lint ok');
