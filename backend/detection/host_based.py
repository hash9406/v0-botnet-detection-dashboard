from config import Config

class HostBasedDetector:
    def __init__(self):
        self.cpu_threshold = Config.HOST_CPU_THRESHOLD
        self.memory_threshold = Config.HOST_MEMORY_THRESHOLD
        self.connection_threshold = Config.HOST_CONNECTION_THRESHOLD
    
    def detect(self, data):
        """Detect suspicious host behavior"""
        suspicious_processes = []
        
        if isinstance(data, list):
            for entry in data:
                flags = []
                
                # Check CPU usage
                cpu = entry.get('cpu_percent', entry.get('cpu', 0))
                if float(cpu) > self.cpu_threshold:
                    flags.append(f"High CPU: {cpu}%")
                
                # Check memory usage
                memory = entry.get('memory_percent', entry.get('memory_mb', entry.get('memory', 0)))
                if float(memory) > self.memory_threshold:
                    flags.append(f"High Memory: {memory}MB")
                
                # Check connections
                connections = entry.get('connection_count', entry.get('connections', 0))
                if int(connections) > self.connection_threshold:
                    flags.append(f"High Connections: {connections}")
                
                # If any flags, mark as suspicious
                if flags:
                    suspicious_processes.append({
                        'process_name': entry.get('process_name', entry.get('name', 'unknown')),
                        'pid': entry.get('pid', 'N/A'),
                        'cpu': cpu,
                        'memory': memory,
                        'connections': connections,
                        'flags': flags,
                        'severity': 'HIGH' if len(flags) >= 2 else 'MEDIUM'
                    })
        
        return {
            'suspicious_processes': suspicious_processes,
            'suspicious_count': len(suspicious_processes),
            'status': 'SUSPICIOUS' if len(suspicious_processes) > 0 else 'NORMAL',
            'message': f"{len(suspicious_processes)} suspicious processes detected" if suspicious_processes else "All processes appear normal"
        }
