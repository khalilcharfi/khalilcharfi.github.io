// Featured Projects - Top 3-5 projects to highlight
import { PROJECT_IDS } from './types';

export const featuredProjects = [
  PROJECT_IDS.VV_VEHICLE_MANAGEMENT,
  PROJECT_IDS.FLUTTER_MOBILE_APP,
  PROJECT_IDS.IONIC_HYBRID_APP,
  PROJECT_IDS.REACT_PORTFOLIO,
];

export const isFeatured = (projectId: string): boolean => 
  featuredProjects.includes(projectId);

// Featured project order for display
export const featuredProjectOrder = [
  PROJECT_IDS.VV_VEHICLE_MANAGEMENT,
  PROJECT_IDS.REACT_PORTFOLIO,
  PROJECT_IDS.FLUTTER_MOBILE_APP,
  PROJECT_IDS.IONIC_HYBRID_APP,
];
