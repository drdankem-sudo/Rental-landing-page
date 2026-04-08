-- Keja Database Schema
-- Paste this into Supabase SQL Editor and click Run

-- ═══════ ENUMS ═══════
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MANAGER', 'CARETAKER', 'TENANT');
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'MAISONETTE', 'BUNGALOW', 'BEDSITTER', 'SINGLE_ROOM', 'COMMERCIAL');
CREATE TYPE "UnitStatus" AS ENUM ('OCCUPIED', 'VACANT', 'NOTICE_GIVEN', 'MAINTENANCE');
CREATE TYPE "TenancyStatus" AS ENUM ('ACTIVE', 'NOTICE_GIVEN', 'ENDED');
CREATE TYPE "PaymentStatus" AS ENUM ('MATCHED', 'UNMATCHED', 'PARTIAL', 'OVERPAYMENT', 'MANUALLY_MATCHED');
CREATE TYPE "PaymentSource" AS ENUM ('MPESA_C2B', 'MANUAL_ENTRY', 'BANK_TRANSFER');
CREATE TYPE "MaintenanceStatus" AS ENUM ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "MaintenanceCategory" AS ENUM ('PLUMBING', 'ELECTRICAL', 'PAINTING', 'CARPENTRY', 'GENERAL', 'SECURITY', 'CLEANING', 'OTHER');
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT_RECEIVED', 'PAYMENT_REMINDER', 'RENT_OVERDUE', 'RECEIPT', 'LEASE_EXPIRY', 'MAINTENANCE_UPDATE', 'GENERAL');
CREATE TYPE "NotificationChannel" AS ENUM ('SMS', 'IN_APP', 'BOTH');

-- ═══════ TABLES ═══════

CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL,
    "idNumber" TEXT,
    "idVerified" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE INDEX "User_phone_idx" ON "User"("phone");

CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "OtpCode_userId_code_idx" ON "OtpCode"("userId", "code");

CREATE TABLE "Property" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "address" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "paybillNumber" TEXT,
    "tillNumber" TEXT,
    "darajaConsumerKey" TEXT,
    "darajaConsumerSecret" TEXT,
    "darajaShortcode" TEXT,
    "darajaPasskey" TEXT,
    "darajaCallbackRegistered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Property_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_paybillNumber_idx" ON "Property"("paybillNumber");

CREATE TABLE "PropertyManager" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "canViewPayments" BOOLEAN NOT NULL DEFAULT true,
    "canManageTenants" BOOLEAN NOT NULL DEFAULT true,
    "canManageUnits" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyManager_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PropertyManager_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PropertyManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "PropertyManager_propertyId_userId_key" ON "PropertyManager"("propertyId", "userId");

CREATE TABLE "Unit" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "propertyId" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "floor" INTEGER,
    "bedrooms" INTEGER,
    "rentAmount" INTEGER NOT NULL,
    "depositAmount" INTEGER,
    "status" "UnitStatus" NOT NULL DEFAULT 'VACANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Unit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Unit_propertyId_unitNumber_key" ON "Unit"("propertyId", "unitNumber");
CREATE INDEX "Unit_propertyId_idx" ON "Unit"("propertyId");

CREATE TABLE "Tenancy" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "unitId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "rentAmount" INTEGER NOT NULL,
    "depositPaid" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "noticeDate" TIMESTAMP(3),
    "status" "TenancyStatus" NOT NULL DEFAULT 'ACTIVE',
    "leaseDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tenancy_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Tenancy_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tenancy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "Tenancy_unitId_idx" ON "Tenancy"("unitId");
CREATE INDEX "Tenancy_tenantId_idx" ON "Tenancy"("tenantId");
CREATE INDEX "Tenancy_status_idx" ON "Tenancy"("status");

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "propertyId" TEXT NOT NULL,
    "unitId" TEXT,
    "tenancyId" TEXT,
    "amount" INTEGER NOT NULL,
    "mpesaRef" TEXT,
    "mpesaPhone" TEXT,
    "mpesaName" TEXT,
    "accountReference" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNMATCHED',
    "source" "PaymentSource" NOT NULL DEFAULT 'MPESA_C2B',
    "paidAt" TIMESTAMP(3) NOT NULL,
    "month" TEXT NOT NULL,
    "receiptSentTenant" BOOLEAN NOT NULL DEFAULT false,
    "receiptSentLandlord" BOOLEAN NOT NULL DEFAULT false,
    "kraInvoiceGenerated" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Payment_mpesaRef_key" ON "Payment"("mpesaRef");
CREATE INDEX "Payment_propertyId_idx" ON "Payment"("propertyId");
CREATE INDEX "Payment_mpesaRef_idx" ON "Payment"("mpesaRef");
CREATE INDEX "Payment_mpesaPhone_idx" ON "Payment"("mpesaPhone");
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_month_idx" ON "Payment"("month");

CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "paymentId" TEXT NOT NULL,
    "receiptNo" TEXT NOT NULL,
    "tenantPhone" TEXT,
    "landlordPhone" TEXT,
    "amount" INTEGER NOT NULL,
    "kraPin" TEXT,
    "taxAmount" INTEGER,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Receipt_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Receipt_paymentId_key" ON "Receipt"("paymentId");
CREATE UNIQUE INDEX "Receipt_receiptNo_key" ON "Receipt"("receiptNo");

CREATE TABLE "MaintenanceRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "unitId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "category" "MaintenanceCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT[] DEFAULT '{}',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SUBMITTED',
    "assignedTo" TEXT,
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MaintenanceRequest_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "MaintenanceRequest_unitId_idx" ON "MaintenanceRequest"("unitId");
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "recipientId" TEXT NOT NULL,
    "senderId" TEXT,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'SMS',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "smsSent" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX "ActivityLog_propertyId_idx" ON "ActivityLog"("propertyId");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
