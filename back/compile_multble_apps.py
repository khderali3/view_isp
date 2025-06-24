import os
import shutil
from setuptools import setup
from Cython.Build import cythonize

# === EDIT HERE: put your app folder names to compile ===
APPS_TO_COMPILE = [
    'usersAuthApp',
    'staffAuthApp',
    'siteusersApp',
    'ticketSystemApp',
    'sitestaffApp',
	'ticketSystemStaffApp',
	'usersManagmentStaffApp',
    'projectFlowApp',
    'logSystemApp',
    # add more app folder names here
]

# Source and destination directories
SRC_ROOT = "."
DST_ROOT = "compiled_django_project"

def find_py_files(package_dir):
    py_files = []
    for dirpath, _, filenames in os.walk(package_dir):
        if 'migrations' in dirpath.replace('\\', '/'):
            continue
        for filename in filenames:
            if filename.endswith('.py') and filename != '__init__.py':
                py_files.append(os.path.join(dirpath, filename))
    return py_files

def compile_apps(app_names):
    all_files_to_compile = []
    for app in app_names:
        all_files_to_compile.extend(find_py_files(app))

    setup(
        ext_modules=cythonize(
            all_files_to_compile,
            build_dir="build",
            compiler_directives={'language_level': "3"},
            inplace=True,
        ),
        script_args=["build_ext", "--inplace"]
    )

def copy_project(src_root, dst_root, compiled_apps):
    if os.path.exists(dst_root):
        shutil.rmtree(dst_root)
    
    shutil.copytree(src_root, dst_root, ignore=shutil.ignore_patterns('*.pyc', '__pycache__', 'build', '*.pyo'))

    for app in compiled_apps:
        dst_app_path = os.path.join(dst_root, app)

        for dirpath, _, filenames in os.walk(dst_app_path):
            for filename in filenames:
                if filename.endswith('.py') and filename != '__init__.py':
                    py_file_path = os.path.join(dirpath, filename)
                    base_name = filename[:-3]

                    compiled_file = None
                    for ext in ['.pyd', '.so']:
                        candidate = os.path.join(dirpath, base_name + ext)
                        if os.path.exists(candidate):
                            compiled_file = candidate
                            break
                    
                    if compiled_file:
                        os.remove(py_file_path)  # remove original .py file

def main():
    if APPS_TO_COMPILE:
        print(f"Compiling apps: {APPS_TO_COMPILE}")
        compile_apps(APPS_TO_COMPILE)
    else:
        print("No apps specified for compilation. Skipping compilation.")
    
    print(f"Copying project from '{SRC_ROOT}' to '{DST_ROOT}'")
    copy_project(SRC_ROOT, DST_ROOT, APPS_TO_COMPILE)
    print("Done.")

if __name__ == "__main__":
    main()
