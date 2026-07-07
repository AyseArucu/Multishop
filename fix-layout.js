const fs = require('fs');

let code = fs.readFileSync('src/app/(shop)/product/[id]/page.tsx', 'utf8');

const rStart = code.indexOf('          {/* Reviews Section */}');
const dStart = code.indexOf('        {/* Product Details */}');

if (rStart === -1 || dStart === -1) {
  console.log("Could not find sections");
  process.exit(1);
}

// 1. Extract Reviews Chunk
let rChunkRaw = code.substring(rStart, dStart);
// Remove the last `        </div>` which actually closes the first column
const rChunk = rChunkRaw.replace(/        <\/div>\s*$/, '');

// 2. Remove Reviews Chunk from its original place
// Replace it with just `        </div>`
code = code.replace(rChunkRaw, '        </div>\n\n');

// 3. Update Product Details div class
code = code.replace(
  '        {/* Product Details */}\n        <div className="md:w-1/2 space-y-6 flex flex-col">',
  '        {/* Product Details */}\n        <div className="space-y-6 flex flex-col order-2 md:order-2">'
);

// 4. Find the end of the grid container.
// It ends right before `{/* Installments Modal */}`
const installmentsStart = code.indexOf('      {/* Installments Modal */}');
if (installmentsStart === -1) {
  console.log("Could not find Installments Modal");
  process.exit(1);
}

// We need to insert our reviews right before the grid container closes.
// Wait, the grid container is closed with `      </div>` right before `{/* Installments Modal */}`.
// Let's verify this by finding the last `      </div>` before installments.
let preInstallments = code.slice(0, installmentsStart);
const lastDivClose = preInstallments.lastIndexOf('      </div>');

if (lastDivClose === -1) {
  console.log("Could not find grid end");
  process.exit(1);
}

// 5. Wrap and insert Reviews Chunk
const rWrapped = `        <div className="order-3 md:order-3 md:col-start-1">\n${rChunk}        </div>\n`;

code = code.slice(0, lastDivClose) + rWrapped + code.slice(lastDivClose);

fs.writeFileSync('src/app/(shop)/product/[id]/page.tsx', code);
console.log("Success");
