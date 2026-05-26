const fs = require('fs');
const path = require('path');

// Ścieżka do kodu źródłowego
const targetDir = path.join(__dirname, '../src');

// Wykrywa konstrukcje: import { Icon1, Icon2 as Alias } from "lucide-react";
const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;

// Funkcja pomocnicza: PascalCase -> kebab-case (np. ArrowRight -> arrow-right)
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function optimizeLucideImports(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      optimizeLucideImports(filePath);
    } else if (/\.(jsx|tsx)$/.test(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      const newContent = content.replace(importRegex, (match, importsStr) => {
        // Rozdziela ikony wyłuskane w klamrach po przecinku
        const icons = importsStr.split(',').map(i => i.trim()).filter(Boolean);
        
        return icons.map(iconDef => {
          // Obsługa aliasów np. "ArrowRight as Arrow"
          const parts = iconDef.split(/\s+as\s+/);
          const iconName = parts[0];
          const alias = parts[1] || iconName;
          const kebabName = toKebabCase(iconName);
          
          return `import ${alias} from 'lucide-react/dist/esm/icons/${kebabName}';`;
        }).join('\n');
      });
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Zoptymalizowano ikony w pliku: ${path.basename(filePath)}`);
      }
    }
  });
}

optimizeLucideImports(targetDir);
console.log('Optymalizacja importów lucide-react zakończona pomyślnie!');