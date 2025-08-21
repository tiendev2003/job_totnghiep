# IT Job Platform - Frontend

Ứng dụng ReactJS cho nền tảng tuyển dụng IT.

## Cấu trúc dự án

```
fe/
├── public/                 # Static files
├── src/
│   ├── assets/            # Images, icons, fonts
│   ├── components/        # Reusable components
│   │   ├── common/        # Common components (Loading, Modal, etc.)
│   │   └── layout/        # Layout components (Header, Footer, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── jobs/          # Job-related pages
│   │   ├── candidate/     # Candidate pages
│   │   ├── recruiter/     # Recruiter pages
│   │   └── admin/         # Admin pages
│   ├── router/            # Routing configuration
│   ├── services/          # API services
│   ├── store/             # Redux store and slices
│   │   └── slices/        # Redux slices
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── .env                   # Environment variables
├── .env.production        # Production environment variables
├── tailwind.config.js     # TailwindCSS configuration
├── vite.config.js         # Vite configuration
└── package.json
```

## Công nghệ sử dụng

- **React 19** - UI Framework
- **React Router** - Routing
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **React Toastify** - Notifications

## Cài đặt và chạy dự án

### 1. Cài đặt dependencies

```bash
cd fe
npm install
```

### 2. Cấu hình environment variables

Sao chép và chỉnh sửa file `.env`:

```bash
cp .env.example .env
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:4000`

### 4. Build cho production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Các tính năng chính

### Authentication
- Đăng nhập / Đăng ký
- Quên mật khẩu
- Xác thực email
- Protected routes theo role

### Roles & Permissions
- **Candidate**: Tìm việc, ứng tuyển, quản lý hồ sơ
- **Recruiter**: Đăng tin tuyển dụng, quản lý ứng viên
- **Admin**: Quản lý toàn bộ hệ thống

### Job Management
- Tìm kiếm và lọc việc làm
- Chi tiết công việc
- Ứng tuyển trực tuyến
- Lưu việc làm yêu thích

### User Management
- Quản lý hồ sơ cá nhân
- Dashboard theo role
- Thông báo realtime

## Redux Store Structure

```javascript
store: {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  jobs: {
    jobs: [],
    currentJob: null,
    filters: {},
    pagination: {}
  },
  candidate: {
    profile: null,
    applications: [],
    savedJobs: []
  },
  recruiter: {
    profile: null,
    postedJobs: [],
    applications: []
  },
  ui: {
    isLoading: false,
    notifications: [],
    modals: {}
  }
}
```

## API Services

### Auth Service
- `login(email, password)`
- `register(userData)`
- `verifyToken(token)`
- `forgotPassword(email)`
- `resetPassword(token, newPassword)`

### Job Service
- `getJobs(params)`
- `getJobById(id)`
- `createJob(jobData)`
- `updateJob(id, jobData)`
- `deleteJob(id)`
- `applyToJob(jobId, applicationData)`

## Routing

### Public Routes
- `/` - Trang chủ
- `/jobs` - Danh sách việc làm
- `/jobs/:id` - Chi tiết việc làm
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Protected Routes (Candidate)
- `/candidate/dashboard` - Dashboard ứng viên
- `/candidate/profile` - Hồ sơ ứng viên

### Protected Routes (Recruiter)
- `/recruiter/dashboard` - Dashboard nhà tuyển dụng
- `/recruiter/profile` - Hồ sơ công ty

### Protected Routes (Admin)
- `/admin/dashboard` - Dashboard admin

## Custom Hooks

### `useDebounce(value, delay)`
Debounce một giá trị trong khoảng thời gian nhất định.

### `useLocalStorage(key, initialValue)`
Quản lý state với localStorage.

### `useForm(initialValues, validationSchema)`
Quản lý form state và validation.

### `usePagination(totalItems, itemsPerPage)`
Xử lý phân trang.

## Utilities

### Helpers
- `formatCurrency()` - Format tiền tệ
- `formatDate()` - Format ngày tháng
- `truncateText()` - Cắt ngắn text
- `isValidEmail()` - Validate email
- `debounce()` - Debounce function

### Constants
- `JOB_TYPES` - Các loại công việc
- `EXPERIENCE_LEVELS` - Cấp độ kinh nghiệm
- `SALARY_RANGES` - Khoảng lương
- `VIETNAMESE_CITIES` - Danh sách thành phố

## Styling với TailwindCSS

### Custom Classes
```css
.btn-primary     /* Primary button */
.btn-secondary   /* Secondary button */
.input-field     /* Input field */
.card           /* Card component */
```

### Color Palette
- Primary: Blue shades
- Secondary: Gray shades
- Success: Green
- Warning: Yellow
- Error: Red

## Development Guidelines

### Component Structure
```jsx
// Component imports
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Component definition
const MyComponent = () => {
  // Hooks
  const [state, setState] = useState();
  const dispatch = useDispatch();
  
  // Event handlers
  const handleClick = () => {};
  
  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### File Naming
- Components: PascalCase (`UserProfile.jsx`)
- Hooks: camelCase with 'use' prefix (`useAuth.js`)
- Utils: camelCase (`helpers.js`)
- Constants: UPPER_SNAKE_CASE

### Import Order
1. React imports
2. Third-party libraries
3. Internal imports (services, utils, components)
4. Relative imports

## Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=IT Job Platform
VITE_APP_VERSION=1.0.0

# Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,application/pdf
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Troubleshooting

### Common Issues

1. **Import errors**: Kiểm tra alias paths trong `vite.config.js`
2. **Style not loading**: Kiểm tra TailwindCSS configuration
3. **Redux state not updating**: Kiểm tra reducer và action dispatch
4. **API calls failing**: Kiểm tra CORS và API base URL

### Debug Tips

1. Sử dụng Redux DevTools
2. Console.log trong development
3. Network tab để debug API calls
4. React Developer Tools

## Contributing

1. Tạo branch từ `main`
2. Implement features
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge to main

## License

MIT License
