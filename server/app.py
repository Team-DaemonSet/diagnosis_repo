import subprocess

if __name__ == "__main__":
    services = [
        "file_upload_service.py",
        "image_preprocessing_service.py",
        "model_serving_service.py",
        "result_interpretation_service.py",
        "signin.py",
        "signup.py"
    ]
    
    processes = []
    
    for service in services:
        process = subprocess.Popen(["python", service])
        processes.append(process)
    
    for process in processes:
        process.wait()