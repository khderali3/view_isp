import os

def remove_pyd_files(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".pyd"):
                full_path = os.path.join(dirpath, filename)
                print(f"Removing {full_path}")
                os.remove(full_path)

if __name__ == "__main__":
    # Change this to your target directory
    remove_pyd_files("usersAuthApp")
