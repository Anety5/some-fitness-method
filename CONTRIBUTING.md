# Contributing to S.O.M.E fitness method

Thank you for your interest in contributing to the S.O.M.E fitness method project!

## Development Workflow

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `develop`
4. **Make your changes** following our guidelines
5. **Test thoroughly** before submitting
6. **Submit a pull request** to the `develop` branch

### Branch Strategy
```
main (production)
├── develop (integration)
├── feature/user-profile-enhancements
├── feature/gps-tracking-improvements
├── hotfix/security-patch-1.0.1
└── release/1.1.0
```

### Commit Message Format
Use conventional commits for automatic changelog generation:

```
type(scope): description

Examples:
feat(dashboard): add character selection system
fix(gps): resolve location permission handling
docs(readme): update installation instructions
security(auth): patch authentication vulnerability
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code formatting changes
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `security`: Security improvements
- `perf`: Performance optimizations

### Code Standards

#### TypeScript/React Guidelines
- Use TypeScript for all new code
- Follow React functional component patterns
- Implement proper error boundaries
- Use custom hooks for reusable logic
- Maintain component prop interface definitions

#### File Organization
```
client/src/
├── components/          # Reusable UI components
├── pages/              # Route-specific pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

#### Database Changes
- Update schema in `shared/schema.ts`
- Use Drizzle migrations for database changes
- Test database changes thoroughly
- Document schema modifications

### Testing Requirements

#### Before Submitting
- [ ] Code builds without errors
- [ ] All TypeScript types are properly defined
- [ ] Mobile responsiveness verified
- [ ] No console errors in browser
- [ ] Security scan passes
- [ ] Performance regression testing

#### Test Coverage
- Component functionality testing
- API endpoint validation
- Mobile device compatibility
- Cross-browser testing (Chrome, Safari, Firefox)
- PWA functionality verification

### Security Guidelines

#### Code Security
- Never commit API keys or secrets
- Validate all user inputs
- Use parameterized database queries
- Implement proper authentication checks
- Follow OWASP security guidelines

#### Dependency Management
- Review new dependencies for security issues
- Keep existing dependencies updated
- Use `npm audit` before submitting changes
- Document any security-related changes

### Pull Request Process

#### Before Submitting
1. **Rebase your branch** on latest develop
2. **Run security scans** and fix any issues
3. **Update documentation** if needed
4. **Add tests** for new functionality
5. **Verify mobile compatibility**

#### PR Description Template
```markdown
## Changes
Brief description of what this PR accomplishes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Security improvement

## Testing
- [ ] Mobile devices tested
- [ ] Cross-browser compatibility verified
- [ ] Security scan passed
- [ ] No console errors

## Screenshots (if applicable)
Include mobile and desktop screenshots for UI changes

## Checklist
- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged
```

### Review Process

#### Code Review Criteria
- Code quality and maintainability
- Security best practices followed
- Mobile-first design principles
- Performance considerations
- Documentation completeness

#### Approval Process
- At least one maintainer approval required
- All GitHub Actions checks must pass
- Security scan must be clean
- Mobile compatibility confirmed

### Release Guidelines

#### Version Numbering
Follow semantic versioning (semver):
- **MAJOR**: Breaking changes requiring user action
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes and minor improvements

#### Release Schedule
- **Patches**: Released as needed for critical fixes
- **Minor releases**: Monthly feature updates
- **Major releases**: Quarterly with significant changes

### Community Guidelines

#### Communication
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

#### Issue Reporting
- Use clear, descriptive titles
- Provide steps to reproduce bugs
- Include environment details
- Attach screenshots for UI issues

### Development Environment

#### Required Tools
- Node.js 18+
- npm or yarn
- Git
- Modern browser with developer tools
- Mobile device or emulator for testing

#### Setup Commands
```bash
git clone https://github.com/[username]/some-fitness-method.git
cd some-fitness-method
npm install
npm run dev
```

#### Useful Scripts
```bash
npm run build          # Production build
npm run type-check     # TypeScript validation
npm run lint           # Code linting
npm audit              # Security audit
```

Thank you for contributing to S.O.M.E fitness method! Your efforts help make wellness technology accessible to everyone.