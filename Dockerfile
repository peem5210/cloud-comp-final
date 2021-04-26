FROM python:3.9
COPY ./backend /app
WORKDIR /app
RUN pip3 install -r requirements.txt
CMD ["uvicorn", "server:app", "--reload", "--host", "0.0.0.0", "--port", "15400"]