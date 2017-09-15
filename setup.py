from setuptools import setup
from channelbindjs import VERSION
import os

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as readme:
    README = readme.read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='channelbindjs',
    version=VERSION,
    author='Mathew Oakes',
    author_email='like@mathewoak.es',
    description=('Activate html document elements for inline editing and '
                 'live updating from a django-channels backend.'),
    license='BSD',
    long_description=README,
    install_requires=[
        'Django>=1.8',
        'channels>=1.1.6',
    ],
    packages=['channelbindjs'],
    package_data={'': ['static/channelbindjs/activate.js']},
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: Internet :: WWW/HTTP',
    ]
)
