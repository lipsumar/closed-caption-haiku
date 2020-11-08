FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN pip3 install pillow

COPY . .
EXPOSE 5000
CMD [ "python", "./flask-server.py" ]