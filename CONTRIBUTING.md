# 🤝 Contributing to Interactive Story Project

Terima kasih atas minat Anda untuk berkontribusi pada Interactive Story Project! Kami menghargai setiap kontribusi dari komunitas.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

Proyek ini mengikuti kode etik open source. Dengan berpartisipasi, Anda diharapkan untuk menjaga standar yang profesional dan saling menghormati.

## 🚀 Getting Started

### Prerequisites
- Web browser modern (Chrome 60+, Safari 12+, Edge 79+, Firefox 65+)
- Git
- Text editor atau IDE
- Basic knowledge of HTML, CSS, dan JavaScript
- (Optional) n8n untuk testing chatbot integration

### Setup Development Environment

1. **Fork repository**
```bash
# Fork repository di GitHub lalu clone fork Anda
git clone https://github.com/YOUR_USERNAME/interactive-story-project.git
cd interactive-story-project
```

2. **Setup remote upstream**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/interactive-story-project.git
```

3. **Test setup**
```bash
# Buka di browser untuk test
open index.html

# Atau gunakan local server
python -m http.server 8000
```

## 🛠️ How to Contribute

### 🐛 Reporting Bugs
- Gunakan issue template yang tersedia
- Include browser info dan steps to reproduce
- Sertakan screenshot atau error messages jika memungkinkan
- Test di multiple browsers jika relevan

### 💡 Suggesting Features
- Buka issue dengan label "enhancement"
- Jelaskan feature yang diinginkan dengan detail
- Berikan context mengapa feature tersebut berguna
- Consider backward compatibility

### 🔧 Code Contributions

#### Types of Contributions Welcome:
- **Bug fixes**: Perbaikan bugs yang ada
- **Feature enhancements**: Improvement pada existing features
- **New features**: Fitur baru yang useful
- **Documentation**: Improvement pada docs
- **Testing**: Penambahan atau perbaikan tests
- **Browser compatibility**: Fixes untuk browser tertentu
- **Performance**: Optimisasi performance

## 📝 Development Guidelines

### 🏗️ Code Style

#### HTML
- Gunakan HTML5 semantic elements
- Include proper ARIA attributes untuk accessibility
- Maintain consistent indentation (2 spaces)
- Include meaningful alt text untuk images

#### CSS
- Follow BEM naming convention untuk classes
- Use CSS custom properties untuk theming
- Maintain responsive design principles
- Test cross-browser compatibility

#### JavaScript
- Use modern ES6+ features
- Follow consistent naming conventions (camelCase)
- Include proper error handling
- Document complex functions dengan comments
- Avoid global variables

### 🧪 Testing
- Test di multiple browsers sebelum submit PR
- Gunakan testing files di folder `testing/`
- Test responsive behavior di different screen sizes
- Verify accessibility dengan screen readers (jika memungkinkan)

### 🔒 Security Guidelines
- **NEVER commit webhook URLs atau API keys**
- Gunakan placeholder values dalam example configs
- Review `.gitignore` untuk ensure sensitive files excluded
- Document security best practices dalam code

## 🔄 Pull Request Process

### 1. Create Feature Branch
```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/amazing-feature
```

### 2. Make Changes
- Follow development guidelines
- Test thoroughly
- Update documentation jika diperlukan
- Commit dengan clear messages

### 3. Commit Guidelines
```bash
# Good commit messages:
git commit -m "feat: add chat history export functionality"
git commit -m "fix: resolve webkit compatibility issue in Safari"
git commit -m "docs: update chatbot integration guide"
git commit -m "style: improve mobile responsive design"

# Commit message types:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting, css
# refactor: code restructuring
# test: testing
# chore: maintenance
```

### 4. Push and Create PR
```bash
# Push branch
git push origin feature/amazing-feature

# Create Pull Request di GitHub dengan:
# - Clear title dan description
# - Reference related issues
# - Include screenshots jika UI changes
# - List testing yang sudah dilakukan
```

### 5. PR Review Process
- Maintainer akan review dalam 2-7 hari
- Address feedback yang diberikan
- Update PR jika ada requested changes
- Merge akan dilakukan setelah approval

## 🐛 Issue Guidelines

### 🏷️ Issue Labels
- `bug`: Something tidak bekerja dengan benar
- `enhancement`: Improvement pada existing feature
- `feature`: New feature request
- `documentation`: Improvement pada docs
- `help-wanted`: Extra help needed
- `good-first-issue`: Good untuk newcomers
- `browser-compatibility`: Browser-specific issues

### 📝 Issue Templates

#### Bug Report
```markdown
**Bug Description**
Clear description tentang bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior**
Apa yang seharusnya terjadi

**Screenshots**
Jika memungkinkan

**Environment**
- Browser: [Chrome/Safari/Edge/Firefox]
- Version: [version]
- OS: [Windows/Mac/Linux]
```

#### Feature Request
```markdown
**Feature Description**
Clear description tentang feature yang diinginkan

**Use Case**
Mengapa feature ini berguna?

**Proposed Solution**
Bagaimana feature ini bisa diimplementasikan?

**Additional Context**
Context atau screenshots tambahan
```

## 📚 Additional Resources

### Documentation
- [Main README](README.md)
- [Chatbot Template Guide](chatbot-template/README.md)
- [Browser Compatibility Guide](BROWSER_COMPATIBILITY.md)
- [Template Usage Guide](TEMPLATE_USAGE.md)

### Development Tools
- [Browser Testing](testing/browser-test.html)
- [Chat History Testing](testing/test-chat-history.html)
- [Webhook Diagnostics](chatbot-template/tools/test-webhook-connection.html)

### Community
- GitHub Issues untuk questions dan discussions
- Pull Requests untuk code contributions
- Wiki untuk additional documentation

## 🙏 Recognition

Contributors akan diakui dalam:
- README.md contributor section
- Release notes untuk significant contributions
- Special thanks untuk major features

## ❓ Questions?

Jika ada pertanyaan tentang contributing:
1. Check existing issues dan documentation
2. Create issue dengan label "question"
3. Be patient - maintainers akan respond

---

**Terima kasih atas kontribusi Anda! Mari buat Interactive Story Project yang lebih baik bersama-sama! 🚀**
