# Argo Editor

A panoramic tour desktop editor for the Argo project.

## Requirements

Make sure you have these dependencies installed before moving forward:

- [Python 3.6-3.8.x](https://github.com/pyenv/pyenv)
  - [install for Windows](https://github.com/pyenv-win/pyenv-win)
- [Node](https://nodejs.org/en/)
- [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html)

## Installation

```bash
npm run init
```

This will create a virtual environment, install pip and Node dependencies. Alternatively you can perform these steps manually.

```bash
npm install
pip install -r requirements.txt
```

On Linux systems installation system makes educated guesses. If you run KDE, QT dependencies are installed, otherwise GTK is chosen. `apt` is used for installing GTK dependencies. In case you are running a non apt-based system, you will have to install GTK dependencies manually. See [installation](https://pywebview.flowrl.com/guide/installation.html) for details.

## Usage

To launch the application.

```bash
npm run start
```

To build an executable. The output binary will be produced in the `dist` directory.

```bash
npm run build
```

To start a development server (only for testing frontend code).

```bash
npm run dev
```
