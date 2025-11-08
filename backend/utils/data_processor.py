import pandas as pd
import json
import os

class DataProcessor:
    def parse_file(self, filepath):
        """Parse uploaded file (CSV, JSON, TXT, LOG)"""
        try:
            file_ext = os.path.splitext(filepath)[1].lower()
            
            if file_ext == '.csv':
                return self.parse_csv(filepath)
            elif file_ext == '.json':
                return self.parse_json(filepath)
            elif file_ext in ['.txt', '.log']:
                return self.parse_text(filepath)
            else:
                print(f"Unsupported file type: {file_ext}")
                return None
                
        except Exception as e:
            print(f"Error parsing file: {e}")
            return None
    
    def parse_csv(self, filepath):
        """Parse CSV file"""
        try:
            df = pd.read_csv(filepath)
            
            # Convert to lowercase column names
            df.columns = df.columns.str.lower().str.replace(' ', '_')
            
            # Convert to list of dicts
            data = df.to_dict('records')
            print(f"Parsed CSV: {len(data)} rows, columns: {list(df.columns)}")
            return data
            
        except Exception as e:
            print(f"CSV parse error: {e}")
            return None
    
    def parse_json(self, filepath):
        """Parse JSON file"""
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            # Ensure it's a list
            if isinstance(data, dict):
                # If single object, wrap in list
                if 'host_based' in data or 'behavior_based' in data or 'signature_based' in data:
                    # Combined format - flatten
                    combined = []
                    for key in ['host_based', 'behavior_based', 'signature_based']:
                        if key in data:
                            combined.extend(data[key] if isinstance(data[key], list) else [data[key]])
                    return combined
                else:
                    data = [data]
            
            print(f"Parsed JSON: {len(data)} entries")
            return data
            
        except Exception as e:
            print(f"JSON parse error: {e}")
            return None
    
    def parse_text(self, filepath):
        """Parse plain text file (one IP/domain per line)"""
        try:
            with open(filepath, 'r') as f:
                lines = [line.strip() for line in f if line.strip()]
            
            # Create structured data
            data = [{'item': line, 'type': 'unknown'} for line in lines]
            print(f"Parsed text: {len(data)} lines")
            return data
            
        except Exception as e:
            print(f"Text parse error: {e}")
            return None

def parse_json_data(filepath):
    """Parse JSON data from file"""
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return []

def save_results(results, file_path='data/scans/results.json'):
    try:
        from datetime import datetime
        results['timestamp'] = datetime.now().isoformat()
        existing = parse_json_data(file_path)
        if isinstance(existing, list):
            existing.append(results)
            with open(file_path, 'w') as f:
                json.dump(existing, f, indent=4)
        else:
            with open(file_path, 'w') as f:
                json.dump([results], f, indent=4)
    except Exception as e:
        print(f"Error saving results: {e}")
