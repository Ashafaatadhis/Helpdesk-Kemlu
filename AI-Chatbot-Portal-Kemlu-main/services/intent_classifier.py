import re

# ==========================
# SMALL TALK
# ==========================

SMALLTALK_PATTERNS = [
    r"^halo$",
    r"^hai$",
    r"^hi$",
    r"^hello$",
    r"^p$",
    r"^ping$",
    r"apa kabar",
    r"lagi apa",
    r"siapa kamu",
    r"kamu siapa",
    r"terima kasih",
    r"makasih",
    r"thanks",
    r"thank you",
    r"selamat pagi",
    r"selamat siang",
    r"selamat sore",
    r"selamat malam",
]

# ==========================
# FAQ
# ==========================

FAQ_PATTERNS = [
    r"paspor",
    r"visa",
    r"legalisasi",
    r"lapor diri",
    r"splp",
    r"kbri",
    r"kjri",
    r"kedutaan",
    r"perwakilan",
    r"peduli wni",
]

# ==========================
# FOLLOW UP
# ==========================

FOLLOWUP_PATTERNS = [
    r"berapa biayanya",
    r"berapa lama",
    r"berapa hari",
    r"bagaimana caranya",
    r"apa syaratnya",
    r"syaratnya",
    r"dokumen apa",
    r"lalu",
    r"terus",
    r"kemudian",
]

def classify_intent(message: str, has_context=False):
    """
    Return:
        smalltalk
        faq
        followup
        general
    """

    text = message.lower().strip()

    # Small Talk
    for pattern in SMALLTALK_PATTERNS:
        if re.search(pattern, text):
            return "smalltalk"

    # FAQ
    for pattern in FAQ_PATTERNS:
        if re.search(pattern, text):
            return "faq"

    # Follow Up
    if has_context:
        for pattern in FOLLOWUP_PATTERNS:
            if re.search(pattern, text):
                return "followup"

    # General AI
    return "general"

if __name__ == "__main__":

    tests = [
        "Halo",
        "Apa kabar",
        "Saya mau membuat paspor",
        "Berapa biayanya",
        "Apa itu ASEAN",
        "Terima kasih"
    ]

    for t in tests:
        print(t, "->", classify_intent(t, has_context=True))