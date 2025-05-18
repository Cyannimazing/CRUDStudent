## Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate   # if you have migrations
php artisan serve

## Frontend Setup (Nextjs)

```bash
cd frontend
npm install
npm run dev
