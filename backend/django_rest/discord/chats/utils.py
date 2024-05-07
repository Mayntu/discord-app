from discord.settings import BASE_DIR
import uuid


def handle_upload_file(file) -> str:
    filename : str = str(uuid.uuid4())
    file_extension : str = str(file).split(".")[-1]

    _path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/media/images/{filename}.{file_extension}"

    with open(file=_path, mode="wb") as _file:
        for _chunk in file.chunks():
            _file.write(_chunk)
    

    return f"media/images/{filename}.{file_extension}"

def handle_upload_audio(file) -> str:
    filename : str = str(uuid.uuid4())
    file_extension : str = str(file).split(".")[-1]

    _path : str = f"{BASE_DIR.parent.parent.parent}/frontend/public/media/audios/{filename}.{file_extension}"

    with open(file=_path, mode="wb") as _file:
        for _chunk in file.chunks():
            _file.write(_chunk)
    

    return f"media/audios/{filename}.{file_extension}"