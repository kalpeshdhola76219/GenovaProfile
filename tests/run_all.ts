import assert from 'assert';
import { calculateOptimalExportScale, generateExportFilename } from '../src/services/exportService';

console.log('Running test suite...');

// Test 1: Filename generation
const fn = generateExportFilename('John Doe', 'Software Engineer', 'resume', 'pdf');
assert.ok(fn.includes('John_Doe') || fn.includes('John'), 'Filename should include name');
console.log('✓ Filename generation test passed');

// Test 2: Scale calculation
const dummyEl = { offsetWidth: 794, offsetHeight: 1123 } as HTMLElement;
const scale = calculateOptimalExportScale(dummyEl);
assert.ok(scale >= 1.5, 'Export scale should be at least 1.5');
console.log('✓ Export scale calculation test passed');

console.log('Running 22-template pagination test suite...');
import('./pagination_verification.test');

console.log('Running Cover Letter typography & polish test suite...');
import('./coverletter_typography.test');
