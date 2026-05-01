// ═══════════════════════════════════════════════════════════
// Base.ke — Unified App (Dashboard + Tenant + Admin)
// ═══════════════════════════════════════════════════════════

// ═══════ MERGED DEMO DATA ═══════
const DATA = {
  owner: { id: 'u1', name: 'James Mwangi', phone: '0712345678', role: 'OWNER' },
  properties: [
    { id: 'p1', name: 'Sunrise Apartments', type: 'APARTMENT', address: 'Ngong Road, Kilimani', county: 'Nairobi', town: 'Nairobi', total_units: 24, owner_id: 'u1' },
    { id: 'p2', name: 'Green Valley Courts', type: 'APARTMENT', address: 'Thika Road, Roysambu', county: 'Nairobi', town: 'Nairobi', total_units: 16, owner_id: 'u1' }
  ],
  units: {
    p1: [
      { id: 'un1', property_id: 'p1', unit_number: 'A1', floor: 0, bedrooms: 1, rent_amount: 15000, deposit_amount: 15000, status: 'OCCUPIED' },
      { id: 'un2', property_id: 'p1', unit_number: 'A2', floor: 0, bedrooms: 1, rent_amount: 15000, deposit_amount: 15000, status: 'OCCUPIED' },
      { id: 'un3', property_id: 'p1', unit_number: 'B1', floor: 1, bedrooms: 2, rent_amount: 25000, deposit_amount: 25000, status: 'OCCUPIED' },
      { id: 'un4', property_id: 'p1', unit_number: 'B2', floor: 1, bedrooms: 2, rent_amount: 25000, deposit_amount: 25000, status: 'VACANT' },
      { id: 'un5', property_id: 'p1', unit_number: 'C1', floor: 2, bedrooms: 3, rent_amount: 35000, deposit_amount: 35000, status: 'OCCUPIED' },
      { id: 'un6', property_id: 'p1', unit_number: 'C2', floor: 2, bedrooms: 3, rent_amount: 35000, deposit_amount: 35000, status: 'NOTICE_GIVEN' },
      { id: 'un7', property_id: 'p1', unit_number: 'D1', floor: 3, bedrooms: 1, rent_amount: 18000, deposit_amount: 18000, status: 'MAINTENANCE' },
      { id: 'un8', property_id: 'p1', unit_number: 'D2', floor: 3, bedrooms: 2, rent_amount: 28000, deposit_amount: 28000, status: 'OCCUPIED' }
    ],
    p2: [
      { id: 'un9', property_id: 'p2', unit_number: '101', floor: 1, bedrooms: 1, rent_amount: 12000, deposit_amount: 12000, status: 'OCCUPIED' },
      { id: 'un10', property_id: 'p2', unit_number: '102', floor: 1, bedrooms: 2, rent_amount: 20000, deposit_amount: 20000, status: 'VACANT' },
      { id: 'un11', property_id: 'p2', unit_number: '201', floor: 2, bedrooms: 1, rent_amount: 12000, deposit_amount: 12000, status: 'OCCUPIED' },
      { id: 'un12', property_id: 'p2', unit_number: '202', floor: 2, bedrooms: 2, rent_amount: 22000, deposit_amount: 22000, status: 'OCCUPIED' }
    ]
  },
  tenancies: {
    p1: [
      { id: 't1', unit_id: 'un1', tenant_id: 'ten1', rent_amount: 15000, deposit_paid: 15000, start_date: '2025-03-01', status: 'ACTIVE', tenant: { id: 'ten1', name: 'Alice Wanjiku', phone: '0722111222', id_verified: true }, unit: { id: 'un1', unit_number: 'A1', rent_amount: 15000 } },
      { id: 't2', unit_id: 'un2', tenant_id: 'ten2', rent_amount: 15000, deposit_paid: 15000, start_date: '2025-06-01', status: 'ACTIVE', tenant: { id: 'ten2', name: 'Brian Otieno', phone: '0733222333', id_verified: true }, unit: { id: 'un2', unit_number: 'A2', rent_amount: 15000 } },
      { id: 't3', unit_id: 'un3', tenant_id: 'ten3', rent_amount: 25000, deposit_paid: 25000, start_date: '2025-01-15', status: 'ACTIVE', tenant: { id: 'ten3', name: 'Carol Njeri', phone: '0711333444', id_verified: false }, unit: { id: 'un3', unit_number: 'B1', rent_amount: 25000 } },
      { id: 't5', unit_id: 'un5', tenant_id: 'ten5', rent_amount: 35000, deposit_paid: 35000, start_date: '2024-11-01', status: 'ACTIVE', tenant: { id: 'ten5', name: 'Edward Kamau', phone: '0700555666', id_verified: true }, unit: { id: 'un5', unit_number: 'C1', rent_amount: 35000 } },
      { id: 't6', unit_id: 'un6', tenant_id: 'ten6', rent_amount: 35000, deposit_paid: 35000, start_date: '2025-02-01', status: 'NOTICE_GIVEN', tenant: { id: 'ten6', name: 'Faith Akinyi', phone: '0722666777', id_verified: true }, unit: { id: 'un6', unit_number: 'C2', rent_amount: 35000 } },
      { id: 't8', unit_id: 'un8', tenant_id: 'ten8', rent_amount: 28000, deposit_paid: 28000, start_date: '2025-04-01', status: 'ACTIVE', tenant: { id: 'ten8', name: 'George Mutua', phone: '0733888999', id_verified: true }, unit: { id: 'un8', unit_number: 'D2', rent_amount: 28000 } }
    ],
    p2: [
      { id: 't9', unit_id: 'un9', tenant_id: 'ten9', rent_amount: 12000, deposit_paid: 12000, start_date: '2025-05-01', status: 'ACTIVE', tenant: { id: 'ten9', name: 'Hannah Wambui', phone: '0711999000', id_verified: true }, unit: { id: 'un9', unit_number: '101', rent_amount: 12000 } },
      { id: 't11', unit_id: 'un11', tenant_id: 'ten11', rent_amount: 12000, deposit_paid: 12000, start_date: '2025-07-01', status: 'ACTIVE', tenant: { id: 'ten11', name: 'Ivan Kiprop', phone: '0700111222', id_verified: false }, unit: { id: 'un11', unit_number: '201', rent_amount: 12000 } },
      { id: 't12', unit_id: 'un12', tenant_id: 'ten12', rent_amount: 22000, deposit_paid: 22000, start_date: '2025-08-01', status: 'ACTIVE', tenant: { id: 'ten12', name: 'Jane Chebet', phone: '0722333444', id_verified: true }, unit: { id: 'un12', unit_number: '202', rent_amount: 22000 } }
    ]
  },
  payments: {
    p1: [
      { id: 'pay1', property_id: 'p1', amount: 15000, mpesa_ref: 'SLK3A7B9XQ', mpesa_name: 'ALICE WANJIKU', paid_at: '2026-04-28T10:23:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: 'A1' }, tenancy: { tenant: { name: 'Alice Wanjiku', phone: '0722111222' } } },
      { id: 'pay2', property_id: 'p1', amount: 15000, mpesa_ref: 'RKQ8H2D4VP', mpesa_name: 'BRIAN OTIENO', paid_at: '2026-04-27T14:11:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: 'A2' }, tenancy: { tenant: { name: 'Brian Otieno', phone: '0733222333' } } },
      { id: 'pay3', property_id: 'p1', amount: 25000, mpesa_ref: 'TMN5C1F8WJ', mpesa_name: 'CAROL NJERI', paid_at: '2026-04-26T09:45:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: 'B1' }, tenancy: { tenant: { name: 'Carol Njeri', phone: '0711333444' } } },
      { id: 'pay4', property_id: 'p1', amount: 35000, mpesa_ref: 'YPL6E3G2XK', mpesa_name: 'EDWARD KAMAU', paid_at: '2026-04-25T16:30:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: 'C1' }, tenancy: { tenant: { name: 'Edward Kamau', phone: '0700555666' } } },
      { id: 'pay5', property_id: 'p1', amount: 20000, mpesa_ref: 'HBW9K4M7ZR', mpesa_name: 'FAITH AKINYI', paid_at: '2026-04-24T11:05:00Z', month: '2026-04', status: 'PARTIAL', unit: { unit_number: 'C2' }, tenancy: { tenant: { name: 'Faith Akinyi', phone: '0722666777' } } },
      { id: 'pay6', property_id: 'p1', amount: 28000, mpesa_ref: 'QDX2J6N1LS', mpesa_name: 'GEORGE MUTUA', paid_at: '2026-04-23T08:50:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: 'D2' }, tenancy: { tenant: { name: 'George Mutua', phone: '0733888999' } } },
      { id: 'pay7', property_id: 'p1', amount: 14500, mpesa_ref: 'FCT7P5R3UA', mpesa_name: 'UNKNOWN SENDER', paid_at: '2026-04-22T13:20:00Z', month: '2026-04', status: 'UNMATCHED', unit: null, tenancy: null },
      { id: 'pay8', property_id: 'p1', amount: 15000, mpesa_ref: 'MVS4L8W6YB', mpesa_name: 'ALICE WANJIKU', paid_at: '2026-03-29T10:10:00Z', month: '2026-03', status: 'MATCHED', unit: { unit_number: 'A1' }, tenancy: { tenant: { name: 'Alice Wanjiku', phone: '0722111222' } } }
    ],
    p2: [
      { id: 'pay9', property_id: 'p2', amount: 12000, mpesa_ref: 'GNR1Q9T5XC', mpesa_name: 'HANNAH WAMBUI', paid_at: '2026-04-27T09:00:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: '101' }, tenancy: { tenant: { name: 'Hannah Wambui', phone: '0711999000' } } },
      { id: 'pay10', property_id: 'p2', amount: 12000, mpesa_ref: 'KAP3S7V2ZD', mpesa_name: 'IVAN KIPROP', paid_at: '2026-04-26T15:30:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: '201' }, tenancy: { tenant: { name: 'Ivan Kiprop', phone: '0700111222' } } },
      { id: 'pay11', property_id: 'p2', amount: 22000, mpesa_ref: 'WEH5U1X8BF', mpesa_name: 'JANE CHEBET', paid_at: '2026-04-25T12:15:00Z', month: '2026-04', status: 'MATCHED', unit: { unit_number: '202' }, tenancy: { tenant: { name: 'Jane Chebet', phone: '0722333444' } } }
    ]
  },
  stats: {
    p1: { totalUnits: 8, occupiedUnits: 5, vacantUnits: 1, occupancyRate: 63, expectedRent: 153000, collectedRent: 138000, collectionRate: 90, unmatchedPayments: 1 },
    p2: { totalUnits: 4, occupiedUnits: 3, vacantUnits: 1, occupancyRate: 75, expectedRent: 46000, collectedRent: 46000, collectionRate: 100, unmatchedPayments: 0 }
  },
  monthlyCollections: {
    p1: [{ month:'2025-11',total:120000 },{ month:'2025-12',total:135000 },{ month:'2026-01',total:128000 },{ month:'2026-02',total:142000 },{ month:'2026-03',total:148000 },{ month:'2026-04',total:138000 }],
    p2: [{ month:'2025-11',total:34000 },{ month:'2025-12',total:40000 },{ month:'2026-01',total:44000 },{ month:'2026-02',total:46000 },{ month:'2026-03',total:46000 },{ month:'2026-04',total:46000 }]
  },
  maintenance: {
    p1: [
      { id: 'm1', unit: { unit_number: 'D1', property_id: 'p1' }, category: 'PLUMBING', description: 'Kitchen sink leaking badly, water pooling on floor', status: 'IN_PROGRESS', created_at: '2026-04-20T08:00:00Z' },
      { id: 'm2', unit: { unit_number: 'A2', property_id: 'p1' }, category: 'ELECTRICAL', description: 'Bedroom light switch not working', status: 'SUBMITTED', created_at: '2026-04-26T14:00:00Z' },
      { id: 'm3', unit: { unit_number: 'C1', property_id: 'p1' }, category: 'PAINTING', description: 'Bathroom ceiling paint peeling', status: 'COMPLETED', created_at: '2026-04-10T10:00:00Z' }
    ],
    p2: [
      { id: 'm4', unit: { unit_number: '201', property_id: 'p2' }, category: 'SECURITY', description: 'Front door lock jammed, needs replacement', status: 'ASSIGNED', created_at: '2026-04-25T09:00:00Z' }
    ]
  },
  tenantScores: {
    ten1:{score:92,level:'excellent'},ten2:{score:85,level:'good'},ten3:{score:68,level:'fair'},
    ten5:{score:95,level:'excellent'},ten6:{score:74,level:'good'},ten8:{score:88,level:'good'},
    ten9:{score:91,level:'excellent'},ten11:{score:55,level:'fair'},ten12:{score:82,level:'good'}
  },
  leases: {
    p1: [
      { id:'l1',tenant:'Alice Wanjiku',unit:'A1',start:'2025-03-01',end:'2026-03-01',status:'expired',signed:true,doc:'lease_A1.pdf' },
      { id:'l2',tenant:'Brian Otieno',unit:'A2',start:'2025-06-01',end:'2026-06-01',status:'active',signed:true,doc:'lease_A2.pdf' },
      { id:'l3',tenant:'Carol Njeri',unit:'B1',start:'2025-01-15',end:'2026-01-15',status:'expired',signed:true,doc:'lease_B1.pdf' },
      { id:'l5',tenant:'Edward Kamau',unit:'C1',start:'2024-11-01',end:'2025-11-01',status:'expired',signed:true,doc:null },
      { id:'l6',tenant:'Faith Akinyi',unit:'C2',start:'2025-02-01',end:'2026-05-15',status:'expiring',signed:true,doc:'lease_C2.pdf' },
      { id:'l8',tenant:'George Mutua',unit:'D2',start:'2025-04-01',end:'2027-04-01',status:'active',signed:false,doc:null }
    ],
    p2: [
      { id:'l9',tenant:'Hannah Wambui',unit:'101',start:'2025-05-01',end:'2026-05-01',status:'expiring',signed:true,doc:'lease_101.pdf' },
      { id:'l11',tenant:'Ivan Kiprop',unit:'201',start:'2025-07-01',end:'2026-07-01',status:'active',signed:true,doc:'lease_201.pdf' },
      { id:'l12',tenant:'Jane Chebet',unit:'202',start:'2025-08-01',end:'2027-08-01',status:'active',signed:true,doc:'lease_202.pdf' }
    ]
  },
  utilities: {
    p1: [{ unit:'A1',water:1200,garbage:500,electricity:2800,total:4500 },{ unit:'A2',water:900,garbage:500,electricity:2100,total:3500 },{ unit:'B1',water:1400,garbage:500,electricity:3500,total:5400 },{ unit:'C1',water:1100,garbage:500,electricity:3800,total:5400 },{ unit:'C2',water:1000,garbage:500,electricity:3200,total:4700 },{ unit:'D2',water:1300,garbage:500,electricity:3000,total:4800 }],
    p2: [{ unit:'101',water:800,garbage:400,electricity:2200,total:3400 },{ unit:'201',water:900,garbage:400,electricity:2500,total:3800 },{ unit:'202',water:1100,garbage:400,electricity:3200,total:4700 }]
  },
  arrears: {
    p1: [{ tenant:'Faith Akinyi',unit:'C2',owed:15000,rent:35000,paid:20000 },{ tenant:'Carol Njeri',unit:'B1',owed:25000,rent:25000,paid:0 }],
    p2: []
  },
  activityLog: [
    { action:'Payment received',detail:'KES 15,000 from Alice Wanjiku — Unit A1',time:'2 hours ago',type:'payment' },
    { action:'Maintenance assigned',detail:'Plumbing — Unit D1 assigned to John Fundi',time:'5 hours ago',type:'maintenance' },
    { action:'Tenant notice',detail:'Faith Akinyi gave notice — Unit C2',time:'1 day ago',type:'tenant' },
    { action:'Payment received',detail:'KES 28,000 from George Mutua — Unit D2',time:'1 day ago',type:'payment' },
    { action:'Lease signed',detail:'Brian Otieno e-signed lease for Unit A2',time:'2 days ago',type:'lease' },
    { action:'KRA invoice generated',detail:'April 2026 rental income — KES 138,000',time:'3 days ago',type:'tax' },
    { action:'Maintenance completed',detail:'Painting — Unit C1 ceiling repaired',time:'4 days ago',type:'maintenance' },
    { action:'Unmatched payment',detail:'KES 14,500 from unknown sender',time:'5 days ago',type:'alert' }
  ],
  kraStatus: {
    p1: { filed:5,pending:1,totalTax:22080,lastFiled:'2026-04-28',pin:'A012345678Z',etims:true },
    p2: { filed:3,pending:0,totalTax:7360,lastFiled:'2026-04-27',pin:'A012345678Z',etims:true }
  },

  // ── Tenant portal view (Alice Wanjiku) ──
  tv: {
    tenant: { id:'ten1',name:'Alice Wanjiku',phone:'0722111222',email:'alice@gmail.com',id_number:'32456789',id_verified:true,score:92,scoreLevel:'excellent' },
    property: { name:'Sunrise Apartments',address:'Ngong Road, Kilimani',landlord:'James Mwangi',landlordPhone:'0712345678' },
    unit: { id:'un1',number:'A1',floor:0,bedrooms:1,rent:15000,deposit:15000,status:'OCCUPIED' },
    lease: { start:'2025-03-01',end:'2026-03-01',status:'expired',signed:true,doc:'lease_A1.pdf',renewalAvailable:true },
    balance: { rent:15000,utilities:4500,totalDue:19500,dueDate:'2026-05-05',lastPaid:'2026-04-28',overpayment:0 },
    payments: [
      { id:'p1',amount:15000,ref:'SLK3A7B9XQ',date:'2026-04-28T10:23:00Z',month:'April 2026',status:'MATCHED',receipt:'BK-2026-00012' },
      { id:'p2',amount:15000,ref:'MVS4L8W6YB',date:'2026-03-29T10:10:00Z',month:'March 2026',status:'MATCHED',receipt:'BK-2026-00008' },
      { id:'p3',amount:15000,ref:'JKL2M5N8QP',date:'2026-02-27T09:15:00Z',month:'February 2026',status:'MATCHED',receipt:'BK-2026-00004' },
      { id:'p4',amount:15000,ref:'ABC1D4E7FG',date:'2026-01-30T11:40:00Z',month:'January 2026',status:'MATCHED',receipt:'BK-2026-00001' },
      { id:'p5',amount:15000,ref:'XYZ9W6V3TU',date:'2025-12-28T08:20:00Z',month:'December 2025',status:'MATCHED',receipt:'BK-2025-00045' },
      { id:'p6',amount:15000,ref:'HIJ5K8L1MN',date:'2025-11-29T14:55:00Z',month:'November 2025',status:'MATCHED',receipt:'BK-2025-00038' },
      { id:'p7',amount:10000,ref:'OPQ2R5S8TU',date:'2025-10-31T10:00:00Z',month:'October 2025',status:'PARTIAL',receipt:null },
      { id:'p8',amount:15000,ref:'VWX3Y6Z9AB',date:'2025-09-28T09:30:00Z',month:'September 2025',status:'MATCHED',receipt:'BK-2025-00025' }
    ],
    maintenance: [
      { id:'mr1',category:'PLUMBING',description:'Kitchen tap dripping constantly, wasting water',status:'COMPLETED',created:'2026-03-15T08:00:00Z',updated:'2026-03-18T16:00:00Z',assignedTo:'John Fundi',notes:'Replaced washer and tightened valve' },
      { id:'mr2',category:'ELECTRICAL',description:'Living room socket sparking when plugging in appliances',status:'IN_PROGRESS',created:'2026-04-25T14:00:00Z',updated:'2026-04-27T09:00:00Z',assignedTo:'Peter Electrician',notes:'Parts ordered, scheduled for Thursday' },
      { id:'mr3',category:'GENERAL',description:'Window handle broken, cannot close bedroom window properly',status:'SUBMITTED',created:'2026-04-29T10:00:00Z',updated:null,assignedTo:null,notes:null }
    ],
    utilities: {
      current: { month:'April 2026',water:1200,garbage:500,electricity:2800,total:4500 },
      history: [{ month:'March 2026',water:1100,garbage:500,electricity:2600,total:4200 },{ month:'February 2026',water:1300,garbage:500,electricity:3100,total:4900 },{ month:'January 2026',water:1050,garbage:500,electricity:2400,total:3950 }]
    },
    notices: [
      { id:'n1',title:'Water tank cleaning',message:'Water supply will be interrupted on Saturday 3rd May from 8am-2pm for routine tank cleaning.',date:'2026-04-28',type:'warning' },
      { id:'n2',title:'Rent reminder',message:'May 2026 rent of KES 15,000 is due by 5th May. Pay to Paybill 123456, Account: A1.',date:'2026-04-30',type:'info' },
      { id:'n3',title:'Security update',message:'New CCTV cameras have been installed in the parking area and main entrance.',date:'2026-04-20',type:'info' },
      { id:'n4',title:'Lease renewal',message:'Your lease expired on 1st March 2026. Please visit the management office to renew.',date:'2026-03-05',type:'warning' }
    ],
    paymentMonths: [{ month:'Nov',paid:15000,due:15000 },{ month:'Dec',paid:15000,due:15000 },{ month:'Jan',paid:15000,due:15000 },{ month:'Feb',paid:15000,due:15000 },{ month:'Mar',paid:15000,due:15000 },{ month:'Apr',paid:15000,due:15000 }]
  },

  // ── Admin RBAC data ──
  admin: {
    users: [
      { id:'u1',name:'James Mwangi',phone:'0712345678',role:'OWNER',email:'james@base.ke',lastActive:'2026-04-30T10:00:00Z',status:'active' },
      { id:'u2',name:'Mary Njoroge',phone:'0723456789',role:'MANAGER',email:'mary@base.ke',lastActive:'2026-04-30T08:30:00Z',status:'active' },
      { id:'u3',name:'Peter Ochieng',phone:'0734567890',role:'CARETAKER',email:null,lastActive:'2026-04-29T17:00:00Z',status:'active' },
      { id:'u4',name:'Sarah Kimani',phone:'0745678901',role:'MANAGER',email:'sarah@gmail.com',lastActive:'2026-04-28T14:00:00Z',status:'active' },
      { id:'u5',name:'David Kipchoge',phone:'0756789012',role:'CARETAKER',email:null,lastActive:'2026-04-25T09:00:00Z',status:'inactive' }
    ],
    assignments: [
      { userId:'u2',propertyId:'p1',canViewPayments:true,canManageTenants:true,canManageUnits:false },
      { userId:'u2',propertyId:'p2',canViewPayments:true,canManageTenants:true,canManageUnits:true },
      { userId:'u3',propertyId:'p1',canViewPayments:false,canManageTenants:false,canManageUnits:false },
      { userId:'u4',propertyId:'p3',canViewPayments:true,canManageTenants:true,canManageUnits:true },
      { userId:'u5',propertyId:'p2',canViewPayments:false,canManageTenants:false,canManageUnits:false }
    ],
    roleDefinitions: [
      { role:'OWNER',label:'Owner',desc:'Full access to all properties, users, billing, and settings',permissions:['View all properties','Manage units','Manage tenants','View payments','Match payments','Manage staff','View reports','KRA/eTIMS','Billing settings'] },
      { role:'MANAGER',label:'Manager',desc:'Manage assigned properties — tenants, units, and payments',permissions:['View assigned properties','Manage units (if granted)','Manage tenants (if granted)','View payments (if granted)','Match payments','View reports'] },
      { role:'CARETAKER',label:'Caretaker',desc:'On-site support — maintenance, viewings, basic reporting',permissions:['View assigned properties','View unit status','Log maintenance','Confirm viewings','Basic reports'] },
      { role:'TENANT',label:'Tenant',desc:'Self-service portal — pay rent, request maintenance, view lease',permissions:['View own unit','Pay rent','Submit maintenance','View lease','View receipts','View utilities'] }
    ],
    auditLog: [
      { user:'James Mwangi',action:'Changed role',detail:'Mary Njoroge: CARETAKER → MANAGER',time:'2026-04-30T09:45:00Z',type:'role' },
      { user:'James Mwangi',action:'Granted permission',detail:'Mary Njoroge: can_manage_units on Green Valley Courts',time:'2026-04-30T09:46:00Z',type:'permission' },
      { user:'Mary Njoroge',action:'Added tenant',detail:'Brian Otieno assigned to Unit A2, Sunrise Apartments',time:'2026-04-29T14:20:00Z',type:'tenant' },
      { user:'James Mwangi',action:'Invited user',detail:'Sarah Kimani invited as MANAGER',time:'2026-04-28T11:00:00Z',type:'user' },
      { user:'Peter Ochieng',action:'Logged maintenance',detail:'Plumbing issue — Unit D1, Sunrise Apartments',time:'2026-04-27T16:30:00Z',type:'maintenance' },
      { user:'James Mwangi',action:'Assigned property',detail:'Sarah Kimani → Lakeview Residences (full access)',time:'2026-04-28T11:05:00Z',type:'property' },
      { user:'Mary Njoroge',action:'Matched payment',detail:'KES 25,000 → Carol Njeri, Unit B1',time:'2026-04-26T10:15:00Z',type:'payment' },
      { user:'James Mwangi',action:'Deactivated user',detail:'David Kipchoge — no longer on-site',time:'2026-04-25T08:00:00Z',type:'user' },
      { user:'Peter Ochieng',action:'Confirmed viewing',detail:'Unit B2, Sunrise Apartments — prospective tenant',time:'2026-04-24T11:00:00Z',type:'property' },
      { user:'James Mwangi',action:'Updated permissions',detail:'Peter Ochieng: removed payment access on Sunrise',time:'2026-04-23T09:30:00Z',type:'permission' }
    ]
  }
};

let state = { user: null, portal: 'dashboard', activeTab: 'overview', activeProperty: null, properties: [] };
let paymentFilter = 'all';

// ═══════ AUTH ═══════
function handleRequestOtp() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (!phone) return showError('Enter any phone number');
  document.getElementById('phoneStep').style.display = 'none';
  document.getElementById('otpStep').style.display = 'block';
  hideError();
}

function handleVerifyOtp() {
  const phone = document.getElementById('phoneInput').value.trim();
  const code = document.getElementById('otpInput').value.trim();
  if (!code) return showError('Enter any code');
  const role = document.getElementById('roleSelect').value;
  if (role === 'TENANT') {
    state.user = DATA.tv.tenant;
    state.user.role = 'TENANT';
    state.portal = 'tenant';
    state.activeTab = 'home';
  } else {
    state.user = { ...DATA.owner, phone: phone, role: role };
    state.portal = 'dashboard';
    state.activeTab = 'overview';
  }
  initApp();
}

function handleLogout() {
  state.user = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

function showError(msg) { const el = document.getElementById('loginError'); el.textContent = msg; el.style.display = 'block'; }
function hideError() { document.getElementById('loginError').style.display = 'none'; }

// ═══════ UI HELPERS ═══════
function showModal(html) { document.getElementById('modalBody').innerHTML = html; document.getElementById('modalOverlay').classList.add('active'); }
function hideModal() { document.getElementById('modalOverlay').classList.remove('active'); }
function toast(msg, type) { const t = document.getElementById('toast'); t.textContent = msg; t.className = 'toast toast-' + (type||'success'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }
document.getElementById('modalOverlay').addEventListener('click', function(e) { if (e.target === this) hideModal(); });

function statusBadge(s) {
  const map = { MATCHED:'badge-green', UNMATCHED:'badge-red', PARTIAL:'badge-yellow', OVERPAYMENT:'badge-blue', MANUALLY_MATCHED:'badge-gray', COMPLETED:'badge-green', IN_PROGRESS:'badge-blue', SUBMITTED:'badge-yellow', ASSIGNED:'badge-blue', CANCELLED:'badge-gray', ACTIVE:'badge-green', NOTICE_GIVEN:'badge-yellow', ENDED:'badge-red' };
  return '<span class="badge ' + (map[s]||'badge-gray') + '">' + (s||'').replace(/_/g,' ') + '</span>';
}

// ═══════ SVG ICONS ═══════
const ICONS = {
  grid: '<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>',
  house: '<svg viewBox="0 0 20 20" fill="none"><path d="M3 15V8l7-5 7 5v7a1 1 0 01-1 1H4a1 1 0 01-1-1z" stroke="currentColor" stroke-width="1.5"/></svg>',
  card: '<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M2 9h16" stroke="currentColor" stroke-width="1.5"/></svg>',
  units: '<svg viewBox="0 0 20 20" fill="none"><path d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z" stroke="currentColor" stroke-width="1.5"/></svg>',
  person: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" stroke-width="1.5"/></svg>',
  wrench: '<svg viewBox="0 0 20 20" fill="none"><path d="M11.5 2.5l6 6-9 9H2.5v-6l9-9z" stroke="currentColor" stroke-width="1.5"/></svg>',
  doc: '<svg viewBox="0 0 20 20" fill="none"><path d="M5 2h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v4h4M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.5"/></svg>',
  bolt: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2v4M6 4l2 3M14 4l-2 3" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="8" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 12h4" stroke="currentColor" stroke-width="1.5"/></svg>',
  report: '<svg viewBox="0 0 20 20" fill="none"><path d="M4 17V6l3-3h6l3 3v11" stroke="currentColor" stroke-width="1.5"/><path d="M4 17h12" stroke="currentColor" stroke-width="1.5"/><path d="M8 17v-5h4v5M7 9h6" stroke="currentColor" stroke-width="1.5"/></svg>',
  clock: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5"/></svg>',
  bell: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 016 6v3l2 2H2l2-2V8a6 6 0 016-6z" stroke="currentColor" stroke-width="1.5"/><path d="M8 17a2 2 0 004 0" stroke="currentColor" stroke-width="1.5"/></svg>',
  shield: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5v5c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V5l-7-3z" stroke="currentColor" stroke-width="1.5"/></svg>',
  users: '<svg viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M1 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="7" r="2" stroke="currentColor" stroke-width="1.2"/><path d="M14 11c2.8 0 5 2.2 5 5" stroke="currentColor" stroke-width="1.2"/></svg>',
  key: '<svg viewBox="0 0 20 20" fill="none"><circle cx="7" cy="13" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M10 10l7-7M14 3l3 3" stroke="currentColor" stroke-width="1.5"/></svg>',
  building: '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h2M7 10h2M11 7h2M11 10h2M8 17v-4h4v4" stroke="currentColor" stroke-width="1.5"/></svg>',
  log: '<svg viewBox="0 0 20 20" fill="none"><path d="M4 4h12M4 8h8M4 12h10M4 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

// ═══════ PORTAL TAB DEFINITIONS ═══════
const TABS = {
  dashboard: [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'properties', label: 'Properties', icon: 'house' },
    { id: 'payments', label: 'Payments', icon: 'card' },
    { id: 'units', label: 'Units', icon: 'units' },
    { id: 'tenants', label: 'Tenants', icon: 'person' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { id: 'leases', label: 'Leases', icon: 'doc' },
    { id: 'utilities', label: 'Utilities', icon: 'bolt' },
    { id: 'reports', label: 'Reports', icon: 'report' }
  ],
  tenant: [
    { id: 'home', label: 'Home', icon: 'grid' },
    { id: 'pay', label: 'Pay Rent', icon: 'card' },
    { id: 'history', label: 'Payment History', icon: 'clock' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { id: 'lease', label: 'My Lease', icon: 'doc' },
    { id: 'utilities', label: 'Utilities', icon: 'bolt' },
    { id: 'notices', label: 'Notices', icon: 'bell' },
    { id: 'profile', label: 'Profile', icon: 'person' }
  ],
  admin: [
    { id: 'admin-overview', label: 'Overview', icon: 'shield' },
    { id: 'admin-users', label: 'Users & Staff', icon: 'users' },
    { id: 'admin-roles', label: 'Roles & Permissions', icon: 'key' },
    { id: 'admin-properties', label: 'Property Access', icon: 'building' },
    { id: 'admin-audit', label: 'Audit Log', icon: 'log' }
  ]
};

// ═══════ SIDEBAR & NAVIGATION ═══════
function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  const tabs = TABS[state.portal] || [];
  const badge = document.getElementById('portalBadge');
  const label = document.getElementById('sidebarLabel');
  const pSwitch = document.getElementById('portalSwitch');
  const propSel = document.getElementById('propertySelect');

  badge.textContent = state.portal === 'admin' ? 'ADMIN' : '';
  label.textContent = state.portal === 'tenant' ? 'My Account' : state.portal === 'admin' ? 'Administration' : '';

  nav.innerHTML = tabs.map(t =>
    '<li data-tab="' + t.id + '"' + (t.id === state.activeTab ? ' class="active"' : '') + '>' + (ICONS[t.icon]||'') + t.label + '</li>'
  ).join('');

  if (state.portal === 'dashboard') {
    propSel.style.display = '';
    populatePropertySelect();
  } else {
    propSel.style.display = 'none';
  }

  if (state.user && state.user.role === 'OWNER') {
    pSwitch.textContent = state.portal === 'admin' ? '← Back to Dashboard' : 'Admin Console →';
    pSwitch.style.display = 'block';
  } else {
    pSwitch.style.display = 'none';
  }

  var sub = document.getElementById('userSub');
  if (state.portal === 'tenant') {
    document.getElementById('userName').textContent = state.user.name;
    sub.textContent = 'Unit ' + DATA.tv.unit.number + ' · ' + DATA.tv.property.name;
  } else {
    document.getElementById('userName').textContent = state.user.name || 'User';
    sub.textContent = state.user.phone || '';
  }
}

function switchPortal() {
  if (state.portal === 'admin') {
    state.portal = 'dashboard';
    state.activeTab = 'overview';
  } else {
    state.portal = 'admin';
    state.activeTab = 'admin-overview';
  }
  renderSidebar();
  renderTab();
}

document.getElementById('sidebarNav').addEventListener('click', function(e) {
  const li = e.target.closest('li');
  if (!li) return;
  document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
  li.classList.add('active');
  state.activeTab = li.dataset.tab;
  document.getElementById('pageTitle').textContent = li.textContent.trim();
  renderTab();
});

function populatePropertySelect() {
  const sel = document.getElementById('propertySelect');
  sel.innerHTML = state.properties.map(p => '<option value="' + p.id + '"' + (state.activeProperty && state.activeProperty.id === p.id ? ' selected' : '') + '>' + p.name + '</option>').join('');
  if (state.properties.length === 0) sel.innerHTML = '<option>No properties</option>';
}

function switchProperty() {
  const id = document.getElementById('propertySelect').value;
  state.activeProperty = state.properties.find(p => p.id === id);
  renderTab();
}

// ═══════ INIT ═══════
function initApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  if (state.portal === 'dashboard') {
    state.properties = DATA.properties;
    if (state.properties.length > 0 && !state.activeProperty) state.activeProperty = state.properties[0];
  }
  renderSidebar();
  renderTab();
}

// ═══════ RENDER TAB DISPATCHER ═══════
function renderTab() {
  const c = document.getElementById('tabContent');
  c.innerHTML = '';
  switch (state.activeTab) {
    // Dashboard portal
    case 'overview': renderOverview(); break;
    case 'properties': renderProperties(); break;
    case 'payments': renderPayments(); break;
    case 'units': renderUnits(); break;
    case 'tenants': renderTenants(); break;
    case 'maintenance': state.portal === 'tenant' ? renderTenantMaintenance() : renderDashMaintenance(); break;
    case 'leases': renderLeases(); break;
    case 'utilities': state.portal === 'tenant' ? renderTenantUtilities() : renderDashUtilities(); break;
    case 'reports': renderReports(); break;
    // Tenant portal
    case 'home': renderHome(); break;
    case 'pay': renderPay(); break;
    case 'history': renderHistory(); break;
    case 'lease': renderTenantLease(); break;
    case 'notices': renderNotices(); break;
    case 'profile': renderProfile(); break;
    // Admin portal
    case 'admin-overview': renderAdminOverview(); break;
    case 'admin-users': renderAdminUsers(); break;
    case 'admin-roles': renderAdminRoles(); break;
    case 'admin-properties': renderPropertyAccess(); break;
    case 'admin-audit': renderAudit(); break;
  }
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD PORTAL
// ═══════════════════════════════════════════════════════════

function donut(pct, size, color) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const cls = color === 'amber' ? ' donut-fill-amber' : color === 'red' ? ' donut-fill-red' : '';
  return '<div class="donut" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + size + '" height="' + size + '"><circle class="donut-bg" cx="' + size/2 + '" cy="' + size/2 + '" r="' + r + '"/><circle class="donut-fill' + cls + '" cx="' + size/2 + '" cy="' + size/2 + '" r="' + r + '" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '"/></svg><div class="donut-pct">' + pct + '%</div></div>';
}

function feedItem(p) {
  const name = p.tenancy?.tenant?.name || p.mpesa_name || 'Unknown';
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const unit = p.unit?.unit_number || '?';
  const time = new Date(p.paid_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  const date = new Date(p.paid_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  const badge = statusBadge(p.status);
  return '<div class="feed-item"><div class="feed-avatar">' + initials + '</div><div class="feed-info"><div class="feed-name">' + name + ' ' + badge + '</div><div class="feed-sub">Unit ' + unit + ' · ' + (p.mpesa_ref||p.bank_ref||'-') + ' · ' + date + ' ' + time + '</div></div><div class="feed-amount">KES ' + (p.amount||0).toLocaleString() + '</div></div>';
}

function kpiCard(label, value, change) {
  return '<div class="kpi-card"><div class="kpi-label">' + label + '</div><div class="kpi-value">' + value + '</div><div class="kpi-change">' + (change||'') + '</div></div>';
}

function reportCard(color, icon, title, desc, btnLabel) {
  return '<div class="report-card" onclick="toast(\'' + title + ' export started\')">' +
    '<div class="report-icon ' + color + '">' + icon + '</div><div><div style="font-weight:700;font-size:0.9rem;margin-bottom:0.3rem">' + title + '</div><div style="font-size:0.75rem;color:var(--gray);margin-bottom:0.5rem">' + desc + '</div><div style="font-size:0.72rem;font-weight:600;color:var(--green)">' + btnLabel + ' &rarr;</div></div></div>';
}

// ── Overview ──
function renderOverview() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Add a property to get started</p></div>'; return; }
  const pid = state.activeProperty.id;
  const o = DATA.stats[pid] || DATA.stats.p1;
  const collections = DATA.monthlyCollections[pid] || [];
  const recentPayments = (DATA.payments[pid] || []).slice(0, 6);
  const arrears = DATA.arrears[pid] || [];
  const totalArrears = arrears.reduce((s, a) => s + a.owed, 0);
  const collColor = o.collectionRate >= 80 ? '' : o.collectionRate >= 50 ? 'amber' : 'red';
  const occColor = o.occupancyRate >= 70 ? '' : o.occupancyRate >= 40 ? 'amber' : 'red';

  c.innerHTML = '<div class="tab-content">' +
    '<div class="kpi-row">' +
      '<div class="kpi-card"><div class="donut-wrap">' + donut(o.collectionRate, 80, collColor) + '<div class="donut-label"><strong>KES ' + (o.collectedRent||0).toLocaleString() + '</strong><span>of KES ' + (o.expectedRent||0).toLocaleString() + ' expected</span></div></div><div class="kpi-label" style="margin-top:0.8rem">Collection Rate</div></div>' +
      '<div class="kpi-card"><div class="donut-wrap">' + donut(o.occupancyRate, 80, occColor) + '<div class="donut-label"><strong>' + o.occupiedUnits + ' / ' + o.totalUnits + '</strong><span>units occupied</span></div></div><div class="kpi-label" style="margin-top:0.8rem">Occupancy</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:var(--green)">' + o.vacantUnits + '</div><div class="kpi-label" style="margin-top:0.3rem">Vacant Units</div><div style="margin-top:0.8rem;font-size:0.72rem;color:var(--gray)">' + (o.totalUnits - o.occupiedUnits - o.vacantUnits > 0 ? '+ ' + (o.totalUnits - o.occupiedUnits - o.vacantUnits) + ' maintenance/notice' : 'Ready to lease') + '</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:' + (o.unmatchedPayments > 0 ? '#ef4444' : 'var(--green)') + '">' + o.unmatchedPayments + '</div><div class="kpi-label" style="margin-top:0.3rem">Unmatched Payments</div><div style="margin-top:0.8rem;font-size:0.72rem;color:var(--gray)">' + (o.unmatchedPayments > 0 ? 'Needs manual matching' : 'All payments matched') + '</div></div>' +
    '</div>' +
    '<div class="content-grid">' +
      '<div class="card"><div class="card-title">Monthly Collections (KES)</div><div class="chart-bars" id="chartBars"></div></div>' +
      '<div class="card"><div class="card-title" style="display:flex;justify-content:space-between;align-items:center">Arrears<span style="color:#ef4444;font-size:0.85rem;font-weight:700;text-transform:none;letter-spacing:0">KES ' + totalArrears.toLocaleString() + '</span></div>' +
        (arrears.length === 0 ? '<div style="text-align:center;padding:2rem;color:var(--gray);font-size:0.82rem">No outstanding arrears</div>' :
        arrears.map(a => '<div class="arrear-row"><div class="feed-avatar" style="width:32px;height:32px;font-size:0.6rem">' + a.tenant.split(' ').map(w=>w[0]).join('') + '</div><div class="arrear-name">' + a.tenant + '</div><div class="arrear-unit">' + a.unit + '</div><div class="arrear-amt">KES ' + a.owed.toLocaleString() + '</div></div>').join('') +
        '<div style="margin-top:0.8rem"><div class="progress-bar"><div class="progress-bar-fill red" style="width:' + Math.round(((o.expectedRent - totalArrears) / o.expectedRent) * 100) + '%"></div></div><div style="font-size:0.68rem;color:var(--gray);margin-top:0.3rem">' + Math.round(((o.expectedRent - totalArrears) / o.expectedRent) * 100) + '% of rent secured</div></div>') +
      '</div>' +
    '</div>' +
    '<div class="content-grid">' +
      '<div class="card"><div class="card-title"><span class="live-dot"></span>M-Pesa Live Feed</div><div id="feedList"></div></div>' +
      '<div class="card"><div class="card-title">Recent Activity</div><div id="activityLog"></div></div>' +
    '</div></div>';

  const bars = document.getElementById('chartBars');
  const maxVal = Math.max(...collections.map(m => m.total), 1);
  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  bars.innerHTML = collections.map(m => {
    const pct = Math.round((m.total / maxVal) * 100);
    const label = months[parseInt(m.month.split('-')[1])];
    return '<div class="chart-bar"><div class="chart-bar-fill" style="height:' + pct + '%"></div><div class="chart-bar-lbl">' + label + '</div></div>';
  }).join('');

  const feed = document.getElementById('feedList');
  feed.innerHTML = recentPayments.length === 0 ? '<div class="empty"><p>No payments yet</p></div>' : recentPayments.map(p => feedItem(p)).join('');

  const log = document.getElementById('activityLog');
  const icons = { payment: 'green', maintenance: 'amber', tenant: 'blue', lease: 'blue', tax: 'green', alert: 'red' };
  log.innerHTML = DATA.activityLog.slice(0, 6).map(a =>
    '<div class="timeline-item"><div class="timeline-dot ' + (icons[a.type]||'') + '"></div><div><div style="font-size:0.82rem;font-weight:600">' + a.action + '</div><div style="font-size:0.72rem;color:var(--gray)">' + a.detail + '</div><div style="font-size:0.65rem;color:var(--gray);margin-top:0.2rem">' + a.time + '</div></div></div>'
  ).join('');
}

// ── Properties ──
function renderProperties() {
  const c = document.getElementById('tabContent');
  const all = DATA.properties;
  c.innerHTML = '<div class="tab-content">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem"><div style="font-size:0.85rem;color:var(--gray)">' + all.length + ' properties</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="showAddProperty()">+ Add Property</button></div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">' +
      all.map(p => '<div class="card" style="cursor:pointer" onclick="viewProperty(\'' + p.id + '\')"><div style="font-weight:700;font-size:1rem;margin-bottom:0.3rem">' + p.name + '</div><div style="font-size:0.78rem;color:var(--gray);margin-bottom:1rem">' + p.address + ', ' + p.county + '</div><div style="display:flex;gap:1.5rem"><div><div style="font-size:1.2rem;font-weight:700">' + (p.total_units||0) + '</div><div style="font-size:0.65rem;color:var(--gray)">Units</div></div></div></div>').join('') +
    '</div></div>';
}

function showAddProperty() {
  showModal('<h3>Add Property</h3>' +
    '<div class="form-group"><label>Name</label><input id="propName" placeholder="Sunrise Apartments"></div>' +
    '<div class="form-group"><label>Type</label><select id="propType"><option value="APARTMENT">Apartment</option><option value="MAISONETTE">Maisonette</option><option value="BUNGALOW">Bungalow</option><option value="BEDSITTER">Bedsitter</option><option value="SINGLE_ROOM">Single Room</option><option value="COMMERCIAL">Commercial</option></select></div>' +
    '<div class="form-group"><label>Address</label><input id="propAddr" placeholder="Ngong Road, Kilimani"></div>' +
    '<div class="form-group"><label>County</label><input id="propCounty" placeholder="Nairobi"></div>' +
    '<div class="form-group"><label>Town</label><input id="propTown" placeholder="Nairobi"></div>' +
    '<div class="form-group"><label>Total Units</label><input id="propUnits" type="number" placeholder="24"></div>' +
    '<div class="form-group"><label>Paybill Number</label><input id="propPaybill" placeholder="Optional"></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="addProperty()">Create</button></div>');
}

function addProperty() {
  const prop = {
    id: 'p' + (DATA.properties.length + 1),
    name: document.getElementById('propName').value,
    type: document.getElementById('propType').value,
    address: document.getElementById('propAddr').value,
    county: document.getElementById('propCounty').value,
    town: document.getElementById('propTown').value,
    total_units: parseInt(document.getElementById('propUnits').value) || 0,
    owner_id: state.user.id
  };
  DATA.properties.push(prop);
  DATA.units[prop.id] = [];
  DATA.tenancies[prop.id] = [];
  DATA.payments[prop.id] = [];
  DATA.stats[prop.id] = { totalUnits: prop.total_units, occupiedUnits: 0, vacantUnits: prop.total_units, occupancyRate: 0, expectedRent: 0, collectedRent: 0, collectionRate: 0, unmatchedPayments: 0 };
  DATA.monthlyCollections[prop.id] = [];
  DATA.maintenance[prop.id] = [];
  state.properties = DATA.properties;
  populatePropertySelect();
  hideModal(); toast('Property created!');
  renderProperties();
}

function viewProperty(id) {
  state.activeProperty = state.properties.find(p => p.id === id);
  document.getElementById('propertySelect').value = id;
  state.activeTab = 'overview';
  document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
  document.querySelector('[data-tab="overview"]').classList.add('active');
  document.getElementById('pageTitle').textContent = 'Overview';
  renderTab();
}

// ── Payments ──
function renderPayments() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const allPayments = DATA.payments[state.activeProperty.id] || [];
  const payments = paymentFilter === 'all' ? allPayments : allPayments.filter(p => p.status === paymentFilter);
  c.innerHTML = '<div class="tab-content">' +
    '<div class="filters">' +
      ['all','MATCHED','UNMATCHED','PARTIAL','MANUALLY_MATCHED'].map(f =>
        '<button class="filter-btn ' + (paymentFilter===f?'active':'') + '" onclick="paymentFilter=\'' + f + '\';renderPayments()">' + (f==='all'?'All':f.replace(/_/g,' ').toLowerCase()) + '</button>'
      ).join('') +
    '</div>' +
    '<div class="card"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Tenant</th><th>Unit</th><th>Amount</th><th>Source</th><th>Reference</th><th>Status</th></tr></thead><tbody>' +
    payments.map(p => {
      const name = p.tenancy?.tenant?.name || p.mpesa_name || 'Unknown';
      const unit = p.unit?.unit_number || '-';
      const date = new Date(p.paid_at).toLocaleDateString('en-KE',{day:'numeric',month:'short'});
      const badge = statusBadge(p.status);
      const sourceLabels = { MPESA_C2B:'M-Pesa', MPESA_STK:'M-Pesa STK', CASH:'Cash', BANK_DEPOSIT:'Bank Deposit', EFT:'EFT', PESALINK:'PesaLink', CHEQUE:'Cheque', MANUAL_ENTRY:'Manual' };
      const src = sourceLabels[p.source] || 'M-Pesa';
      const ref = p.mpesa_ref || p.bank_ref || '-';
      return '<tr><td>' + date + '</td><td>' + name + '</td><td>' + unit + '</td><td style="font-weight:600">KES ' + (p.amount||0).toLocaleString() + '</td><td><span class="badge ' + (p.source==='CASH'?'badge-yellow':p.source==='MPESA_C2B'||p.source==='MPESA_STK'?'badge-green':'badge-blue') + '">' + src + '</span></td><td style="font-size:0.75rem;color:var(--gray)">' + ref + '</td><td>' + badge + '</td></tr>';
    }).join('') +
    '</tbody></table></div></div>' +
    '<div style="margin-top:1rem;text-align:right"><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="showManualPayment()">+ Record Payment</button></div></div>';
}

function showManualPayment() {
  const pid = state.activeProperty.id;
  var tenancies = DATA.tenancies[pid] || [];
  showModal('<h3>Record Payment</h3>' +
    '<div class="form-group"><label>Payment Source</label><select id="manSource" onchange="togglePaymentFields()"><option value="CASH">Cash</option><option value="BANK_DEPOSIT">Bank Deposit (branch/agent)</option><option value="EFT">EFT Transfer</option><option value="PESALINK">PesaLink</option><option value="CHEQUE">Cheque</option><option value="MPESA_C2B">M-Pesa (manual entry)</option></select></div>' +
    '<div class="form-group"><label>Amount (KES)</label><input id="manAmount" type="number" placeholder="15000"></div>' +
    '<div class="form-group"><label>Tenant</label><select id="manTenant"><option value="">— Select tenant —</option>' +
      tenancies.map(function(t) { return '<option value="' + t.id + '">' + t.tenant.name + ' (Unit ' + (t.unit?t.unit.unit_number:'-') + ')</option>'; }).join('') +
    '</select></div>' +
    '<div class="form-group" id="refGroup"><label id="refLabel">Reference Number</label><input id="manRef" placeholder="Transaction or receipt reference"></div>' +
    '<div class="form-group"><label>Date Paid</label><input id="manDate" type="date" value="' + new Date().toISOString().slice(0,10) + '"></div>' +
    '<div class="form-group"><label>Month For</label><input id="manMonth" type="month" value="' + new Date().toISOString().slice(0,7) + '"></div>' +
    '<div class="form-group"><label>Notes</label><input id="manNotes" placeholder="e.g. Received by caretaker Peter"></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="addManualPayment()">Record Payment</button></div>');
}

function togglePaymentFields() {
  var source = document.getElementById('manSource').value;
  var refLabel = document.getElementById('refLabel');
  var refInput = document.getElementById('manRef');
  var labels = { CASH:'Receipt Number', BANK_DEPOSIT:'Bank Slip / Deposit Ref', EFT:'EFT Reference', PESALINK:'PesaLink Ref', CHEQUE:'Cheque Number', MPESA_C2B:'M-Pesa Ref' };
  var placeholders = { CASH:'Optional — manual receipt', BANK_DEPOSIT:'Bank deposit slip number', EFT:'EFT transaction reference', PESALINK:'PesaLink transaction ID', CHEQUE:'Cheque number', MPESA_C2B:'e.g. SLK3A7B9XQ' };
  refLabel.textContent = labels[source] || 'Reference';
  refInput.placeholder = placeholders[source] || 'Reference number';
}

function addManualPayment() {
  var pid = state.activeProperty.id;
  var amount = parseInt(document.getElementById('manAmount').value);
  if (!amount || amount < 1) { toast('Enter a valid amount', 'error'); return; }
  var source = document.getElementById('manSource').value;
  var tenantId = document.getElementById('manTenant').value;
  var ref = document.getElementById('manRef').value.trim();
  var paidDate = document.getElementById('manDate').value;
  var month = document.getElementById('manMonth').value;
  var notes = document.getElementById('manNotes').value.trim();
  var tenancy = tenantId ? (DATA.tenancies[pid] || []).find(function(t) { return t.id === tenantId; }) : null;
  var sourceLabels = { CASH:'Cash', BANK_DEPOSIT:'Bank deposit', EFT:'EFT', PESALINK:'PesaLink', CHEQUE:'Cheque', MPESA_C2B:'M-Pesa' };
  var pay = {
    id: 'pay' + Date.now(), property_id: pid, amount: amount,
    mpesa_ref: source === 'MPESA_C2B' ? ref : null,
    bank_ref: source !== 'MPESA_C2B' ? ref : null,
    mpesa_name: tenancy ? tenancy.tenant.name.toUpperCase() : (sourceLabels[source] || 'MANUAL'),
    source: source, month: month || new Date().toISOString().slice(0,7),
    paid_at: paidDate ? new Date(paidDate).toISOString() : new Date().toISOString(),
    status: tenancy ? 'MATCHED' : 'UNMATCHED', notes: notes || null,
    unit: tenancy ? { unit_number: tenancy.unit.unit_number } : null,
    tenancy: tenancy ? { tenant: { name: tenancy.tenant.name, phone: tenancy.tenant.phone } } : null
  };
  if (!DATA.payments[pid]) DATA.payments[pid] = [];
  DATA.payments[pid].unshift(pay);
  hideModal(); toast((sourceLabels[source] || 'Payment') + ' of KES ' + amount.toLocaleString() + ' recorded' + (tenancy ? ' for ' + tenancy.tenant.name : ''));
  renderPayments();
}

// ── Units ──
function renderUnits() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const units = DATA.units[state.activeProperty.id] || [];
  c.innerHTML = '<div class="tab-content">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem"><div style="font-size:0.85rem;color:var(--gray)">' + units.length + ' units</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="showAddUnit()">+ Add Unit</button></div>' +
    '<div class="card"><div class="table-wrap"><table><thead><tr><th>Unit</th><th>Floor</th><th>Beds</th><th>Rent (KES)</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
    units.map(u => '<tr><td><strong>' + u.unit_number + '</strong></td><td>' + (u.floor ?? '-') + '</td><td>' + (u.bedrooms ?? '-') + '</td><td>' + u.rent_amount.toLocaleString() + '</td><td>' + statusBadge(u.status) + '</td><td><button class="btn btn-outline" style="width:auto;padding:0.3rem 0.8rem;font-size:0.75rem" onclick="editUnit(\'' + u.id + '\')">Edit</button></td></tr>').join('') +
    '</tbody></table></div></div></div>';
}

function showAddUnit() {
  showModal('<h3>Add Unit</h3>' +
    '<div class="form-group"><label>Unit Number</label><input id="uNum" placeholder="e.g. 4B"></div>' +
    '<div class="form-group"><label>Floor</label><input id="uFloor" type="number" placeholder="0"></div>' +
    '<div class="form-group"><label>Bedrooms</label><input id="uBeds" type="number" placeholder="1"></div>' +
    '<div class="form-group"><label>Rent (KES)</label><input id="uRent" type="number" placeholder="15000"></div>' +
    '<div class="form-group"><label>Deposit (KES)</label><input id="uDeposit" type="number" placeholder="15000"></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="addUnit()">Add</button></div>');
}

function addUnit() {
  const pid = state.activeProperty.id;
  const unit = { id: 'un' + Date.now(), property_id: pid, unit_number: document.getElementById('uNum').value, floor: parseInt(document.getElementById('uFloor').value) || null, bedrooms: parseInt(document.getElementById('uBeds').value) || null, rent_amount: parseInt(document.getElementById('uRent').value), deposit_amount: parseInt(document.getElementById('uDeposit').value) || null, status: 'VACANT' };
  if (!DATA.units[pid]) DATA.units[pid] = [];
  DATA.units[pid].push(unit);
  hideModal(); toast('Unit added!'); renderUnits();
}

function editUnit(id) {
  const units = DATA.units[state.activeProperty.id] || [];
  const u = units.find(x => x.id === id);
  if (!u) return;
  showModal('<h3>Edit Unit ' + u.unit_number + '</h3>' +
    '<div class="form-group"><label>Rent (KES)</label><input id="euRent" type="number" value="' + u.rent_amount + '"></div>' +
    '<div class="form-group"><label>Status</label><select id="euStatus"><option ' + (u.status==='OCCUPIED'?'selected':'') + '>OCCUPIED</option><option ' + (u.status==='VACANT'?'selected':'') + '>VACANT</option><option ' + (u.status==='NOTICE_GIVEN'?'selected':'') + '>NOTICE_GIVEN</option><option ' + (u.status==='MAINTENANCE'?'selected':'') + '>MAINTENANCE</option></select></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="handleUpdateUnit(\'' + id + '\')">Save</button></div>');
}

function handleUpdateUnit(id) {
  const units = DATA.units[state.activeProperty.id] || [];
  const u = units.find(x => x.id === id);
  if (u) { u.rent_amount = parseInt(document.getElementById('euRent').value); u.status = document.getElementById('euStatus').value; }
  hideModal(); toast('Unit updated!'); renderUnits();
}

// ── Tenants ──
function renderTenants() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const tenants = DATA.tenancies[state.activeProperty.id] || [];
  c.innerHTML = '<div class="tab-content">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem"><div style="font-size:0.85rem;color:var(--gray)">' + tenants.length + ' active tenancies</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="showAssignTenant()">+ Assign Tenant</button></div>' +
    '<div class="card"><div class="table-wrap"><table><thead><tr><th>Tenant</th><th>Phone</th><th>Unit</th><th>Rent</th><th>Base Score</th><th>ID</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
    tenants.map(t => {
      const sc = DATA.tenantScores[t.tenant_id] || { score: 0, level: 'fair' };
      const verified = t.tenant?.id_verified;
      return '<tr><td><strong>' + (t.tenant?.name||'-') + '</strong></td><td>' + (t.tenant?.phone||'-') + '</td><td>' + (t.unit?.unit_number||'-') + '</td><td>KES ' + t.rent_amount.toLocaleString() + '</td><td><span class="base-score ' + sc.level + '">' + sc.score + '</span></td><td>' + (verified ? '<span class="id-badge">&#10003; Verified</span>' : '<span class="id-badge pending">&#9679; Pending</span>') + '</td><td>' + statusBadge(t.status) + '</td><td>' + (t.status === 'ACTIVE' ? '<button class="btn btn-outline" style="width:auto;padding:0.3rem 0.8rem;font-size:0.75rem;margin-right:0.3rem" onclick="handleGiveNotice(\'' + t.id + '\')">Notice</button><button class="btn btn-outline" style="width:auto;padding:0.3rem 0.8rem;font-size:0.75rem;color:#ef4444" onclick="handleMoveOut(\'' + t.id + '\')">Move Out</button>' : '-') + '</td></tr>';
    }).join('') +
    '</tbody></table></div></div></div>';
}

function showAssignTenant() {
  showModal('<h3>Assign Tenant</h3>' +
    '<div class="form-group"><label>Tenant Name</label><input id="tName" placeholder="John Kamau"></div>' +
    '<div class="form-group"><label>Phone (07...)</label><input id="tPhone" placeholder="0712345678"></div>' +
    '<div class="form-group"><label>Unit Number</label><input id="tUnit" placeholder="4B"></div>' +
    '<div class="form-group"><label>Rent (KES)</label><input id="tRent" type="number" placeholder="15000"></div>' +
    '<div class="form-group"><label>Deposit Paid</label><input id="tDeposit" type="number" placeholder="0"></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="handleAssignTenant()">Assign</button></div>');
}

function handleAssignTenant() {
  const pid = state.activeProperty.id;
  const units = DATA.units[pid] || [];
  const unitNum = document.getElementById('tUnit').value.trim();
  const unit = units.find(u => u.unit_number === unitNum);
  if (!unit) { toast('Unit not found', 'error'); return; }
  const tenantName = document.getElementById('tName').value.trim();
  const phone = document.getElementById('tPhone').value.trim();
  const rentAmount = parseInt(document.getElementById('tRent').value);
  const depositPaid = parseInt(document.getElementById('tDeposit').value) || 0;
  const tenancy = {
    id: 't' + Date.now(), unit_id: unit.id, tenant_id: 'ten' + Date.now(), rent_amount: rentAmount, deposit_paid: depositPaid, start_date: new Date().toISOString().split('T')[0], status: 'ACTIVE',
    tenant: { id: 'ten' + Date.now(), name: tenantName, phone: phone, id_verified: false },
    unit: { id: unit.id, unit_number: unit.unit_number, rent_amount: rentAmount }
  };
  if (!DATA.tenancies[pid]) DATA.tenancies[pid] = [];
  DATA.tenancies[pid].push(tenancy);
  unit.status = 'OCCUPIED';
  hideModal(); toast('Tenant assigned!'); renderTenants();
}

function handleGiveNotice(tenancyId) {
  if (!confirm('Mark tenant as notice given?')) return;
  const pid = state.activeProperty.id;
  const t = (DATA.tenancies[pid] || []).find(x => x.id === tenancyId);
  if (t) t.status = 'NOTICE_GIVEN';
  toast('Notice recorded'); renderTenants();
}

function handleMoveOut(tenancyId) {
  if (!confirm('Move out this tenant? This will end their tenancy.')) return;
  const pid = state.activeProperty.id;
  const idx = (DATA.tenancies[pid] || []).findIndex(x => x.id === tenancyId);
  if (idx >= 0) {
    const t = DATA.tenancies[pid][idx];
    const unit = (DATA.units[pid] || []).find(u => u.id === t.unit_id);
    if (unit) unit.status = 'VACANT';
    DATA.tenancies[pid].splice(idx, 1);
  }
  toast('Tenant moved out'); renderTenants();
}

// ── Dashboard Maintenance ──
function renderDashMaintenance() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const allReqs = DATA.maintenance[state.activeProperty.id] || [];
  c.innerHTML = '<div class="tab-content">' +
    '<div style="margin-bottom:1.5rem;font-size:0.85rem;color:var(--gray)">' + allReqs.length + ' maintenance requests</div>' +
    (allReqs.length === 0 ? '<div class="empty"><p>No maintenance requests yet.</p></div>' :
    '<div class="card"><div class="table-wrap"><table><thead><tr><th>Unit</th><th>Category</th><th>Description</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead><tbody>' +
    allReqs.map(r => '<tr><td>' + (r.unit?.unit_number||'-') + '</td><td>' + r.category + '</td><td>' + r.description.substring(0,60) + (r.description.length>60?'...':'') + '</td><td>' + statusBadge(r.status) + '</td><td>' + new Date(r.created_at).toLocaleDateString() + '</td><td><select onchange="handleUpdateMaintenance(\'' + r.id + '\',this.value)"><option value="">Change...</option><option value="ASSIGNED">Assign</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Complete</option><option value="CANCELLED">Cancel</option></select></td></tr>').join('') +
    '</tbody></table></div></div>') + '</div>';
}

function handleUpdateMaintenance(id, status) {
  if (!status) return;
  const pid = state.activeProperty.id;
  const r = (DATA.maintenance[pid] || []).find(x => x.id === id);
  if (r) r.status = status;
  toast('Status updated'); renderDashMaintenance();
}

// ── Leases ──
function renderLeases() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const leases = DATA.leases[state.activeProperty.id] || [];
  const active = leases.filter(l => l.status === 'active').length;
  const expiring = leases.filter(l => l.status === 'expiring').length;
  const expired = leases.filter(l => l.status === 'expired').length;

  c.innerHTML = '<div class="tab-content">' +
    '<div class="grid-3" style="margin-bottom:1.5rem">' +
      '<div class="kpi-card"><div class="kpi-value" style="color:var(--green)">' + active + '</div><div class="kpi-label">Active Leases</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:#f59e0b">' + expiring + '</div><div class="kpi-label">Expiring Soon</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:#ef4444">' + expired + '</div><div class="kpi-label">Expired / Needs Renewal</div></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><div style="font-size:0.85rem;color:var(--gray)">' + leases.length + ' leases</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="toast(\'Lease template generator coming soon\')">+ Generate Lease</button></div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem">' +
    leases.map(l => {
      const statusLabel = l.status === 'active' ? 'Active' : l.status === 'expiring' ? 'Expiring Soon' : 'Expired';
      const statusCls = l.status === 'active' ? 'badge-green' : l.status === 'expiring' ? 'badge-yellow' : 'badge-red';
      return '<div class="lease-card ' + l.status + '"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.8rem"><div><div style="font-weight:700;font-size:0.95rem">' + l.tenant + '</div><div style="font-size:0.75rem;color:var(--gray)">Unit ' + l.unit + '</div></div><span class="badge ' + statusCls + '">' + statusLabel + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">Start</span><span class="stat-row-value">' + new Date(l.start).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">End</span><span class="stat-row-value">' + new Date(l.end).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">E-Signed</span><span class="stat-row-value">' + (l.signed ? '<span style="color:var(--green)">&#10003; Yes</span>' : '<span style="color:#f59e0b">Pending</span>') + '</span></div>' +
        '<div style="margin-top:0.8rem;display:flex;gap:0.5rem">' +
          (l.doc ? '<button class="btn btn-outline" style="width:auto;padding:0.3rem 0.8rem;font-size:0.72rem" onclick="toast(\'Download: ' + l.doc + '\')">Download</button>' : '') +
          (l.status === 'expired' ? '<button class="btn btn-green" style="width:auto;padding:0.3rem 0.8rem;font-size:0.72rem" onclick="toast(\'Renewal flow coming soon\')">Renew</button>' : '') +
          (!l.signed ? '<button class="btn btn-green" style="width:auto;padding:0.3rem 0.8rem;font-size:0.72rem" onclick="toast(\'E-sign request sent\')">Request Signature</button>' : '') +
        '</div></div>';
    }).join('') +
    '</div></div>';
}

// ── Dashboard Utilities ──
function renderDashUtilities() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const utils = DATA.utilities[state.activeProperty.id] || [];
  const totalWater = utils.reduce((s, u) => s + u.water, 0);
  const totalGarbage = utils.reduce((s, u) => s + u.garbage, 0);
  const totalElec = utils.reduce((s, u) => s + u.electricity, 0);
  const totalAll = utils.reduce((s, u) => s + u.total, 0);

  c.innerHTML = '<div class="tab-content">' +
    '<div class="grid-4" style="margin-bottom:1.5rem">' +
      '<div class="kpi-card"><div class="kpi-value">KES ' + totalAll.toLocaleString() + '</div><div class="kpi-label">Total Utilities</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:#3b82f6">KES ' + totalWater.toLocaleString() + '</div><div class="kpi-label">Water</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:#f59e0b">KES ' + totalGarbage.toLocaleString() + '</div><div class="kpi-label">Garbage</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:#8b5cf6">KES ' + totalElec.toLocaleString() + '</div><div class="kpi-label">Electricity</div></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><div style="font-size:0.85rem;color:var(--gray)">April 2026 billing — ' + utils.length + ' units</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="toast(\'Invoices generated for all units\')">Generate Invoices</button></div>' +
    '<div class="card"><div class="table-wrap">' +
      '<div class="util-row" style="font-weight:600;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray);border-bottom:2px solid #f3f4f6"><div>Unit</div><div>Water</div><div>Garbage</div><div>Electric</div><div>Total</div></div>' +
      utils.map(u => '<div class="util-row"><div><strong>' + u.unit + '</strong></div><div>' + u.water.toLocaleString() + '</div><div>' + u.garbage.toLocaleString() + '</div><div>' + u.electricity.toLocaleString() + '</div><div style="font-weight:700">KES ' + u.total.toLocaleString() + '</div></div>').join('') +
      '<div class="util-row" style="font-weight:700;border-top:2px solid #e5e7eb;margin-top:0.3rem;padding-top:0.8rem"><div>Total</div><div>' + totalWater.toLocaleString() + '</div><div>' + totalGarbage.toLocaleString() + '</div><div>' + totalElec.toLocaleString() + '</div><div style="color:var(--green)">KES ' + totalAll.toLocaleString() + '</div></div>' +
    '</div></div></div>';
}

// ── Reports ──
function renderReports() {
  const c = document.getElementById('tabContent');
  if (!state.activeProperty) { c.innerHTML = '<div class="empty"><p>Select a property first</p></div>'; return; }
  const pid = state.activeProperty.id;
  const kra = DATA.kraStatus[pid] || DATA.kraStatus.p1;

  c.innerHTML = '<div class="tab-content">' +
    '<div class="card" style="margin-bottom:1.5rem;border-left:4px solid var(--green)">' +
      '<div class="card-title">KRA / eTIMS Compliance</div>' +
      '<div class="grid-4" style="margin-bottom:1rem">' +
        '<div><div style="font-size:1.4rem;font-weight:700;color:var(--green)">' + kra.filed + '</div><div style="font-size:0.72rem;color:var(--gray)">Invoices Filed</div></div>' +
        '<div><div style="font-size:1.4rem;font-weight:700;color:' + (kra.pending>0?'#f59e0b':'var(--green)') + '">' + kra.pending + '</div><div style="font-size:0.72rem;color:var(--gray)">Pending</div></div>' +
        '<div><div style="font-size:1.4rem;font-weight:700">KES ' + kra.totalTax.toLocaleString() + '</div><div style="font-size:0.72rem;color:var(--gray)">Tax This Month</div></div>' +
        '<div><div style="font-size:1.4rem;font-weight:700;color:var(--green)">&#10003;</div><div style="font-size:0.72rem;color:var(--gray)">eTIMS Connected</div></div>' +
      '</div>' +
      '<div class="stat-row"><span class="stat-row-label">KRA PIN</span><span class="stat-row-value">' + kra.pin + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Last Filed</span><span class="stat-row-value">' + new Date(kra.lastFiled).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</span></div>' +
      '<div style="margin-top:1rem"><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="toast(\'KRA tax invoice generated for April 2026\')">Generate Tax Invoice</button></div>' +
    '</div>' +
    '<div class="card-title">Reports & Exports</div>' +
    '<div class="grid-3" style="margin-bottom:1.5rem">' +
      reportCard('green','&#128200;','Revenue Report','Monthly income breakdown, collection trends, and projections','Download PDF') +
      reportCard('blue','&#128203;','Tenant Ledger','Per-tenant payment history with running balances','Download CSV') +
      reportCard('amber','&#128176;','Arrears Report','Outstanding rent with aging analysis','Download PDF') +
      reportCard('red','&#128209;','Tax Summary','KRA-ready rental income declaration','Download PDF') +
      reportCard('green','&#128202;','Occupancy Report','Unit status history and vacancy trends','Download CSV') +
      reportCard('blue','&#128221;','Audit Trail','Complete activity log — every action timestamped','Export Log') +
    '</div>' +
    '<div class="card"><div class="card-title">Recent Audit Trail</div>' +
      DATA.activityLog.map(a => {
        const icons = { payment:'green', maintenance:'amber', tenant:'blue', lease:'blue', tax:'green', alert:'red' };
        return '<div class="timeline-item"><div class="timeline-dot ' + (icons[a.type]||'') + '"></div><div style="flex:1"><div style="display:flex;justify-content:space-between"><div style="font-size:0.82rem;font-weight:600">' + a.action + '</div><div style="font-size:0.68rem;color:var(--gray)">' + a.time + '</div></div><div style="font-size:0.72rem;color:var(--gray)">' + a.detail + '</div></div></div>';
      }).join('') +
    '</div></div>';
}

// ═══════════════════════════════════════════════════════════
// TENANT PORTAL
// ═══════════════════════════════════════════════════════════

function renderHome() {
  const c = document.getElementById('tabContent');
  const b = DATA.tv.balance;
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = T.property.name + ' · Unit ' + T.unit.number;

  c.innerHTML = '<div class="tab-content">' +
    '<div class="balance-hero">' +
      '<div class="balance-hero-label">Amount Due — ' + new Date(b.dueDate).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}) + '</div>' +
      '<div class="balance-hero-amt">KES ' + b.totalDue.toLocaleString() + '</div>' +
      '<div class="balance-hero-sub">Rent KES ' + b.rent.toLocaleString() + ' + Utilities KES ' + b.utilities.toLocaleString() + '</div>' +
      '<div class="balance-hero-actions">' +
        '<button class="btn btn-green" onclick="state.activeTab=\'pay\';document.querySelectorAll(\'.sidebar-nav li\').forEach(l=>l.classList.remove(\'active\'));document.querySelector(\'[data-tab=pay]\').classList.add(\'active\');document.getElementById(\'pageTitle\').textContent=\'Pay Rent\';renderTab()">Pay Now</button>' +
        '<button class="btn" style="background:rgba(255,255,255,0.15);color:white" onclick="state.activeTab=\'history\';document.querySelectorAll(\'.sidebar-nav li\').forEach(l=>l.classList.remove(\'active\'));document.querySelector(\'[data-tab=history]\').classList.add(\'active\');document.getElementById(\'pageTitle\').textContent=\'Payment History\';renderTab()">View History</button>' +
      '</div>' +
    '</div>' +
    '<div class="grid-3" style="margin-bottom:1.5rem">' +
      '<div class="kpi-card"><div class="kpi-value" style="color:var(--green)">&#10003;</div><div class="kpi-label">April Rent</div><div style="font-size:0.72rem;color:var(--gray);margin-top:0.3rem">Paid ' + new Date(b.lastPaid).toLocaleDateString('en-KE',{day:'numeric',month:'short'}) + '</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="font-size:1.4rem">' + T.maintenance.filter(m=>m.status!=='COMPLETED').length + '</div><div class="kpi-label">Open Requests</div><div style="font-size:0.72rem;color:var(--gray);margin-top:0.3rem">Maintenance</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="font-size:1.4rem;color:' + (T.lease.status==='expired'?'#ef4444':T.lease.status==='expiring'?'#f59e0b':'var(--green)') + '">' + (T.lease.status==='active'?'Active':T.lease.status==='expiring'?'Expiring':'Expired') + '</div><div class="kpi-label">Lease Status</div><div style="font-size:0.72rem;color:var(--gray);margin-top:0.3rem">Ends ' + new Date(T.lease.end).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</div></div>' +
    '</div>' +
    '<div class="grid-2">' +
      '<div class="card"><div class="card-title">Payment History (6 months)</div><div style="display:flex;align-items:flex-end;gap:8px;height:120px" id="homeChart"></div></div>' +
      '<div class="card"><div class="card-title">Recent Activity</div>' +
        '<div class="timeline-item"><div class="timeline-dot"></div><div><div style="font-size:0.82rem;font-weight:600">Rent payment confirmed</div><div style="font-size:0.72rem;color:var(--gray)">KES 15,000 — ' + T.payments[0].ref + '</div><div style="font-size:0.65rem;color:var(--gray)">28 Apr</div></div></div>' +
        '<div class="timeline-item"><div class="timeline-dot blue"></div><div><div style="font-size:0.82rem;font-weight:600">Maintenance update</div><div style="font-size:0.72rem;color:var(--gray)">Socket repair — parts ordered</div><div style="font-size:0.65rem;color:var(--gray)">27 Apr</div></div></div>' +
        '<div class="timeline-item"><div class="timeline-dot amber"></div><div><div style="font-size:0.82rem;font-weight:600">Notice from management</div><div style="font-size:0.72rem;color:var(--gray)">Water tank cleaning scheduled</div><div style="font-size:0.65rem;color:var(--gray)">28 Apr</div></div></div>' +
        '<div class="timeline-item"><div class="timeline-dot"></div><div><div style="font-size:0.82rem;font-weight:600">Utility bill ready</div><div style="font-size:0.72rem;color:var(--gray)">April utilities — KES 4,500</div><div style="font-size:0.65rem;color:var(--gray)">25 Apr</div></div></div>' +
      '</div>' +
    '</div></div>';

  const chart = document.getElementById('homeChart');
  const maxV = Math.max(...T.paymentMonths.map(m => m.due), 1);
  chart.innerHTML = T.paymentMonths.map(m => {
    const pct = Math.round((m.paid / maxV) * 100);
    const full = m.paid >= m.due;
    return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px"><div style="width:100%;border-radius:6px 6px 2px 2px;background:' + (full ? 'var(--green)' : '#f59e0b') + ';height:' + pct + '%;min-height:4px;transition:height 0.8s"></div><div style="font-size:0.6rem;color:var(--gray)">' + m.month + '</div></div>';
  }).join('');
}

// ── Pay Rent ──
function renderPay() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  const b = T.balance;
  document.getElementById('pageSub').textContent = 'Send via M-Pesa to complete your payment';

  c.innerHTML = '<div class="tab-content"><div class="grid-2">' +
    '<div>' +
      '<div class="card" style="margin-bottom:1rem;border:2px solid var(--green)">' +
        '<div class="card-title" style="color:var(--green)">Pay Instantly via M-Pesa</div>' +
        '<div style="font-size:0.82rem;color:var(--gray);margin-bottom:1rem">Enter amount and tap Pay — you\'ll receive the M-Pesa PIN prompt on your phone.</div>' +
        '<div class="form-group" style="margin-bottom:0.8rem"><label>Amount (KES)</label><input type="number" id="stkAmount" value="' + b.totalDue + '" min="1" style="font-size:1.1rem;font-weight:700"></div>' +
        '<div class="form-group" style="margin-bottom:1rem"><label>M-Pesa Phone Number</label><input type="tel" id="stkPhone" value="' + T.tenant.phone + '" placeholder="0722111222"></div>' +
        '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">' +
          '<button class="btn btn-outline" style="width:auto;padding:0.3rem 0.8rem;font-size:0.72rem" onclick="document.getElementById(\'stkAmount\').value=' + b.rent + '">Rent only — KES ' + b.rent.toLocaleString() + '</button>' +
          '<button class="btn btn-outline" style="width:auto;padding:0.3rem 0.8rem;font-size:0.72rem" onclick="document.getElementById(\'stkAmount\').value=' + b.totalDue + '">Rent + utilities — KES ' + b.totalDue.toLocaleString() + '</button>' +
        '</div>' +
        '<button class="btn btn-green" id="stkPayBtn" onclick="initiateSTKPush()" style="font-size:1rem;padding:1rem">Pay via M-Pesa</button>' +
        '<div id="stkStatus" style="margin-top:1rem;display:none"></div>' +
      '</div>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-title">Or Pay Manually via Paybill</div><div style="background:var(--green-tint);border-radius:10px;padding:1.2rem"><div style="font-size:0.82rem;font-weight:600;margin-bottom:0.8rem">M-Pesa &gt; Lipa na M-Pesa &gt; Pay Bill</div><div class="stat-row"><span class="stat-row-label">Business Number</span><span class="stat-row-value" style="font-size:1rem">123456</span></div><div class="stat-row"><span class="stat-row-label">Account Number</span><span class="stat-row-value" style="font-size:1rem;color:var(--green)">' + T.unit.number + '</span></div><div class="stat-row"><span class="stat-row-label">Amount</span><span class="stat-row-value" style="font-size:1rem">KES ' + b.totalDue.toLocaleString() + '</span></div></div></div>' +
      '<div class="card"><div class="card-title">Paid via Bank / Cash / EFT?</div><div style="font-size:0.82rem;color:var(--gray);margin-bottom:1rem">If you\'ve already paid via bank deposit, EFT, PesaLink, or cash, submit your payment details so your landlord can confirm.</div><button class="btn btn-outline" style="font-size:0.85rem" onclick="showPaymentProof()">I\'ve Already Paid</button></div>' +
    '</div>' +
    '<div>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-title">Balance Breakdown</div>' +
        '<div class="stat-row"><span class="stat-row-label">Monthly Rent</span><span class="stat-row-value">KES ' + b.rent.toLocaleString() + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">Utilities (April)</span><span class="stat-row-value">KES ' + b.utilities.toLocaleString() + '</span></div>' +
        '<div class="stat-row" style="border-top:2px solid #e5e7eb;padding-top:0.8rem;margin-top:0.3rem"><span class="stat-row-label" style="font-weight:700;color:var(--black)">Total Due</span><span class="stat-row-value" style="font-size:1.2rem;color:var(--green)">KES ' + b.totalDue.toLocaleString() + '</span></div>' +
        '<div style="font-size:0.72rem;color:var(--gray);margin-top:0.5rem">Due by ' + new Date(b.dueDate).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}) + '</div>' +
      '</div>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-title">Payment Confirmation</div><div style="font-size:0.82rem;color:var(--gray);line-height:1.5"><span class="live-dot"></span>Payments are tracked in real time. Once confirmed, it appears in your history within 1-2 minutes. An SMS receipt will be sent to <strong>' + T.tenant.phone + '</strong>.</div></div>' +
      '<div class="card"><div class="card-title">Recent Payments</div>' +
        T.payments.slice(0,3).map(p => '<div class="stat-row"><span class="stat-row-label">' + p.month + '</span><span class="stat-row-value">KES ' + p.amount.toLocaleString() + ' ' + statusBadge(p.status) + '</span></div>').join('') +
      '</div>' +
    '</div></div></div>';
}

function initiateSTKPush() {
  const T = DATA.tv;
  const amount = parseInt(document.getElementById('stkAmount').value);
  const phone = document.getElementById('stkPhone').value.trim();
  if (!amount || amount < 1) { toast('Enter a valid amount', 'error'); return; }
  if (!phone) { toast('Enter your M-Pesa phone number', 'error'); return; }
  const btn = document.getElementById('stkPayBtn');
  const statusDiv = document.getElementById('stkStatus');
  btn.disabled = true; btn.textContent = 'Sending request...'; btn.style.opacity = '0.6';
  statusDiv.style.display = 'block';
  statusDiv.innerHTML = '<div style="text-align:center;padding:1rem"><div class="live-dot" style="width:12px;height:12px;margin:0 auto 0.5rem"></div><div style="font-size:0.85rem;font-weight:600">Sending M-Pesa prompt to ' + phone + '...</div><div style="font-size:0.75rem;color:var(--gray);margin-top:0.3rem">Check your phone and enter your M-Pesa PIN</div></div>';

  setTimeout(function() {
    btn.textContent = 'Waiting for confirmation...';
    statusDiv.innerHTML = '<div style="text-align:center;padding:1rem"><div style="width:40px;height:40px;border:3px solid #f3f4f6;border-top-color:var(--green);border-radius:50%;margin:0 auto 0.8rem;animation:spin 1s linear infinite"></div><div style="font-size:0.85rem;font-weight:600">Waiting for M-Pesa confirmation...</div><div style="font-size:0.75rem;color:var(--gray);margin-top:0.3rem">Enter your PIN on your phone to complete the payment</div></div>';

    setTimeout(function() {
      const ref = 'STK' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const receipt = 'BK-2026-' + String(T.payments.length + 1).padStart(5, '0');
      const now = new Date().toISOString();
      T.payments.unshift({ id: 'p' + Date.now(), amount: amount, ref: ref, date: now, month: 'May 2026', status: 'MATCHED', receipt: receipt });
      T.balance.totalDue = Math.max(0, T.balance.totalDue - amount);
      T.balance.lastPaid = now;
      btn.disabled = false; btn.textContent = 'Pay via M-Pesa'; btn.style.opacity = '1';
      statusDiv.innerHTML = '<div style="background:#dcfce7;border-radius:10px;padding:1.2rem;text-align:center"><div style="font-size:1.5rem;margin-bottom:0.4rem">&#10003;</div><div style="font-size:0.95rem;font-weight:700;color:#16a34a">Payment Confirmed!</div><div style="font-size:0.82rem;color:var(--gray);margin-top:0.3rem">KES ' + amount.toLocaleString() + ' received</div><div style="font-size:0.72rem;color:var(--gray);margin-top:0.2rem">M-Pesa Ref: ' + ref + '</div><div style="font-size:0.72rem;color:var(--gray)">Receipt: ' + receipt + '</div><div style="font-size:0.72rem;color:var(--gray);margin-top:0.5rem">SMS receipt sent to ' + T.tenant.phone + '</div></div>';
      toast('Payment of KES ' + amount.toLocaleString() + ' confirmed!');
    }, 4000);
  }, 2000);
}

function showPaymentProof() {
  const T = DATA.tv;
  showModal('<h3>Submit Payment Details</h3>' +
    '<div style="font-size:0.82rem;color:var(--gray);margin-bottom:1.2rem">Your landlord will verify and confirm the payment.</div>' +
    '<div class="form-group"><label>Payment Method</label><select id="proofMethod" onchange="updateProofFields()"><option value="BANK_DEPOSIT">Bank Deposit (branch/agent)</option><option value="EFT">EFT Transfer</option><option value="PESALINK">PesaLink</option><option value="CASH">Cash (to caretaker/landlord)</option><option value="CHEQUE">Cheque</option></select></div>' +
    '<div class="form-group"><label>Amount Paid (KES)</label><input id="proofAmount" type="number" value="' + T.balance.totalDue + '"></div>' +
    '<div class="form-group"><label id="proofRefLabel">Bank Reference / Slip Number</label><input id="proofRef" placeholder="Transaction reference from your bank"></div>' +
    '<div class="form-group"><label>Date Paid</label><input id="proofDate" type="date" value="' + new Date().toISOString().slice(0,10) + '"></div>' +
    '<div class="form-group" id="proofFileGroup"><label>Upload Proof (bank slip / screenshot)</label><input type="file" id="proofFile" accept="image/*,.pdf" style="font-size:0.82rem"><div style="font-size:0.68rem;color:var(--gray);margin-top:0.3rem">JPG, PNG, or PDF — max 5MB. Stored securely, only visible to your landlord.</div></div>' +
    '<div class="form-group"><label>Notes (optional)</label><input id="proofNotes" placeholder="e.g. Paid at KCB Westlands branch"></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="submitPaymentProof()">Submit for Confirmation</button></div>');
}

function updateProofFields() {
  var method = document.getElementById('proofMethod').value;
  var labels = { BANK_DEPOSIT:'Bank Slip / Deposit Reference', EFT:'EFT Transaction Reference', PESALINK:'PesaLink Transaction ID', CASH:'Receipt Number (if any)', CHEQUE:'Cheque Number' };
  var placeholders = { BANK_DEPOSIT:'Reference from bank deposit slip', EFT:'EFT reference from your bank', PESALINK:'PesaLink transaction ID', CASH:'Optional — if given a receipt', CHEQUE:'Cheque number' };
  document.getElementById('proofRefLabel').textContent = labels[method] || 'Reference';
  document.getElementById('proofRef').placeholder = placeholders[method] || 'Reference number';
  document.getElementById('proofFileGroup').style.display = method === 'CASH' ? 'none' : 'block';
}

function submitPaymentProof() {
  const T = DATA.tv;
  var method = document.getElementById('proofMethod').value;
  var amount = parseInt(document.getElementById('proofAmount').value);
  var ref = document.getElementById('proofRef').value.trim();
  var date = document.getElementById('proofDate').value;
  var notes = document.getElementById('proofNotes').value.trim();
  var fileInput = document.getElementById('proofFile');
  var hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
  if (!amount || amount < 1) { toast('Enter the amount you paid', 'error'); return; }
  if (method !== 'CASH' && !ref) { toast('Enter the transaction reference', 'error'); return; }
  var sourceLabels = { BANK_DEPOSIT:'Bank deposit', EFT:'EFT transfer', PESALINK:'PesaLink', CASH:'Cash payment', CHEQUE:'Cheque' };
  var fileName = hasFile ? fileInput.files[0].name : null;
  T.payments.unshift({ id: 'p' + Date.now(), amount: amount, ref: ref || 'CASH-' + Date.now().toString(36).toUpperCase(), date: date ? new Date(date).toISOString() : new Date().toISOString(), month: 'May 2026', status: 'UNMATCHED', receipt: null, source: method, proof: fileName, notes: notes });
  hideModal(); toast(sourceLabels[method] + ' of KES ' + amount.toLocaleString() + ' submitted — awaiting landlord confirmation'); renderPay();
}

// ── Payment History ──
function renderHistory() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = T.payments.length + ' payments on record';
  const totalPaid = T.payments.reduce((s, p) => s + p.amount, 0);

  c.innerHTML = '<div class="tab-content">' +
    '<div class="grid-3" style="margin-bottom:1.5rem">' +
      '<div class="kpi-card"><div class="kpi-value">KES ' + totalPaid.toLocaleString() + '</div><div class="kpi-label">Total Paid</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:var(--green)">' + T.payments.filter(p=>p.status==='MATCHED').length + '</div><div class="kpi-label">Confirmed Payments</div></div>' +
      '<div class="kpi-card"><div class="kpi-value">' + T.payments.length + '</div><div class="kpi-label">Transactions</div></div>' +
    '</div>' +
    '<div class="card"><div class="table-wrap"><table><thead><tr><th>Month</th><th>Date</th><th>Amount</th><th>Source</th><th>Reference</th><th>Status</th><th>Receipt</th></tr></thead><tbody>' +
    T.payments.map(p => {
      var srcLabels = { MPESA_C2B:'M-Pesa', MPESA_STK:'M-Pesa', CASH:'Cash', BANK_DEPOSIT:'Bank', EFT:'EFT', PESALINK:'PesaLink', CHEQUE:'Cheque' };
      var src = srcLabels[p.source] || 'M-Pesa';
      var srcCls = p.source === 'CASH' ? 'badge-yellow' : (p.source === 'BANK_DEPOSIT' || p.source === 'EFT' || p.source === 'PESALINK' || p.source === 'CHEQUE') ? 'badge-blue' : 'badge-green';
      return '<tr><td><strong>' + p.month + '</strong></td><td>' + new Date(p.date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</td><td style="font-weight:600">KES ' + p.amount.toLocaleString() + '</td><td><span class="badge ' + srcCls + '">' + src + '</span></td><td style="font-size:0.75rem;color:var(--gray)">' + p.ref + '</td><td>' + statusBadge(p.status) + '</td><td>' + (p.receipt ? '<button class="btn btn-outline" style="width:auto;padding:0.2rem 0.6rem;font-size:0.7rem" onclick="toast(\'Downloading ' + p.receipt + '\')">' + p.receipt + '</button>' : '<span style="font-size:0.72rem;color:var(--gray)">—</span>') + '</td></tr>';
    }).join('') +
    '</tbody></table></div></div></div>';
}

// ── Tenant Maintenance ──
function renderTenantMaintenance() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = 'Submit and track repair requests';
  const reqs = T.maintenance;
  const open = reqs.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;

  c.innerHTML = '<div class="tab-content">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem"><div style="font-size:0.85rem;color:var(--gray)">' + open + ' open request' + (open !== 1 ? 's' : '') + '</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="showNewRequest()">+ New Request</button></div>' +
    reqs.map(r => {
      const cls = r.status === 'SUBMITTED' || r.status === 'IN_PROGRESS' ? 'pending' : '';
      return '<div class="maint-card ' + cls + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.6rem"><div><span class="badge badge-gray" style="margin-right:0.4rem">' + r.category + '</span>' + statusBadge(r.status) + '</div><div style="font-size:0.68rem;color:var(--gray)">' + new Date(r.created).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</div></div>' +
        '<div style="font-size:0.9rem;font-weight:600;margin-bottom:0.4rem">' + r.description + '</div>' +
        (r.assignedTo ? '<div style="font-size:0.75rem;color:var(--gray);margin-bottom:0.3rem">Assigned to: <strong>' + r.assignedTo + '</strong></div>' : '') +
        (r.notes ? '<div style="font-size:0.75rem;color:var(--gray);background:var(--gray-light);border-radius:6px;padding:0.5rem 0.8rem;margin-top:0.5rem">' + r.notes + '</div>' : '') +
        (r.updated && r.status !== 'SUBMITTED' ? '<div style="font-size:0.68rem;color:var(--gray);margin-top:0.4rem">Last updated: ' + new Date(r.updated).toLocaleDateString('en-KE',{day:'numeric',month:'short'}) + '</div>' : '') +
      '</div>';
    }).join('') +
  '</div>';
}

function showNewRequest() {
  showModal('<h3>New Maintenance Request</h3>' +
    '<div class="form-group"><label>Category</label><select id="reqCat"><option value="PLUMBING">Plumbing</option><option value="ELECTRICAL">Electrical</option><option value="PAINTING">Painting</option><option value="CARPENTRY">Carpentry</option><option value="SECURITY">Security</option><option value="CLEANING">Cleaning</option><option value="GENERAL">General</option><option value="OTHER">Other</option></select></div>' +
    '<div class="form-group"><label>Description</label><textarea id="reqDesc" placeholder="Describe the issue in detail..."></textarea></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="submitRequest()">Submit Request</button></div>');
}

function submitRequest() {
  const desc = document.getElementById('reqDesc').value.trim();
  if (!desc) { toast('Please describe the issue', 'error'); return; }
  DATA.tv.maintenance.unshift({ id: 'mr' + Date.now(), category: document.getElementById('reqCat').value, description: desc, status: 'SUBMITTED', created: new Date().toISOString(), updated: null, assignedTo: null, notes: null });
  hideModal(); toast('Request submitted! Management will respond shortly.'); renderTenantMaintenance();
}

// ── Tenant Lease ──
function renderTenantLease() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = T.property.name + ' · Unit ' + T.unit.number;
  const l = T.lease;
  const statusLabel = l.status === 'active' ? 'Active' : l.status === 'expiring' ? 'Expiring Soon' : 'Expired';
  const statusCls = l.status === 'active' ? 'badge-green' : l.status === 'expiring' ? 'badge-yellow' : 'badge-red';

  c.innerHTML = '<div class="tab-content"><div class="grid-2">' +
    '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem"><div class="card-title" style="margin:0">Lease Details</div><span class="badge ' + statusCls + '">' + statusLabel + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Property</span><span class="stat-row-value">' + T.property.name + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Unit</span><span class="stat-row-value">' + T.unit.number + ' (Floor ' + T.unit.floor + ', ' + T.unit.bedrooms + ' bed)</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Monthly Rent</span><span class="stat-row-value">KES ' + T.unit.rent.toLocaleString() + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Deposit Paid</span><span class="stat-row-value">KES ' + T.unit.deposit.toLocaleString() + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Lease Start</span><span class="stat-row-value">' + new Date(l.start).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}) + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Lease End</span><span class="stat-row-value" style="color:' + (l.status==='expired'?'#ef4444':'inherit') + '">' + new Date(l.end).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'}) + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">E-Signed</span><span class="stat-row-value">' + (l.signed ? '<span style="color:var(--green)">&#10003; Signed</span>' : '<span style="color:#f59e0b">Pending</span>') + '</span></div>' +
      '<div style="display:flex;gap:0.5rem;margin-top:1.2rem">' +
        (l.doc ? '<button class="btn btn-outline" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="toast(\'Downloading ' + l.doc + '\')">Download Lease</button>' : '') +
        (l.renewalAvailable ? '<button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="toast(\'Renewal request sent to management\')">Request Renewal</button>' : '') +
      '</div>' +
    '</div>' +
    '<div>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-title">Landlord / Management</div>' +
        '<div class="stat-row"><span class="stat-row-label">Name</span><span class="stat-row-value">' + T.property.landlord + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">Phone</span><span class="stat-row-value">' + T.property.landlordPhone + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">Property</span><span class="stat-row-value">' + T.property.address + '</span></div>' +
      '</div>' +
      '<div class="card"><div class="card-title">Lease Terms</div><div style="font-size:0.82rem;color:var(--gray);line-height:1.6"><div style="margin-bottom:0.5rem">&#8226; Rent due by 5th of each month</div><div style="margin-bottom:0.5rem">&#8226; 1 month notice required for termination</div><div style="margin-bottom:0.5rem">&#8226; No subletting without written consent</div><div style="margin-bottom:0.5rem">&#8226; Deposit refundable on move-out inspection</div><div>&#8226; Tenant responsible for unit utility costs</div></div></div>' +
    '</div>' +
  '</div></div>';
}

// ── Tenant Utilities ──
function renderTenantUtilities() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = 'Water, garbage & electricity charges';
  const cur = T.utilities.current;
  const hist = T.utilities.history;

  c.innerHTML = '<div class="tab-content">' +
    '<div class="card" style="margin-bottom:1.5rem;border-left:4px solid var(--green)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><div class="card-title" style="margin:0">' + cur.month + ' Utilities</div><span class="badge badge-yellow">Unpaid</span></div>' +
      '<div class="grid-3" style="margin-bottom:1rem">' +
        '<div style="text-align:center"><div style="font-size:1.4rem;font-weight:700;color:#3b82f6">KES ' + cur.water.toLocaleString() + '</div><div style="font-size:0.72rem;color:var(--gray)">Water</div></div>' +
        '<div style="text-align:center"><div style="font-size:1.4rem;font-weight:700;color:#f59e0b">KES ' + cur.garbage.toLocaleString() + '</div><div style="font-size:0.72rem;color:var(--gray)">Garbage</div></div>' +
        '<div style="text-align:center"><div style="font-size:1.4rem;font-weight:700;color:#8b5cf6">KES ' + cur.electricity.toLocaleString() + '</div><div style="font-size:0.72rem;color:var(--gray)">Electricity</div></div>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:0.8rem;border-top:2px solid #f3f4f6"><div style="font-size:1.1rem;font-weight:700">Total: KES ' + cur.total.toLocaleString() + '</div><button class="btn btn-outline" style="width:auto;padding:0.4rem 1rem;font-size:0.78rem" onclick="toast(\'Invoice downloaded\')">Download Invoice</button></div>' +
    '</div>' +
    '<div class="card"><div class="card-title">Previous Months</div><div class="table-wrap"><table><thead><tr><th>Month</th><th>Water</th><th>Garbage</th><th>Electricity</th><th>Total</th></tr></thead><tbody>' +
    hist.map(h => '<tr><td><strong>' + h.month + '</strong></td><td>' + h.water.toLocaleString() + '</td><td>' + h.garbage.toLocaleString() + '</td><td>' + h.electricity.toLocaleString() + '</td><td style="font-weight:700">KES ' + h.total.toLocaleString() + '</td></tr>').join('') +
    '</tbody></table></div></div></div>';
}

// ── Notices ──
function renderNotices() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = 'Announcements from management';
  c.innerHTML = '<div class="tab-content">' +
    T.notices.map(n => '<div class="announce-card ' + (n.type === 'warning' ? 'warning' : '') + '"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.4rem"><div style="font-weight:700;font-size:0.95rem">' + n.title + '</div><div style="font-size:0.68rem;color:var(--gray);white-space:nowrap;margin-left:1rem">' + new Date(n.date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</div></div><div style="font-size:0.82rem;color:var(--gray);line-height:1.5">' + n.message + '</div></div>').join('') +
  '</div>';
}

// ── Profile ──
function renderProfile() {
  const c = document.getElementById('tabContent');
  const T = DATA.tv;
  document.getElementById('pageSub').textContent = 'Your account details';
  const t = T.tenant;

  c.innerHTML = '<div class="tab-content"><div class="grid-2">' +
    '<div class="card">' +
      '<div class="card-title">Personal Information</div>' +
      '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem"><div style="width:60px;height:60px;border-radius:50%;background:var(--green-dark);color:var(--white);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700">' + t.name.split(' ').map(w=>w[0]).join('') + '</div><div><div style="font-size:1.1rem;font-weight:700">' + t.name + '</div><div style="font-size:0.78rem;color:var(--gray)">' + T.property.name + ' · Unit ' + T.unit.number + '</div></div></div>' +
      '<div class="stat-row"><span class="stat-row-label">Phone</span><span class="stat-row-value">' + t.phone + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">Email</span><span class="stat-row-value">' + (t.email||'—') + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">ID Number</span><span class="stat-row-value">' + (t.id_number||'—') + '</span></div>' +
      '<div class="stat-row"><span class="stat-row-label">ID Verified</span><span class="stat-row-value">' + (t.id_verified ? '<span style="color:var(--green)">&#10003; Verified</span>' : '<span style="color:#f59e0b">Pending</span>') + '</span></div>' +
      '<div style="margin-top:1.2rem"><button class="btn btn-outline" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="toast(\'Profile edit coming soon\')">Edit Profile</button></div>' +
    '</div>' +
    '<div>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-title">Base Score</div><div style="display:flex;align-items:center;gap:1.2rem;margin-bottom:1rem"><div style="width:70px;height:70px;border-radius:50%;background:var(--green-tint);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:var(--green)">' + t.score + '</div><div><div style="font-weight:700;font-size:1rem;text-transform:capitalize;color:var(--green)">' + t.scoreLevel + '</div><div style="font-size:0.75rem;color:var(--gray)">Based on payment history, ID verification, and tenure</div></div></div><div style="font-size:0.78rem;color:var(--gray);line-height:1.5">Your Base Score helps you get approved faster for new rentals. Keep paying on time to maintain your excellent rating.</div></div>' +
      '<div class="card"><div class="card-title">Account</div>' +
        '<div class="stat-row"><span class="stat-row-label">Member Since</span><span class="stat-row-value">' + new Date(T.lease.start).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">Payments Made</span><span class="stat-row-value">' + T.payments.length + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">On-Time Rate</span><span class="stat-row-value" style="color:var(--green)">95%</span></div>' +
      '</div>' +
    '</div>' +
  '</div></div>';
}

// ═══════════════════════════════════════════════════════════
// ADMIN PORTAL
// ═══════════════════════════════════════════════════════════

function roleBadge(role) {
  const cls = { OWNER:'role-owner', MANAGER:'role-manager', CARETAKER:'role-caretaker', TENANT:'role-tenant' };
  return '<span class="role-badge ' + (cls[role]||'role-tenant') + '">' + role + '</span>';
}
function getUserName(id) { const u = DATA.admin.users.find(x => x.id === id); return u ? u.name : '—'; }
function getPropertyName(id) { const p = DATA.properties.find(x => x.id === id); if (p) return p.name; const ap = DATA.admin.properties && DATA.admin.properties.find(x => x.id === id); return ap ? ap.name : '—'; }

var adminProperties = [
  { id: 'p1', name: 'Sunrise Apartments', units: 24, county: 'Nairobi' },
  { id: 'p2', name: 'Green Valley Courts', units: 16, county: 'Nairobi' },
  { id: 'p3', name: 'Lakeview Residences', units: 12, county: 'Nakuru' }
];

function renderAdminOverview() {
  const c = document.getElementById('tabContent');
  const D = DATA.admin;
  document.getElementById('pageSub').textContent = 'Role-based access control for your properties';
  const owners = D.users.filter(u => u.role === 'OWNER').length;
  const managers = D.users.filter(u => u.role === 'MANAGER').length;
  const caretakers = D.users.filter(u => u.role === 'CARETAKER').length;
  const active = D.users.filter(u => u.status === 'active').length;

  c.innerHTML = '<div class="tab-content">' +
    '<div class="grid-4" style="margin-bottom:1.5rem">' +
      '<div class="kpi-card"><div class="kpi-value">' + D.users.length + '</div><div class="kpi-label">Total Users</div></div>' +
      '<div class="kpi-card"><div class="kpi-value" style="color:var(--green)">' + active + '</div><div class="kpi-label">Active</div></div>' +
      '<div class="kpi-card"><div class="kpi-value">' + adminProperties.length + '</div><div class="kpi-label">Properties</div></div>' +
      '<div class="kpi-card"><div class="kpi-value">' + D.assignments.length + '</div><div class="kpi-label">Assignments</div></div>' +
    '</div>' +
    '<div class="grid-2">' +
      '<div class="card"><div class="card-title">Users by Role</div>' +
        '<div class="stat-row"><span class="stat-row-label">' + roleBadge('OWNER') + '</span><span class="stat-row-value">' + owners + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">' + roleBadge('MANAGER') + '</span><span class="stat-row-value">' + managers + '</span></div>' +
        '<div class="stat-row"><span class="stat-row-label">' + roleBadge('CARETAKER') + '</span><span class="stat-row-value">' + caretakers + '</span></div>' +
        '<div style="margin-top:1rem">' +
          D.users.slice(0,4).map(u => '<div class="user-card" style="margin-bottom:0.5rem"><div class="user-avatar ' + u.role.toLowerCase() + '">' + u.name.split(' ').map(w=>w[0]).join('') + '</div><div style="flex:1"><div style="font-weight:600;font-size:0.85rem">' + u.name + '</div><div style="font-size:0.72rem;color:var(--gray)">' + u.phone + '</div></div>' + roleBadge(u.role) + '</div>').join('') +
        '</div>' +
      '</div>' +
      '<div class="card"><div class="card-title">Recent Access Changes</div>' +
        D.auditLog.slice(0,6).map(a => {
          const colors = { role:'blue', permission:'amber', user:'', tenant:'', maintenance:'gray', property:'blue', payment:'' };
          return '<div class="timeline-item"><div class="timeline-dot ' + (colors[a.type]||'') + '"></div><div style="flex:1"><div style="display:flex;justify-content:space-between"><div style="font-size:0.82rem;font-weight:600">' + a.action + '</div><div style="font-size:0.65rem;color:var(--gray)">' + new Date(a.time).toLocaleDateString('en-KE',{day:'numeric',month:'short'}) + '</div></div><div style="font-size:0.72rem;color:var(--gray)">' + a.detail + '</div><div style="font-size:0.65rem;color:var(--gray)">by ' + a.user + '</div></div></div>';
        }).join('') +
      '</div>' +
    '</div></div>';
}

function renderAdminUsers() {
  const c = document.getElementById('tabContent');
  const D = DATA.admin;
  document.getElementById('pageSub').textContent = D.users.length + ' users across ' + adminProperties.length + ' properties';

  c.innerHTML = '<div class="tab-content">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem"><div style="font-size:0.85rem;color:var(--gray)">' + D.users.length + ' users</div><button class="btn btn-green" style="width:auto;padding:0.5rem 1.2rem;font-size:0.8rem" onclick="showInviteUser()">+ Invite User</button></div>' +
    '<div class="card"><div class="table-wrap"><table><thead><tr><th>User</th><th>Phone</th><th>Role</th><th>Properties</th><th>Last Active</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
    D.users.map(u => {
      const props = D.assignments.filter(a => a.userId === u.id).map(a => getPropertyName(a.propertyId));
      const propStr = u.role === 'OWNER' ? '<span style="color:var(--green)">All</span>' : (props.length > 0 ? props.join(', ') : '<span style="color:var(--gray)">None</span>');
      const stBadge = u.status === 'active' ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-gray">Inactive</span>';
      const ago = Math.round((Date.now() - new Date(u.lastActive).getTime()) / 3600000);
      const lastStr = ago < 24 ? ago + 'h ago' : Math.round(ago/24) + 'd ago';
      return '<tr><td><div style="display:flex;align-items:center;gap:0.6rem"><div class="user-avatar ' + u.role.toLowerCase() + '" style="width:32px;height:32px;font-size:0.6rem">' + u.name.split(' ').map(w=>w[0]).join('') + '</div><strong>' + u.name + '</strong></div></td><td>' + u.phone + '</td><td>' + roleBadge(u.role) + '</td><td style="font-size:0.78rem">' + propStr + '</td><td style="font-size:0.75rem;color:var(--gray)">' + lastStr + '</td><td>' + stBadge + '</td><td>' + (u.role !== 'OWNER' ? '<button class="btn btn-outline" style="width:auto;padding:0.25rem 0.6rem;font-size:0.7rem" onclick="showEditUser(\'' + u.id + '\')">Edit</button>' : '<span style="font-size:0.72rem;color:var(--gray)">Owner</span>') + '</td></tr>';
    }).join('') +
    '</tbody></table></div></div></div>';
}

function showInviteUser() {
  showModal('<h3>Invite User</h3>' +
    '<div class="form-group"><label>Name</label><input id="invName" placeholder="Full name"></div>' +
    '<div class="form-group"><label>Phone</label><input id="invPhone" placeholder="0712345678"></div>' +
    '<div class="form-group"><label>Email (optional)</label><input id="invEmail" placeholder="email@example.com"></div>' +
    '<div class="form-group"><label>Role</label><select id="invRole"><option value="MANAGER">Manager</option><option value="CARETAKER">Caretaker</option></select></div>' +
    '<div class="form-group"><label>Assign to Property</label><select id="invProp">' + adminProperties.map(p => '<option value="' + p.id + '">' + p.name + '</option>').join('') + '</select></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="inviteUser()">Send Invite</button></div>');
}

function inviteUser() {
  const D = DATA.admin;
  const name = document.getElementById('invName').value.trim();
  const phone = document.getElementById('invPhone').value.trim();
  const role = document.getElementById('invRole').value;
  const propId = document.getElementById('invProp').value;
  if (!name || !phone) { toast('Name and phone required', 'error'); return; }
  const newUser = { id: 'u' + Date.now(), name: name, phone: phone, email: document.getElementById('invEmail').value || null, role: role, lastActive: new Date().toISOString(), status: 'active' };
  D.users.push(newUser);
  D.assignments.push({ userId: newUser.id, propertyId: propId, canViewPayments: true, canManageTenants: role === 'MANAGER', canManageUnits: false });
  D.auditLog.unshift({ user: state.user.name, action: 'Invited user', detail: name + ' invited as ' + role, time: new Date().toISOString(), type: 'user' });
  hideModal(); toast(name + ' invited as ' + role); renderAdminUsers();
}

function showEditUser(id) {
  const u = DATA.admin.users.find(x => x.id === id);
  if (!u) return;
  showModal('<h3>Edit User — ' + u.name + '</h3>' +
    '<div class="form-group"><label>Role</label><select id="editRole"><option value="MANAGER"' + (u.role==='MANAGER'?' selected':'') + '>Manager</option><option value="CARETAKER"' + (u.role==='CARETAKER'?' selected':'') + '>Caretaker</option></select></div>' +
    '<div class="form-group"><label>Status</label><select id="editStatus"><option value="active"' + (u.status==='active'?' selected':'') + '>Active</option><option value="inactive"' + (u.status==='inactive'?' selected':'') + '>Inactive</option></select></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="saveUser(\'' + id + '\')">Save</button></div>');
}

function saveUser(id) {
  const D = DATA.admin;
  const u = D.users.find(x => x.id === id);
  if (!u) return;
  const oldRole = u.role;
  u.role = document.getElementById('editRole').value;
  u.status = document.getElementById('editStatus').value;
  if (oldRole !== u.role) {
    D.auditLog.unshift({ user: state.user.name, action: 'Changed role', detail: u.name + ': ' + oldRole + ' → ' + u.role, time: new Date().toISOString(), type: 'role' });
  }
  hideModal(); toast(u.name + ' updated'); renderAdminUsers();
}

function renderAdminRoles() {
  const c = document.getElementById('tabContent');
  const D = DATA.admin;
  document.getElementById('pageSub').textContent = D.roleDefinitions.length + ' roles defined';

  c.innerHTML = '<div class="tab-content">' +
    '<div class="grid-2" style="margin-bottom:1.5rem">' +
    D.roleDefinitions.map(r => {
      const cls = { OWNER:'role-owner', MANAGER:'role-manager', CARETAKER:'role-caretaker', TENANT:'role-tenant' };
      const count = D.users.filter(u => u.role === r.role).length;
      return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.8rem"><div><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem"><span class="role-badge ' + (cls[r.role]||'') + '">' + r.role + '</span><span style="font-size:0.72rem;color:var(--gray)">' + count + ' user' + (count!==1?'s':'') + '</span></div><div style="font-size:0.82rem;color:var(--gray);max-width:280px">' + r.desc + '</div></div></div><div style="border-top:1px solid #f3f4f6;padding-top:0.8rem"><div style="font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray);margin-bottom:0.5rem">Permissions</div><div style="display:flex;flex-wrap:wrap;gap:0.3rem">' + r.permissions.map(p => '<span class="badge badge-green" style="font-size:0.62rem">' + p + '</span>').join('') + '</div></div></div>';
    }).join('') +
    '</div>' +
    '<div class="card"><div class="card-title">Permission Comparison Matrix</div><div class="perm-matrix"><div class="perm-matrix-header"><div>Permission</div><div style="text-align:center">Manager</div><div style="text-align:center">Caretaker</div><div style="text-align:center">Tenant</div></div>' + permMatrixRows() + '</div></div></div>';
}

function permMatrixRows() {
  const perms = [
    { label: 'View assigned properties', manager: true, caretaker: true, tenant: false },
    { label: 'Manage units', manager: 'granted', caretaker: false, tenant: false },
    { label: 'Manage tenants', manager: 'granted', caretaker: false, tenant: false },
    { label: 'View payments', manager: 'granted', caretaker: false, tenant: false },
    { label: 'Match M-Pesa payments', manager: true, caretaker: false, tenant: false },
    { label: 'Log maintenance', manager: true, caretaker: true, tenant: true },
    { label: 'View reports', manager: true, caretaker: true, tenant: false },
    { label: 'Pay rent (M-Pesa)', manager: false, caretaker: false, tenant: true },
    { label: 'View own lease', manager: false, caretaker: false, tenant: true },
    { label: 'KRA / eTIMS access', manager: false, caretaker: false, tenant: false }
  ];
  function icon(v) {
    if (v === true) return '<span style="color:#16a34a;font-weight:700">✓</span>';
    if (v === 'granted') return '<span class="badge badge-yellow" style="font-size:0.6rem">If granted</span>';
    return '<span style="color:#d1d5db">—</span>';
  }
  return perms.map(p => '<div class="perm-matrix-row"><div style="font-weight:500">' + p.label + '</div><div style="text-align:center">' + icon(p.manager) + '</div><div style="text-align:center">' + icon(p.caretaker) + '</div><div style="text-align:center">' + icon(p.tenant) + '</div></div>').join('');
}

function renderPropertyAccess() {
  const c = document.getElementById('tabContent');
  const D = DATA.admin;
  document.getElementById('pageSub').textContent = 'Manage who can access each property';
  let html = '<div class="tab-content">';

  adminProperties.forEach(prop => {
    const assigns = D.assignments.filter(a => a.propertyId === prop.id);
    html += '<div class="card" style="margin-bottom:1.5rem"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><div><div style="font-size:1rem;font-weight:700">' + prop.name + '</div><div style="font-size:0.72rem;color:var(--gray)">' + prop.units + ' units · ' + prop.county + ' · ' + assigns.length + ' staff assigned</div></div><button class="btn btn-outline" style="width:auto;padding:0.4rem 1rem;font-size:0.75rem" onclick="showAssignUser(\'' + prop.id + '\')">+ Assign Staff</button></div>';
    if (assigns.length === 0) {
      html += '<div style="text-align:center;padding:1.5rem;color:var(--gray);font-size:0.82rem">No staff assigned to this property</div>';
    } else {
      html += '<div class="perm-matrix"><div class="perm-matrix-header"><div>Staff Member</div><div style="text-align:center">View Payments</div><div style="text-align:center">Manage Tenants</div><div style="text-align:center">Manage Units</div></div>';
      assigns.forEach(a => {
        const u = D.users.find(x => x.id === a.userId);
        if (!u) return;
        html += '<div class="perm-matrix-row"><div style="display:flex;align-items:center;gap:0.6rem"><div class="user-avatar ' + u.role.toLowerCase() + '" style="width:28px;height:28px;font-size:0.55rem">' + u.name.split(' ').map(w=>w[0]).join('') + '</div><div><div style="font-weight:600;font-size:0.82rem">' + u.name + '</div><div style="font-size:0.65rem;color:var(--gray)">' + u.role + '</div></div></div>' +
          '<div style="text-align:center"><label class="perm-toggle"><input type="checkbox" ' + (a.canViewPayments?'checked':'') + ' onchange="togglePerm(\'' + a.userId + '\',\'' + prop.id + '\',\'canViewPayments\',this.checked)"></label></div>' +
          '<div style="text-align:center"><label class="perm-toggle"><input type="checkbox" ' + (a.canManageTenants?'checked':'') + ' onchange="togglePerm(\'' + a.userId + '\',\'' + prop.id + '\',\'canManageTenants\',this.checked)"></label></div>' +
          '<div style="text-align:center"><label class="perm-toggle"><input type="checkbox" ' + (a.canManageUnits?'checked':'') + ' onchange="togglePerm(\'' + a.userId + '\',\'' + prop.id + '\',\'canManageUnits\',this.checked)"></label></div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });

  html += '</div>';
  c.innerHTML = html;
}

function togglePerm(userId, propId, perm, val) {
  const D = DATA.admin;
  const a = D.assignments.find(x => x.userId === userId && x.propertyId === propId);
  if (!a) return;
  a[perm] = val;
  const permLabel = { canViewPayments:'view payments', canManageTenants:'manage tenants', canManageUnits:'manage units' };
  D.auditLog.unshift({ user: state.user.name, action: val ? 'Granted permission' : 'Revoked permission', detail: getUserName(userId) + ': ' + permLabel[perm] + ' on ' + getPropertyName(propId), time: new Date().toISOString(), type: 'permission' });
  toast((val ? 'Granted' : 'Revoked') + ' ' + permLabel[perm] + ' for ' + getUserName(userId));
}

function showAssignUser(propId) {
  const D = DATA.admin;
  const assigned = D.assignments.filter(a => a.propertyId === propId).map(a => a.userId);
  const available = D.users.filter(u => u.role !== 'OWNER' && !assigned.includes(u.id) && u.status === 'active');
  if (available.length === 0) {
    showModal('<h3>Assign Staff to ' + getPropertyName(propId) + '</h3><p style="color:var(--gray);font-size:0.85rem;margin-bottom:1rem">No available staff to assign. Invite new users first.</p><div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Close</button></div>');
    return;
  }
  showModal('<h3>Assign Staff to ' + getPropertyName(propId) + '</h3>' +
    '<div class="form-group"><label>Staff Member</label><select id="assignUser">' + available.map(u => '<option value="' + u.id + '">' + u.name + ' (' + u.role + ')</option>').join('') + '</select></div>' +
    '<div style="margin-bottom:1rem"><div style="font-size:0.72rem;font-weight:600;color:var(--gray);margin-bottom:0.4rem">PERMISSIONS</div><label class="perm-toggle" style="display:flex"><input type="checkbox" id="aViewPay" checked> View Payments</label><label class="perm-toggle" style="display:flex"><input type="checkbox" id="aManTen"> Manage Tenants</label><label class="perm-toggle" style="display:flex"><input type="checkbox" id="aManUnit"> Manage Units</label></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-green" onclick="assignUser(\'' + propId + '\')">Assign</button></div>');
}

function assignUser(propId) {
  const D = DATA.admin;
  const userId = document.getElementById('assignUser').value;
  D.assignments.push({ userId: userId, propertyId: propId, canViewPayments: document.getElementById('aViewPay').checked, canManageTenants: document.getElementById('aManTen').checked, canManageUnits: document.getElementById('aManUnit').checked });
  D.auditLog.unshift({ user: state.user.name, action: 'Assigned property', detail: getUserName(userId) + ' → ' + getPropertyName(propId), time: new Date().toISOString(), type: 'property' });
  hideModal(); toast(getUserName(userId) + ' assigned to ' + getPropertyName(propId)); renderPropertyAccess();
}

function renderAudit() {
  const c = document.getElementById('tabContent');
  const D = DATA.admin;
  document.getElementById('pageSub').textContent = D.auditLog.length + ' events recorded';
  const types = [...new Set(D.auditLog.map(a => a.type))];
  const users = [...new Set(D.auditLog.map(a => a.user))];

  c.innerHTML = '<div class="tab-content">' +
    '<div class="card" style="margin-bottom:1.5rem"><div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end">' +
      '<div class="form-group" style="margin-bottom:0;flex:1;min-width:150px"><label>Filter by Type</label><select id="auditTypeFilter" onchange="filterAudit()"><option value="">All types</option>' + types.map(t => '<option value="' + t + '">' + t.charAt(0).toUpperCase() + t.slice(1) + '</option>').join('') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0;flex:1;min-width:150px"><label>Filter by User</label><select id="auditUserFilter" onchange="filterAudit()"><option value="">All users</option>' + users.map(u => '<option value="' + u + '">' + u + '</option>').join('') + '</select></div>' +
      '<button class="btn btn-outline" style="width:auto;padding:0.5rem 1rem;font-size:0.78rem;margin-bottom:0" onclick="document.getElementById(\'auditTypeFilter\').value=\'\';document.getElementById(\'auditUserFilter\').value=\'\';filterAudit()">Clear</button>' +
    '</div></div>' +
    '<div class="card" id="auditEntries">' + renderAuditEntries(D.auditLog) + '</div></div>';
}

function filterAudit() {
  const D = DATA.admin;
  const type = document.getElementById('auditTypeFilter').value;
  const user = document.getElementById('auditUserFilter').value;
  let filtered = D.auditLog;
  if (type) filtered = filtered.filter(a => a.type === type);
  if (user) filtered = filtered.filter(a => a.user === user);
  document.getElementById('auditEntries').innerHTML = renderAuditEntries(filtered);
}

function renderAuditEntries(entries) {
  if (entries.length === 0) return '<div style="text-align:center;padding:2rem;color:var(--gray);font-size:0.85rem">No matching events</div>';
  const typeColors = { role:'blue', permission:'amber', user:'', tenant:'', maintenance:'gray', property:'blue', payment:'' };
  const typeBadge = { role:'badge-blue', permission:'badge-yellow', user:'badge-purple', tenant:'badge-green', maintenance:'badge-gray', property:'badge-blue', payment:'badge-green' };
  return '<div class="card-title">Activity Timeline (' + entries.length + ' events)</div>' +
    entries.map(a => {
      const dt = new Date(a.time);
      const dateStr = dt.toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'});
      const timeStr = dt.toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'});
      return '<div class="timeline-item"><div class="timeline-dot ' + (typeColors[a.type]||'') + '"></div><div style="flex:1"><div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.3rem"><div><span style="font-weight:600;font-size:0.85rem">' + a.action + '</span> <span class="badge ' + (typeBadge[a.type]||'badge-gray') + '" style="font-size:0.58rem">' + a.type + '</span></div><div style="font-size:0.68rem;color:var(--gray);white-space:nowrap">' + dateStr + ' · ' + timeStr + '</div></div><div style="font-size:0.78rem;color:var(--gray);margin-top:0.15rem">' + a.detail + '</div><div style="font-size:0.68rem;color:var(--gray);margin-top:0.1rem">by <strong>' + a.user + '</strong></div></div></div>';
    }).join('');
}
