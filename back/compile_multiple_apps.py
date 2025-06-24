import os
import shutil
from setuptools import setup
from Cython.Build import cythonize
from contextlib import contextmanager

# === APPS TO COMPILE ===
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
]

SRC_ROOT = "./django_project"
DST_ROOT = "compiled_django_project/django_project"

@contextmanager
def change_working_dir(path):
    old_dir = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old_dir)

def find_relative_py_files(base_dir, app_name):
    """Returns list of relative paths to .py files for Cython"""
    py_files = []
    app_path = os.path.join(base_dir, app_name)
    for dirpath, _, filenames in os.walk(app_path):
        if 'migrations' in dirpath.replace('\\', '/'):
            continue
        for filename in filenames:
            if filename.endswith('.py') and filename != '__init__.py':
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, base_dir)
                py_files.append(rel_path)
    return py_files

def compile_apps(app_names, base_dir):
    all_files_to_compile = []
    for app in app_names:
        py_files = find_relative_py_files(base_dir, app)
        all_files_to_compile.extend(py_files)

    if not all_files_to_compile:
        print("❌ No .py files found to compile.")
        return

    print(f"🔧 Compiling {len(all_files_to_compile)} Python files...")

    with change_working_dir(base_dir):
        ext_modules = cythonize(
            all_files_to_compile,
            build_dir="build",
            compiler_directives={'language_level': "3"},
        )

        setup(
            name="CompiledDjangoApps",
            ext_modules=ext_modules,
            script_args=["build_ext"],
            options={'build_ext': {'build_lib': "build/lib", 'build_temp': "build/temp"}},
        )

        # Copy compiled files from build/lib to their respective original locations
        copy_compiled_files("build/lib", base_dir)

def copy_compiled_files(build_lib, base_dir):
    for root, _, files in os.walk(build_lib):
        for file in files:
            if file.endswith(('.pyd', '.so')):
                rel_path = os.path.relpath(root, build_lib)
                dst_dir = os.path.join(base_dir, rel_path)
                os.makedirs(dst_dir, exist_ok=True)
                shutil.copy2(os.path.join(root, file), os.path.join(dst_dir, file))

def remove_py_files_and_keep_compiled(dst_root, compiled_apps):
    for app in compiled_apps:
        app_dir = os.path.join(dst_root, app)
        for dirpath, _, filenames in os.walk(app_dir):
            for filename in filenames:
                if filename.endswith('.py') and filename != '__init__.py':
                    py_path = os.path.join(dirpath, filename)
                    base_name = filename[:-3]
                    compiled_found = False
                    for ext in ['.pyd', '.so']:
                        if os.path.exists(os.path.join(dirpath, base_name + ext)):
                            compiled_found = True
                            break
                    if compiled_found:
                        os.remove(py_path)

def remove_build_dir():
    build_dir = os.path.join(DST_ROOT, 'build')
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
        print("🧹 Removed build directory from destination project.")
    else:
        print("ℹ️ No build directory found in destination project to remove.")


def main():
    if os.path.exists(DST_ROOT):
        shutil.rmtree(DST_ROOT)

    shutil.copytree(
        SRC_ROOT,
        DST_ROOT,
        ignore=shutil.ignore_patterns('*.pyc', '__pycache__', 'build', '*.pyo'),
    )

    if APPS_TO_COMPILE:
        print(f"📦 Apps to compile: {APPS_TO_COMPILE}")
        compile_apps(APPS_TO_COMPILE, DST_ROOT)
        remove_py_files_and_keep_compiled(DST_ROOT, APPS_TO_COMPILE)
    else:
        print("⚠️ No apps specified for compilation.")


    remove_build_dir()  # ✅ Add this line



    print("✅ Compilation complete.")

if __name__ == "__main__":
    main()
