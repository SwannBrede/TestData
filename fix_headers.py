#!/usr/bin/env python3

import re

# Read the quotes file
with open('client/src/components/quotes-updated.tsx', 'r') as f:
    quotes_content = f.read()

# Read the PO file
with open('client/src/components/purchase-orders-updated.tsx', 'r') as f:
    po_content = f.read()

# Pattern to match old button headers
old_pattern = r'<button\s+onClick=\{[^}]+\}\s+className="flex items-center space-x-1 hover:text-gray-700"\s*>\s*<span>([^<]+)</span>\s*<ArrowUpDown className="w-3 h-3" />\s*</button>'

# Function to replace with new Button component
def replace_button(match):
    text = match.group(1)
    return f'<Button variant="ghost" size="sm" onClick={{() => handleSort(\'{text.lower().replace(" ", "").replace("#", "Nbr")}\')}} className="h-auto p-0 font-medium text-gray-500 hover:text-gray-700">\n                  {text} <ArrowUpDown className="ml-1 w-3 h-3" />\n                </Button>'

# Replace all old buttons in quotes
quotes_content = re.sub(old_pattern, replace_button, quotes_content)

# Replace all old buttons in PO
po_content = re.sub(old_pattern, replace_button, po_content)

# Write back the files
with open('client/src/components/quotes-updated.tsx', 'w') as f:
    f.write(quotes_content)

with open('client/src/components/purchase-orders-updated.tsx', 'w') as f:
    f.write(po_content)

print("Fixed all headers in both files!")