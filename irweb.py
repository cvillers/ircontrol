# Web frontend. This must be configured at the root of the application.

from flask import Flask, Response, jsonify, g, request
from ircore import ac_buttons, Button
from lirc.client import LircRemote, LircError

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

app = JinjaOverrideFlask(__name__, static_folder="public", template_folder="templates")

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
    name = request.form.get("name")

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

if __name__ == "__main__":
    app.run("localhost", 8888, True)
