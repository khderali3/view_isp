import os
import shutil
from setuptools import setup, Extension
from Cython.Build import cythonize
from contextlib import contextmanager
import glob

# === CONFIGURATION ===

# Apps (relative to project root) to compile

# APPS_TO_COMPILE = [
#     'django_project',
#     'ticketSystemApp',
 
# ]




APPS_TO_COMPILE = [
    'django_project',
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

# Full paths to the source and destination project directories
SRC_ROOT = os.path.abspath("./django_project")
DST_ROOT = os.path.abspath("./compiled_django_project/django_project")


# === UTILITY ===

@contextmanager
def change_working_dir(path):
    old_dir = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(old_dir)


def find_relative_py_files(base_dir, app_name):
    """Find .py files in an app, excluding __init__.py and migrations"""
    py_files = []
    app_path = os.path.join(base_dir, app_name)
    EXCLUDE_FILES = {'__init__.py', 'settings.py', 'asgi.py'}

    for dirpath, _, filenames in os.walk(app_path):
        if 'migrations' in dirpath.replace('\\', '/'):
            continue
        for filename in filenames:
            # if filename.endswith('.py') and filename != '__init__.py':
            if filename.endswith('.py') and filename not in EXCLUDE_FILES:
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
        # Create extensions with correct module names
        ext_modules = [
            Extension(
                name=os.path.splitext(f.replace(os.sep, "."))[0],
                sources=[f]
            ) for f in all_files_to_compile
        ]

        cythonized = cythonize(
            ext_modules,
            build_dir="build",
            compiler_directives={'language_level': "3"}
        )

        setup(
            name="CompiledDjangoApps",
            ext_modules=cythonized,
            script_args=["build_ext"],
            options={'build_ext': {'build_lib': "build/lib", 'build_temp': "build/temp"}},
        )

        copy_compiled_files("build/lib", base_dir)


def copy_compiled_files(build_lib, base_dir):
    """Copy .so/.pyd files from build to the destination project"""
    for root, _, files in os.walk(build_lib):
        for file in files:
            if file.endswith(('.pyd', '.so')):
                rel_path = os.path.relpath(root, build_lib)
                dst_dir = os.path.join(base_dir, rel_path)
                os.makedirs(dst_dir, exist_ok=True)
                shutil.copy2(os.path.join(root, file), os.path.join(dst_dir, file))


# def remove_py_files_and_keep_compiled(dst_root, compiled_apps):
#     """Delete .py files if compiled .so/.pyd file exists"""
#     for app in compiled_apps:
#         app_dir = os.path.join(dst_root, app)
#         for dirpath, _, filenames in os.walk(app_dir):
#             for filename in filenames:
#                 if filename.endswith('.py') and filename != '__init__.py':
#                     py_path = os.path.join(dirpath, filename)
#                     base_name = filename[:-3]
#                     compiled_found = False
#                     for ext in ['.pyd', '.so']:
#                         if os.path.exists(os.path.join(dirpath, base_name + ext)):
#                             compiled_found = True
#                             break
#                     if compiled_found:
#                         os.remove(py_path)

 
def remove_py_files_and_keep_compiled(dst_root, compiled_apps):
    for app in compiled_apps:
        app_dir = os.path.join(dst_root, app)
        for dirpath, _, filenames in os.walk(app_dir):
            for filename in filenames:
                if filename.endswith('.py') and filename != '__init__.py':
                    py_path = os.path.join(dirpath, filename)
                    base_name = filename[:-3]
                    # Look for any .so/.pyd files that start with base_name
                    pattern = os.path.join(dirpath, f"{base_name}.*.so")  # For Linux/macOS
                    pattern_win = os.path.join(dirpath, f"{base_name}.*.pyd")  # For Windows
                    if glob.glob(pattern) or glob.glob(pattern_win):
                        os.remove(py_path)
                        print(f"🗑️ Removed source file: {py_path}")






def remove_build_dir():
    build_dir = os.path.join(DST_ROOT, 'build')
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
        print("🧹 Removed build directory.")
    else:
        print("ℹ️ No build directory found.")


# === MAIN ===

def main():
    print(f"📁 Copying project from {SRC_ROOT} to {DST_ROOT}...")

    if os.path.exists(DST_ROOT):
        shutil.rmtree(DST_ROOT)

    shutil.copytree(
        SRC_ROOT,
        DST_ROOT,
        ignore=shutil.ignore_patterns('*.pyc', '__pycache__', 'build', '*.pyo'),
    )

    if APPS_TO_COMPILE:
        print(f"📦 Compiling apps: {APPS_TO_COMPILE}")
        compile_apps(APPS_TO_COMPILE, DST_ROOT)
        remove_py_files_and_keep_compiled(DST_ROOT, APPS_TO_COMPILE)
    else:
        print("⚠️ No apps specified to compile.")

    remove_build_dir()
    print("✅ Compilation complete.")


if __name__ == "__main__":
    main()
