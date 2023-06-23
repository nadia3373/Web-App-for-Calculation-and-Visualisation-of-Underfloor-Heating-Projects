FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11-slim

COPY . /

RUN chmod +x /start.sh && \
    pip install --no-cache-dir -r /requirements.txt

CMD ["/start.sh"]