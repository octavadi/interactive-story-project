#!/bin/bash

# Interactive Story Project - GitHub Repository Setup Script
echo "🚀 Setting up GitHub repository for Interactive Story Project..."

# Repository details
REPO_NAME="interactive-story-project"
DESCRIPTION="🔧 Modular Interactive Story Template | n8n Chatbot Integration | Web Components Architecture | Cross-browser Compatible | Perfect for creating engaging story experiences with AI narrator support"
HOMEPAGE="https://your-username.github.io/interactive-story-project"

# Topics for the repository
TOPICS="interactive-story,chatbot,n8n-integration,web-components,storytelling,html5,css3,javascript,responsive-design,cross-browser,template-system,modular-architecture,ai-narrator,story-template,interactive-fiction"

echo "📝 Repository Name: $REPO_NAME"
echo "📋 Description: $DESCRIPTION"
echo ""

# Check if gh is authenticated
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub. Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated!"

# Create the repository
echo "🏗️  Creating GitHub repository..."
gh repo create "$REPO_NAME" \
    --public \
    --description "$DESCRIPTION" \
    --homepage "$HOMEPAGE" \
    --clone=false

if [ $? -eq 0 ]; then
    echo "✅ Repository created successfully!"
    
    # Add remote origin
    echo "🔗 Adding remote origin..."
    GITHUB_USER=$(gh api user --jq '.login')
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    
    # Set main branch and push
    echo "📤 Pushing code to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Code pushed successfully!"
        
        # Set repository topics
        echo "🏷️  Setting repository topics..."
        gh repo edit "$GITHUB_USER/$REPO_NAME" --add-topic "$TOPICS"
        
        # Enable GitHub Pages (optional)
        read -p "🌐 Enable GitHub Pages? (y/n): " enable_pages
        if [[ $enable_pages =~ ^[Yy]$ ]]; then
            gh api -X POST "/repos/$GITHUB_USER/$REPO_NAME/pages" \
                -f source[branch]=main \
                -f source[path]=/ 2>/dev/null || echo "⚠️  GitHub Pages setup may need manual configuration"
        fi
        
        # Open repository in browser
        echo "🎉 Repository setup complete!"
        echo "📖 Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"
        
        read -p "🌐 Open repository in browser? (y/n): " open_browser
        if [[ $open_browser =~ ^[Yy]$ ]]; then
            gh repo view "$GITHUB_USER/$REPO_NAME" --web
        fi
        
        echo ""
        echo "🎊 SUCCESS! Your Interactive Story Project is now on GitHub!"
        echo "👉 Next steps:"
        echo "   1. Copy .env.example to .env.local and configure your webhooks"
        echo "   2. Invite collaborators if needed"
        echo "   3. Set up branch protection rules (optional)"
        echo "   4. Configure GitHub Pages if not done above"
        
    else
        echo "❌ Failed to push code to GitHub"
        exit 1
    fi
else
    echo "❌ Failed to create repository"
    exit 1
fi
