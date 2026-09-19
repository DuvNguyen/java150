import json
import os
import re

# Determine paths relative to project root
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

json_path = os.path.join(project_root, 'docs', 'neetcode150.json')
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

md_lines = [
    '# NeetCode 150 Checklist & Guide (Java)',
    '',
    'Danh sách 150 bài tập LeetCode / NeetCode thiết yếu cho luyện tập phỏng vấn Java DSA.',
    ''
]

total = 0
for category, problems in data.items():
    md_lines.append(f'## {category}\n')
    md_lines.append('| # | Bài tập (Problem) | Độ khó (Difficulty) | LeetCode | NeetCode |')
    md_lines.append('|---|-------------------|---------------------|----------|----------|')
    
    cat_dir = os.path.join(project_root, 'src', re.sub(r'[^a-zA-Z0-9]', '_', category).strip('_'))
    os.makedirs(cat_dir, exist_ok=True)
    
    for p_name, p_info in problems.items():
        total += 1
        diff = p_info.get('difficulty', 'Medium')
        lc_url = p_info.get('url', '#')
        nc_url = p_info.get('nurl', '#')
        
        md_lines.append(f'| {total} | {p_name} | `{diff}` | [LeetCode]({lc_url}) | [NeetCode]({nc_url}) |')
        
        file_basename = re.sub(r'[^a-zA-Z0-9]', '', p_name)
        java_path = os.path.join(cat_dir, f'{file_basename}.java')
        
        java_code = f'''/**
 * Problem: {p_name}
 * Category: {category}
 * Difficulty: {diff}
 * LeetCode: {lc_url}
 * NeetCode: {nc_url}
 */

public class {file_basename} {{
    // TODO: Implement solution for {p_name}
    public static void main(String[] args) {{
        System.out.println("Solution template for {p_name}");
    }}
}}
'''
        with open(java_path, 'w', encoding='utf-8') as jf:
            jf.write(java_code)

    md_lines.append('')

readme_path = os.path.join(project_root, 'NEETCODE150.md')
with open(readme_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(md_lines))

print(f"Successfully generated {total} problems into src/ and NEETCODE150.md!")
