# Loading System

## What's This About?

Got tired of showing spinners everywhere, so I built a proper loading system with skeleton screens and actual progress tracking. Now users see what's coming instead of staring at a blank page.

## The Loading Manager

Basically tracks loading progress across the whole app and shows descriptive messages.

```typescript
import { loadingManager } from '@/shared/utils';

// Kick things off
loadingManager.startLoading(10);

// Update as you go
loadingManager.incrementProgress('Loading components');

// All done
loadingManager.completeLoading();
```

## React Hook

```typescript
import { useLoadingManager } from '@/shared/utils';

function MyComponent() {
  const { state, progress } = useLoadingManager();
  
  return (
    <div>
      {state === 'loading' && (
        <div>Loading: {progress.percentage}% - {progress.stage}</div>
      )}
    </div>
  );
}
```

## Skeleton Screens

Instead of spinners, show placeholders that match your content structure.

### Basic Usage
```typescript
import { Skeleton } from '@/shared/components';

<Skeleton width="100%" height={200} variant="rounded" />
```

### Ready-Made Components
```typescript
import { ProfileSkeleton, SkillsSkeleton, TimelineSkeleton } from '@/shared/components';

<ProfileSkeleton />              // For profile sections
<SkillsSkeleton />               // For skills grid
<TimelineSkeleton count={3} />   // For experience/education
```

## Loading Heavy Stuff

For big imports like Three.js:

```typescript
import { ResourceLoader } from '@/shared/utils';

const loader = new ResourceLoader();
await loader.load('three', () => import('three'));
```

## Best Practices

### Use Skeleton Screens
```typescript
// Don't do this
{isLoading && <Spinner />}

// Do this instead
{isLoading ? <ProfileSkeleton /> : <ProfileContent />}
```

### Wrap with Suspense
```typescript
<Suspense fallback={<ProjectsSkeleton />}>
  <ProjectsSection />
</Suspense>
```

## Performance Impact

- **Bundle size**: About +5KB total (not bad)
- **Speed**: No noticeable impact
- **Memory**: ~50KB for tracking (pretty light)
- **Browser support**: All modern browsers

## Migrating Old Code

Replace your old loading patterns:

```typescript
// Before (boring)
const [loading, setLoading] = useState(true);
{loading && <div>Loading...</div>}

// After (better UX)
const { state } = useLoadingManager();
{state === 'loading' ? <ProfileSkeleton /> : <ProfileContent />}
```

That's it. Way better than spinners, right?
