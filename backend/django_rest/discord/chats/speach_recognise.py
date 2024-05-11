from discord.settings import BASE_DIR, VOSK_MODEL_PATH
import vosk
model = vosk.Model(VOSK_MODEL_PATH)
vosk.SetLogLevel(-1)

def recognise(path : str, lang : str = "ru") -> str:
    recognizer = vosk.KaldiRecognizer(model, 44100)
    with open(path, "rb") as f:
        print(f)
        audio_data = f.read()

    recognizer.AcceptWaveform(audio_data)
    result = recognizer.FinalResult()

    return result
