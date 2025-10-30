# Changelog

All notable changes to the Pomoductivity application (API + Client) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Push notification system using Pushover for timer events (start, stop, complete)

### Fixed
- Push notifications now properly configured for production deployment

## [2.0.0] - 2024-10-30

### Added

#### API (Backend)
- Docker deployment configuration with GitHub Actions workflow
- GitHub Container Registry (GHCR) integration for automated image builds
- Self-hosted runner deployment support
- ES6 module syntax migration (type: "module")
- Push notification system for timer events via Pushover
- Node.js 18+ requirement
- Comprehensive test suite (90+ tests)
- Settings API for customizable timer durations
- Real-time WebSocket updates for timer state
- Session history tracking
- Modular service-based architecture

#### Client (Frontend)
- Angular 18 frontend application
- Production API endpoint configuration
- Docker deployment with Nginx
- Modern Bootstrap 5 UI
- Real-time timer synchronization with backend
- ESLint and Prettier configuration for code quality
- Jest testing setup with Testing Library
- Tailwind CSS integration for styling

### Changed
- Refactored entire codebase to use ES6 modules
- Updated deployment path to `~/pomoductivity-deploy`
- Enhanced GHCR authentication in deployment workflow
- Modernized build pipeline

### Infrastructure
- Automated CI/CD pipeline with GitHub Actions
- Docker containerization for both API and client
- Multi-stage Docker builds for optimized images
- Self-hosted deployment configuration

## [1.0.0] - Initial Release

### Added
- Basic Pomodoro timer functionality
- Task management features
- REST API backend
- Angular frontend
- Timer state management
- Session types (focus, short break, long break)

---

## Version Guidelines

- **API Version**: Currently `2.0.0` (in `pomoductivity/package.json`)
- **Client Version**: Following `0.0.0` (in development, to be versioned with releases)
- **Combined Release**: This changelog tracks the application as a whole

### Versioning Strategy
- **Major**: Breaking API changes, major feature overhauls
- **Minor**: New features, non-breaking changes
- **Patch**: Bug fixes, minor improvements

[Unreleased]: https://github.com/yourusername/pomoductivity/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/yourusername/pomoductivity/releases/tag/v2.0.0
[1.0.0]: https://github.com/yourusername/pomoductivity/releases/tag/v1.0.0
