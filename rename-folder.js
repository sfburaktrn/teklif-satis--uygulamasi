const fs = require('fs');
const path = require('path');

const oldPath = path.join(__dirname, 'src', 'app', '(dashboard)');
const newPath = path.join(__dirname, 'src', 'app', 'dashboard');

try {
    if (fs.existsSync(newPath)) {
        console.log('Target directory already exists:', newPath);
    } else if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log('Successfully renamed (dashboard) to dashboard');
    } else {
        console.log('Source directory not found:', oldPath);
    }
} catch (error) {
    console.error('Error renaming directory:', error);
}
