# Admin Calendar Frontend (React + Vite)

This is a React + Vite front-end app implementing:

- Login with hardcoded credentials (admin and user)
- Admin dashboard: week calendar (Mon-Fri) with time slots, break and active hour
- Save button with rounded corners and hover ring
- Lessons list with boxes and left/right sliders; click to open details
- Toolbar with logo, profile, signout and users (admin only)
- Responsive: toolbar collapses into hamburger on small screens
- Users page with role dropdowns for each user (admin only)

Run the app

1. Open a PowerShell terminal in the project folder:

```powershell
cd "C:\Users\SRoy\Desktop\workspace"
```

2. Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`).

Credentials

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

Files

- `index.html` - Vite entry
- `package.json` - scripts and deps
- `src/main.jsx` - React entry
- `src/App.jsx` - main app and routing
- `src/components/*` - components
- `src/styles.css` - global styles

Notes

- This is a static front-end demo with no backend. Role-based behavior is enforced on the client only.
