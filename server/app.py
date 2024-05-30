import subprocess

if __name__ == "__main__":
    services = [
        "./file_upload/file_upload_service.py",
        "./image_preprocess/image_preprocessing_service.py",
        "./modelserving/model_serving_service.py",
        "./result_interpret/result_interpretation_service.py",
        "preprocessing_trigger_service.py",
        "./database_service/database_service.py",
        "./history/history.py",
        "./signin/signin.py",
        "./signup/signup.py"
    ]
    
    processes = []
    
    for service in services:
        process = subprocess.Popen(["python", service])
        processes.append(process)
    
    for process in processes:
        process.wait()