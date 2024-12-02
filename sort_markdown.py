import re
import json

# Function to parse markdown content
# This function will extract headings, items, descriptions, and sub-items

def parse_markdown(content):
    headings = {}
    current_heading = None
    current_item = None

    for line in content.splitlines():
        # Match headings
        heading_match = re.match(r'^(#{2,})\s+(.*)', line)
        if heading_match:
            current_heading = heading_match.group(2).strip()
            headings[current_heading] = []
            continue

        # Match items
        item_match = re.match(r'^-\s+\[(.*)\]\((.*)\)\s*-?\s*(.*)', line)
        if item_match:
            current_item = {
                'name': item_match.group(1).strip(),
                'link': item_match.group(2).strip(),
                'description': item_match.group(3).strip(),
                'sub_items': []
            }
            if current_heading:
                headings[current_heading].append(current_item)
            continue

        # Match sub-items
        sub_item_match = re.match(r'^\s*-\s+\[(.*)\]\((.*)\)\s*-?\s*(.*)', line)
        if sub_item_match and current_item:
            sub_item = {
                'name': sub_item_match.group(1).strip(),
                'link': sub_item_match.group(2).strip(),
                'description': sub_item_match.group(3).strip()
            }
            current_item['sub_items'].append(sub_item)

    return headings

# Read the README.md file
with open('readme.md', 'r', encoding='utf-8') as file:
    markdown_content = file.read()

# Parse the markdown content
parsed_content = parse_markdown(markdown_content)

# Write the parsed content to a JSON file
with open('parsed_content.json', 'w', encoding='utf-8') as json_file:
    json.dump(parsed_content, json_file, ensure_ascii=False, indent=4)
