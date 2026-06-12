import io
from firebase_functions import https_fn
from app import app as flask_backend_app

@https_fn.on_request()
def flask_app(req: https_fn.Request) -> https_fn.Response:
    body_bytes = req.get_data()
    environ = req.environ.copy()
    environ['wsgi.input'] = io.BytesIO(body_bytes)
    environ['CONTENT_LENGTH'] = str(len(body_bytes))
    
    with flask_backend_app.request_context(environ):
        return flask_backend_app.full_dispatch_request()

