# Core definitions for ircontrol.

from lirc.client import LircError, LircRemote

class Button:
    """
    Represents a single remote button.
    """

    def __init__(self, name, label):
        """
        :param str name: The button's internal (LIRC) name.
        :param str description: The button's label.
        """
        self.name = name
        self.label = label

_AC_BUTTONS = [
    Button("Power", "Power"),

    Button("TempTimerUp", "Temp \u2191"),
    Button("TempTimerDown", "Temp \u2193"),

    Button("FanUp", "Fan \u2191"),
    Button("FanDown", "Fan \u2193"),
    Button("AutoFan", "Automatic fan"),

    Button("Cool", "Cool"),
    Button("EnergySaver", "Energy saver mode"),
    Button("FanOnly", "Fan-only mode")
]

def ac_buttons():
    """
    Gets the buttons for the AC remote.
    :rtype: collections.abc.Iterable[Button]
    :return: The button definitions.
    """

    return list(_AC_BUTTONS)