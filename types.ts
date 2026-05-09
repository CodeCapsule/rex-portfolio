export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  link?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  icon_type: 'svg' | 'image' | 'png' | 'jpeg';
  icon_value: string;
  color: string;
  description?: string;
  icon_bg_color?: string;
  icon_text_color?: string;
}

export interface Profile {
  name: string;
  image: string;
  title: string;
  resume_url?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  hoverColor: string;
}
