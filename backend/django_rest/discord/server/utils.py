from discord.settings import BASE_DIR
from soundfile import read, write
from string import ascii_letters
from random import randint
import uuid
import tempfile



def handle_upload_file_server(file, server_id : str) -> str:
    filename : str = str(uuid.uuid4())
    file_extension : str = str(file).split(".")[-1]

    _path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/media/images/servers/{server_id}/{filename}.{file_extension}"

    with open(file=_path, mode="wb") as _file:
        for _chunk in file.chunks():
            _file.write(_chunk)
    

    return f"media/images/servers/{server_id}/{filename}.{file_extension}"


def handle_upload_audio_server(file, server_id : str) -> str:
    filename : str = str(uuid.uuid4())
    file_extension : str = str(file).split(".")[-1]

    print(file_extension)

    _path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/media/audios/servers/{server_id}/{filename}.wav"

    # with open(file=_path, mode="wb") as _file:
    #     for _chunk in file.chunks():
    #         _file.write(_chunk)
    
 
    data, samplerate = read(file)
    
    write(_path, data, samplerate, format='wav')
    

    return f"media/audios/servers/{server_id}/{filename}.wav"


def generate_link(server_uuid : str) -> str:
    NUMS : str = "1234567890"
    SYMBOLS : str = ascii_letters + NUMS
    SYMBOLS_LENGTH : int = len(SYMBOLS) - 1
    link : str = "invite/"
    link += "".join([SYMBOLS[randint(0, SYMBOLS_LENGTH)] for x in range(0, SYMBOLS_LENGTH)])
    return link
