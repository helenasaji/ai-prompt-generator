import random

class PromptGenerator:
    def __init__(self):
        self.subjects = [
            "A highly detailed digital portrait",
            "A professional cinematic poster of a model",
            "A hyper-realistic close-up portrait with elevated facial features"
        ]
        self.environments = [
            "standing in a misty tea plantation",
            "against a dark cinematic studio background",
            "surrounded by glowing neon city lights"
        ]
        self.styles = [
            "photorealistic, 8k resolution, hyper-detailed skin texture",
            "digital portraiture, sharp focus, masterpiece",
            "cinematic concept art, hyper-detailed"
        ]
        self.lighting = [
            "cinematic dramatic lighting",
            "golden hour warmth, soft rim lighting",
            "volumetric lighting, moody atmosphere"
        ]
        self.camera = [
            "shot on 85mm lens, f/1.4",
            "macro photography, intricate details",
            "wide-angle anamorphic lens"
        ]

    def generate_random_prompt(self):
        subject = random.choice(self.subjects)
        environment = random.choice(self.environments)
        style = random.choice(self.styles)
        lighting = random.choice(self.lighting)
        camera = random.choice(self.camera)
        
        return f"{subject}, {environment}, {style}, {lighting}, {camera}, --ar 16:9"

generator = PromptGenerator()
print(generator.generate_random_prompt())
      
