
from setuptools import setup
from Cython.Build import cythonize
import os

def find_py_files(package_dir):
    py_files = []
    for dirpath, _, filenames in os.walk(package_dir):
        # Skip any directory with 'migrations' in the path
        if 'migrations' in dirpath.replace('\\', '/'):
            continue

        for filename in filenames:
            if filename.endswith(".py") and filename != "__init__.py":
                full_path = os.path.join(dirpath, filename)
                py_files.append(full_path)

    return py_files

 
setup(
    ext_modules=cythonize(
        find_py_files("usersAuthApp"),
        build_dir="build",
        compiler_directives={'language_level': "3"},
    ),
)




