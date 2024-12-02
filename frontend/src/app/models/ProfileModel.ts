export interface Profile {
  userId: number;
  profileId?: string;
  title: string;
  deskHeight: number;
  timer_sitting?: string;
  timer_standing?: string;
  mot_lvl?: string;
  selected?: boolean;
}