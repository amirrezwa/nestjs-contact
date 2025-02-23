import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from '@prisma/client';

describe('ContactService', () => {
  let service: ContactService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactService, PrismaService],
    }).compile();

    service = module.get<ContactService>(ContactService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should delete a contact', async () => {
    jest.spyOn(prisma.contact, 'delete').mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: null, // یا مقدار تستی مثل 'test@example.com'
      phone: '09123456789',
      address: null, // یا مقدار تستی مثل 'Test Address'
      userId: 1,
      fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه      createdAt: new Date(),
      updatedAt: new Date(),
    } as Contact);

    const result = await service.remove(1);
    expect(result).not.toBeNull(); // بررسی کن مقدار `null` نباشه

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact', async () => {
    const contactData: CreateContactDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      phone: '09123456789',
      address: '123 Main St',
      userId: 1,
      fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه
    };

    jest.spyOn(prisma.contact, 'create').mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '09123456789',
      address: 'Some address',
      userId: 1,
      fileUrl: 'uploads/file.jpg',  // به جای undefined از string استفاده کنید
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create(contactData);

    expect(result).toHaveProperty('id');
    expect(result.firstName).toBe(contactData.firstName);
    expect(result.lastName).toBe(contactData.lastName);
    expect(result.phone).toBe(contactData.phone);
  });

  it('should find all contacts', async () => {
    const contacts = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        phone: '09123456789',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: null,
        address: null,
        fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه
      },
    ];

    jest.spyOn(prisma.contact, 'findMany').mockResolvedValue(contacts);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe('John');
  });

  it('should find one contact by ID', async () => {
    const contact = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: null, // مقدار اضافه شد
      phone: '09123456789',
      address: null, // مقدار اضافه شد
      userId: 1,
      fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.contact, 'findFirst').mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: null,
      phone: '09123456789',
      address: null,
      userId: 1,
      fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.findOne(1);
    expect(result).not.toBeNull();
    expect(result?.firstName).toBe('John');

    if (result) {
      console.log(result.firstName); // اینجا `result` قطعاً مقدار داره
    } else {
      console.error('Contact not found!');
    }
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    if (result) {
      expect(result.firstName).toBe('John');
    }

  });

  it('should throw an error if contact not found', async () => {
    jest.spyOn(prisma.contact, 'findUnique').mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(
      `Contact NOT found, id 999`,
    );
  });

  it('should update a contact', async () => {
    const updatedContact = {
      id: 1,
      firstName: 'John Updated',
      lastName: 'Doe',
      email: null, // مقدار اضافه شد
      phone: '09123456789',
      address: null, // مقدار اضافه شد
      userId: 1,
      fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.contact, 'update').mockResolvedValue(updatedContact);

    const result = await service.update(1, {
      firstName: 'John Updated',
      lastName: 'Doe',
      email: null,
      phone: '09123456789',
      address: null,
      fileUrl: '/uploads/file-1234567890.jpg',  // حتما باید string باشه
      userId: 1
    });

    expect(result).toBeDefined();
    expect(result.firstName).toBe('John Updated');
  });

});
