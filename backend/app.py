from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import psycopg2
load_dotenv()

app = Flask(__name__)
CORS(app)
DATABASE_URL = os.getenv("DATABASE_URL")

@app.route('/get-board', methods = ["GET"])
def get_board():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM posts ORDER BY id;")
        rows = cursor.fetchall()
        posts = [{"column_id": row[1], "title": row[2], "attachment": row[3], "description": row[4], "isGhost": row[5]} for row in rows]
        cursor.execute("SELECT * FROM columns ORDER BY id;")
        row_col = cursor.fetchall()
        columns  = [{"id": row[0], "title": row[1], "posts": [], "isGhost": row[2]} for row in row_col]
        for column in columns:
             column["posts"] = []
             for post in posts:
                  if column["id"] == post["column_id"]:
                       column["posts"].append(post)
        for column in columns:
             del column["id"]
             for post in column["posts"]:
                  del post["column_id"]
                  
        cursor.close()
        conn.close()
        return jsonify(columns)
    except Exception as e:
        return jsonify({"get-board error": str(e)}), 500

@app.route('/set-board', methods = ["POST"])
def set_board():
        rec_json =  request.get_json()
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM posts;")
            cursor.execute("DELETE FROM columns;")
            cursor.execute("ALTER SEQUENCE columns_id_seq RESTART WITH 1;")
            cursor.execute("ALTER SEQUENCE posts_id_seq RESTART WITH 1;")
            column_index = 1
            for column in rec_json:
                cursor.execute("INSERT INTO columns (title, is_ghost) VALUES (%s, %s)", (column["title"], column["isGhost"]))
                for post in column["posts"]:
                    cursor.execute("INSERT INTO posts (column_id, title, attachment, description, is_ghost) VALUES (%s, %s, %s, %s, %s)", (column_index, post["title"], post["attachment"], post["description"], post["isGhost"])) 
                column_index += 1
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Success"}), 200
        except Exception as e:
            return jsonify({"set-board error": str(e)}), 500 


@app.route('/get-title', methods = ["GET"])
def get_title():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM titles ORDER BY id;")
        title = cursor.fetchall()
        fetched_title = title[0][1]
        cursor.close()
        conn.close()
        return jsonify({"title": fetched_title})
    except Exception as e:
        return jsonify({"get-title error": str(e)}), 500
    
@app.route('/set-title', methods = ["POST"])
def set_title():
        rec_json = request.get_json()
        title = rec_json.get("title")
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("UPDATE titles SET title = (%s) WHERE id = 1", (title,))
            if(cursor.rowcount == 0):
                 cursor.execute("INSERT INTO titles (id, title) VALUES(%s, %s)", (1, title))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Success"}), 200
        except Exception as e:
            return jsonify({"set-title error": str(e)}), 500 

if __name__ == '__main__':
    app.run(debug=True)