import unittest
import subprocess
import json
import os
import tempfile

class TestSchedulerInvariants(unittest.TestCase):
    def run_scheduler(self, processes, algorithm='HYBRID', quantum=4, aging=10):
        # Format input for C program (N followed by AT, BT, PRI, TYPE lines)
        input_lines = [str(len(processes))]
        for p in processes:
            # Map TYPE string to integer
            type_int = 1
            if p['type'] == 'REAL_TIME': type_int = 1
            elif p['type'] == 'INTERACTIVE': type_int = 2
            elif p['type'] == 'BATCH': type_int = 3
            
            input_lines.append(f"{p['arrivalTime']} {p['burstTime']} {p['priority']} {type_int}")
            
        input_data = "\n".join(input_lines) + "\n"
        
        # We assume we are in the scheduler directory
        cmd = ['./scheduler_engine', '--json', '--algo', algorithm, '--quantum', str(quantum), '--aging', str(aging)]
        # Handle windows executable extension if needed
        if not os.path.exists('./scheduler_engine') and os.path.exists('./scheduler_engine.exe'):
            cmd[0] = './scheduler_engine.exe'
            
        result = subprocess.run(cmd, input=input_data, capture_output=True, text=True, check=True)
        output = json.loads(result.stdout)
        return output
            
    def assert_invariants(self, output):
        procs = output['processMetrics']
        for p in procs:
            orig = next(op for op in output['processes'] if op['id'] == p['processId'])
            
            # TAT = CT - AT
            expected_tat = p['completionTime'] - orig['arrivalTime']
            self.assertEqual(p['turnaroundTime'], expected_tat, f"P{p['processId']}: TAT != CT - AT")
            
            # WT = TAT - BT
            expected_wt = p['turnaroundTime'] - orig['burstTime']
            self.assertEqual(p['waitingTime'], expected_wt, f"P{p['processId']}: WT != TAT - BT")
            
            # WT >= 0
            self.assertGreaterEqual(p['waitingTime'], 0, f"P{p['processId']}: WT < 0")
            
            # TAT >= 0
            self.assertGreaterEqual(p['turnaroundTime'], 0, f"P{p['processId']}: TAT < 0")
            
            # CT >= AT
            self.assertGreaterEqual(p['completionTime'], orig['arrivalTime'], f"P{p['processId']}: CT < AT")
            
    def test_fcfs_invariants(self):
        procs = [
            {"id": 1, "arrivalTime": 0, "burstTime": 5, "priority": 1, "type": "BATCH"},
            {"id": 2, "arrivalTime": 1, "burstTime": 3, "priority": 1, "type": "BATCH"}
        ]
        out = self.run_scheduler(procs, algorithm='FCFS')
        self.assert_invariants(out)
        
    def test_sjf_invariants(self):
        procs = [
            {"id": 1, "arrivalTime": 0, "burstTime": 10, "priority": 1, "type": "BATCH"},
            {"id": 2, "arrivalTime": 1, "burstTime": 2, "priority": 1, "type": "BATCH"},
            {"id": 3, "arrivalTime": 2, "burstTime": 1, "priority": 1, "type": "BATCH"}
        ]
        out = self.run_scheduler(procs, algorithm='SJF')
        self.assert_invariants(out)
        self.assertEqual(out['processMetrics'][2]['completionTime'], 11) # P3 finishes at 11 (Non-preemptive SJF)
        
    def test_hybrid_aging_promotion(self):
        # A long batch process and short interactive processes
        procs = [
            {"id": 1, "arrivalTime": 0, "burstTime": 50, "priority": 1, "type": "BATCH"},
            {"id": 2, "arrivalTime": 2, "burstTime": 20, "priority": 1, "type": "REAL_TIME"}
        ]
        out = self.run_scheduler(procs, algorithm='HYBRID', aging=5)
        self.assert_invariants(out)
        
        # Check if aging event occurred
        aging_events = [e for e in out['events'] if e['type'] == 'AGING']
        self.assertGreater(len(aging_events), 0, "Aging should have occurred")
        
    def test_context_switches_counted(self):
        procs = [
            {"id": 1, "arrivalTime": 0, "burstTime": 4, "priority": 1, "type": "INTERACTIVE"},
            {"id": 2, "arrivalTime": 0, "burstTime": 4, "priority": 1, "type": "INTERACTIVE"}
        ]
        out = self.run_scheduler(procs, algorithm='ROUND_ROBIN', quantum=2)
        self.assert_invariants(out)
        self.assertGreater(out['metrics']['contextSwitches'], 0)

if __name__ == '__main__':
    unittest.main()
