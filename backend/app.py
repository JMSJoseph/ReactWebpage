from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import psycopg2
import uuid
import bcrypt
#Load .env file
load_dotenv()

#Setup Flask, CORS and database URL from .env
app = Flask(__name__)
CORS(app)
DATABASE_URL = os.getenv("DATABASE_URL")

#Queries backend to make the colArray (board) by UUID
#I also do some parsing here of useless json for the frontend
@app.route('/get-board', methods = ["GET"])
def get_board():
    uuid = request.args.get('uuid')
    print(uuid)
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM posts WHERE uuid = %s ORDER BY id;", (uuid,))
        rows = cursor.fetchall()
        posts = [{"column_id": row[1], "title": row[2], "attachment": row[3], "description": row[4], "isGhost": row[5]} for row in rows]
        cursor.execute("SELECT * FROM columns WHERE uuid = %s ORDER BY id;", (uuid,))
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

#Updates columns and post tables (actually deletes and sets)
#TODO: Make this an actual update system
@app.route('/set-board', methods = ["POST"])
def set_board():
        rec_json =  request.get_json()
        uuid = request.args.get('uuid')
        print(uuid)
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM posts WHERE uuid = %s;", (uuid,))
            cursor.execute("DELETE FROM columns WHERE uuid = %s;", (uuid,))
            for column in rec_json:
                cursor.execute("INSERT INTO columns (title, is_ghost, uuid) VALUES (%s, %s, %s) RETURNING id", (column["title"], column["isGhost"], uuid))
                column_index = cursor.fetchone()[0]
                for post in column["posts"]:
                    cursor.execute("INSERT INTO posts (column_id, title, attachment, description, is_ghost, uuid) VALUES (%s, %s, %s, %s, %s, %s)", (column_index, post["title"], post["attachment"], post["description"], post["isGhost"], uuid)) 
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Success"}), 200
        except Exception as e:
            print(str(e))
            return jsonify({"set-board error": str(e)}), 500 

#Gets title from the backend by uuid
@app.route('/get-title', methods = ["GET"])
def get_title():
    uuid = request.args.get('uuid')
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM titles WHERE uuid = %s", (uuid,))
        title = cursor.fetchall()
        fetched_title = title[0][0]
        cursor.close()
        conn.close()
        return jsonify({"title": fetched_title})
    except Exception as e:
        print(str(e))
        return jsonify({"get-title error": str(e)}), 500

#Sets title from backend by uuid
#TODO: I might also need to make this an actual update system if I plan on users having multiple boards    
@app.route('/set-title', methods = ["POST"])
def set_title():
        rec_json = request.get_json()
        uuid = request.args.get('uuid')
        title = rec_json.get("title")
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("UPDATE titles SET title = (%s) WHERE uuid = %s", (title, uuid))
            if(cursor.rowcount == 0):
                 cursor.execute("INSERT INTO titles (title, uuid) VALUES(%s, %s)", (title, uuid))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Success"}), 200
        except Exception as e:
            print(str(e))
            return jsonify({"set-title error": str(e)}), 500 
#Gets uuid from board by checking username and then password against bcrypt hash
@app.route('/login-user', methods = ["GET"])
def login_user():
    user = request.args.get('user')
    password = request.args.get('password')
    password_bytes = password.encode("utf-8")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM auth WHERE username = %s", (user,))
        userInfo = cursor.fetchall()
        if(cursor.rowcount == 0):
            return jsonify({"Invalid User": "Invalid User"}), 400  
        if(bcrypt.checkpw(password_bytes, userInfo[0][1].encode("utf-8")) == False):
            return jsonify({"Invalid Pass": "Invalid Password"}), 400     
        cursor.close()
        conn.close()
        return jsonify({"uuid": userInfo[0][2]})
    except Exception as e:
        return jsonify({"login error": str(e)}), 500
#Registers user, assigning them a uuid and hashing their password through bcrypt 
@app.route('/register-user', methods = ["POST"])
def register_user():
        rec_json = request.get_json()
        user = rec_json.get("user")
        password = rec_json.get("password")
        password_bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashedPass = bcrypt.hashpw(password_bytes, salt)
        genUuid = uuid.uuid4()
        genUuidStr = str(genUuid)
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()
            cursor.execute("INSERT INTO auth (username, pass, uuid) VALUES(%s, %s, %s)", (user, hashedPass.decode("utf-8"), genUuidStr))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Success"}), 200
        except Exception as e:
            return jsonify({"register error": str(e)}), 500 

#Debug mode
#TODO: Not in prod do not run in debug
if __name__ == '__main__':
    app.run(debug=True)