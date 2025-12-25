import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  decimal,
} from 'drizzle-orm/pg-core';

// ================= ENUMS =================

export const roleEnum = pgEnum('role', [
  'ADMIN',
  'DOCTOR',
  'PHARMACIST',
  'PATIENT',
]);

// Translated specializations to English
export const specializationEnum = pgEnum('specialization', [
  'GENERAL',
  'CARDIOLOGY',
  'PULMONOLOGY',
]);

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'WAITING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);
export const prescriptionStatusEnum = pgEnum('prescription_status', [
  'PENDING',
  'DISPENSED',
]);

export const genderEnum = pgEnum('gender', [
  'Male',
  'Female',
]);


// ================= TABLES =================

// 1. Users (Login System)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('PATIENT'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Patients (Demographics & National ID)
export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  nationalId: varchar('national_id', { length: 20 }).notNull().unique(), // Unique Search Key (NIK)
  name: varchar('name', { length: 255 }).notNull(),
  dob: timestamp('dob').notNull(), // Date of Birth
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  gender: genderEnum('gender').notNull(),
  userId: uuid('user_id').references(() => users.id), // Optional link to login account
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Doctors (Doctor Profiles)
export const doctors = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  gender: genderEnum('gender').notNull(),
  specialization: specializationEnum('specialization').notNull(),
  licenseNumber: varchar('license_number', { length: 50 }), // Practice License (SIP)
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
    .unique(), // Doctor must have a login account
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Doctor Schedules
export const doctorSchedules = pgTable('doctor_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  dayOfWeek: integer('day_of_week').notNull(), // 0=Sunday, 1=Monday, etc.
  startTime: varchar('start_time', { length: 5 }).notNull(), // Format: "08:00"
  endTime: varchar('end_time', { length: 5 }).notNull(), // Format: "12:00"
  isActive: boolean('is_active').default(true),
  doctorId: uuid('doctor_id')
    .references(() => doctors.id)
    .notNull(),
});

// 5. Appointments (Queue & Main Transaction)
export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  queueNumber: integer('queue_number').notNull(),
  date: timestamp('date').notNull(),
  status: appointmentStatusEnum('status').default('WAITING'),
  patientId: uuid('patient_id')
    .references(() => patients.id)
    .notNull(),
  doctorId: uuid('doctor_id')
    .references(() => doctors.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 6. Medical Records (Examination Results)
export const medicalRecords = pgTable('medical_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  diagnosis: text('diagnosis').notNull(),
  symptoms: text('symptoms').notNull(),
  notes: text('notes'),
  treatment: text('treatment'), // Medical action taken
  appointmentId: uuid('appointment_id')
    .references(() => appointments.id)
    .notNull()
    .unique(),
  patientId: uuid('patient_id')
    .references(() => patients.id)
    .notNull(), // Redundancy for easier history querying
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. Medicines (Inventory)
export const medicines = pgTable('medicines', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  stock: integer('stock').default(0),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(), // e.g., Tablet, Bottle, Strip
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 8. Prescriptions (Prescription Header)
export const prescriptions = pgTable('prescriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: prescriptionStatusEnum('status').default('PENDING'),
  medicalRecordId: uuid('medical_record_id')
    .references(() => medicalRecords.id)
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 9. Prescription Items (Medicine Details per Prescription)
export const prescriptionItems = pgTable('prescription_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quantity: integer('quantity').notNull(),
  instructions: text('instructions').notNull(), // e.g., "3x1 after meals"
  prescriptionId: uuid('prescription_id')
    .references(() => prescriptions.id)
    .notNull(),
  medicineId: uuid('medicine_id')
    .references(() => medicines.id)
    .notNull(),
});

// ================= RELATIONS (For 'with' Queries) =================

export const usersRelations = relations(users, ({ one }) => ({
  patientProfile: one(patients, {
    fields: [users.id],
    references: [patients.userId],
  }),
  doctorProfile: one(doctors, {
    fields: [users.id],
    references: [doctors.userId],
  }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  schedules: many(doctorSchedules),
  appointments: many(appointments),
}));

export const doctorSchedulesRelations = relations(
  doctorSchedules,
  ({ one }) => ({
    doctor: one(doctors, {
      fields: [doctorSchedules.doctorId],
      references: [doctors.id],
    }),
  }),
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  medicalRecord: one(medicalRecords, {
    // 1-to-1 optional relationship
    fields: [appointments.id],
    references: [medicalRecords.appointmentId],
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id],
  }),
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  prescription: one(prescriptions, {
    fields: [medicalRecords.id],
    references: [prescriptions.medicalRecordId],
  }),
}));

export const prescriptionsRelations = relations(
  prescriptions,
  ({ one, many }) => ({
    medicalRecord: one(medicalRecords, {
      fields: [prescriptions.medicalRecordId],
      references: [medicalRecords.id],
    }),
    items: many(prescriptionItems),
  }),
);

export const prescriptionItemsRelations = relations(
  prescriptionItems,
  ({ one }) => ({
    prescription: one(prescriptions, {
      fields: [prescriptionItems.prescriptionId],
      references: [prescriptions.id],
    }),
    medicine: one(medicines, {
      fields: [prescriptionItems.medicineId],
      references: [medicines.id],
    }),
  }),
);
