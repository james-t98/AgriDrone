# scripts/data_population/populate_data.py
# Master script to populate all demo data

import subprocess
import sys

def run_script(script_name):
    """Run a population script and handle errors"""
    print(f"\n{'='*60}")
    print(f"Running: {script_name}")
    print('='*60)
    
    try:
        result = subprocess.run(
            [sys.executable, f"scripts/{script_name}"],
            check=True,
            capture_output=True,
            text=True
        )
        print(result.stdout)
        print(f"✅ {script_name} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running {script_name}:")
        print(e.stderr)
        return False

def main():
    """Run all data population scripts in sequence"""
    scripts = [
        "populate_images.py",
        "populate_cv_results.py",
        "populate_sensors.py",
        "populate_flights.py",
        # "populate_legal_docs.py",
        # "generate_past_reports.py"
    ]
    
    print("🚀 Starting data population for AgriDrone Demo...")
    
    success_count = 0
    for script in scripts:
        if run_script(script):
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Completed {success_count}/{len(scripts)} scripts successfully")
    print('='*60)
    
    if success_count == len(scripts):
        print("\n🎉 All data populated! Demo environment ready.")
        return 0
    else:
        print("\n⚠️  Some scripts failed. Check output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())