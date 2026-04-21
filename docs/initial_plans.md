# Kezdeti terv

## Stack

- Backend: ASP.NET Core Web API (.NET 10)
- ORM: Entity Framework Core
- Adatbázis: PostgreSQL
- Auth: ASP.NET Core Identity + JWT Bearer (kész user/auth komponensek)
- Frontend: React + Vite, Tailwind
- Konténerizáció: Docker + docker-compose
- Teszt: xUnit (backend)

## Megvalósítás sorrendje

0. Tervezés (scope, pontcélok, endpoint lista, adatmodell)
1. Projektváz és környezet (backend + frontend)
2. Docker alap korán (postgres + api, opcionálisan frontend)
3. Adatmodell és ORM (User, Note), migrációk
4. Identity alapú auth integráció (register, login, JWT beállítás)
5. Notes API (legalább 2 végpont, célszerű CRUD)
6. React felület (login, notes lista, notes létrehozás/szerkesztés)
7. Tesztek (minimum 2 automata teszt)
8. Dokumentáció és beadási csomag véglegesítése

## Táblák felépítése (vázlat)

- User: Id, Email (egyedi), PasswordHash, CreatedAtUtc
- Note: Id, UserId (FK), Title, Content, CreatedAtUtc, UpdatedAtUtc
- Kapcsolat: egy User több Note rekorddal (1-N)

## Opcionális elemek

- Docker konténerizáció
- JWT autentikáció
- ORM használat
