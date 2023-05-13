FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /app
COPY ./init_db.py /init_db.py
COPY ./start.sh /start.sh

RUN chmod +x /start.sh

CMD ["/start.sh"]