import { DataSource } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Roles } from '../../users/enums/roles';
import { hashPassword } from '../../users/users.service';

interface UserSeed {
  email: string;
  name: string;
  role: Roles;
  password: string;
}

export async function seedUsers(dataSource: DataSource): Promise<void> {
  console.log('Seeding users...');

  const userRepository = dataSource.getRepository(User);

  // Define default users
  const defaultUsers: UserSeed[] = [
    {
      email: 'admin@admon.uniajc.edu.co',
      name: 'Admin User',
      role: Roles.Admin,
      password: await hashPassword('uniajcAdmin')
    },
    {
      email: 'moderator@admon.uniajc.edu.co',
      name: 'Moderator User',
      role: Roles.Moderator,
      password: await hashPassword('uniajcAdmin')
    },
    {
      email: 'citizen@admon.uniajc.edu.co',
      name: 'Citizen User',
      role: Roles.Citizen,
      password: await hashPassword('uniajcAdmin')
    }
  ];

  // Seed each user if they don't exist
  for (const userData of defaultUsers) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email }
    });

    if (!existingUser) {
      console.log(`Creating user: ${userData.email} (${userData.role})`);
      const user = userRepository.create(userData);
      await userRepository.save(user);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  console.log('✅ Users seeding completed');
}