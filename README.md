# Pomoductivity Frontend

A modern, mobile-friendly Angular frontend for the Pomoductivity Pomodoro timer application. Built with Angular 18, TypeScript, Tailwind CSS, and comprehensive testing with Jest.

## Features

- **Modern UI/UX**: Clean, distraction-free interface with smooth animations
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: WebSocket integration for live timer synchronization
- **State Management**: Reactive state management using RxJS and Facade pattern
- **Type-Safe**: Full TypeScript strict mode with comprehensive type definitions
- **Well-Tested**: Jest + Testing Library for reliable unit and component tests
- **Code Quality**: ESLint with 60+ rules for consistent, maintainable code
- **Customizable Settings**: Adjust timer durations to fit your workflow
- **Session History**: Track your productivity with detailed session statistics

## Quick Start

### Prerequisites

- Node.js 18.19.1+ or 20.11.1+ (or 22.0.0+)
- npm 8.0.0+
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start

# Application will be available at http://localhost:4200
```

### Build

```bash
# Build for production
npm run build

# Output will be in dist/ directory
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Lint TypeScript and HTML
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Project Structure

```
pomoductivity-client/
├── src/
│   ├── app/
│   │   ├── core/                   # Core services, models, state
│   │   │   ├── models/            # TypeScript interfaces
│   │   │   ├── services/          # API services and facades
│   │   │   ├── state/             # State management
│   │   │   └── interceptors/      # HTTP interceptors
│   │   ├── shared/                # Shared components, pipes, directives
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── pipes/             # Custom pipes
│   │   │   └── directives/        # Custom directives
│   │   ├── features/              # Feature modules
│   │   │   ├── timer/             # Timer page
│   │   │   ├── history/           # History page
│   │   │   └── settings/          # Settings page
│   │   ├── app.component.*        # Root component
│   │   ├── app.routes.ts          # Route configuration
│   │   └── app.config.ts          # App configuration
│   ├── styles.scss                # Global styles
│   └── index.html                 # HTML entry point
├── docs/                          # Documentation
├── jest.config.js                 # Jest configuration
├── setup-jest.ts                  # Jest setup file
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── .eslintrc.json                 # ESLint configuration
└── .prettierrc                    # Prettier configuration
```

## Architecture

### Layered Architecture

1. **Core Layer** - Business logic, API communication, state management
2. **Shared Layer** - Reusable UI components, pipes, directives
3. **Feature Layer** - Feature-specific components and logic

### State Management

Uses the **Facade Pattern** with RxJS:

- **State Services**: Hold observable state using BehaviorSubjects
- **Facade Services**: Orchestrate business logic and API calls
- **Components**: Subscribe to state observables (no direct mutations)

Example:

```typescript
// State Service
@Injectable({ providedIn: 'root' })
export class TimerStateService {
  private state$ = new BehaviorSubject<TimerState>(INITIAL_STATE);

  getState(): Observable<TimerState> {
    return this.state$.asObservable();
  }

  setState(state: TimerState): void {
    this.state$.next(state);
  }
}

// Facade Service
@Injectable({ providedIn: 'root' })
export class TimerFacade {
  public readonly state$ = this.timerState.getState();

  start(): void {
    this.timerApi.start().subscribe(
      response => this.timerState.setState(response.state)
    );
  }
}

// Component
export class TimerComponent {
  private readonly timerFacade = inject(TimerFacade);
  public state$ = this.timerFacade.state$;

  onStart(): void {
    this.timerFacade.start();
  }
}
```

### Routing

Uses lazy-loaded standalone components:

```typescript
{
  path: 'timer',
  loadComponent: () => import('./features/timer/timer.component')
}
```

## Technology Stack

- **Framework**: Angular 18 (standalone components)
- **Language**: TypeScript 5.5 (strict mode)
- **Styling**: Tailwind CSS 3.4 + SCSS
- **State Management**: RxJS 7.8
- **Testing**: Jest 29 + Testing Library
- **Linting**: ESLint 8 + Prettier 3
- **HTTP Client**: Angular HttpClient
- **WebSocket**: Native WebSocket API

## Design System

### Color Palette

- **Primary (Indigo)**: `#6366f1` - Focus sessions
- **Success (Emerald)**: `#10b981` - Short breaks
- **Warning (Yellow)**: `#eab308` - Long breaks

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

## Testing Strategy

### Unit Tests

- Services: 90%+ coverage
- Components: 80%+ coverage
- Utilities: 100% coverage

### Test Structure

```typescript
describe('TimerFacade', () => {
  let facade: TimerFacade;
  let mockApi: jest.Mocked<TimerApiService>;

  beforeEach(() => {
    // Setup
  });

  it('should start timer', () => {
    // Test
  });
});
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api`.

### Endpoints

- `GET /api/timer/status` - Get current timer state
- `POST /api/timer/start` - Start timer
- `POST /api/timer/stop` - Stop timer
- `POST /api/timer/start-stop` - Toggle timer
- `POST /api/timer/reset` - Reset timer
- `POST /api/timer/set-type` - Set session type
- `GET /api/timer/history` - Get session history
- `GET /api/settings` - Get timer settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/reset` - Reset settings

### WebSocket

Real-time updates via WebSocket at `ws://localhost:3000`.

## Code Quality

### ESLint Rules

60+ rules including:

- TypeScript: Explicit types, naming conventions
- Angular: Component selectors, OnPush detection
- RxJS: No nested subscribe, takeUntil enforcement
- Import organization and alphabetization

### Path Aliases

```typescript
import { TimerState } from '@core/models/timer.models';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TimerComponent } from '@features/timer/timer.component';
```

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- WCAG AA compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Environment Configuration

Currently uses hardcoded API URLs. For production:

1. Create `src/environments/environment.prod.ts`
2. Set production API URL
3. Update services to use environment variables

## Development Guidelines

### Creating a New Component

```bash
# Create component directory
mkdir src/app/shared/components/my-component

# Create component files
touch src/app/shared/components/my-component/my-component.component.{ts,html,scss}
```

### Component Template

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
})
export class MyComponent {}
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/angular';
import { MyComponent } from './my-component.component';

describe('MyComponent', () => {
  it('should render', async () => {
    await render(MyComponent);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist .angular
npm install
```

### WebSocket Connection Issues

Ensure the backend server is running on `http://localhost:3000`.

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Run `npm run lint:fix` before committing
4. Ensure all tests pass: `npm test`
5. Update documentation as needed

## Performance Optimization

- Lazy-loaded routes
- OnPush change detection (recommended)
- TrackBy functions in ngFor
- Debounced input handlers
- Optimized bundle size with tree-shaking

## Future Enhancements

- Service worker for offline support
- Progressive Web App (PWA) features
- Push notifications for timer completion
- Dark mode support
- User authentication
- Multi-language support (i18n)
- Timer sound customization

## License

ISC

## Author

Built for use with the Pomoductivity REST API.

## Support

For issues and questions:
- Check the documentation in `docs/`
- Review the [Backend API docs](../pomoductivity/docs/API.md)

---

**Happy Productivity!** 🍅⏱️
