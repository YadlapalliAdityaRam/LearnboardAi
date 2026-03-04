FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (default 8000 but rendered by env in docker-compose)
EXPOSE 8000

# Start gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
