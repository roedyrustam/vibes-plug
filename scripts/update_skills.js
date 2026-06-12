const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../skills');

function updateSkills() {
    const dirs = fs.readdirSync(skillsDir);
    
    dirs.forEach(dir => {
        const skillPath = path.join(skillsDir, dir, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
            let content = fs.readFileSync(skillPath, 'utf-8');
            
            // Remove unnecessary frontmatter
            content = content.replace(/github:.*?\n/g, '');
            content = content.replace(/risk:.*?\n/g, '');
            content = content.replace(/source:.*?\n/g, '');
            content = content.replace(/date_added:.*?\n/g, '');
            
            // Standardize headers
            content = content.replace(/^## When to Use$/gm, '## Kondisi Pemicu');
            
            // Update technologies to make them "semakin relevan"
            content = content.replace(/React 18/g, 'React 19');
            content = content.replace(/Next\.js 14/g, 'Next.js 15');
            content = content.replace(/Tailwind CSS v3/g, 'Tailwind CSS v4');
            content = content.replace(/TanStack Query v4/g, 'TanStack Query v5');
            content = content.replace(/Bun v1\.0/g, 'Bun v1.1+');
            
            // Fix encoding issues from ui_ux_expert
            content = content.replace(/ðŸŽ¯/g, '🎯');
            content = content.replace(/ðŸ§ /g, '🧠');
            content = content.replace(/ðŸŽ¨/g, '🎨');
            content = content.replace(/ðŸ“±/g, '📱');
            content = content.replace(/ðŸ§©/g, '🧩');
            content = content.replace(/âš™ï¸ /g, '⚙️');
            content = content.replace(/ðŸš€/g, '🚀');
            content = content.replace(/â Œ/g, '❌');

            fs.writeFileSync(skillPath, content, 'utf-8');
            console.log(`Updated: ${dir}`);
        }
    });
}

updateSkills();
