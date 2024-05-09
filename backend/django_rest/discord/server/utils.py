from discord.settings import BASE_DIR
from string import ascii_letters
from random import randint
import uuid



def handle_upload_file_server(file, server_id : str) -> str:
    filename : str = str(uuid.uuid4())
    file_extension : str = str(file).split(".")[-1]

    _path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/media/images/servers/{server_id}/{filename}.{file_extension}"

    with open(file=_path, mode="wb") as _file:
        for _chunk in file.chunks():
            _file.write(_chunk)
    

    return f"media/images/servers/{server_id}/{filename}.{file_extension}"


def generate_link(server_uuid : str) -> str:
    NUMS : str = "1234567890"
    SYMBOLS : str = ascii_letters + NUMS
    SYMBOLS_LENGTH : int = len(SYMBOLS) - 1
    link : str = "invite/"
    link += "".join([SYMBOLS[randint(0, SYMBOLS_LENGTH)] for x in range(0, SYMBOLS_LENGTH)])
    return link
