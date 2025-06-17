# Trello-Like React App

The goal of this app is to get me used to React, including state managment, hooks, and references for Front-end development.
The second goal is to get more experience with Flask and my first experience with PostgreSQL for a backend.

## Feature List and Pic Demo

![image](https://github.com/user-attachments/assets/c3fdfd35-5e83-49ea-b3ef-e9e4b37de076)

## Demo Video

[![Watch Demo Video](https://github.com/user-attachments/assets/ef979fb0-12fb-4b57-a041-b1ed0c141331)](https://youtu.be/8c6WC_fdSEg)

## Tech Stack
- React
- TypeScript
- Flask
- PostgreSQL
- Vite

## Installation

### Database
PostgreSQL database
Download schema.sql and either use the CLI with this command
```
psql -U your_user -d my_project_db -f scheme.sql
```
Or follow instructions for pgAdmin

### RESTful API (Flask)

Go to the backend folder
```
cd backend
```
Create a virtual environment
```
python -m venv venv
source venv/bin/activate
```
For windows in PS
```
venv/Scripts/activate
```
Install requirements
```
pip install -r requirements.txt
```
Create .env file
Format
```
DATABASE_URL=PSQLDATABASEPASSWORDSTRING
```
Run it
```
python app.py
```

### FrontEnd (React + Vite)
At the top of the directory
```
npm install
```
Create a .env file at the top in this format
```
VITE_FLASK= FlaskURL
```
Run or build it
```
npm run dev
```
```
npm run build
npn run preview
```




