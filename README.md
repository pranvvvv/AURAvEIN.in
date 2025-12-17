# Business Operating System (BOS)

This project is a high-performance, enterprise-grade Business Operating System (BOS) built with Next.js, PostgreSQL, and a custom JWT-based authentication system.

## 🚀 Getting Started

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set Up Environment Variables**
Create a `.env` file in the root of the project and add the following environment variables:
```
POSTGRES_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
```
Replace the placeholder values with your actual database connection URL and a secure JWT secret.

### 3. **Set Up the Database**
Run the following scripts to create the necessary tables in your PostgreSQL database:
```bash
node scripts/create-users-table.js
node scripts/create-contacts-table.js
```

### 4. **Run Development Server**
```bash
npm run dev
```

### 5. **Access the Application**
Navigate to `http://localhost:3000/register` to create a new account or `http://localhost:3000/login` to log in.

## 🔧 Technical Implementation

### Performance Optimizations
- **Optimized Routing**: Dynamic routes with efficient data fetching
- **Minimal Re-renders**: Efficient state management with React hooks

### State Management
- **React Hooks**: Local state management for forms and UI interactions

### Error Handling
- **Graceful Degradation**: Fallbacks for failed operations
- **User Feedback**: Clear error messages and success notifications

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL**
