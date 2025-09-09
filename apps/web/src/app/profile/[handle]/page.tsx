import { notFound } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Public profile page showing user information
 * Server-side rendered with data fetched at request time
 */
export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  // TODO: Add proper authentication check here
  // For now, we'll use mock data
  
  // Mock user data - in production, this would be fetched from the database
  const user = {
    id: '1',
    handle: handle || 'johndoe',
    fullName: 'John Doe',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. I love working with React, TypeScript, and Node.js. Always eager to learn new technologies and share knowledge with others.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB'],
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        duration: '2021 - Present',
        description: 'Leading development of microservices architecture and mentoring junior developers.'
      },
      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        duration: '2019 - 2021',
        description: 'Built and maintained web applications using React and Node.js.'
      }
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        year: '2019'
      }
    ],
    joinedAt: new Date('2020-01-15'),
    lastActiveAt: new Date(),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  };

  // In production, check if user exists
  if (!user) {
    notFound();
  }

  return <ProfileClient user={user} handle={handle} />;
}