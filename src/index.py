import os
import threading
import webview

from time import time
from API.API import Api


def get_entrypoint():
    """
    Mounts web application
    """
    def exists(path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))

    if exists('../gui/index.html'): # unfrozen development
        return '../gui/index.html'

    if exists('../Resources/gui/index.html'): # frozen py2app
        return '../Resources/gui/index.html'

    if exists('./gui/index.html'):
        return './gui/index.html'

    raise Exception('No index.html found')


def set_interval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop(): # executed in another thread
                while not stopped.wait(interval): # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True # stop if the program exits
            t.start()
            return stopped
        return wrapper
    return decorator



entry = get_entrypoint()

@set_interval(1)
def update_ticker():
    pass


if __name__ == '__main__':
    # Starts the application
    window = webview.create_window('Style Transfer', entry, js_api=Api())
    webview.start(update_ticker, debug=True)
