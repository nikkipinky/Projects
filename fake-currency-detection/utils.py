import os
import shutil

def organize_dataset(base_dir):
    train_dir = os.path.join(base_dir, 'Train')
    val_dir = os.path.join(base_dir, 'Test')

    # Check if folders exist
    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        raise Exception("Train or Test directories do not exist!")

    print("Dataset structure:")
    for dirpath, dirnames, filenames in os.walk(base_dir):
        print(f"{dirpath}: {len(filenames)} files")

def clear_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

# Example usage
base_dir = 'dataset'
organize_dataset(base_dir)
