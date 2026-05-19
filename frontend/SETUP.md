# Setup Instructions

## Assets
Copy the `assets/` folder from the workspace root into `frontend/public/`:
```
cp -r assets/ frontend/public/assets/
```

## Running the app

### Backend (PHP)
```
php -S localhost:8000 -t backend/
```

### Frontend (React)
```
cd frontend
npm install
npm run dev
```

### Database
Create a MySQL database named `petify` and run:
```
mysql -u root -p petify < backend/schema.sql
```
