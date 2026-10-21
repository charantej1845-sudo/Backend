const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');
const NGOProfile = require('../models/NGOProfile');
const Skill = require('../models/Skill');
const Event = require('../models/Event');
const Availability = require('../models/Availability');
const Application = require('../models/Application');

const skillsData = [
  {
    name: 'First Aid & CPR Certified',
    category: 'Healthcare & First Aid',
    description: 'Basic life support, triage, emergency first response, and CPR.',
  },
  {
    name: 'Medical Screening & Nursing',
    category: 'Healthcare & First Aid',
    description: 'Vitals checking, triage assistance, patient intake, and basic nursing aid.',
  },
  {
    name: 'Elementary & Middle School Tutoring',
    category: 'Teaching & Mentoring',
    description: 'Math, science, English reading, and homework support for school students.',
  },
  {
    name: 'Coding & STEM Mentorship',
    category: 'Teaching & Mentoring',
    description: 'Teaching fundamentals of Scratch, Python, HTML/CSS, and robotics.',
  },
  {
    name: 'Tree Planting & Reforestation',
    category: 'Environment & Conservation',
    description: 'Sapling plantation, sapling care, soil preparation, and nursery maintenance.',
  },
  {
    name: 'Waste Management & Beach Cleanup',
    category: 'Environment & Conservation',
    description: 'Trash collection, plastic segregation, recycling audits, and clean-up drives.',
  },
  {
    name: 'Web & App Development',
    category: 'Technical & IT',
    description: 'Building websites, forms, database entry, and technical troubleshooting.',
  },
  {
    name: 'Data Entry & Spreadsheets',
    category: 'Technical & IT',
    description: 'Managing participant records, registration data, Excel, and Google Sheets.',
  },
  {
    name: 'Photography & Videography',
    category: 'Media, Content & Design',
    description: 'Event photojournalism, editing, short promo reels, and documentation.',
  },
  {
    name: 'Social Media & Graphic Design',
    category: 'Media, Content & Design',
    description: 'Canva, social media posters, promotional campaigns, and storytelling.',
  },
  {
    name: 'Event Coordination & Crowd Control',
    category: 'Logistics & Events',
    description: 'Stage management, queue direction, event flow, and participant onboarding.',
  },
  {
    name: 'Food & Relief Kit Packaging',
    category: 'Logistics & Events',
    description: 'Sorting food supplies, packing care hampers, warehouse inventory loading.',
  },
  {
    name: 'Community Outreach & Translation',
    category: 'General & Community',
    description: 'Multilingual assistance, survey conduction, door-to-door community awareness.',
  },
  {
    name: 'Elderly Companion Care',
    category: 'General & Community',
    description: 'Reading, recreational games, mobility aid, and conversation support.',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/volunteer_management_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await VolunteerProfile.deleteMany();
    await NGOProfile.deleteMany();
    await Skill.deleteMany();
    await Event.deleteMany();
    await Availability.deleteMany();
    await Application.deleteMany();

    console.log('Existing data wiped.');

    // 1. Seed Skills
    const createdSkills = await Skill.insertMany(skillsData);
    console.log(`Seeded ${createdSkills.length} skills.`);

    const skillMap = {};
    createdSkills.forEach((s) => {
      skillMap[s.name] = s._id;
    });

    // 2. Seed Admin
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@volunteerhub.org',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+1 555-0100',
    });

    // 3. Seed NGOs
    const ngoUser1 = await User.create({
      name: 'Green Earth Conservation Alliance',
      email: 'greenearth@ngo.org',
      password: 'password123',
      role: 'ngo',
      phone: '+1 555-0123',
    });

    const ngoProfile1 = await NGOProfile.create({
      user: ngoUser1._id,
      organizationName: 'Green Earth Conservation Alliance',
      registrationNumber: 'NGO-ENV-88492',
      causeCategory: 'Environment & Climate',
      mission: 'Preserving natural ecosystems, restoring urban forestry, and driving climate action through community mobilization.',
      description: 'Founded in 2018, Green Earth works across municipal parks, water bodies, and coastal belts to champion environmental restoration.',
      website: 'https://greenearth-ngo.example.org',
      contactPerson: 'David Miller (Field Director)',
      contactPhone: '+1 555-0123',
      address: {
        street: '124 Eco Park Blvd',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'USA',
      },
      verificationStatus: 'verified',
    });

    const ngoUser2 = await User.create({
      name: 'Hope For All Children Foundation',
      email: 'hopeforall@ngo.org',
      password: 'password123',
      role: 'ngo',
      phone: '+1 555-0155',
    });

    const ngoProfile2 = await NGOProfile.create({
      user: ngoUser2._id,
      organizationName: 'Hope For All Children Foundation',
      registrationNumber: 'NGO-EDU-43109',
      causeCategory: 'Education & Literacy',
      mission: 'Empowering underprivileged youth through quality after-school mentorship, STEM literacy, and arts integration.',
      description: 'We believe education is the single greatest equalizer. We partner with public schools to provide tutoring and creative workshops.',
      website: 'https://hopeforall-children.example.org',
      contactPerson: 'Elena Vasquez (Program Coordinator)',
      contactPhone: '+1 555-0155',
      address: {
        street: '450 Learning Lane',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        country: 'USA',
      },
      verificationStatus: 'verified',
    });

    const ngoUser3 = await User.create({
      name: 'Lifeline Community Health Services',
      email: 'lifeline@ngo.org',
      password: 'password123',
      role: 'ngo',
      phone: '+1 555-0188',
    });

    const ngoProfile3 = await NGOProfile.create({
      user: ngoUser3._id,
      organizationName: 'Lifeline Community Health Services',
      registrationNumber: 'NGO-HLT-77215',
      causeCategory: 'Healthcare & Mental Health',
      mission: 'Bringing preventive healthcare, basic health screenings, and wellness literacy to underserved communities.',
      description: 'Lifeline deploys mobile clinics and volunteers to conduct free blood pressure, diabetes, and dental camps.',
      website: 'https://lifelinehealth.example.org',
      contactPerson: 'Dr. Robert Thorne',
      contactPhone: '+1 555-0188',
      address: {
        street: '88 Care Medical Ave',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'USA',
      },
      verificationStatus: 'verified',
    });

    console.log('Seeded NGOs successfully.');

    // 4. Seed Volunteers
    const volUser1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      password: 'password123',
      role: 'volunteer',
      phone: '+1 555-0201',
    });

    const volProfile1 = await VolunteerProfile.create({
      user: volUser1._id,
      bio: 'Enthusiastic environmental advocate and STEM mentor with 3+ years experience helping kids learn science and participating in urban tree drives.',
      skills: [
        skillMap['Tree Planting & Reforestation'],
        skillMap['Elementary & Middle School Tutoring'],
        skillMap['Social Media & Graphic Design'],
      ],
      interests: ['Environment & Climate', 'Education & Literacy'],
      location: { city: 'Seattle', state: 'WA', country: 'USA' },
      emergencyContact: { name: 'Mark Jenkins', phone: '+1 555-0209', relation: 'Spouse' },
      totalHoursLogged: 24,
      eventsAttendedCount: 5,
      badges: ['First Step', 'Eco Crusader', 'Top Mentor'],
    });

    await Availability.create({
      volunteer: volUser1._id,
      daysOfWeek: ['Saturday', 'Sunday'],
      timeSlots: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 5PM)'],
      maxHoursPerWeek: 12,
      preferredLocationType: 'In-Person',
      notes: 'Available on all weekend mornings and Saturday afternoons. Highly mobile within Seattle area.',
    });

    const volUser2 = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: 'password123',
      role: 'volunteer',
      phone: '+1 555-0202',
    });

    const volProfile2 = await VolunteerProfile.create({
      user: volUser2._id,
      bio: 'Certified CPR first responder and software developer eager to contribute technical skills and on-the-ground disaster or medical camp aid.',
      skills: [
        skillMap['First Aid & CPR Certified'],
        skillMap['Web & App Development'],
        skillMap['Event Coordination & Crowd Control'],
        skillMap['Data Entry & Spreadsheets'],
      ],
      interests: ['Healthcare & Mental Health', 'Technical & IT', 'Disaster Relief & Aid'],
      location: { city: 'Chicago', state: 'IL', country: 'USA' },
      emergencyContact: { name: 'Maria Rivera', phone: '+1 555-0210', relation: 'Sister' },
      totalHoursLogged: 36,
      eventsAttendedCount: 7,
      badges: ['First Aid Hero', 'Tech for Good', 'Seasoned Volunteer'],
    });

    await Availability.create({
      volunteer: volUser2._id,
      daysOfWeek: ['Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Afternoon (12PM - 5PM)', 'Evening (5PM - 9PM)'],
      maxHoursPerWeek: 15,
      preferredLocationType: 'Any',
      notes: 'Can support evening remote tech tasks or weekend in-person medical camps.',
    });

    const volUser3 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: 'password123',
      role: 'volunteer',
      phone: '+1 555-0203',
    });

    const volProfile3 = await VolunteerProfile.create({
      user: volUser3._id,
      bio: 'Pre-med student and enthusiastic youth tutor passionate about community healthcare access and after-school STEM workshops.',
      skills: [
        skillMap['Medical Screening & Nursing'],
        skillMap['Coding & STEM Mentorship'],
        skillMap['Community Outreach & Translation'],
      ],
      interests: ['Healthcare & Mental Health', 'Education & Literacy'],
      location: { city: 'Austin', state: 'TX', country: 'USA' },
      emergencyContact: { name: 'Raj Patel', phone: '+1 555-0211', relation: 'Father' },
      totalHoursLogged: 16,
      eventsAttendedCount: 3,
      badges: ['Health Champion', 'STEM Star'],
    });

    await Availability.create({
      volunteer: volUser3._id,
      daysOfWeek: ['Saturday', 'Sunday', 'Wednesday'],
      timeSlots: ['Morning (8AM - 12PM)', 'Flexible / Any Time'],
      maxHoursPerWeek: 10,
      preferredLocationType: 'In-Person',
      notes: 'Available Wednesdays after 4 PM and full weekends.',
    });

    const volUser4 = await User.create({
      name: 'Marcus Chen',
      email: 'marcus.chen@example.com',
      password: 'password123',
      role: 'volunteer',
      phone: '+1 555-0204',
    });

    const volProfile4 = await VolunteerProfile.create({
      user: volUser4._id,
      bio: 'Freelance photographer and digital media creator looking to help non-profits capture their impact and share inspiring stories.',
      skills: [
        skillMap['Photography & Videography'],
        skillMap['Social Media & Graphic Design'],
        skillMap['Food & Relief Kit Packaging'],
      ],
      interests: ['Media, Content & Design', 'Community Development'],
      location: { city: 'Seattle', state: 'WA', country: 'USA' },
      emergencyContact: { name: 'Kelly Chen', phone: '+1 555-0212', relation: 'Sister' },
      totalHoursLogged: 18,
      eventsAttendedCount: 4,
      badges: ['Storyteller', 'Dedicated Contributor'],
    });

    await Availability.create({
      volunteer: volUser4._id,
      daysOfWeek: ['Monday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning (8AM - 12PM)', 'Afternoon (12PM - 5PM)'],
      maxHoursPerWeek: 8,
      preferredLocationType: 'In-Person',
      notes: 'Brings professional camera and lighting equipment.',
    });

    console.log('Seeded Volunteers and Availability schedules successfully.');

    // 5. Seed Events
    const event1 = await Event.create({
      title: 'Emerald Green Urban Tree Plantation Drive',
      ngo: ngoUser1._id,
      description: 'Join us for our major seasonal tree planting campaign! We will be planting 400 native cedar and maple saplings across Woodland Green Park. Tools, saplings, gloves, and lunch will be provided. Perfect for nature lovers and families.',
      category: 'Environment & Climate',
      locationType: 'In-Person',
      address: 'Woodland Green Park, North Trail Gate',
      city: 'Seattle',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      startTime: '09:00',
      endTime: '14:00',
      requiredSkills: [
        skillMap['Tree Planting & Reforestation'],
        skillMap['Event Coordination & Crowd Control'],
        skillMap['Photography & Videography'],
      ],
      volunteersNeeded: 15,
      volunteersRegisteredCount: 2,
      status: 'Upcoming',
      bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60',
      certificateProvided: true,
      hoursCredit: 5,
    });

    const event2 = await Event.create({
      title: 'Puget Sound Beach & Marine Cleanup',
      ngo: ngoUser1._id,
      description: 'Help us protect local marine life by clearing microplastics, nets, and trash along Golden Beach. Bio-degradable bags, safety pickers, and refreshments will be provided for all volunteers.',
      category: 'Environment & Climate',
      locationType: 'In-Person',
      address: 'Golden Gardens Shoreline, Point 3',
      city: 'Seattle',
      startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // in 12 days
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      startTime: '10:00',
      endTime: '15:00',
      requiredSkills: [
        skillMap['Waste Management & Beach Cleanup'],
        skillMap['Community Outreach & Translation'],
      ],
      volunteersNeeded: 20,
      volunteersRegisteredCount: 1,
      status: 'Upcoming',
      bannerImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=60',
      certificateProvided: true,
      hoursCredit: 5,
    });

    const event3 = await Event.create({
      title: 'Youth Coding & Robotics Weekend Bootcamp',
      ngo: ngoUser2._id,
      description: 'Introduce 6th-8th grade public school students to the wonders of Scratch, micro:bit programming, and creative coding! Tutors will guide small groups of 3-4 children each through hands-on game design.',
      category: 'Education & Literacy',
      locationType: 'In-Person',
      address: 'Austin Community Youth Center, Hall B',
      city: 'Austin',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      startTime: '10:00',
      endTime: '16:00',
      requiredSkills: [
        skillMap['Coding & STEM Mentorship'],
        skillMap['Elementary & Middle School Tutoring'],
      ],
      volunteersNeeded: 10,
      volunteersRegisteredCount: 1,
      status: 'Upcoming',
      bannerImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60',
      certificateProvided: true,
      hoursCredit: 6,
    });

    const event4 = await Event.create({
      title: 'Free Preventive Health & Dental Screening Camp',
      ngo: ngoUser3._id,
      description: 'A comprehensive free health fair serving over 300 neighborhood residents. We need volunteers for patient registration, basic vitals check (BP, blood glucose), and directing patients to specialized doctor tables.',
      category: 'Healthcare & Mental Health',
      locationType: 'In-Person',
      address: 'South Shore Wellness Center, 540 63rd St',
      city: 'Chicago',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      startTime: '08:00',
      endTime: '15:00',
      requiredSkills: [
        skillMap['First Aid & CPR Certified'],
        skillMap['Medical Screening & Nursing'],
        skillMap['Data Entry & Spreadsheets'],
        skillMap['Community Outreach & Translation'],
      ],
      volunteersNeeded: 12,
      volunteersRegisteredCount: 2,
      status: 'Active',
      bannerImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
      certificateProvided: true,
      hoursCredit: 7,
    });

    const event5 = await Event.create({
      title: 'Community Food Bank Care Hamper Assembly',
      ngo: ngoUser2._id,
      description: 'Help assemble 500 emergency food hampers for local families ahead of the holidays. Tasks involve sorting dry goods, packing balanced hampers, labeling, and warehouse organization.',
      category: 'Community Development',
      locationType: 'In-Person',
      address: 'Central Food Relief Warehouse, Dock 4',
      city: 'Austin',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // in past
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      startTime: '09:00',
      endTime: '14:00',
      requiredSkills: [
        skillMap['Food & Relief Kit Packaging'],
        skillMap['Event Coordination & Crowd Control'],
      ],
      volunteersNeeded: 8,
      volunteersRegisteredCount: 2,
      status: 'Completed',
      bannerImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60',
      certificateProvided: true,
      hoursCredit: 5,
    });

    console.log('Seeded Events successfully.');

    // 6. Seed Applications
    // Sarah Jenkins applied to Tree Plantation Drive (Approved)
    await Application.create({
      event: event1._id,
      volunteer: volUser1._id,
      ngo: ngoUser1._id,
      status: 'approved',
      message: 'Excited to join! I have planted trees before and can bring my own gardening spade.',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Marcus Chen applied to Tree Plantation Drive (Pending)
    await Application.create({
      event: event1._id,
      volunteer: volUser4._id,
      ngo: ngoUser1._id,
      status: 'pending',
      message: 'I can cover event photography and social media video reels for Green Earth!',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Sarah Jenkins applied to Beach Cleanup (Pending)
    await Application.create({
      event: event2._id,
      volunteer: volUser1._id,
      ngo: ngoUser1._id,
      status: 'pending',
      message: 'Love marine conservation, would love to join the Saturday team!',
      appliedAt: new Date(),
    });

    // Priya Patel applied to STEM Bootcamp (Approved)
    await Application.create({
      event: event3._id,
      volunteer: volUser3._id,
      ngo: ngoUser2._id,
      status: 'approved',
      message: 'I love teaching kids basic code logic and making STEM fun.',
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Alex Rivera applied to Health Camp (Approved)
    await Application.create({
      event: event4._id,
      volunteer: volUser2._id,
      ngo: ngoUser3._id,
      status: 'approved',
      message: 'CPR certified first responder, ready to help with patient vitals and queue triage.',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Priya Patel applied to Health Camp (Pending)
    await Application.create({
      event: event4._id,
      volunteer: volUser3._id,
      ngo: ngoUser3._id,
      status: 'pending',
      message: 'Pre-med student with nursing assistant experience.',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Past completed event application: Marcus Chen attended Food Relief Assembly
    await Application.create({
      event: event5._id,
      volunteer: volUser4._id,
      ngo: ngoUser2._id,
      status: 'attended',
      message: 'Happy to pack boxes and document the operation.',
      hoursLogged: 5,
      feedback: 'Marcus was fantastic! Helped organize the packing line efficiently.',
      rating: 5,
      appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    });

    // Past completed event application: Alex Rivera attended Food Relief Assembly
    await Application.create({
      event: event5._id,
      volunteer: volUser2._id,
      ngo: ngoUser2._id,
      status: 'attended',
      message: 'Ready to assist logistics and heavy lifting.',
      hoursLogged: 5,
      feedback: 'Outstanding dedication and hard worker.',
      rating: 5,
      appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    });

    console.log('Seeded Applications successfully.');
    console.log('\n=============================================');
    console.log('Volunteer Management System Demo Credentials:');
    console.log('---------------------------------------------');
    console.log('ADMIN:');
    console.log('  Email: admin@volunteerhub.org');
    console.log('  Password: adminpassword123');
    console.log('NGO 1:');
    console.log('  Email: greenearth@ngo.org');
    console.log('  Password: password123');
    console.log('NGO 2:');
    console.log('  Email: hopeforall@ngo.org');
    console.log('  Password: password123');
    console.log('VOLUNTEER 1:');
    console.log('  Email: sarah.jenkins@example.com');
    console.log('  Password: password123');
    console.log('VOLUNTEER 2:');
    console.log('  Email: alex.rivera@example.com');
    console.log('  Password: password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
