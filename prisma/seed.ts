import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

/**
 * Main seeder function that populates the database with sample data
 */
async function main() {
  console.log('🌱 Starting database seeding...');

  await cleanDatabase();
  const users = await createUsers(20);
  await createSkills(users);
  await createAvailabilities(users);
  await createConnections(users);
  await createCohorts(users);

  console.log('✅ Seeding completed successfully!');
}

/**
 * Clean the database before seeding
 */
async function cleanDatabase() {
  console.log('🧹 Cleaning database...');
  
  // Delete all records from tables in the correct order to avoid foreign key constraints
  await prisma.notification.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.endorsement.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.message.deleteMany();
  await prisma.session.deleteMany();
  await prisma.cohortMember.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('🧹 Database cleaned');
}

/**
 * Create sample users
 * @param count Number of users to create
 * @returns Array of created users
 */
async function createUsers(count: number) {
  console.log(`👤 Creating ${count} users...`);
  
  const users: any[] = [];
  const timezones = [
    'America/Los_Angeles',
    'America/New_York',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Africa/Lagos',
    'Australia/Sydney',
  ];
  
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese'];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const handle = faker.helpers.slugify(`${firstName}-${lastName}-${faker.number.int(999)}`).toLowerCase();
    
    const user = await prisma.user.create({
      data: {
        handle,
        fullName: `${firstName} ${lastName}`,
        bio: faker.lorem.paragraph(),
        avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${handle}&radius=50`,
        timezone: faker.helpers.arrayElement(timezones),
        languages: faker.helpers.arrayElements(languages, { min: 1, max: 3 }),
        locationCity: faker.location.city(),
        locationCountry: faker.location.country(),
      }
    });
    
    users.push(user);
  }
  
  console.log(`✅ Created ${users.length} users`);
  return users;
}

/**
 * Create sample skills for users
 * @param users Array of users to create skills for
 */
async function createSkills(users: any[]) {
  console.log('🔍 Creating skills for users...');
  
  const teachSkills = [
    ['javascript', 'react', 'frontend'],
    ['python', 'django', 'backend'],
    ['design', 'figma', 'ui'],
    ['marketing', 'seo', 'content'],
    ['devops', 'aws', 'kubernetes'],
    ['mobile', 'react-native', 'ios'],
    ['data', 'sql', 'analytics'],
    ['management', 'agile', 'leadership'],
  ];
  
  const learnSkills = [
    ['typescript', 'nextjs', 'graphql'],
    ['rust', 'webassembly', 'systems'],
    ['ai', 'machine-learning', 'neural-networks'],
    ['blockchain', 'solidity', 'web3'],
    ['ux', 'user-research', 'accessibility'],
    ['copywriting', 'storytelling', 'branding'],
    ['flutter', 'dart', 'cross-platform'],
    ['product', 'strategy', 'growth'],
  ];
  
  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  for (const user of users) {
    // Each user has 1-3 teach skills
    const teachCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < teachCount; i++) {
      const skillTags = faker.helpers.arrayElement(teachSkills);
      
      await prisma.skill.create({
        data: {
          userId: user.id,
          kind: 'teach',
          tags: skillTags,
          level: faker.helpers.arrayElement(skillLevels) as any,
          notes: faker.lorem.sentences(2),
        }
      });
    }
    
    // Each user has 1-3 learn skills
    const learnCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < learnCount; i++) {
      const skillTags = faker.helpers.arrayElement(learnSkills);
      
      await prisma.skill.create({
        data: {
          userId: user.id,
          kind: 'learn',
          tags: skillTags,
          level: faker.helpers.arrayElement(skillLevels) as any,
          notes: faker.lorem.sentences(2),
        }
      });
    }
  }
  
  console.log('✅ Created skills for users');
}

/**
 * Create availabilities for users
 * @param users Array of users to create availabilities for
 */
async function createAvailabilities(users: any[]) {
  console.log('📅 Creating availability for users...');
  
  for (const user of users) {
    // Generate random availability mask (168 slots for a week)
    const weekMask: boolean[] = [];
    for (let i = 0; i < 168; i++) {
      // Working hours more likely to be available (9am-5pm)
      const hour = i % 24;
      const isWeekday = Math.floor(i / 24) < 5; // Monday-Friday
      const isWorkingHour = hour >= 9 && hour < 17;
      
      const availabilityChance = isWeekday && isWorkingHour ? 0.7 : 0.2;
      weekMask.push(Math.random() < availabilityChance);
    }
    
    await prisma.availability.create({
      data: {
        userId: user.id,
        weekMask,
      }
    });
  }
  
  console.log('✅ Created availability for users');
}

/**
 * Create connections between users
 * @param users Array of users to create connections for
 */
async function createConnections(users: any[]) {
  console.log('🔗 Creating connections between users...');
  
  // Create some accepted connections
  for (let i = 0; i < users.length; i++) {
    // Each user connects with 2-5 other users
    const connectionCount = faker.number.int({ min: 2, max: 5 });
    const connected: string[] = [];
    
    for (let j = 0; j < connectionCount; j++) {
      let otherUserIndex;
      do {
        otherUserIndex = faker.number.int({ min: 0, max: users.length - 1 });
      } while (otherUserIndex === i || connected.includes(users[otherUserIndex].id));
      
      const otherUser = users[otherUserIndex];
      connected.push(otherUser.id);
      
      await prisma.connection.create({
        data: {
          requesterId: users[i].id,
          addresseeId: otherUser.id,
          status: 'accepted',
        }
      });
    }
  }
  
  // Create some pending connections
  for (let i = 0; i < 10; i++) {
    const requesterIndex = faker.number.int({ min: 0, max: users.length - 1 });
    let addresseeIndex;
    do {
      addresseeIndex = faker.number.int({ min: 0, max: users.length - 1 });
    } while (addresseeIndex === requesterIndex);
    
    try {
      await prisma.connection.create({
        data: {
          requesterId: users[requesterIndex].id,
          addresseeId: users[addresseeIndex].id,
          status: 'pending',
        }
      });
    } catch (error) {
      // Skip if connection already exists
      console.log('Skipping duplicate connection');
    }
  }
  
  console.log('✅ Created connections between users');
}

/**
 * Create cohorts with members, sessions, and messages
 * @param users Array of users to include in cohorts
 */
async function createCohorts(users: any[]) {
  console.log('👥 Creating cohorts...');
  
  // Create a special cohort in Lagos as specified in the requirements
  const lagosCohort = await prisma.cohort.create({
    data: {
      title: "Lagos Web Development Masterclass",
      ownerId: users[0].id,
      size: 4,
      startDate: faker.date.recent({ days: 7 }),
      weeks: 6,
      visibility: 'public',
      city: 'Lagos',
    }
  });
  
  // Add members to Lagos cohort
  await prisma.cohortMember.create({
    data: {
      cohortId: lagosCohort.id,
      userId: users[0].id,
      role: 'teacher',
    }
  });
  
  // Add 3 more members
  for (let i = 1; i < 4; i++) {
    await prisma.cohortMember.create({
      data: {
        cohortId: lagosCohort.id,
        userId: users[i].id,
        role: 'learner',
      }
    });
  }
  
  // Create 6 weekly sessions
  const startDate = new Date(lagosCohort.startDate);
  for (let i = 0; i < 6; i++) {
    const sessionDate = new Date(startDate);
    sessionDate.setDate(startDate.getDate() + (i * 7)); // Weekly
    
    await prisma.session.create({
      data: {
        cohortId: lagosCohort.id,
        weekIndex: i,
        startsAt: sessionDate,
        durationMinutes: 60,
        notesUrl: i < 3 ? `https://docs.google.com/document/d/session-notes-${i}` : undefined,
      }
    });
  }
  
  // Create some messages in the Lagos cohort
  for (let i = 0; i < 20; i++) {
    const userId = users[faker.number.int({ min: 0, max: 3 })].id;
    
    await prisma.message.create({
      data: {
        cohortId: lagosCohort.id,
        userId,
        body: faker.lorem.paragraph(),
        createdAt: faker.date.recent({ days: 14 }),
      }
    });
  }
  
  // Create some artifacts
  const artifactKinds = ['repo', 'doc', 'video', 'image'];
  for (let i = 0; i < 3; i++) {
    const kind = artifactKinds[i % artifactKinds.length];
    let url;
    
    switch (kind) {
      case 'repo':
        url = 'https://github.com/example/project';
        break;
      case 'doc':
        url = 'https://docs.google.com/document/d/example';
        break;
      case 'video':
        url = 'https://youtube.com/watch?v=example';
        break;
      case 'image':
        url = `https://picsum.photos/seed/${lagosCohort.id}-${i}/1200/800`;
        break;
      default:
        url = 'https://example.com/artifact';
    }
    
    await prisma.artifact.create({
      data: {
        cohortId: lagosCohort.id,
        url,
        kind: kind as any,
      }
    });
  }
  
  // Create some feedback
  // Teacher -> Student feedback
  for (let i = 1; i < 4; i++) {
    await prisma.feedback.create({
      data: {
        cohortId: lagosCohort.id,
        fromUserId: users[0].id,
        toUserId: users[i].id,
        rating: faker.number.int({ min: 3, max: 5 }),
        text: faker.lorem.paragraph(),
      }
    });
  }
  
  // Student -> Teacher feedback
  for (let i = 1; i < 4; i++) {
    await prisma.feedback.create({
      data: {
        cohortId: lagosCohort.id,
        fromUserId: users[i].id,
        toUserId: users[0].id,
        rating: faker.number.int({ min: 4, max: 5 }),
        text: faker.lorem.paragraph(),
      }
    });
  }
  
  // Create some endorsements
  for (let i = 1; i < 4; i++) {
    await prisma.endorsement.create({
      data: {
        endorserId: users[0].id,
        endorseeId: users[i].id,
        tag: faker.helpers.arrayElement(['javascript', 'css', 'html']),
      }
    });
  }
  
  // Create some referrals
  for (let i = 1; i < 3; i++) {
    await prisma.referral.create({
      data: {
        fromUserId: users[0].id,
        toUserId: users[i].id,
        context: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['draft', 'sent', 'accepted']),
      }
    });
  }
  
  console.log('✅ Created cohorts with members, sessions, and messages');
  
  // Create a few more random cohorts
  for (let i = 0; i < 3; i++) {
    const ownerIndex = faker.number.int({ min: 4, max: users.length - 1 });
    const cohortSize = faker.number.int({ min: 2, max: 5 });
    
    const cohort = await prisma.cohort.create({
      data: {
        title: faker.lorem.words(3),
        ownerId: users[ownerIndex].id,
        size: cohortSize,
        startDate: faker.date.soon({ days: 30 }),
        weeks: faker.helpers.arrayElement([4, 6, 8]),
        visibility: faker.helpers.arrayElement(['private', 'public']),
        city: faker.location.city(),
      }
    });
    
    // Add owner as member
    await prisma.cohortMember.create({
      data: {
        cohortId: cohort.id,
        userId: users[ownerIndex].id,
        role: 'facilitator',
      }
    });
    
    // Add some more members
    const memberCount = faker.number.int({ min: 1, max: cohortSize - 1 });
    const memberIndices = new Set<number>();
    memberIndices.add(ownerIndex); // Avoid adding owner twice
    
    while (memberIndices.size < memberCount + 1) {
      const idx = faker.number.int({ min: 0, max: users.length - 1 });
      if (!memberIndices.has(idx)) {
        memberIndices.add(idx);
        
        await prisma.cohortMember.create({
          data: {
            cohortId: cohort.id,
            userId: users[idx].id,
            role: faker.helpers.arrayElement(['teacher', 'learner']),
          }
        });
      }
    }
    
    // Create sessions
    const startDate = new Date(cohort.startDate);
    const sessionCount = cohort.weeks;
    
    for (let j = 0; j < sessionCount; j++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(startDate.getDate() + (j * 7)); // Weekly
      
      await prisma.session.create({
        data: {
          cohortId: cohort.id,
          weekIndex: j,
          startsAt: sessionDate,
          durationMinutes: faker.helpers.arrayElement([45, 60, 90]),
        }
      });
    }
  }
  
  console.log('✅ Created additional cohorts');
}

// Execute the main function
main()
  .catch((e) => {
    console.error('Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma client
    await prisma.$disconnect();
  });
