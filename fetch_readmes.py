import requests
import json
import time
import os
import logging
from datetime import datetime
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('readme_fetcher.log'),
        logging.StreamHandler()
    ]
)

class ReadmeFetcher:
    def __init__(self, force_update=False):
        self.force_update = force_update
        self.data_dir = os.path.join('data', 'readmes')
        self.failed_file = os.path.join('data', 'failed_items.json')
        self.rate_limit_pause = 2  # seconds between requests
        
        # Create directories
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(os.path.dirname(self.failed_file), exist_ok=True)

    def fetch_readme(self, github_url):
        """Fetch README from a GitHub repository"""
        base_url = github_url.replace('#readme', '').replace('github.com', 'raw.githubusercontent.com')
        branches = ['main', 'master']
        filenames = ['README.md', 'readme.md', 'Readme.md']
        
        for branch in branches:
            for filename in filenames:
                raw_url = f"{base_url}/{branch}/{filename}"
                logging.info(f"Trying: {raw_url}")
                
                try:
                    response = requests.get(raw_url)
                    if response.status_code == 200:
                        logging.info(f"Success! Found README at: {raw_url}")
                        return response.text
                    elif response.status_code == 403:
                        logging.warning("Rate limit hit, waiting for 60 seconds...")
                        time.sleep(60)  # Wait longer if we hit rate limit
                        continue
                    logging.warning(f"Failed to fetch {raw_url}: Status {response.status_code}")
                except Exception as e:
                    logging.error(f"Error fetching {raw_url}: {e}")
        
        return None

    def save_readme(self, content, name):
        """Save README content to a file"""
        filename = f"{name.lower().replace(' ', '_')}.md"
        file_path = os.path.join(self.data_dir, filename)
        
        if os.path.exists(file_path) and not self.force_update:
            logging.info(f"Skipping {filename} (already exists)")
            return False
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logging.info(f"Saved: {filename}")
            return True
        except Exception as e:
            logging.error(f"Error saving {filename}: {e}")
            return False

    def save_failed_items(self, failed_items):
        """Save failed items for later retry"""
        try:
            with open(self.failed_file, 'w') as f:
                json.dump(failed_items, f, indent=2)
        except Exception as e:
            logging.error(f"Error saving failed items: {e}")

    def process_all_items(self):
        start_time = datetime.now()
        failed_items = []
        
        # Load parsed_content.json
        try:
            with open('parsed_content.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            logging.error(f"Error loading parsed_content.json: {e}")
            return
        
        # Initialize counters
        total_items = sum(len(items) for category, items in data.items() 
                         if category != "Contents" and isinstance(items, list))
        processed = successful = failed = skipped = 0
        
        logging.info(f"Starting to process {total_items} items at {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Process each category and its items
        for category_name, items in data.items():
            if category_name != "Contents" and isinstance(items, list):
                logging.info(f"\nProcessing category: {category_name}")
                
                for item in items:
                    processed += 1
                    if 'link' in item and 'name' in item:
                        logging.info(f"\n[{processed}/{total_items}] Processing: {item['name']}")
                        
                        readme_content = self.fetch_readme(item['link'])
                        if readme_content:
                            if self.save_readme(readme_content, item['name']):
                                successful += 1
                                logging.info(f"✓ Successfully processed {item['name']}")
                            else:
                                skipped += 1
                                logging.info(f"⚠ Skipped {item['name']} (already exists)")
                        else:
                            failed += 1
                            failed_items.append({
                                'category': category_name,
                                'name': item['name'],
                                'link': item['link']
                            })
                            logging.error(f"✗ Failed to fetch README for {item['name']}")
                        
                        # Progress update
                        progress = (processed / total_items) * 100
                        logging.info(f"Progress: {progress:.1f}% | Success: {successful} | Failed: {failed} | Skipped: {skipped}")
                        logging.info("-" * 50)
                        
                        # Rate limiting
                        time.sleep(self.rate_limit_pause)
        
        # Save failed items for later retry
        if failed_items:
            self.save_failed_items(failed_items)
        
        # Final summary
        end_time = datetime.now()
        duration = end_time - start_time
        
        summary = f"""
{"=" * 50}
SUMMARY
{"=" * 50}
Total items processed: {processed}/{total_items}
Successful: {successful}
Failed: {failed}
Skipped: {skipped}
Time taken: {duration}
Start time: {start_time.strftime('%Y-%m-%d %H:%M:%S')}
End time: {end_time.strftime('%Y-%m-%d %H:%M:%S')}
{"=" * 50}
"""
        logging.info(summary)

def main():
    # You can set force_update=True to overwrite existing files
    fetcher = ReadmeFetcher(force_update=False)
    fetcher.process_all_items()

if __name__ == "__main__":
    main() 