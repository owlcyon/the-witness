FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

COPY ./start-reload.sh /start-reload.sh
RUN chmod +x /start-reload.sh

COPY ./start.sh /start.sh
RUN chmod +x /start.sh

ENV PYTHONPATH=/app

CMD ["/start.sh"]
