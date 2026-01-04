
const fs = require('fs');
const content = fs.readFileSync('d:/smart-doc-teacher-app/components/template-engine/LessonTab.tsx', 'utf8');

let braces = 0;
let curleys = 0;
let parens = 0;
let inString = false;
let quoteChar = '';

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (inString) {
        if (char === quoteChar && content[i - 1] !== '\\') {
            inString = false;
        }
    } else {
        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            quoteChar = char;
        } else if (char === '{') {
            curleys++;
        } else if (char === '}') {
            curleys--;
            if (curleys < 0) console.log('Extra } at', i);
        } else if (char === '(') {
            parens++;
        } else if (char === ')') {
            parens--;
            if (parens < 0) console.log('Extra ) at', i);
        }
    }
}

console.log('Final counts:', { curleys, parens });
