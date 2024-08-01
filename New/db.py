import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="ccscloud.dlsu.edu.ph",
        user="username",
        password="password",
        database="Complete",
        port=20060
    )
    return connection

def execute_query(query, values=None, connection=None):
    cursor = connection.cursor()
    try:
        if values:
            cursor.execute(query, values)
        else:
            cursor.execute(query)
        connection.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise
    finally:
        cursor.close()

def fetch_one(query, values=None, connection=None):
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
    return result
