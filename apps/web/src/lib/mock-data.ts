/**
 * Mock data service for development and testing
 * Provides realistic sample data for matches and skills
 */

import { MatchData } from '@/components/match-card';

/**
 * Sample skills data
 */
export const mockSkills = [
  'React', 'TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'C++', 'C#',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails',
  'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'SvelteKit',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Jenkins',
  'Git', 'GitHub', 'GitLab', 'CI/CD', 'REST API', 'GraphQL', 'gRPC',
  'WebSocket', 'Microservices', 'Serverless', 'Machine Learning', 'AI',
  'Data Science', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'UI Design', 'UX Design', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop',
  'Illustrator', 'CSS', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap',
  'Material-UI', 'Ant Design', 'Chakra UI', 'Storybook', 'Jest', 'Cypress',
  'Playwright', 'Testing Library', 'Webpack', 'Vite', 'Parcel', 'Rollup',
  'Linux', 'Bash', 'PowerShell', 'SQL', 'NoSQL', 'GraphQL', 'Apollo',
  'Prisma', 'TypeORM', 'Sequelize', 'Mongoose', 'Firebase', 'Supabase',
  'Stripe', 'PayPal', 'Twilio', 'SendGrid', 'Auth0', 'JWT', 'OAuth',
  'Blockchain', 'Web3', 'Solidity', 'Ethereum', 'Bitcoin', 'NFT',
  'Mobile Development', 'React Native', 'Flutter', 'Swift', 'Kotlin',
  'iOS', 'Android', 'Xamarin', 'Ionic', 'Cordova', 'Electron',
  'Game Development', 'Unity', 'Unreal Engine', 'C++', 'C#', 'Lua',
  'DevOps', 'SRE', 'Monitoring', 'Logging', 'APM', 'Prometheus',
  'Grafana', 'ELK Stack', 'Splunk', 'New Relic', 'DataDog', 'Sentry'
];

/**
 * Sample locations
 */
export const mockLocations = [
  'San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Seattle, WA',
  'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Portland, OR',
  'Miami, FL', 'Atlanta, GA', 'Dallas, TX', 'Phoenix, AZ', 'Las Vegas, NV',
  'Remote', 'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands',
  'Toronto, Canada', 'Vancouver, Canada', 'Sydney, Australia', 'Melbourne, Australia',
  'Tokyo, Japan', 'Singapore', 'Dublin, Ireland', 'Stockholm, Sweden',
  'Copenhagen, Denmark', 'Zurich, Switzerland', 'Paris, France', 'Barcelona, Spain'
];

/**
 * Sample availability patterns
 */
export const mockAvailability = [
  'Weekdays 6-8 PM, Weekends 10 AM-2 PM',
  'Evenings 7-9 PM, Saturday mornings',
  'Weekdays 5-7 PM, Sunday afternoons',
  'Monday-Friday 9-11 AM',
  'Tuesday/Thursday 6-8 PM',
  'Weekends only',
  'Flexible schedule',
  'Early mornings (6-8 AM)',
  'Late evenings (8-10 PM)',
  'Lunch breaks (12-1 PM)'
];

/**
 * Sample job titles
 */
export const mockTitles = [
  'Senior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'UX Designer', 'Product Manager', 'Mobile Developer',
  'Cloud Architect', 'Machine Learning Engineer', 'Technical Lead', 'Software Architect',
  'QA Engineer', 'Security Engineer', 'Blockchain Developer', 'Game Developer', 'SRE',
  'Solutions Architect', 'Engineering Manager', 'CTO', 'VP of Engineering', 'Tech Consultant',
  'UI/UX Designer', 'Product Designer', 'Growth Engineer', 'Platform Engineer', 'Infrastructure Engineer'
];

/**
 * Sample bios
 */
export const mockBios = [
  'Passionate developer with 5+ years experience in full-stack development. Love teaching and learning new technologies.',
  'Senior software engineer specializing in backend systems and cloud architecture. Always excited to share knowledge.',
  'Frontend developer passionate about React and design systems. Love teaching and learning new technologies.',
  'Data scientist with expertise in machine learning and Python. Looking to improve my frontend skills.',
  'UX designer and content creator. Always excited to learn new skills and share design knowledge.',
  'DevOps engineer with experience in Kubernetes and AWS. Looking to learn more about frontend development.',
  'Mobile developer specializing in React Native and Flutter. Love sharing mobile development best practices.',
  'Backend engineer with expertise in Go and microservices. Interested in learning frontend frameworks.',
  'Full-stack developer with a passion for clean code and best practices. Love mentoring junior developers.',
  'Product manager with technical background. Looking to improve my coding skills and learn new technologies.'
];

/**
 * Generate random match data
 */
export function generateMockMatches(count: number = 12): MatchData[] {
  const matches: MatchData[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Liam', 'Maya', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina'][Math.floor(Math.random() * 20)];
    const lastName = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'][Math.floor(Math.random() * 20)];
    const name = `${firstName} ${lastName}`;
    const handle = `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}${Math.floor(Math.random() * 100)}`;
    
    // Generate skills to teach (2-4 skills)
    const teachSkillsCount = Math.floor(Math.random() * 3) + 2;
    const teachSkills = Array.from({ length: teachSkillsCount }, () => {
      const skill = mockSkills[Math.floor(Math.random() * mockSkills.length)];
      const level = ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)] as 'beginner' | 'intermediate' | 'advanced' | 'expert';
      return { name: skill, level };
    });
    
    // Generate skills to learn (1-3 skills)
    const learnSkillsCount = Math.floor(Math.random() * 3) + 1;
    const learnSkills = Array.from({ length: learnSkillsCount }, () => {
      const skill = mockSkills[Math.floor(Math.random() * mockSkills.length)];
      const level = ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)] as 'beginner' | 'intermediate' | 'advanced' | 'expert';
      return { name: skill, level };
    });
    
    // Find common skills
    const teachSkillNames = teachSkills.map(s => s.name);
    const learnSkillNames = learnSkills.map(s => s.name);
    const commonSkills = teachSkillNames.filter(skill => learnSkillNames.includes(skill));
    
    const match: MatchData = {
      id: `match_${i + 1}`,
      name,
      handle,
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      bio: mockBios[Math.floor(Math.random() * mockBios.length)],
      location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
      avatar_url: undefined, // Will be generated by the component
      skills_to_teach: teachSkills,
      skills_to_learn: learnSkills,
      common_skills: commonSkills,
      match_score: Math.floor(Math.random() * 30) + 70, // 70-100%
      last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
      availability_summary: mockAvailability[Math.floor(Math.random() * mockAvailability.length)]
    };
    
    matches.push(match);
  }
  
  return matches;
}

/**
 * Mock API response for match preview
 * @param request - Optional request object with filters
 */
export function getMockMatchPreview(request?: any) {
  // Generate a larger pool of matches to filter from
  const allMatches = generateMockMatches(30);
  let filteredMatches = [...allMatches];
  
  // Apply filters if provided
  if (request && request.filters) {
    const { search, skill_level, location, skills } = request.filters;
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMatches = filteredMatches.filter(match => 
        match.name.toLowerCase().includes(searchLower) || 
        match.handle.toLowerCase().includes(searchLower) ||
        match.bio?.toLowerCase().includes(searchLower) ||
        match.title?.toLowerCase().includes(searchLower) ||
        match.location?.toLowerCase().includes(searchLower) ||
        match.skills_to_teach.some(s => s.name.toLowerCase().includes(searchLower)) ||
        match.skills_to_learn.some(s => s.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by skill level
    if (skill_level) {
      filteredMatches = filteredMatches.filter(match => 
        match.skills_to_teach.some(s => s.level === skill_level) || 
        match.skills_to_learn.some(s => s.level === skill_level)
      );
    }
    
    // Filter by location
    if (location) {
      const locationLower = location.toLowerCase();
      filteredMatches = filteredMatches.filter(match => 
        match.location?.toLowerCase().includes(locationLower)
      );
    }
    
    // Filter by skills
    if (skills && skills.length > 0) {
      filteredMatches = filteredMatches.filter(match => 
        skills.some((skill: string) => 
          match.skills_to_teach.some(s => s.name.toLowerCase() === skill.toLowerCase()) ||
          match.skills_to_learn.some(s => s.name.toLowerCase() === skill.toLowerCase())
        )
      );
    }
  }
  
  // Apply limit and offset
  const limit = request?.limit || 12;
  const offset = request?.offset || 0;
  const paginatedMatches = filteredMatches.slice(offset, offset + limit);
  
  // Sort if requested
  if (request?.sort_by) {
    switch (request.sort_by) {
      case 'match_score':
        paginatedMatches.sort((a, b) => b.match_score - a.match_score);
        break;
      case 'last_active':
        paginatedMatches.sort((a, b) => 
          new Date(b.last_active || '').getTime() - 
          new Date(a.last_active || '').getTime()
        );
        break;
      case 'name':
        paginatedMatches.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'location':
        paginatedMatches.sort((a, b) => 
          (a.location || '').localeCompare(b.location || '')
        );
        break;
    }
  }
  
  return {
    matches: paginatedMatches,
    total: filteredMatches.length,
    has_more: offset + limit < filteredMatches.length,
    available_skills: mockSkills
  };
}
