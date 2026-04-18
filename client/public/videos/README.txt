# Dopamine Loop Assets

Este directorio está enlazado a la precarga (preloading) asincrónica del Frontend.
Añadir vídeos locales aquí:
1. `reward.webm` (Recomendado: Animación Veo/Sora de 5s).
2. `reward.mp4` (Fallback Safari/iOS).

El socket manda la instrucción temporal {"acao_ui": "recompensa_video"} a Zustand, quien levanta el Framer Motion sobre el Z-Index y dispara autoPlay aquí.
