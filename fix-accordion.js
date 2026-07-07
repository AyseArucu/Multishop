const fs = require('fs');
let content = fs.readFileSync('src/app/admin/settings/page.tsx', 'utf8');

const sectionRegex = /^(\s*)<div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6.*?">\s*<h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">([^<]+)<\/h2>/gm;

let match;
let replacements = [];
while ((match = sectionRegex.exec(content)) !== null) {
  const indent = match[1];
  const title = match[2];
  const startIdx = match.index;
  const endOfMatch = startIdx + match[0].length;

  // find the closing div
  let divCount = 1;
  let i = endOfMatch;
  while (divCount > 0 && i < content.length) {
    if (content.substr(i, 4) === '<div') { divCount++; i += 4; }
    else if (content.substr(i, 6) === '</div>') { divCount--; if (divCount === 0) break; i += 6; }
    else { i++; }
  }

  if (divCount === 0) {
    const innerContent = content.substring(endOfMatch, i);
    const newBlock = indent + `<SettingSection title="${title}" openSection={openSection} setOpenSection={setOpenSection}>\n` + innerContent + indent + `</SettingSection>`;
    replacements.push({ start: startIdx, end: i + 6, text: newBlock });
  }
}

// Apply replacements backwards so indices don't change
for(let j=replacements.length-1; j>=0; j--) {
  content = content.substring(0, replacements[j].start) + replacements[j].text + content.substring(replacements[j].end);
}

// Add state and component
if (!content.includes('const [openSection, setOpenSection]')) {
  content = content.replace('const [settings, setSettings] = useState({', 'const [openSection, setOpenSection] = useState<string | null>("Genel Site Ayarları");\n  const [settings, setSettings] = useState({');
}

const componentDef = `
const SettingSection = ({ title, children, openSection, setOpenSection }: any) => {
  const isOpen = openSection === title;
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <button 
        type="button"
        onClick={() => setOpenSection(isOpen ? null : title)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="text-2xl text-slate-400">{isOpen ? '\\u2212' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-8 pt-4 border-t border-gray-100 space-y-6 animate-fade-in-up">
           {children}
        </div>
      )}
    </div>
  );
};

export default function`;

if (!content.includes('const SettingSection =')) {
  content = content.replace('export default function', componentDef);
}

fs.writeFileSync('src/app/admin/settings/page.tsx', content);
console.log('Accordion layout applied successfully.');
