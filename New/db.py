import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="ccscloud.dlsu.edu.ph",
        user="username",
        password="password",
        database="Complete",
        port=20060
    )

def execute_query(query, values):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def fetch_all(query, values=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, values)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

def fetch_one(query, values=None):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        if values:
            cursor.execute(query, values)
        else:
            cursor.execute(query)
        result = cursor.fetchone()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise
    finally:
        cursor.close()
        connection.close()
    return result