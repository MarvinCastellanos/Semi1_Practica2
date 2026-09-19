import os
import psycopg2


def obtener_conexion():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db-semi1-g1.postgres.database.azure.com"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "marvin"),
        password=os.getenv("DB_PASSWORD", "Seminario12026")
    )