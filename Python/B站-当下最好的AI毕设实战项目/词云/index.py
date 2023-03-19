from wordcloud import WordCloud, ImageColorGenerator
import matplotlib.pyplot as plt
import jieba
from PIL import Image
import numpy as np

text = " ".join(jieba.cut(open("dldd2.txt").read()))

mask_image = np.array(Image.open("./mask.png"))

# mask 白色部分会当
wc = WordCloud(
    mode="RGBA",
    font_path="./wryh.ttf",
    mask=mask_image,
    background_color=None,
).generate(text)

wc.recolor(color_func=ImageColorGenerator(mask_image))

plt.imshow(wc, interpolation="bilinear")
plt.axis("off")
plt.show()

wc.to_file("dldd2.png")
