from firebase_functions import https_fn
from app import app as flask_backend_app

@https_fn.on_request()
def flask_app(req: https_fn.Request) -> https_fn.Response:
    with flask_backend_app.request_context(req.environ):
        return flask_backend_app.full_dispatch_request()
