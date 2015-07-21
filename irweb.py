# Web frontend. This must be configured at the root of the application.

from flask import Flask, Response, jsonify, g, request, make_response, redirect, render_template, url_for
from io import StringIO
from ircore import ac_buttons, Button
from lirc.client import LircRemote, LircError
from subprocess import PIPE, Popen

class JinjaOverrideFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='<%',
        block_end_string='%>',
        variable_start_string='<<',
        variable_end_string='>>',
        comment_start_string='<#',
        comment_end_string='#>',
    ))

class ScriptPathFixer:
    """
    WSGI middleware which fixes PATH_INFO to not include the same prefix which is the SCRIPT_NAME.
    """
    def __init__(self, app):
        self._app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('SCRIPT_NAME', '')
        if script_name:
            #environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        #scheme = environ.get('HTTP_X_SCHEME', '')
        #if scheme:
        #    environ['wsgi.url_scheme'] = scheme
        return self._app(environ, start_response)

app = JinjaOverrideFlask(__name__, static_folder="static", template_folder="templates")
app.wsgi_app = ScriptPathFixer(app.wsgi_app)

@app.route("/api/buttons")
def get_buttons():
    """
    Gets the known buttons.
    :rtype: Response
    :return: The JSON result.
    """

    try:
        buttons = []

        for button in ac_buttons():
            buttons.append({"Id": button.name, "Label": button.label})

        return jsonify(success=True, message=None, buttons=buttons)
    except Exception as e:
        return jsonify(success=False, message=str(e), buttons=[])

@app.route("/api/press", methods=["POST"])
def press_button():
    """
    Sends a press command for a given button.
    :param str name: The button name (see ircore.Button.name).
    :rtype: Response
    :return: The JSON result.
    """
    name = request.json.get("name")

    if not name:
        return jsonify(success=False, message="Name not specified"), 400

    if "remote" not in g or not g.remote:
        try:
            g.remote = LircRemote("AC")     # TODO make configurable
        except LircError as e:
            return jsonify(success=False, message="An error occurred while connecting to LIRC: {0}".format(e.args[0])), 500

    if "known_names" not in g:
        g.known_names = set(button.name for button in ac_buttons())

    if name not in g.known_names:
        return jsonify(success=False, message="Unknown button '{0}'".format(name)), 400

    try:
        g.remote.send_one(name)
        return jsonify(success=True, message=None)
    except LircError as e:
        return jsonify(success=False, message="An error occurred while sending the IR command: {0}".format(e.args[0])), 500
    except Exception as e:
        return jsonify(success=False, message="An unknown error occurred while sending the IR command: {0}".format(str(e))), 500

@app.route("/status/image")
def current_image():
    response = Response()
    response.content_type = "image/jpeg"
    # TODO cache_control, max age 30 seconds?
    cmd = "/usr/bin/fswebcam -d /dev/video0 -F 1 -r 640x480 --no-banner"
    process = Popen(cmd.split(" "), stdout=PIPE)
    stdout, stderr = process.communicate()
    response.data = stdout
    return response


# Bit of a hack to enforce the client seeing the static page, because the web server hands everything under the path to this script
@app.route("/")
def index():
    return render_template("index.html")
    #return redirect("/public/index.html", 301)

@app.errorhandler(404)
def not_found(error):
    buf = StringIO()
    buf.write("not found!\n<br/><br/>\n")

    for k, v in sorted(request.environ.items()):
        print("{0}={1}<br/>\n".format(k, v), file=buf)

    return buf.getvalue(), 404

if __name__ == "__main__":
    app.run("localhost", 8888, True)
