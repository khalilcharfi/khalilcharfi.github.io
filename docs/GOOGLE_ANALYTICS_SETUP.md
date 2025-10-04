# 📊 Google Analytics 4 (GA4) Setup Guide

Complete guide for setting up free Google Analytics 4 tracking in your portfolio.

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click **"Start measuring"** or **"Admin"** → **"Create Property"**
4. Fill in property details:
   - **Property name**: "Khalil Charfi Portfolio"
   - **Reporting time zone**: Your timezone
   - **Currency**: Your currency (optional)
5. Click **"Next"** and complete business information:
   - Industry category: Technology
   - Business size: Small
6. Select business objectives (optional)
7. Accept Google Analytics Terms of Service

### Step 2: Create Web Data Stream

1. Select **"Web"** as your platform
2. Enter website details:
   - **Website URL**: `https://khalilcharfi.github.io`
   - **Stream name**: "Portfolio Website"
3. **Enable Enhanced Measurement** (recommended):
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads
4. Click **"Create stream"**
5. **Copy your Measurement ID** (format: `G-XXXXXXXXXX`)
   - This will be displayed prominently at the top
   - Keep this safe - you'll need it next

### Step 3: Add Measurement ID to Your Project

#### For Local Development:

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Measurement ID:

```bash
# .env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

#### For GitHub Pages (Production):

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/YOUR_REPO`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the secret:
   - **Name**: `VITE_GA_MEASUREMENT_ID`
   - **Secret**: `G-XXXXXXXXXX` (your Measurement ID)
5. Click **"Add secret"**

### Step 4: Deploy Your Site

```bash
# Commit and push your changes
git add .
git commit -m "Add Google Analytics 4 tracking"
git push origin next
```

The GitHub Actions workflow will automatically build and deploy with your GA4 Measurement ID.

### Step 5: Verify Tracking

1. Visit your deployed site: `https://khalilcharfi.github.io`
2. Accept analytics cookies in the cookie banner
3. Go back to [Google Analytics](https://analytics.google.com)
4. Navigate to **Reports** → **Realtime**
5. You should see your visit appearing in real-time!

---

## 📈 What Gets Tracked

### Automatic Tracking (Enhanced Measurement)

When you enable Enhanced Measurement in GA4, these are tracked automatically:

- ✅ **Page Views**: Every page/section navigation
- ✅ **Scrolls**: 90% scroll depth
- ✅ **Outbound Clicks**: Links to external websites
- ✅ **Site Search**: If you have search functionality
- ✅ **Video Engagement**: YouTube embeds
- ✅ **File Downloads**: PDF, DOC, XLS, etc.

### Custom Events (Our Implementation)

Our custom implementation adds these specific portfolio events:

#### 1. Section Views
```javascript
Event: section_view
Parameters:
  - section_name: "projects", "experience", "skills", etc.
  - time_spent: seconds
  - scroll_depth: percentage
```

#### 2. Button Clicks
```javascript
Event: button_click
Parameters:
  - button_name: "Download Resume", "Contact Me", etc.
  - location: "Hero", "Footer", "Projects", etc.
```

#### 3. Form Submissions
```javascript
Event: form_submit
Parameters:
  - form_name: "Contact Form"
  - success: true/false
```

#### 4. Outbound Links
```javascript
Event: outbound_click
Parameters:
  - link_url: "https://linkedin.com/..."
  - link_text: "LinkedIn Profile"
```

#### 5. Project Views
```javascript
Event: project_view
Parameters:
  - project_name: "AI Chatbot"
  - tech_stack: "React, Node.js, OpenAI"
```

#### 6. Certificate Views
```javascript
Event: certificate_view
Parameters:
  - certificate_name: "AWS Solutions Architect"
  - issuer: "Amazon Web Services"
```

#### 7. Publication Views
```javascript
Event: publication_view
Parameters:
  - publication_title: "Research Paper Title"
  - publication_year: 2024
```

#### 8. Downloads
```javascript
Event: file_download
Parameters:
  - file_name: "resume.pdf"
  - file_type: "pdf"
```

#### 9. Scroll Depth
```javascript
Event: scroll_depth
Parameters:
  - depth_percentage: 25, 50, 75, 100
```

#### 10. Performance Metrics
```javascript
Event: performance_metric
Parameters:
  - metric_name: "page_load_time"
  - metric_value: 1234
  - metric_unit: "ms"
```

---

## 🔧 Usage in Your Code

### Using the React Hook (Recommended)

```typescript
import { useGoogleAnalytics } from '../hooks';

function ProjectCard({ project }) {
  const ga = useGoogleAnalytics();

  const handleProjectClick = () => {
    // Track project view
    ga.trackProjectView(project.name, project.techStack);
    
    // Your click logic
    navigateToProject(project.id);
  };

  return (
    <div onClick={handleProjectClick}>
      {/* Project content */}
    </div>
  );
}
```

### Direct Service Usage

```typescript
import { googleAnalytics } from '../services';

// Track custom event
googleAnalytics.trackEvent('certificate_clicked', {
  certificate_name: 'AWS Certification',
  certificate_year: 2024,
  issuer: 'Amazon'
});

// Track section view with metadata
googleAnalytics.trackSectionView('experience', {
  scroll_depth: 75,
  time_spent: 30,
  items_viewed: 3
});

// Set user properties
googleAnalytics.setUserProperties({
  user_type: 'recruiter',
  preferred_language: 'en',
  theme: 'dark',
  device_type: 'mobile'
});
```

### Tracking Outbound Links

```typescript
import { useGoogleAnalytics } from '../hooks';

function SocialLinks() {
  const ga = useGoogleAnalytics();

  const handleLinkedInClick = () => {
    ga.trackOutboundLink(
      'https://linkedin.com/in/yourprofile',
      'LinkedIn Profile'
    );
  };

  return (
    <a 
      href="https://linkedin.com/in/yourprofile"
      onClick={handleLinkedInClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      LinkedIn
    </a>
  );
}
```

### Tracking Form Submissions

```typescript
import { useGoogleAnalytics } from '../hooks';

function ContactForm() {
  const ga = useGoogleAnalytics();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await sendEmail(formData);
      ga.trackFormSubmit('Contact Form', true);
      showSuccessMessage();
    } catch (error) {
      ga.trackFormSubmit('Contact Form', false);
      showErrorMessage();
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🔒 Privacy & Compliance

### GDPR Compliant

Our implementation is fully GDPR compliant:

- ✅ **Consent-based**: Analytics only initializes after user consent
- ✅ **IP Anonymization**: Enabled by default
- ✅ **No Personal Data**: We don't collect PII (names, emails, etc.)
- ✅ **Transparent**: Clear cookie consent UI
- ✅ **User Control**: Users can revoke consent anytime
- ✅ **Data Export**: Users can export their data
- ✅ **Data Deletion**: Users can delete their data

### How Consent Works

```typescript
// User grants analytics consent through Privacy Settings
consent.analytics = true  →  GA initializes automatically

// User revokes consent
consent.analytics = false  →  GA stops tracking

// DNT (Do Not Track) enabled
navigator.doNotTrack = '1'  →  All tracking disabled
```

### Data We DON'T Collect

- ❌ Personally Identifiable Information (PII)
- ❌ Email addresses
- ❌ Names
- ❌ Phone numbers
- ❌ Credit card information
- ❌ Precise geolocation (only country/city)

### Data We DO Collect

- ✅ Page views and navigation
- ✅ Button clicks and interactions
- ✅ Device type and browser
- ✅ Language preference
- ✅ Approximate location (country/city)
- ✅ Referral source (where they came from)
- ✅ Session duration
- ✅ Anonymized usage patterns

---

## 📊 Viewing Your Analytics

### Real-Time Reports

See what's happening right now:

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Click **"Reports"** → **"Realtime"**

**What you'll see:**
- Active users right now
- Top active pages
- Traffic sources
- Locations (city/country)
- Events in real-time

### Standard Reports

Navigate to **Reports** to see:

#### **Acquisition**
- How users find your site
- Traffic sources (Google, LinkedIn, Direct, etc.)
- Campaign performance

#### **Engagement**
- What users do on your site
- Most viewed sections/pages
- Event tracking
- Session duration

#### **Retention**
- New vs. returning users
- User loyalty
- User lifetime

#### **Demographics**
- Age ranges (if available)
- Gender breakdown (if available)
- Interests

#### **Tech**
- Browser types
- Operating systems
- Screen resolutions
- Device categories (mobile/desktop/tablet)

#### **Location**
- Countries
- Cities
- Languages

### Custom Events Dashboard

1. Go to **Reports** → **Engagement** → **Events**
2. See all custom events with counts
3. Click any event to see parameters
4. Create custom explorations for deeper insights

### Creating Custom Reports

1. Go to **Explore** (left sidebar)
2. Click **"Blank"** to create a new exploration
3. Add dimensions (e.g., Section Name, Device Type)
4. Add metrics (e.g., Event Count, Active Users)
5. Customize and save

---

## 🎯 Key Metrics to Monitor

### Week 1 Checklist

Focus on these metrics in your first week:

- [ ] **Total Users**: How many people visited?
- [ ] **Page Views**: Total page/section views
- [ ] **Top Traffic Sources**: Where do they come from?
- [ ] **Most Viewed Sections**: Projects? Experience? Skills?
- [ ] **Average Session Duration**: How long do they stay?
- [ ] **Device Breakdown**: Mobile vs. Desktop
- [ ] **Geographic Distribution**: Top countries/cities

### Monthly KPIs

Track these monthly:

1. **User Growth**: Month-over-month increase
2. **Engagement Rate**: % of engaged sessions
3. **Conversion Events**: Contact form submissions, resume downloads
4. **Top Pages**: Which sections get most attention
5. **Return Visitor Rate**: % who come back
6. **Traffic Sources**: Organic, Direct, Referral breakdown
7. **Mobile vs. Desktop**: Device preference

### Goal Tracking

Set up these goals to measure success:

1. **Primary Goals**:
   - Contact form submission
   - Resume download
   - LinkedIn profile click

2. **Secondary Goals**:
   - Project demo click
   - Certificate view
   - Publication read
   - 90% scroll depth

3. **Engagement Goals**:
   - 2+ minutes on site
   - 3+ sections viewed
   - Return visit within 7 days

---

## 🚨 Troubleshooting

### Analytics Not Working?

#### 1. Check Measurement ID

```bash
# Verify environment variable is set
echo $VITE_GA_MEASUREMENT_ID

# Should output: G-XXXXXXXXXX
# If empty, add it to .env file
```

#### 2. Check Consent

Open your site and browser console:
- Look for: `"✅ Google Analytics initialized successfully"`
- If not there, check if you accepted cookies
- Open Privacy Settings and verify Analytics is enabled

#### 3. Check Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "google-analytics.com" or "gtag"
4. You should see requests to GA servers
5. If not, check console for errors

#### 4. Use GA Debugger Extension

Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna):
- Enables verbose logging
- Shows what's being tracked
- Helps identify issues

### Common Issues & Solutions

**Issue**: "No data in reports after 24 hours"
- **Solution**: Check Realtime reports first (instant feedback)
- Standard reports can take 24-48 hours to populate
- Verify tracking is active in Realtime

**Issue**: "Measurement ID not found"
- **Solution**: Add `VITE_GA_MEASUREMENT_ID` to `.env` file
- For production, add to GitHub Secrets
- Rebuild and redeploy

**Issue**: "Events not tracking"
- **Solution**: Ensure analytics consent is granted
- Check browser console for errors
- Verify `ga.isEnabled` returns true

**Issue**: "Tracking works locally but not in production"
- **Solution**: Verify GitHub Secret is set correctly
- Check deployment logs for environment variables
- Ensure `.env.production` is properly configured

**Issue**: "Do Not Track (DNT) blocking analytics"
- **Solution**: This is expected behavior
- We respect DNT settings
- No workaround (and shouldn't have one)

---

## 🎨 Advanced Configuration

### Custom Dimensions (Optional)

If you want to track additional custom properties:

```typescript
// In googleAnalytics.ts, add to config:
window.gtag('config', this.config.measurementId, {
  custom_map: {
    dimension1: 'visitor_type',    // Recruiter, Developer, etc.
    dimension2: 'user_intent',     // Hiring, Learning, etc.
    dimension3: 'tech_interest',   // AI, Web Dev, Mobile, etc.
  }
});

// Then track:
googleAnalytics.trackEvent('custom_event', {
  visitor_type: 'recruiter',
  user_intent: 'hiring',
  tech_interest: 'AI'
});
```

### Debug Mode

Enable debug mode in development:

```typescript
// googleAnalytics.ts automatically enables debug in development
// To manually enable:
const analytics = new GoogleAnalyticsService({
  debug: true
});
```

Console will show:
- 📊 All events being tracked
- ✅ Initialization status
- ⚠️ Warnings and errors

### Custom Event Parameters

Add more context to events:

```typescript
googleAnalytics.trackEvent('project_demo_click', {
  project_name: 'AI Chatbot',
  tech_stack: 'React, Node.js, OpenAI',
  complexity: 'high',
  year: 2024,
  featured: true,
  category: 'AI/ML'
});
```

---

## 📚 Resources & Documentation

### Official Documentation
- [GA4 Help Center](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 Migration Guide](https://support.google.com/analytics/answer/9744165)

### Privacy & Compliance
- [GA4 & GDPR](https://support.google.com/analytics/answer/9019185)
- [GA4 & CCPA](https://support.google.com/analytics/answer/9976101)
- [Data Retention Settings](https://support.google.com/analytics/answer/7667196)

### Video Tutorials
- [GA4 Setup Tutorial](https://www.youtube.com/results?search_query=ga4+setup+tutorial)
- [GA4 Custom Events](https://www.youtube.com/results?search_query=ga4+custom+events)
- [GA4 Reports Overview](https://www.youtube.com/results?search_query=ga4+reports+overview)

### Community
- [Google Analytics Reddit](https://www.reddit.com/r/GoogleAnalytics/)
- [GA4 Stack Overflow](https://stackoverflow.com/questions/tagged/google-analytics-4)

---

## ✅ Setup Checklist

Use this checklist to ensure everything is configured:

### Initial Setup
- [ ] Created GA4 property at analytics.google.com
- [ ] Created web data stream
- [ ] Copied Measurement ID (G-XXXXXXXXXX)
- [ ] Enabled Enhanced Measurement

### Local Development
- [ ] Created `.env` file
- [ ] Added `VITE_GA_MEASUREMENT_ID` to `.env`
- [ ] Tested tracking in local environment
- [ ] Verified console shows "✅ GA initialized"

### Production Deployment
- [ ] Added `VITE_GA_MEASUREMENT_ID` to GitHub Secrets
- [ ] Deployed to GitHub Pages
- [ ] Visited site and accepted cookies
- [ ] Verified tracking in Realtime reports

### Verification
- [ ] Checked Realtime reports show activity
- [ ] Verified custom events are tracking
- [ ] Tested form submission tracking
- [ ] Tested button click tracking
- [ ] Verified outbound link tracking
- [ ] Checked mobile device tracking

### Optimization
- [ ] Set up goal conversions
- [ ] Created custom dashboard
- [ ] Configured alerts (optional)
- [ ] Integrated with Google Search Console (optional)
- [ ] Bookmarked GA4 dashboard

---

## 🎉 What's Next?

After setup, focus on:

1. **Week 1**: Monitor Realtime reports, verify tracking works
2. **Week 2**: Review traffic sources, top sections
3. **Week 3**: Analyze user behavior, engagement metrics
4. **Month 1**: Identify trends, optimize content
5. **Ongoing**: Monthly reviews, A/B testing, content optimization

**Pro Tips**:
- Check analytics weekly
- Set up email reports (GA4 → Admin → Property → Property Settings)
- Compare month-over-month growth
- Act on insights (promote top content, fix low-performing sections)
- Share insights in job interviews ("My portfolio gets X visitors/month from Y sources")

---

**Need Help?** Check the troubleshooting section or open an issue on GitHub!

