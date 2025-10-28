# AI Developer Guide for Pomoductivity Frontend

This guide provides instructions for AI agents and developers working with the Pomoductivity Angular frontend codebase.

## Project Overview

**Tech Stack:**
- Angular 18 (standalone components)
- TypeScript 5.5 (strict mode)
- Tailwind CSS 3.4 + SCSS
- RxJS 7.8 for reactive programming
- Jest 29 + Testing Library for testing
- ESLint + Prettier for code quality

**Architecture Pattern:** Facade pattern with reactive state management

## Directory Structure

```
src/app/
├── core/               # Core business logic
│   ├── models/        # TypeScript interfaces and types
│   ├── services/      # API services and facades
│   ├── state/         # State management with BehaviorSubjects
│   └── interceptors/  # HTTP interceptors (if needed)
├── shared/            # Reusable UI components
│   ├── components/    # Button, Pill, ProgressCircle, etc.
│   ├── pipes/         # Custom pipes (timeFormat, etc.)
│   └── directives/    # Custom directives
└── features/          # Feature modules
    ├── timer/         # Timer page component
    ├── history/       # History page component
    └── settings/      # Settings page component
```

## Important Patterns & Conventions

### 1. Standalone Components

All components are standalone (no NgModules):

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, /* other imports */],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
})
export class MyComponent {}
```

### 2. Dependency Injection

Use `inject()` function instead of constructor injection:

```typescript
export class MyComponent {
  private readonly myService = inject(MyService);
  private readonly http = inject(HttpClient);
}
```

### 3. State Management Pattern

**Three-layer pattern:**

1. **State Service** - Holds observable state using BehaviorSubject
2. **Facade Service** - Orchestrates API calls and state updates
3. **Component** - Subscribes to state observables

Example:

```typescript
// State Service
@Injectable({ providedIn: 'root' })
export class TimerStateService {
  private readonly state$ = new BehaviorSubject<TimerState>(INITIAL_STATE);

  public getState(): Observable<TimerState> {
    return this.state$.asObservable();
  }

  public setState(state: TimerState): void {
    this.state$.next(state);
  }
}

// Facade Service
@Injectable({ providedIn: 'root' })
export class TimerFacade {
  private readonly timerApi = inject(TimerApiService);
  private readonly timerState = inject(TimerStateService);

  public readonly state$ = this.timerState.getState();

  public start(): void {
    this.timerApi.start()
      .pipe(tap(response => this.timerState.setState(response.state)))
      .subscribe();
  }
}

// Component
export class TimerComponent {
  private readonly timerFacade = inject(TimerFacade);
  public state$ = this.timerFacade.state$;

  public onStart(): void {
    this.timerFacade.start();
  }
}
```

### 4. RxJS Best Practices

**Always clean up subscriptions:**

```typescript
export class MyComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.myService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {/* ... */});
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Use async pipe in templates when possible:**

```html
<div *ngIf="state$ | async as state">
  {{ state.value }}
</div>
```

### 5. Path Aliases

Use path aliases for clean imports:

```typescript
import { TimerState } from '@core/models/timer.models';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TimerComponent } from '@features/timer/timer.component';
```

**Available aliases:**
- `@app/*` → `src/app/*`
- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`
- `@environments/*` → `src/environments/*`

### 6. TypeScript Strict Mode

The project uses strict mode. Always:

- Define explicit return types for functions
- Use explicit types (avoid `any`)
- Mark private members with `private`/`protected`
- Use readonly where applicable

```typescript
// Good
public calculateProgress(state: TimerState): number {
  return (state.timeRemaining / 1500) * 100;
}

// Bad (no return type)
public calculateProgress(state: TimerState) {
  return (state.timeRemaining / 1500) * 100;
}
```

### 7. Component Inputs & Outputs

Use the new signal-based inputs (Angular 18+) or traditional decorators:

```typescript
@Component({/* ... */})
export class ButtonComponent {
  @Input() public variant: ButtonVariant = 'primary';
  @Input() public disabled = false;
  @Output() public readonly clicked = new EventEmitter<void>();
}
```

### 8. Styling with Tailwind

Use Tailwind utility classes and custom SCSS:

```html
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <button class="btn-primary">Click Me</button>
</div>
```

**Custom utility classes defined in `styles.scss`:**
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-icon` - Icon button style
- `.card` - Card container style
- `.input-field` - Input field style

### 9. Testing with Jest

**Component Test Example:**

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MyComponent } from './my-component.component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

**Service Test Example:**

```typescript
describe('TimerApiService', () => {
  let service: TimerApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TimerApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get timer status', () => {
    const mockState: TimerState = { /* ... */ };

    service.getStatus().subscribe(state => {
      expect(state).toEqual(mockState);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/timer/status');
    expect(req.request.method).toBe('GET');
    req.flush(mockState);
  });
});
```

### 10. Accessibility

Always include:
- ARIA labels on interactive elements
- Proper semantic HTML
- Keyboard navigation support
- Focus indicators

```html
<button
  type="button"
  [attr.aria-label]="'Start timer'"
  [attr.aria-pressed]="isRunning"
  (click)="onStart()"
>
  Start
</button>
```

## Common Tasks

### Adding a New Component

```bash
# Create component directory
mkdir src/app/shared/components/my-component

# Create files
touch src/app/shared/components/my-component/my-component.component.{ts,html,scss,spec.ts}
```

### Adding a New Feature

1. Create feature directory: `src/app/features/my-feature/`
2. Create component files
3. Add route to `app.routes.ts`:

```typescript
{
  path: 'my-feature',
  loadComponent: () =>
    import('./features/my-feature/my-feature.component')
      .then(m => m.MyFeatureComponent)
}
```

### Adding a New Service

1. Create service file in `src/app/core/services/`
2. Use `@Injectable({ providedIn: 'root' })`
3. Add tests in `.spec.ts` file

### Updating Models

Add new interfaces/types to `src/app/core/models/timer.models.ts` or create new model files.

## API Integration

**Backend URL:** `http://localhost:3000/api`

**Available Endpoints:**
- `GET /timer/status` - Get timer state
- `POST /timer/start` - Start timer
- `POST /timer/stop` - Stop timer
- `POST /timer/start-stop` - Toggle timer
- `POST /timer/reset` - Reset timer
- `POST /timer/set-type` - Set session type
- `GET /timer/history` - Get history
- `GET /settings` - Get settings
- `PUT /settings` - Update settings
- `POST /settings/reset` - Reset settings

**WebSocket:** `ws://localhost:3000` for real-time updates

## Code Quality Checks

Before committing:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Build
npm run build
```

## ESLint Rules

The project has 60+ ESLint rules. Key rules:

- Explicit return types required
- No `any` type allowed
- Private members must have leading underscore
- No nested subscriptions
- Always use `takeUntil` for cleanup
- Import organization enforced

## Common Pitfalls

### 1. Forgetting takeUntil

```typescript
// Bad
this.myService.data$.subscribe(data => {/* ... */});

// Good
this.myService.data$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {/* ... */});
```

### 2. Not providing router in tests

```typescript
// Bad
TestBed.configureTestingModule({
  imports: [MyComponent]
});

// Good
TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [provideRouter([])]
});
```

### 3. Wrong import for `of`

```typescript
// Bad
import { of } from 'rxjs/operators';

// Good
import { of } from 'rxjs';
```

### 4. Missing async pipe in templates

```typescript
// Bad (causes memory leaks)
public state: TimerState;
ngOnInit() {
  this.myService.state$.subscribe(s => this.state = s);
}

// Good
public state$ = this.myService.state$;
// Template: {{ state$ | async }}
```

## Performance Tips

1. Use `OnPush` change detection where possible
2. Use `trackBy` functions in `*ngFor`
3. Lazy load routes (already implemented)
4. Avoid unnecessary subscriptions (use async pipe)
5. Debounce user input handlers

## Debugging Tips

### Check WebSocket Connection

Open browser console and look for WebSocket connection logs.

### Verify API Connection

Check Network tab in DevTools for API calls to `localhost:3000`.

### Test State Updates

Use Redux DevTools or RxJS spy to monitor state changes.

## File Naming Conventions

- Components: `my-component.component.ts`
- Services: `my-service.service.ts`
- Models: `my-model.models.ts`
- Pipes: `my-pipe.pipe.ts`
- Directives: `my-directive.directive.ts`
- Tests: `*.spec.ts`

## Version Control

- Commit messages should be clear and descriptive
- Run `npm run lint:fix` before committing
- Ensure all tests pass: `npm test`
- Build should succeed: `npm run build`

## Deployment

1. Build for production: `npm run build`
2. Output is in `dist/pomoductivity-client/`
3. Serve with any static file server
4. Update API URLs for production environment

## Future Enhancements

When adding new features, consider:

1. Adding comprehensive tests
2. Updating documentation
3. Following existing patterns
4. Maintaining accessibility
5. Keeping bundle size small
6. Ensuring mobile responsiveness

## Getting Help

- Check `README.md` for setup instructions
- Review `docs/` directory for additional docs
- Check backend API docs at `../pomoductivity/docs/API.md`
- Review UI mockups at `/UI_MOCKUPS.md` (in backend directory)

---

**Remember:** This project prioritizes maintainability, type safety, and clean architecture. When in doubt, follow existing patterns in the codebase.
