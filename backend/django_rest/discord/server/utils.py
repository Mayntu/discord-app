from discord.settings import SECRET_KEY, BASE_DIR
import jwt
import uuid



def generate_jwt(uuid : str, login : str, password : str):
    if uuid and login and password:
        context : dict = {
            "uuid" : uuid,
            "login" : login,
            "password" : password,
        }
        algorithm : str = "HS256"
        return jwt.encode(
            payload=context,
            key=SECRET_KEY,
            algorithm=algorithm,
        ).decode()
    
    return 1


def get_token(token : str):
    if token:
        try:
            data = jwt.decode(
                jwt=token,
                key=SECRET_KEY,
            )
            return data
        except Exception as e:
            print(e)
            return False
    
    return False


def handle_upload_file(file) -> str:
    filename : str = str(uuid.uuid4())
    file_extension : str = str(file).split(".")[-1]

    _path : str = f"{BASE_DIR.parent.parent.parent}/media/images/{filename}.{file_extension}"

    with open(file=_path, mode="wb") as _file:
        for _chunk in file.chunks():
            _file.write(_chunk)
    

    return f"media/images/{filename}.{file_extension}"
