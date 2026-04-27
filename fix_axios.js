const fs = require('fs');

const filesToFix = [
  'frontend/src/pages/user-pages/Login.jsx',
  'frontend/src/pages/user-pages/Register.jsx',
  'frontend/src/pages/user-pages/Vehicles.jsx',
  'frontend/src/pages/user-pages/VehicleDetail.jsx',
  'frontend/src/pages/user-pages/Profile.jsx',
  'frontend/src/context/user-context/AuthContext.jsx'
];

filesToFix.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/from '\.\.\/api\/axios'/g, "from '../../api/axios'");
    fs.writeFileSync(file, content);
    console.log("Fixed " + file);
});
