# API – Routes & Tests (curl)

Base URL:
http://localhost:3000/api

---

## Démarrage

npm install
npm run build
npm start

---

## Auth

### Register (le 1er user devient ADMIN)

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin","email":"admin@example.com"}'

### Login

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

Stocker le token:

export TOKEN="TON_ACCESS_TOKEN"

### Me

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

### Refresh

curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"TON_REFRESH_TOKEN"}'

---

## Members

curl -X GET http://localhost:3000/api/members -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/members/1 -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3000/api/members \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"id":9,"stageName":"Test","firstName":"A","lastName":"B","birthday":"01-01-2000","skzoo":"None"}'

curl -X PUT http://localhost:3000/api/members/9 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"stageName":"Test2","firstName":"A","lastName":"B","birthday":"01-01-2000","skzoo":"None"}'

curl -X DELETE http://localhost:3000/api/members/9 -H "Authorization: Bearer $TOKEN"

---

## Pets

curl -X GET http://localhost:3000/api/pets -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/pets/1 -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/pets/owner/2 -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3000/api/pets \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"id":99,"name":"Rex","type":"Dog","birthday":"01-01-2020","owner":1}'

curl -X PUT http://localhost:3000/api/pets/99 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Rex2","type":"Dog","birthday":"01-01-2020","owner":1}'

curl -X DELETE http://localhost:3000/api/pets/99 -H "Authorization: Bearer $TOKEN"

---

## Positions

curl -X GET http://localhost:3000/api/positions -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/positions/1 -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3000/api/positions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"id":10,"name":"Leader"}'

curl -X PUT http://localhost:3000/api/positions/10 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Main Leader"}'

curl -X DELETE http://localhost:3000/api/positions/10 -H "Authorization: Bearer $TOKEN"

### Positions ↔ Members (MtM)

curl -X POST http://localhost:3000/api/positions/1/members/2 -H "Authorization: Bearer $TOKEN"
curl -X DELETE http://localhost:3000/api/positions/1/members/2 -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/positions/1/members -H "Authorization: Bearer $TOKEN"

---

## sub-units

curl -X GET http://localhost:3000/api/sub-units -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/sub-units/1 -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3000/api/sub-units \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"id":10,"name":"Dance Team"}'

curl -X PUT http://localhost:3000/api/sub-units/10 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Main Dance Team"}'

curl -X DELETE http://localhost:3000/api/sub-units/10 -H "Authorization: Bearer $TOKEN"

### sub-units ↔ Members (MtM)

curl -X POST http://localhost:3000/api/sub-units/1/members/2 -H "Authorization: Bearer $TOKEN"
curl -X DELETE http://localhost:3000/api/sub-units/1/members/2 -H "Authorization: Bearer $TOKEN"
curl -X GET http://localhost:3000/api/sub-units/1/members -H "Authorization: Bearer $TOKEN"

---

