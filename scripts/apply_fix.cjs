const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/templates/invitations/invitationRegistry.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

const startIdx = content.indexOf('const BESPOKE_INVITATION_DATA: Record<string, Partial<InvitationData>> = {');
const endMarker = 'export const INVITATION_TEMPLATES: InvitationTemplate[] = [';
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Markers not found:", { startIdx, endIdx });
  process.exit(1);
}

const fixScript = fs.readFileSync(__dirname + '/fix_bespoke_types.cjs', 'utf8');
const match = fixScript.match(/const bespokeData = `([\s\S]*?)`;/);
if (!match) {
  console.error("Could not extract bespokeData from fix script");
  process.exit(1);
}

const replacement = match[1].trim() + '\n\n\n';
content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync(targetFile, content, 'utf8');
console.log("Successfully replaced BESPOKE block!");
