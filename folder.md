menu-service/
├─ app.js
├─ .env
├─ package.json
├─ package-lock.json
├─ node_modules/
├─ src/
│  ├─ database/
│  │  ├─ db.js
│  │  ├─ init.js
│  │  ├─ models/
│  │  │  ├─ category.js
│  │  │  └─ menu_item.js
│  │  └─ seeds/
│  │     ├─ category.js
│  │     └─ menu_item.js
│  ├─ di/
│  │  └─ container.js
│  ├─ kafka/
│  ├─ middleware/
│  │  └─ errorHandler.js
│  └─ modules/
│     └─ menu/
│        ├─ repository.js
│        ├─ service.js
│        └─ routes.js
└─ menu.sqlite   <-- keep inside menu-service root
