import io
import os
from flask import Flask
from flask import send_file
from flask import request
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw


server = Flask(__name__)


@server.route("/")
def hello():
    return "Hello World!"


@server.route("/img")
def imageroute():
    img = Image.open("backgrounds/"+request.args.get('bg'))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype("fonts/ArchivoBlack-Regular.ttf", 45)
    line_height = 90
    img_w = 1280
    img_h = 720

    y = img_h/2 - (line_height*3)/2

    draw_centered_text(img_w, y, request.args.get('t1'), draw, font)
    y += line_height
    draw_centered_text(img_w, y, request.args.get('t2'), draw, font)
    y += line_height
    draw_centered_text(img_w, y, request.args.get('t3'), draw, font)

    # w, h = draw.textsize(request.args.get('t2'), font)
    # draw.rectangle(
    #     [(img_w/2-w/2, y), ((img_w/2-w/2)+w, y+line_height+h)], fill="black")
    # draw.text((img_w/2-w/2, y+line_height),
    #           request.args.get('t2'), (255, 255, 255), font=font)

    # w, h = draw.textsize(request.args.get('t3'), font)
    # draw.rectangle(
    #     [(img_w/2-w/2, y), ((img_w/2-w/2)+w, y+line_height*2+h)], fill="black")
    # draw.text((img_w/2-w/2, y+line_height*2),
    #           request.args.get('t3'), (255, 255, 255), font=font)

    file_path = "out.jpg"
    img.save(file_path)
    # return send_file("out.jpg", mimetype='image/jpg')
    return_data = io.BytesIO()
    with open(file_path, 'rb') as fo:
        return_data.write(fo.read())
    # (after writing, cursor will be at last byte, so move it to start)
    return_data.seek(0)

    os.remove(file_path)

    return send_file(return_data, mimetype='image/jpg')


def draw_centered_text(img_w, y, text, draw, font):
    w, h = draw.textsize(text, font)
    x = img_w/2 - w/2
    draw.rectangle([(x, y), (x+w, y+h)], fill="black")
    draw.text((x, y), text, (255, 255, 255), font=font)


if __name__ == "__main__":
    server.run(host='0.0.0.0')
