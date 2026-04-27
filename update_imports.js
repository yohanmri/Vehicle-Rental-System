const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
            callback(dirPath);
        }
    });
}

function fixImports(content, filePath) {
    let newContent = content;
    
    // Determine depth relative to src
    const relativePath = path.relative(srcDir, filePath);
    const parts = relativePath.split(path.sep);
    const depth = parts.length - 1;

    // Helper for relative path to src
    let toSrc = '';
    for(let i=0; i<depth; i++) toSrc += '../';
    if(depth === 0) toSrc = './';

    // 1. Fix asset imports
    // Anything looking like `../assets/images/` -> `toSrc + assets/user-assets/images/`
    // Wait, it's easier to just do regex replacement based on known patterns.
    
    // For App.jsx and main.jsx (depth 0)
    if (depth === 0) {
        newContent = newContent.replace(/'\.\/components\//g, "'./components/user-components/");
        newContent = newContent.replace(/'\.\/pages\/(?!admin-pages)/g, "'./pages/user-pages/");
        newContent = newContent.replace(/'\.\/pages\/admin\//g, "'./pages/admin-pages/");
        newContent = newContent.replace(/'\.\/context\//g, "'./context/user-context/");
    } 
    // For files at depth 2 (components/user-components, context/user-context, pages/user-pages, pages/admin-pages)
    else if (depth === 2) {
        // From depth 1 (e.g. pages/Home.jsx), the old path to components was `../components/`
        // Now from depth 2 (pages/user-pages/Home.jsx), it should be `../../components/user-components/`
        // So `../components/` becomes `../../components/user-components/`
        
        // Wait, for pages/admin-pages, the old path was already `../../components/`
        // We need to know if the file WAS at depth 1 or depth 2.
        
        const isFromAdmin = parts[1] === 'admin-pages';
        
        if (isFromAdmin) {
            // Old paths were already from depth 2.
            // `../../components/` -> `../../components/user-components/`
            newContent = newContent.replace(/'\.\.\/\.\.\/components\//g, "'../../components/user-components/");
            // `../../context/` -> `../../context/user-context/`
            newContent = newContent.replace(/'\.\.\/\.\.\/context\//g, "'../../context/user-context/");
            // `../../assets/images/` -> `../../assets/user-assets/images/`
            newContent = newContent.replace(/'\.\.\/\.\.\/assets\/images\//g, "'../../assets/user-assets/images/");
        } else {
            // Old paths were from depth 1.
            // `../components/` -> `../../components/user-components/`
            newContent = newContent.replace(/'\.\.\/components\//g, "'../../components/user-components/");
            // `../context/` -> `../../context/user-context/`
            newContent = newContent.replace(/'\.\.\/context\//g, "'../../context/user-context/");
            // `../assets/images/` -> `../../assets/user-assets/images/`
            newContent = newContent.replace(/'\.\.\/assets\/images\//g, "'../../assets/user-assets/images/");
        }
    }

    return newContent;
}

walk(srcDir, (filePath) => {
    const original = fs.readFileSync(filePath, 'utf8');
    const fixed = fixImports(original, filePath);
    if (original !== fixed) {
        fs.writeFileSync(filePath, fixed);
        console.log(`Updated ${path.relative(srcDir, filePath)}`);
    }
});

