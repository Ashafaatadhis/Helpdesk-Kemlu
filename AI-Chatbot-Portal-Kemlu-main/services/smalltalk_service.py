import json
import random
import os

# lokasi file json
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
JSON_PATH = os.path.join(BASE_DIR, "data", "smalltalk.json")

with open(JSON_PATH, encoding="utf-8") as f:
    SMALLTALK = json.load(f)


def get_smalltalk_reply(message):

    text = message.lower()

    for keyword, replies in SMALLTALK.items():

        if keyword in text:
            return random.choice(replies)

    return None

if __name__ == "__main__":

    while True:

        msg = input("Anda : ")

        print("Bot :", get_smalltalk_reply(msg))