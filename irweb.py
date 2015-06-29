# Web frontend. This must be configured at the root of the application.

from flask import Flask, Response, jsonify, g, request
from ircore import ac_buttons, Button
from lirc.client import LircRemote, LircError

app = Flask(__name__)

@app.route("/api/buttons")
def get_buttons():
    """
    Gets the known buttons.
    :rtype: Response
    :return: The JSON result.
    """

    buttons = []

    for button in ac_buttons():
        buttons.append({"name": button.name, "label": button.label})

    return jsonify(buttons=buttons)

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
        return jsonify(message="Name not specified"), 400

    if "remote" not in g or not g.remote:
        try:
            g.remote = LircRemote("AC")     # TODO make configurable
        except LircError as e:
            return jsonify(message="An error occurred while connecting to LIRC: {0}".format(e.args[0])), 500

    if "known_names" not in g:
        g.known_names = set(button.name for button in ac_buttons())

    if name not in g.known_names:
        return jsonify(message="Unknown button '{0}'".format(name)), 400

    try:
        g.remote.send_one(name)
        return jsonify(success=True)
    except LircError as e:
        return jsonify(message="An error occurred while sending the IR command: {0}".format(e.args[0])), 500
    except Exception as e:
        return jsonify(message="An unknown error occurred while sending the IR command: {0}".format(str(e))), 500

if __name__ == "__main__":
    app.run("localhost", 8888, True)
