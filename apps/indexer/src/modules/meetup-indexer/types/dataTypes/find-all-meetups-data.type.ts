import { Location, Sort } from '../index';

export interface FindAllMeetupsData {
  searchQuery?: string;
  filterTags?: string[];
  sortBy?: string;
  sortOrder?: Sort;
  size?: number;
  from?: number;
  location?: Location;
}
