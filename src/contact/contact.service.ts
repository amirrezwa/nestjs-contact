import { HttpException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Contact } from '@prisma/client';

@Injectable()
export class ContactService {
  contact: any;
  constructor(private prisma: PrismaService) { }

  async create(data: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        ...data,
        fileUrl: data.fileUrl, // اینجا دقت کن که مسیر درست باشه
        userId: Number(data.userId),
        createdAt: new Date(), updatedAt: new Date()
      },
    });
  }

  findAll() {
    return this.prisma.contact.findMany();
  }

  async findOne(id: number): Promise<Contact | null> {
    const contact = await this.prisma.contact.findFirst({ where: { id } });

    if (!contact) {
      throw new HttpException(`Contact NOT found, id ${id}`, 404);
    }
    console.log(contact); 
    return contact;
  }

  async update(id: number, data: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Contact> {  // تغییر `void` به `Contact`
    return this.prisma.contact.delete({ where: { id } });
  }

}
