from discord.settings import SECRET_KEY
import jwt


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

