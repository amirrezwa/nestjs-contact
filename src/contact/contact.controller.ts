import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';


@Controller('contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const userId = req.body.userId; // گرفتن id کاربر
          const uploadPath = `./uploads/${userId}`;
          fs.mkdirSync(uploadPath, { recursive: true }); // ایجاد پوشه اگر وجود ندارد
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )


  @Roles(Role.USER)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new contact with an optional file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string' },
        userId: { type: 'integer' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body() createContactDto: CreateContactDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.contactService.create({ ...createContactDto, fileUrl });
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all contacts' })
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get a contact by id' })
  async findOne(@Param('id') id: string) {
    const contact = await this.contactService.findOne(+id);

    if (contact && contact.fileUrl) {
      contact.fileUrl = `http://localhost:3000${contact.fileUrl}`;
    }
    return contact;
  }

  @Get(':id/photo')
  async getPhoto(@Param('id') id: string, @Res() res: Response) {
    const contact = await this.contactService.findOne(+id);

    // بررسی وجود کانتکت و عکس
    if (!contact || !contact.fileUrl) {
      throw new NotFoundException('Photo not found');
    }

    const fileName = path.basename(contact.fileUrl); // استخراج نام فایل
    const filePath = path.resolve('uploads', fileName); // مسیر کامل فایل
  
    // بررسی وجود فایل
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File does not exist');
    }

    return res.sendFile(filePath);
  }



  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a contact' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a contact' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
